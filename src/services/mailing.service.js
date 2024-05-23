const nodemailer = require("nodemailer");
const { mailing } = require("../config/config");

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: "alandeveloper10@gmail.com",
    pass: "aepxhitoxkvefuwg",
  },
});

class MailingService {
  async sendPasswordResetMail(user, destinationMail, passwordResetToken) {
    await transport.sendMail({
      from: `Node service <${"alandeveloper10@gmail.com"}>`,
      to: destinationMail,
      subject: "Password Reset",
      html: `<h1>Reset your password</h1>
            <p>Click on the link below to reset your password</p>
            <a href="http://localhost:8080/api/sessions/changePassword/${passwordResetToken}">Reset your password</a>`,
    });
  }
}

module.exports = MailingService;
