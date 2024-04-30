const dotenv = require("dotenv");
const { Command } = require("commander");

dotenv.config();

const port = process.env.PORT;
const mongoConnectionLink = process.env.MONGO_CONNECTION_LINK;
const sessionSecret = process.env.SESSION_SECRET;

const program = new Command();
program.option(
  "-p, --persistence <persistence>",
  "The selected persistence",
  "MEMORY"
);
program.parse(process.argv);
const options = program.opts();

module.exports = {
  mongoConnectionLink,
  sessionSecret,
  port,
  persistence: options.persistence,
};
