/**
 * Server-side checks for POST /api/contact, kept free of Next and Resend so they can be unit tested.
 *
 * checkContact() decides what the route does with a parsed JSON body:
 *   drop   -> answer 200 as if sent, send nothing (honeypot filled, or submitted faster than a person can)
 *   reject -> answer with `status` and `error` (invalid input, failed or unavailable Turnstile check)
 *   send   -> go ahead; `fields` are the cleaned values, `html` the same values escaped for the emails
 *
 * Turnstile is checked only when a secret is passed in. With no secret the form behaves as it did
 * before Turnstile, which is what makes the rollout order in docs/ops/turnstile.md safe.
 */

export const MIN_FILL_MS = 3000;
export const VERIFY_TIMEOUT_MS = 5000;

export const LIMITS = { name: 200, company: 200, phone: 200, email: 254, message: 5000 } as const;
const MAX_SOLUTIONS = 20;
const MAX_SOLUTION_LENGTH = 100;
/** Cloudflare documents tokens as at most 2048 characters. */
const MAX_TOKEN_LENGTH = 2048;

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const HTML_ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
}

/** For anything that ends up in a header or subject. */
export function stripCrlf(value: string): string {
  return value.replace(/[\r\n]+/g, " ");
}

export type TurnstileVerdict = "ok" | "invalid" | "unavailable";

/**
 * Asks Cloudflare whether a token is good. Anything other than a clear yes or no from Cloudflare
 * (network error, timeout, non-200, internal-error) is "unavailable", and the caller fails closed.
 */
export async function verifyTurnstile(opts: {
  secret: string;
  token: string;
  ip?: string;
  fetchImpl?: typeof fetch;
  timeoutMs?: number;
}): Promise<TurnstileVerdict> {
  const { secret, token, ip, fetchImpl = fetch, timeoutMs = VERIFY_TIMEOUT_MS } = opts;
  const params = new URLSearchParams({ secret, response: token });
  if (ip) params.set("remoteip", ip);

  try {
    const res = await fetchImpl(SITEVERIFY_URL, {
      method: "POST",
      body: params,
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (!res.ok) return "unavailable";
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (data.success === true) return "ok";
    return data["error-codes"]?.includes("internal-error") ? "unavailable" : "invalid";
  } catch {
    return "unavailable";
  }
}

export type ContactFields = {
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  solutions: string[];
};

export type GuardResult =
  | { action: "drop" }
  | { action: "reject"; status: 400 | 503; error: string; code?: "turnstile" }
  | {
      action: "send";
      fields: ContactFields;
      /** The same values escaped for interpolation into email HTML. */
      html: Omit<ContactFields, "solutions"> & { solutionList: string };
    };

const reject = (error: string): GuardResult => ({ action: "reject", status: 400, error });
const CHECK_FAILED = "Spam check failed. Please try again.";

export async function checkContact(
  body: unknown,
  opts: { secret?: string; ip?: string; fetchImpl?: typeof fetch; timeoutMs?: number } = {},
): Promise<GuardResult> {
  if (typeof body !== "object" || body === null) return reject("Missing required fields");
  const raw = body as Record<string, unknown>;

  // Silent drops: the bot is told it worked so it has nothing to adjust to.
  if (String(raw.company_website ?? "").trim() !== "") return { action: "drop" };
  if (typeof raw.elapsedMs === "number" && raw.elapsedMs < MIN_FILL_MS) return { action: "drop" };

  const text = (v: unknown) => (typeof v === "string" ? v.trim() : v == null ? "" : null);
  const name = text(raw.name);
  const email = text(raw.email);
  const phone = text(raw.phone);
  const company = text(raw.company);
  const message = text(raw.message);
  if (name === null || email === null || phone === null || company === null || message === null) {
    return reject("Invalid field");
  }
  if (!name || !email || !company || !message) return reject("Missing required fields");

  if (
    name.length > LIMITS.name ||
    company.length > LIMITS.company ||
    phone.length > LIMITS.phone ||
    email.length > LIMITS.email ||
    message.length > LIMITS.message
  ) {
    return reject("Field too long");
  }
  if (!EMAIL_PATTERN.test(email)) return reject("Invalid email address");

  let solutions: string[] = [];
  if (Array.isArray(raw.solutions)) {
    if (
      raw.solutions.length > MAX_SOLUTIONS ||
      !raw.solutions.every((s) => typeof s === "string" && s.length <= MAX_SOLUTION_LENGTH)
    ) {
      return reject("Invalid solutions");
    }
    solutions = raw.solutions as string[];
  }

  if (opts.secret) {
    const token = raw.turnstileToken;
    if (typeof token !== "string" || token === "" || token.length > MAX_TOKEN_LENGTH) {
      return { action: "reject", status: 400, error: CHECK_FAILED, code: "turnstile" };
    }
    const verdict = await verifyTurnstile({
      secret: opts.secret,
      token,
      ip: opts.ip,
      fetchImpl: opts.fetchImpl,
      timeoutMs: opts.timeoutMs,
    });
    if (verdict === "invalid") {
      return { action: "reject", status: 400, error: CHECK_FAILED, code: "turnstile" };
    }
    if (verdict === "unavailable") {
      return {
        action: "reject",
        status: 503,
        error: "Spam check is unavailable. Please try again.",
        code: "turnstile",
      };
    }
  }

  // Single-line fields lose CR/LF; email can't contain whitespace at all (see EMAIL_PATTERN).
  const fields: ContactFields = {
    name: stripCrlf(name),
    email,
    phone: stripCrlf(phone),
    company: stripCrlf(company),
    message,
    solutions,
  };
  return {
    action: "send",
    fields,
    html: {
      name: escapeHtml(fields.name),
      email: escapeHtml(fields.email),
      phone: escapeHtml(fields.phone),
      company: escapeHtml(fields.company),
      message: escapeHtml(fields.message),
      solutionList: solutions.length > 0 ? escapeHtml(solutions.join(", ")) : "Not specified",
    },
  };
}
