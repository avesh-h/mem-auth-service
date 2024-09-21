const express = require("express");

const router = express.Router();
const {
  signUp,
  signIn,
  updateUserVerification,
  getUserDetails,
} = require("../../controllers/user-controller");

router.post("/register", signUp);

router.post("/signin", signIn);

router.get("/update-verification", updateUserVerification);

router.get("/get-user-details", getUserDetails);

module.exports = router;
