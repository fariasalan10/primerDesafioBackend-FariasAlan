const dotenv = require("dotenv");

config = dotenv.config();
const { Command } = require("commander");

const program = new Command();
program.option(
  "-p, --persistence <persistence>",
  "The selected persistence",
  "MEMORY"
);
program.parse(process.argv);
const options = program.opts();

module.exports = {
  port: process.env.PORT,
  mongoConnectionLink: process.env.MONGO_CONNECTION_LINK,
  sessionSecret: process.env.SESSION_SECRET,
  persistence: options.persistence,
  jwtSecret: process.env.JWT_SECRET,
  mailing: {
    service: process.env.MAIL_SERVICE,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_AUTH_USER,
      pass: process.env.MAIL_AUTH_PASS,
    },
  },
  stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
  stripeSecretKey: process.env.STRIPE_SECRET_KEY,
};
