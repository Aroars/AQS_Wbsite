import { describe, expect, it, vi } from "vitest";
import { LIMITS, checkContact, escapeHtml, verifyTurnstile } from "./contact-guard";

const valid = {
  name: "Jane Smith",
  email: "jane@example.com",
  phone: "",
  company: "Acme Foods",
  message: "We need a quote.",
  solutions: ["VeriPak SCADA", "Other"],
  elapsedMs: 12_000,
};

const siteverify = (body: unknown, init?: ResponseInit) =>
  vi.fn<typeof fetch>(async () => new Response(JSON.stringify(body), init));

describe("checkContact: silent drops", () => {
  it("drops a filled honeypot without calling Cloudflare", async () => {
    const fetchImpl = siteverify({ success: true });
    const result = await checkContact(
      { ...valid, company_website: "http://spam.example", turnstileToken: "t" },
      { secret: "s", fetchImpl },
    );
    expect(result.action).toBe("drop");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("drops a submit faster than 3 seconds", async () => {
    expect((await checkContact({ ...valid, elapsedMs: 2999 })).action).toBe("drop");
    expect((await checkContact({ ...valid, elapsedMs: 3000 })).action).toBe("send");
  });
});

describe("checkContact: Turnstile", () => {
  it("skips verification when no secret is set", async () => {
    const fetchImpl = siteverify({ success: false });
    const result = await checkContact(valid, { fetchImpl });
    expect(result.action).toBe("send");
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("rejects a missing token with 400 when a secret is set", async () => {
    const fetchImpl = siteverify({ success: true });
    const result = await checkContact(valid, { secret: "s", fetchImpl });
    expect(result).toMatchObject({ action: "reject", status: 400, code: "turnstile" });
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("sends secret, response and remoteip to siteverify and accepts success", async () => {
    const fetchImpl = siteverify({ success: true });
    const result = await checkContact(
      { ...valid, turnstileToken: "tok" },
      { secret: "sec", ip: "203.0.113.9", fetchImpl },
    );
    expect(result.action).toBe("send");
    const [url, init] = fetchImpl.mock.calls[0];
    expect(url).toBe("https://challenges.cloudflare.com/turnstile/v0/siteverify");
    const params = init?.body as URLSearchParams;
    expect(params.get("secret")).toBe("sec");
    expect(params.get("response")).toBe("tok");
    expect(params.get("remoteip")).toBe("203.0.113.9");
  });

  it("rejects with 400 when Cloudflare says the token is invalid", async () => {
    const fetchImpl = siteverify({ success: false, "error-codes": ["invalid-input-response"] });
    const result = await checkContact({ ...valid, turnstileToken: "bad" }, { secret: "s", fetchImpl });
    expect(result).toMatchObject({ action: "reject", status: 400, code: "turnstile" });
  });

  it("fails closed with 503 when siteverify errors", async () => {
    const down = vi.fn<typeof fetch>(async () => {
      throw new TypeError("network down");
    });
    const bad = siteverify({}, { status: 500 });
    const internal = siteverify({ success: false, "error-codes": ["internal-error"] });
    for (const fetchImpl of [down, bad, internal]) {
      const result = await checkContact({ ...valid, turnstileToken: "t" }, { secret: "s", fetchImpl });
      expect(result).toMatchObject({ action: "reject", status: 503, code: "turnstile" });
    }
  });

  it("fails closed with 503 when siteverify times out", async () => {
    const hang = vi.fn<typeof fetch>(
      (_url, init) =>
        new Promise((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => reject(init.signal?.reason));
        }),
    );
    const result = await checkContact(
      { ...valid, turnstileToken: "t" },
      { secret: "s", fetchImpl: hang, timeoutMs: 20 },
    );
    expect(result).toMatchObject({ action: "reject", status: 503 });
  });

  it("omits remoteip when there is no client address", async () => {
    const fetchImpl = siteverify({ success: true });
    await verifyTurnstile({ secret: "s", token: "t", fetchImpl });
    expect((fetchImpl.mock.calls[0][1]?.body as URLSearchParams).has("remoteip")).toBe(false);
  });
});

describe("checkContact: validation", () => {
  it("escapes a <script> payload in every value used in email HTML", async () => {
    const payload = `<script>alert("x")</script>`;
    const result = await checkContact({
      ...valid,
      name: payload,
      email: "<script>@b.co",
      phone: payload,
      company: payload,
      message: payload,
      solutions: [payload],
    });
    if (result.action !== "send") throw new Error("expected send");
    for (const value of Object.values(result.html)) {
      expect(value).not.toContain("<script>");
      expect(value).toContain("&lt;script&gt;");
    }
    expect(escapeHtml(`&"'<>`)).toBe("&amp;&quot;&#39;&lt;&gt;");
  });

  it("strips CR/LF from single-line fields", async () => {
    const result = await checkContact({ ...valid, company: "Acme\r\nBcc: evil@example.com", name: "A\nB" });
    if (result.action !== "send") throw new Error("expected send");
    expect(result.fields.company).not.toMatch(/[\r\n]/);
    expect(result.fields.name).not.toMatch(/[\r\n]/);
  });

  it("keeps line breaks in the message", async () => {
    const result = await checkContact({ ...valid, message: "one\ntwo" });
    if (result.action !== "send") throw new Error("expected send");
    expect(result.fields.message).toBe("one\ntwo");
  });

  it("enforces the length caps", async () => {
    const at = (key: keyof typeof LIMITS) => "x".repeat(LIMITS[key]);
    const over = (key: keyof typeof LIMITS) => "x".repeat(LIMITS[key] + 1);
    expect((await checkContact({ ...valid, name: at("name"), company: at("company"), phone: at("phone"), message: at("message") })).action).toBe("send");
    for (const key of ["name", "company", "phone", "message"] as const) {
      expect(await checkContact({ ...valid, [key]: over(key) })).toMatchObject({ action: "reject", status: 400 });
    }
  });

  it("rejects invalid email addresses", async () => {
    for (const email of ["nope", "a@b", "a b@c.com", "a@b.com\r\nBcc: x@y.com", "@b.com"]) {
      expect(await checkContact({ ...valid, email })).toMatchObject({ action: "reject", status: 400 });
    }
  });

  it("rejects missing required fields and non-string values", async () => {
    for (const key of ["name", "email", "company", "message"] as const) {
      expect(await checkContact({ ...valid, [key]: "  " })).toMatchObject({ action: "reject", status: 400 });
    }
    expect(await checkContact({ ...valid, name: { a: 1 } })).toMatchObject({ action: "reject", status: 400 });
    expect(await checkContact(null)).toMatchObject({ action: "reject", status: 400 });
  });

  it("treats a missing phone and missing solutions as empty", async () => {
    const result = await checkContact({ ...valid, phone: undefined, solutions: undefined });
    if (result.action !== "send") throw new Error("expected send");
    expect(result.fields.phone).toBe("");
    expect(result.html.solutionList).toBe("Not specified");
  });
});
