const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pkg = require("../models/index.js");
const { sequelize, User } = pkg;

const JWT_SECRET = process.env.JWT_SECRET || "secret";

const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
};

const comparePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};

const generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: "1d",
  });
};

const findUserByUsername = async (username) => {
  const user = await User.findOne({ where: { username } });
  return user;
};

const createUser = async (username, password, email) => {
  const hashedPassword = hashPassword(password);
  const user = await User.create({ username, password: hashedPassword, email });
  return user;
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  findUserByUsername,
  createUser,
};
