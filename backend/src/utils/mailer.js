const { Resend } = require('resend');

function getFrontendOrigin() {
  const raw = process.env.FRONTEND_URL || 'http://localhost:5173';
  return raw.split(',')[0].trim();
}

async function sendPasswordResetEmail(to, token) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn('RESEND_API_KEY is not set; password reset email was not sent.');
    console.warn(`Reset link for ${to}: ${getFrontendOrigin()}/reset-password?token=${token}`);
    return { skipped: true };
  }

  const resend = new Resend(apiKey);
  const resetUrl = `${getFrontendOrigin()}/reset-password?token=${token}`;
  const from = process.env.EMAIL_FROM || 'popin <onboarding@resend.dev>';

  const { data, error } = await resend.emails.send({
    from,
    to: [to],
    subject: 'Reset your popin. password',
    html: `
      <p>Hi,</p>
      <p>We received a request to reset your popin. password.</p>
      <p><a href="${resetUrl}">Reset your password</a></p>
      <p>This link expires in 15 minutes. If you did not request this, you can ignore this email.</p>
    `,
  });

  if (error) {
    throw new Error(error.message || 'Failed to send reset email');
  }

  return data;
}

module.exports = { sendPasswordResetEmail, getFrontendOrigin };
