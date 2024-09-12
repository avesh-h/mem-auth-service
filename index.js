const express = require("express");
const { PORT } = require("./src/config/serverConfig");
const { connectToDB } = require("./src/config/db");
const { User } = require("./src/models/user");
const serverRoutes = require("./src/routes/index");
const cors = require("cors");
const bodyParser = require("body-parser");

const setupAndStartServer = async () => {
  const app = express();

  //Middlewares
  app.use(cors());
  app.use(bodyParser.json({ limit: "30mb", extended: true }));
  app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));

  // Routes
  app.use("/api", serverRoutes);

  // DB connection
  connectToDB();

  app.listen(PORT, () => {
    console.log("Auth Service is now on " + PORT);
  });
};

//To start the server
setupAndStartServer();
