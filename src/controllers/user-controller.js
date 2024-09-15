const userService = require("../services/user-service");
const {
  VERIFY_TOKEN_SECRET,
  LIVE_URL,
  ACCESS_TOKEN_SECRET,
} = require("../config/serverConfig");

const signUp = async (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  try {
    const isAlreadyExist = await userService.findByEmail(email);
    if (isAlreadyExist) {
      // Already exist
      return res.status(400).json({ message: "User already exists." });
    }
    const hashedPassword = await userService.hashedPassword(password, 12);
    // Creat user
    const result = await userService.createUser({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
      isVerified: false,
    });
    //Create email verification token
    const verificationToken = userService.generateToken(
      { email },
      VERIFY_TOKEN_SECRET
    );
    //Send email for email verification
    const verification = {
      email,
      verificationLink: `${LIVE_URL}/user/verification?email=${email}&token=${verificationToken}`,
      message: "Please verify your email",
    };
    return res.status(200).json(result);
  } catch (error) {
    // All the error will come in repo layer or service layer will be handled there and throw error here and send this error back to the client.
    return res.status(error.statusCode).json({
      message: error.message,
      status: "failed",
      error: error,
    });
  }
};

const signIn = async (req, res) => {
  const { email, password, googleId } = req.body;
  try {
    const existedUser = await userService.findByEmail(email);
    if (!existedUser) {
      // Not exist
      return res
        .status(400)
        .json({ message: "User with this email is not exist!" });
    }
    //Check verification
    const isVerified = await userService.checkUserIsVerified(email);
    if (!isVerified) {
      // Send verification mail link
      // Do the email verification process again
    }
    const isPasswordCorrect = await userService.comparePassword(
      password,
      existedUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(404).json({ message: "Invalid Credentials." });
    }
    //Generate token for user
    const token = userService.generateToken(
      {
        email: existedUser.email,
        id: existedUser._id,
      },
      ACCESS_TOKEN_SECRET,
      "1h"
    );
    return res.status(200).json({ result: existedUser, token });
  } catch (error) {
    // All the error will come in repo layer or service layer will be handled there and throw error here and send this error back to the client.
    return res.status(error.statusCode).json({
      message: error.message,
      status: "failed",
      error: error,
    });
  }
};

module.exports = { signUp, signIn };
