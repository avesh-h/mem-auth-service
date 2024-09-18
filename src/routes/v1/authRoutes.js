const express = require("express");

const router = express.Router();
const {
  signUp,
  signIn,
  updateUserVerification,
} = require("../../controllers/user-controller");

router.post("/register", signUp);

router.post("/signin", signIn);

router.get("/update-verification", updateUserVerification);

module.exports = router;
