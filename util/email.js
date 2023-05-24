const { config } = require("dotenv");
const nodemailer = require("nodemailer");

config();
// Create a transporter with SMTP settings
const senderEmail = process.env.SENDER_EMAIL;
const senderPassword = process.env.SENDER_PASSWORD;
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  secure: true,
  auth: {
    user: senderEmail,
    pass: senderPassword,
  },
});
async function sendVerificationEmail(email, verificationLink) {
  try {
    const message = {
      from: senderEmail,
      to: email,
      subject: "Email Verification",
      text: `Please verify your email by clicking on the following link: ${verificationLink}`,
    };

    const info = await transporter.sendMail(message);
  } catch (error) {
    console.log(error);
    throw new Error("Error sending verification email:", error);
  }
}
async function sendNotificationEmail(email, url) {
  try {
    const message = {
      from: senderEmail,
      to: email,
      subject: "Your url is down",
      text: `Url ${url} is down`,
    };
    await transporter.sendMail(message);
  } catch (error) {
    console.log(error);
    throw new Error("Error sending notification email:", error);
  }
}
module.exports = {
  sendVerificationEmail,
  sendNotificationEmail,
};
