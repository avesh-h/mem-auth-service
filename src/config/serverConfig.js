require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  DB_URI: process.env.DB_URI,
  VERIFY_TOKEN_SECRET: process.env.VERIFY_TOKEN_SECRET,
  AUTH_SERVICE_URL: process.env.AUTH_SERVICE_URL,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  MAIL_SERVICE_URL: process.env.MAIL_SERVICE_URL,
  CHAT_SERVICE_URL: process.env.CHAT_SERVICE_URL,
  POST_SERVICE_URL: process.env.POST_SERVICE_URL,
  FRONTEND_URL: process.env.FRONTEND_URL,
};
