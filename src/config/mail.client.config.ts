export const MailClientConfig = {
  apiKey: process.env.MAILJET_API_KEY || "",
  apiSecret: process.env.MAILJET_API_SECRET || "",
  senderEmail: process.env.MAILJET_SENDER_EMAIL || "",
  registerMailSubject: process.env.MAILJET_REGISTER_MAIL_SUBJECT || "Welcome To Zilla",
};
