// config.js
require('dotenv').config();

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET || 'secret',
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 3000,
};
