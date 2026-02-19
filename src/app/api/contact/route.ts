import { NextResponse } from "next/server";

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

    // TODO: Replace with Resend API when RESEND_API_KEY is configured
    // import { Resend } from 'resend';
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // await resend.emails.send({
    //   from: 'AQS Website <noreply@automatedqs.com>',
    //   to: 'info@automatedqs.com',
    //   subject: `New Project Inquiry from ${name} at ${company}`,
    //   text: `...`,
    // });

    console.log("Contact form submission:", {
      name,
      email,
      phone,
      company,
      solutions,
      message,
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to process submission" },
      { status: 500 }
    );
  }
}
