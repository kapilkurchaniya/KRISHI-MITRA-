import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.GOOGLE_USER_EMAIL,
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    refreshToken: process.env.GOOGLE_REFRESH_TOKEN,

  },
});

 await transporter.verify()
.then(() => {console.log("Email service is ready");})
.catch((error) => console.error("Error setting up email service:", error));


export async function sendEmail({to ,subject, html,text}) {
  const mailOptions = {
    from: process.env.GOOGLE_USER_EMAIL,
    to,
    subject,
    html,
    text
  };
  const details = await transporter.sendMail(mailOptions);
  console.log("Email sent:", details.response);
  return details;
} 
