export function appUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
}

export async function sendEmail({ to, subject, html, text, replyTo }) {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    return { sent: false, reason: "Email provider not configured." };
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      text,
      ...(replyTo ? { reply_to: replyTo } : {})
    })
  });

  if (!response.ok) {
    return { sent: false, reason: "Email provider rejected the message." };
  }

  return { sent: true };
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendContactLeadEmail({ lead, to }) {
  const subject = `New B Socio inquiry: ${lead.serviceRequired}`;
  const text = [
    "New B Socio contact inquiry",
    "",
    `Name: ${lead.name}`,
    `Business: ${lead.businessName || "Not provided"}`,
    `Phone: ${lead.phone}`,
    `Email: ${lead.email || "Not provided"}`,
    `Service Required: ${lead.serviceRequired}`,
    "",
    "Message:",
    lead.message || "No message added."
  ].join("\n");
  const html = `
    <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
      <h2 style="margin:0 0 12px">New B Socio contact inquiry</h2>
      <table style="border-collapse:collapse;width:100%;max-width:640px">
        <tbody>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:700">Name</td><td style="padding:8px;border:1px solid #e2e8f0">${escapeHtml(lead.name)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:700">Business</td><td style="padding:8px;border:1px solid #e2e8f0">${escapeHtml(lead.businessName || "Not provided")}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:700">Phone</td><td style="padding:8px;border:1px solid #e2e8f0">${escapeHtml(lead.phone)}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:700">Email</td><td style="padding:8px;border:1px solid #e2e8f0">${escapeHtml(lead.email || "Not provided")}</td></tr>
          <tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:700">Service</td><td style="padding:8px;border:1px solid #e2e8f0">${escapeHtml(lead.serviceRequired)}</td></tr>
        </tbody>
      </table>
      <p style="margin:18px 0 6px;font-weight:700">Message</p>
      <p style="white-space:pre-wrap;background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:14px">${escapeHtml(lead.message || "No message added.")}</p>
    </div>
  `;
  return sendEmail({
    to,
    subject,
    text,
    html,
    replyTo: lead.email || undefined
  });
}

export async function sendVerificationEmail({ user, token }) {
  const url = `${appUrl()}/api/auth/verify?token=${token}`;
  const subject = "Verify your B Socio Studio account";
  const text = `Verify your B Socio Studio account: ${url}`;
  const html = `<p>Hi ${user.name},</p><p>Please verify your B Socio Studio account before admin approval.</p><p><a href="${url}">Verify email</a></p>`;
  const result = await sendEmail({ to: user.email, subject, text, html });
  return { ...result, url };
}

export async function sendPasswordResetEmail({ user, token }) {
  const url = `${appUrl()}/reset-password?token=${token}`;
  const subject = "Reset your B Socio Studio password";
  const text = `Reset your B Socio Studio password: ${url}`;
  const html = `<p>Hi ${user.name},</p><p>Use this secure link to reset your password.</p><p><a href="${url}">Reset password</a></p>`;
  const result = await sendEmail({ to: user.email, subject, text, html });
  return { ...result, url };
}
