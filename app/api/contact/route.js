import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import { sendContactLeadEmail } from "@/lib/email";
import { DEFAULT_EMAIL, getPublicSiteContent } from "@/lib/siteContent";
import ContactLead from "@/models/ContactLead";

async function readContactBody(request) {
  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return request.json();
  }
  const formData = await request.formData();
  return Object.fromEntries(formData);
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Database save timed out.")), ms);
    })
  ]);
}

function wantsJson(request) {
  const contentType = request.headers.get("content-type") || "";
  const accept = request.headers.get("accept") || "";
  return contentType.includes("application/json") || accept.includes("application/json");
}

function redirectToContact(_request, status) {
  return new NextResponse(null, {
    status: 303,
    headers: {
      Location: `/contact?contact=${encodeURIComponent(status)}`
    }
  });
}

export function GET(request) {
  return redirectToContact(request, "form");
}

export async function POST(request) {
  try {
    const jsonResponse = wantsJson(request);
    const body = await readContactBody(request);
    const lead = {
      name: String(body.name || "").trim(),
      businessName: String(body.businessName || "").trim(),
      phone: String(body.phone || "").trim(),
      email: String(body.email || "").trim().toLowerCase(),
      serviceRequired: String(body.serviceRequired || "").trim(),
      message: String(body.message || "").trim()
    };

    if (!lead.name || !lead.phone || !lead.serviceRequired) {
      if (!jsonResponse) return redirectToContact(request, "missing-fields");
      return NextResponse.json({ error: "Name, phone number, and service required are needed." }, { status: 400 });
    }

    const siteContent = await getPublicSiteContent();
    const dashboardRecipient = siteContent.contact?.formReceivingEmail || "";
    const recipient = dashboardRecipient && dashboardRecipient !== DEFAULT_EMAIL
      ? dashboardRecipient
      : process.env.CONTACT_RECEIVING_EMAIL || dashboardRecipient || siteContent.contact?.email || DEFAULT_EMAIL;

    let saved = null;
    let saveWarning = "";
    try {
      await withTimeout(connectDB(), 1800);
      saved = await ContactLead.create(lead);
    } catch (error) {
      saveWarning = error.message || "Lead could not be saved in the database.";
    }

    const email = await sendContactLeadEmail({ lead, to: recipient });
    if (!saved && !email.sent) {
      if (!jsonResponse) return redirectToContact(request, "setup-needed");
      return NextResponse.json({
        error: "Contact request could not be saved or emailed. Please configure MongoDB and email settings.",
        emailReason: email.reason,
        saveWarning
      }, { status: 500 });
    }

    if (!jsonResponse) {
      return redirectToContact(request, email.sent ? "sent" : "saved");
    }

    return NextResponse.json({
      success: true,
      leadId: saved?._id?.toString?.() || null,
      emailSent: email.sent,
      emailReason: email.sent ? "" : email.reason,
      saveWarning,
      message: email.sent
        ? "Thank you. Your message was sent to B Socio."
        : "Thank you. Your inquiry was saved. Email sending is not configured yet."
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Contact request could not be sent." }, { status: 500 });
  }
}
