const nodemailer = require("nodemailer");
const { mailing } = require("../config/config");

const transport = nodemailer.createTransport({
  service: mailing.service,
  port: mailing.port,
  auth: {
    user: mailing.auth.user,
    pass: mailing.auth.pass,
  },
});

class MailingService {
  async sendPasswordResetMail(user, destinationMail, passwordResetToken) {
    await transport.sendMail({
      from: `Node service <${mailing.auth.user}>`,
      to: destinationMail,
      subject: "Password Reset",
      html: `<h1>Reset your password</h1>
            <p>Click on the link below to reset your password</p>
            <a href="http://localhost:8080/api/sessions/changePassword/${passwordResetToken}">Reset your password</a>`,
    });
  }

  async sendDeletedAccountMail(user, destinationMail) {
    await transport.sendMail({
      from: `Node service <${mailing.auth.user}>`,
      to: destinationMail,
      subject: "Account Deleted",
      html: `<h1>Hi ${user}, your account has been deleted.</h1>
            <p>Thank you for using our service. Unfortunately, your account has been deleted due to inactivity.</p>
            <p>If you want restore your account, please register again.</p>
            <p>If you have any questions, please contact us.</p>
            `,
    });
  }

  async sendDeletedPremiumProductMail(destinationMail, itemData) {
    await transport.sendMail({
      from: `Node service <${mailing.auth.user}>`,
      to: destinationMail,
      subject: "Item Deleted",
      html: `<h1>Hi, your product has been deleted.</h1>
            <p>Item: ${itemData} was deleted by an admin. Sorry for the inconvenience.</p>
            `,
    });
  }
}

module.exports = MailingService;
