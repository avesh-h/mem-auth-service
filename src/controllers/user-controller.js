const userService = require("../services/user-service");
const { VERIFY_TOKEN_SECRET, LIVE_URL } = require("../config/serverConfig");

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
    console.log("controllerrrr", error);
  }
};

const signIn = async (req, res) => {};

module.exports = { signUp, signIn };
