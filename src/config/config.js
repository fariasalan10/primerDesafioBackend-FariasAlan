const dotenv = require("dotenv");
const { Command } = require("commander");

dotenv.config();

const program = new Command();
program.option(
  "-p, --persistence <persistence>",
  "The selected persistence",
  "MEMORY"
);
program.parse(process.argv);
const options = program.opts();

module.exports = {
  mongoConnectionLink: process.env.MONGO_CONNECTION_LINK,
  sessionSecret: process.env.SESSION_SECRET,
  port: process.env.PORT,
  persistence: options.persistence,
};
