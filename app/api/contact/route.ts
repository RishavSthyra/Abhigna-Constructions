import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

type ContactPayload = {
  source?: string;
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  projectType?: string;
  message?: string;
};

const EMAIL_USER = process.env.EMAIL_USER;
const GOOGLE_APP_PASSWORD = process.env.GOOGLE_APP_PASSWORD;

const isValidEmail = (value: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const buildMailBody = ({
  source,
  name,
  email,
  phone,
  subject,
  projectType,
  message,
}: Required<ContactPayload>) => {
  const lines = [
    `Source: ${source}`,
    `Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    `Subject: ${subject || "Not provided"}`,
    `Project Type: ${projectType || "Not provided"}`,
    "",
    "Message:",
    message,
  ];

  return lines.join("\n");
};

export async function POST(request: Request) {
  if (!EMAIL_USER || !GOOGLE_APP_PASSWORD) {
    return NextResponse.json(
      { error: "Email service is not configured." },
      { status: 500 },
    );
  }

  let payload: ContactPayload;

  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 },
    );
  }

  const source = payload.source?.trim() || "Website";
  const name = payload.name?.trim() || "";
  const email = payload.email?.trim() || "";
  const phone = payload.phone?.trim() || "";
  const subject = payload.subject?.trim() || "";
  const projectType = payload.projectType?.trim() || "";
  const message = payload.message?.trim() || "";

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json(
      { error: "Please provide a valid email address." },
      { status: 400 },
    );
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: GOOGLE_APP_PASSWORD,
    },
  });

  const mailBody = buildMailBody({
    source,
    name,
    email,
    phone,
    subject,
    projectType,
    message,
  });

  try {
    await transporter.sendMail({
      from: `"Abhigna Website" <${EMAIL_USER}>`,
      to: EMAIL_USER,
      replyTo: email,
      subject: `[${source}] New inquiry from ${name}`,
      text: mailBody,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1f1f1f;">
          <h2 style="margin-bottom: 16px;">New Website Inquiry</h2>
          <p><strong>Source:</strong> ${source}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || "Not provided"}</p>
          <p><strong>Subject:</strong> ${subject || "Not provided"}</p>
          <p><strong>Project Type:</strong> ${projectType || "Not provided"}</p>
          <p style="margin-top: 20px;"><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact email send failed:", error);

    return NextResponse.json(
      { error: "We could not send your message right now." },
      { status: 500 },
    );
  }
}
