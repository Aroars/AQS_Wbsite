import { NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

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

    const solutionList = Array.isArray(solutions) && solutions.length > 0
      ? solutions.join(", ")
      : "Not specified";

    const { error } = await resend.emails.send({
      from: "AQS Website <noreply@apps.automatedqs.com>",
      to: ["info@automatedqs.com"],
      replyTo: email,
      subject: `New Quote Request — ${company}`,
      html: `
        <h2>New Quote Request from automatedqs.com</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px;">
          <tr><td style="padding:8px 12px;font-weight:bold;vertical-align:top;">Name</td><td style="padding:8px 12px;">${name}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px 12px;font-weight:bold;vertical-align:top;">Email</td><td style="padding:8px 12px;"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:8px 12px;font-weight:bold;vertical-align:top;">Phone</td><td style="padding:8px 12px;">${phone || "—"}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px 12px;font-weight:bold;vertical-align:top;">Company</td><td style="padding:8px 12px;">${company}</td></tr>
          <tr><td style="padding:8px 12px;font-weight:bold;vertical-align:top;">Solutions</td><td style="padding:8px 12px;">${solutionList}</td></tr>
          <tr style="background:#f9f9f9;"><td style="padding:8px 12px;font-weight:bold;vertical-align:top;">Message</td><td style="padding:8px 12px;">${message.replace(/\n/g, "<br>")}</td></tr>
        </table>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 502 }
      );
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
