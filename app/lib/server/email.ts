import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendLoginNotification(to: string) {
  if (!process.env.RESEND_API_KEY) {
    console.error("RESEND_API_KEY is not configured");
    return;
  }

  try {
    await resend.emails.send({
      from: process.env.SECURITY_EMAIL_FROM!,
      to,
      subject: "New Memento Login",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
          <h2>New Memento Login</h2>

          <p>Your private Memento vault was just accessed.</p>

          <p>
            <strong>Time:</strong>
            ${new Date().toLocaleString("en-IN", {
              dateStyle: "full",
              timeStyle: "short",
            })}
          </p>

          <p>
            If this was you, no action is required.
          </p>

          <p>
            If you don't recognize this login, secure your vault immediately.
          </p>

          <p style="margin-top: 30px;">
            — Memento
          </p>
        </div>
      `,
    });
  } catch (error) {
    // Email failure should never prevent login.
    console.error("Failed to send login notification:", error);
  }
}
