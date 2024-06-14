// import { createTransport } from "nodemailer";
const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, text) => {
  console.log(process.env.SMTP_USER);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    to,
    subject,
    text,
  });
};

module.exports = { sendEmail };
