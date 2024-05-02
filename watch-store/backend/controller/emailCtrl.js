const nodemailer = require('nodemailer');
const asyncHandling = require('express-async-handler');
const { validate } = require('../utils/validation');

const sendEmail = asyncHandling(async (data, req, res) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.MAIL_ID,
          pass: process.env.MAIL_PW,
        },
        debug: true,
        logger: true,
      });
      
      async function main() {
        // send mail with defined transport object
        const info = await transporter.sendMail({
          from: '"Hi" <davidhpthao@gmail.com>', // sender address - replace with your email
          to: data.to, // list of receivers
          subject: data.subject, // Subject line
          text: data.text, // plain text body
          html: data.htm, // html body
        });
      
        console.log("Message sent: %s", info.messageId);
}});

module.exports = { sendEmail };