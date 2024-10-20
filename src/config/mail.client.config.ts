export const SendgridMailClientConfig = {
  apiKey: process.env.SENDGRID_API_KEY || "",
  senderEmail: process.env.SENDGRID_SENDER_EMAIL || "",
  registerMailSubject: process.env.SENDGRID_REGISTER_MAIL_SUBJECT || "Welcome To Zilla",
  forgottenPasswordMailSubject: process.env.SENDGRID_FORGOTTEN_PASSWORD_MAIL_SUBJECT || "Reset Your Password",
};
