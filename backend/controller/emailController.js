const nodemailer = require("nodemailer");
const asyncHandler = require("express-async-handler");

const sendMail = asyncHandler(async (data, req, res) => {
  console.log(data);

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_MP,
    },
  });

  const info = await transporter.sendMail({
    from: '"MERN COMMERCE', // sender address
    to: data.to, // list of receivers
    subject: data.subject, // Subject line
    text: data.text, // plain text body
    html: data.html, // html body
  });

  console.log("Message sent: %s", info.messageId);
});

module.exports = { sendMail };
