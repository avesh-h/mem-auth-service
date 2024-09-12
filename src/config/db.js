const mongoose = require("mongoose");
const { DB_URI } = require("./serverConfig");

let isConnected = false;

const connectToDB = async () => {
  if (!DB_URI) return console.log("MONGO URI not found!");
  if (isConnected) return console.log("DB is already connected!");

  try {
    const db = mongoose.connection;
    db.on("open", () => {
      console.log("Connected to DB!");
    });
    await mongoose.connect(DB_URI);
    isConnected = true;
  } catch (error) {
    console.log("ERROR:::::::", error);
  }
};

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("mongoose close");
    process.exit(0);
  });
});

module.exports = { connectToDB };
