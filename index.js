const express = require("express");
const { PORT } = require("./src/config/serverConfig");

const setupAndStartServer = async () => {
  const app = express();

  app.listen(PORT, () => {
    console.log("Auth Service is now on " + PORT);
  });
};

//To start the server
setupAndStartServer();
