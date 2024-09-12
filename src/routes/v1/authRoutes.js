const express = require("express");

const router = express.Router();
const { signUp } = require("../../controllers/user-controller");

router.post("/register", signUp);

module.exports = router;
