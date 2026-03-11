import { NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const SITE_URL = "https://automatedqs.com";

function buildConfirmationEmail(name: string, solutionList: string) {
  const firstName = name.split(" ")[0];
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#131620;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#131620;padding:40px 20px;">
    <tr><td align="center">
      <!-- Logo -->
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;">
        <tr><td align="center" style="padding:30px 0 20px;">
          <img src="${SITE_URL}/images/logos/aqs-logo-email.png" alt="AQS" width="200" style="display:block;" />
        </td></tr>
      </table>

      <!-- Main card -->
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:#1a1d2b;border-radius:12px;border:1px solid rgba(255,255,255,0.06);">
        <tr><td style="padding:40px 36px;">
          <h1 style="margin:0 0 16px;font-size:24px;font-weight:800;color:#ffffff;">
            We Received Your Request
          </h1>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#8892b0;">
            Hi ${firstName},
          </p>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.7;color:#8892b0;">
            Thank you for reaching out to <strong style="color:#ffffff;">Automated Quality Solutions</strong>.
            We&rsquo;ve received your project inquiry and our engineering team will review it within one business day.
          </p>
          ${solutionList !== "Not specified" ? `
          <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#00c2ff;letter-spacing:0.08em;text-transform:uppercase;">
            Solutions of Interest
          </p>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#ffffff;">
            ${solutionList}
          </p>
          ` : ""}
          <p style="margin:0 0 28px;font-size:15px;line-height:1.7;color:#8892b0;">
            In the meantime, feel free to explore our solutions:
          </p>

          <!-- CTA button -->
          <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
            <tr><td align="center" style="background:linear-gradient(135deg,#00c2ff,#0066ff);border-radius:8px;">
              <a href="${SITE_URL}/solutions" target="_blank" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#0B1A2E;text-decoration:none;">
                Explore Our Solutions &rarr;
              </a>
            </td></tr>
          </table>

          <!-- Divider -->
          <hr style="margin:32px 0;border:none;border-top:1px solid rgba(255,255,255,0.06);" />

          <p style="margin:0;font-size:13px;line-height:1.6;color:#555d75;">
            If you have any immediate questions, reply to this email or contact us directly at
            <a href="mailto:info@automatedqs.com" style="color:#00c2ff;text-decoration:none;">info@automatedqs.com</a>.
          </p>
        </td></tr>
      </table>

      <!-- Footer -->
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;">
        <tr><td align="center" style="padding:24px 0 10px;">
          <p style="margin:0;font-size:12px;color:#555d75;">
            Automated Quality Solutions &mdash; Boise, Idaho
          </p>
          <p style="margin:4px 0 0;font-size:12px;color:#555d75;">
            &copy; ${new Date().getFullYear()} AQS. All rights reserved.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function buildInternalEmail(
  name: string,
  email: string,
  phone: string,
  company: string,
  message: string,
  solutionList: string,
) {
  return `
    <h2>New Quote Request from automatedqs.com</h2>
    <table style="border-collapse:collapse;width:100%;max-width:600px;">
      <tr><td style="padding:8px 12px;font-weight:bold;vertical-align:top;">Name</td><td style="padding:8px 12px;">${name}</td></tr>
      <tr style="background:#f9f9f9;"><td style="padding:8px 12px;font-weight:bold;vertical-align:top;">Email</td><td style="padding:8px 12px;"><a href="mailto:${email}">${email}</a></td></tr>
      <tr><td style="padding:8px 12px;font-weight:bold;vertical-align:top;">Phone</td><td style="padding:8px 12px;">${phone || "—"}</td></tr>
      <tr style="background:#f9f9f9;"><td style="padding:8px 12px;font-weight:bold;vertical-align:top;">Company</td><td style="padding:8px 12px;">${company}</td></tr>
      <tr><td style="padding:8px 12px;font-weight:bold;vertical-align:top;">Solutions</td><td style="padding:8px 12px;">${solutionList}</td></tr>
      <tr style="background:#f9f9f9;"><td style="padding:8px 12px;font-weight:bold;vertical-align:top;">Message</td><td style="padding:8px 12px;">${message.replace(/\n/g, "<br>")}</td></tr>
    </table>`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, company, message, solutions } = body;

    if (!name || !email || !company || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("Missing RESEND_API_KEY env var");
      return NextResponse.json(
        { error: "Contact form is not configured" },
        { status: 503 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const solutionList =
      Array.isArray(solutions) && solutions.length > 0
        ? solutions.join(", ")
        : "Not specified";

    // Send both emails in parallel
    const [internal, confirmation] = await Promise.all([
      // Email 1: Internal notification to AQS team
      resend.emails.send({
        from: "AQS Website <noreply@apps.automatedqs.com>",
        to: ["info@automatedqs.com"],
        replyTo: email,
        subject: `New Quote Request — ${company}`,
        html: buildInternalEmail(name, email, phone, company, message, solutionList),
      }),
      // Email 2: Confirmation to the user
      resend.emails.send({
        from: "Automated Quality Solutions <noreply@apps.automatedqs.com>",
        to: [email],
        replyTo: "info@automatedqs.com",
        subject: "We received your request — AQS",
        html: buildConfirmationEmail(name, solutionList),
      }),
    ]);

    if (internal.error) {
      console.error("Resend internal email error:", internal.error);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 502 }
      );
    }

    if (confirmation.error) {
      console.error("Resend confirmation email error:", confirmation.error);
      // Don't fail the request — the internal email went through
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact form error:", err);
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 }
    );
  }
}
