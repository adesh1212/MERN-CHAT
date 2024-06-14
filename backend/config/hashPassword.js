const bcrypt = require("bcryptjs");

const hashPassword = async function (pass) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(pass, salt);
};

module.exports = { hashPassword };