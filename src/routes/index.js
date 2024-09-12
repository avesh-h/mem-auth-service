const express = require("express");

const router = express.Router();
const authRoutes = require("./v1/authRoutes");

router.use("/v1", authRoutes);

module.exports = router;
