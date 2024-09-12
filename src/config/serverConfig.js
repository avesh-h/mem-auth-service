require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  DB_URI: process.env.DB_URI,
  VERIFY_TOKEN_SECRET: process.env.VERIFY_TOKEN_SECRET,
  LIVE_URL: process.env.LIVE_URL,
};
