// Vercel serverless function: emails contact-form submissions through Brevo SMTP.
// Credentials live in Vercel environment variables only (this repo is public):
//   BREVO_SMTP_LOGIN, BREVO_SMTP_KEY, CONTACT_TO, CONTACT_FROM
import nodemailer from 'nodemailer';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const clean = (v, max) => String(v ?? '').replace(/\r/g, '').trim().slice(0, max);
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const body = typeof req.body === 'string' ? safeJson(req.body) : req.body || {};
  // Bots fill every field, including this hidden one. Pretend success so they move on.
  if (body.company) return res.status(200).json({ ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const type = clean(body.type, 60) || 'General';
  const message = clean(body.message, 5000);
  const page = clean(body.page, 300);

  if (!name || !isEmail(email) || message.length < 2) {
    return res.status(400).json({ ok: false, error: 'Please add your name, a valid email and a message.' });
  }

  const { BREVO_SMTP_LOGIN, BREVO_SMTP_KEY } = process.env;
  const to = process.env.CONTACT_TO || 'khanajwa950@gmail.com';
  const from = process.env.CONTACT_FROM || to;
  if (!BREVO_SMTP_LOGIN || !BREVO_SMTP_KEY) {
    console.error('contact: SMTP credentials are not configured');
    return res.status(500).json({ ok: false, error: 'Email is not configured yet. Please email me directly.' });
  }

  const transport = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false,
    auth: { user: BREVO_SMTP_LOGIN, pass: BREVO_SMTP_KEY },
  });

  const when = new Date().toUTCString();
  try {
    await transport.sendMail({
      from: { name: 'Ajwa Malik — Portfolio', address: from },
      to,
      // Hitting reply answers the visitor, not the site.
      replyTo: { name, address: email },
      subject: `New ${type} enquiry from ${name}`,
      text: `${message}\n\n— ${name} <${email}>\nProject type: ${type}\nPage: ${page || 'contact'}\nSent: ${when}`,
      html: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.55;color:#111">
        <p style="margin:0 0 4px;color:#ff4f9a;font-size:12px;letter-spacing:.08em;text-transform:uppercase">New enquiry · ${esc(type)}</p>
        <h2 style="margin:0 0 16px;font-size:20px">${esc(name)} &lt;<a href="mailto:${esc(email)}">${esc(email)}</a>&gt;</h2>
        <div style="white-space:pre-wrap;padding:16px;border-left:3px solid #ff4f9a;background:#f7eff3">${esc(message)}</div>
        <p style="margin:16px 0 0;color:#6f6369;font-size:12px">Page: ${esc(page || 'contact')} · ${esc(when)}</p>
      </div>`,
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('contact: send failed', err?.message);
    return res.status(502).json({ ok: false, error: 'The message could not be sent. Please email me directly.' });
  }
}

function safeJson(s) {
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
}
