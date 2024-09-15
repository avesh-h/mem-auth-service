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

// Why Handle SIGINT?
// When you terminate your application with Ctrl + C, the default behavior is for the Node.js process to immediately stop. If your application is connected to a MongoDB database, this sudden termination might leave connections open or in an undefined state. Handling SIGINT allows you to cleanly close the MongoDB connection and perform any other cleanup tasks before the application shuts down.

//It is like cleanup thing like what we want to perform when the node js process terminate or exit.

process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("mongoose close");
    process.exit(0);
  });
});

module.exports = { connectToDB };
