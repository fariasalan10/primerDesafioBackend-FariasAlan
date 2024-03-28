const bcrypt = require("bcrypt");

const createHash = (password) => {
  const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  return hashedPassword;
};

const isValidPassword = (user, password) => {
  const isValid = bcrypt.comparneSyc(password, user.password);
  return isValid;
};

module.exports = {
  createHash,
  isValidPassword,
};
