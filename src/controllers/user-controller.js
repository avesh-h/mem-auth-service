const userService = require("../services/user-service");
const {
  VERIFY_TOKEN_SECRET,
  ACCESS_TOKEN_SECRET,
  MAIL_SERVICE_URL,
} = require("../config/serverConfig");
const axios = require("axios");
const httpStatusCode = require("../utils/httpStatusCode");
const ClientError = require("../utils/errors/client-error");

const signUp = async (req, res) => {
  const { email, firstName, lastName, password } = req.body;
  try {
    const isAlreadyExist = await userService.findByEmail(email);
    if (isAlreadyExist) {
      // Already exist
      return res
        .status(httpStatusCode.BAD_REQUEST)
        .json({ message: "User already exists." });
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
    const verificationLink = `${MAIL_SERVICE_URL}/api/v1/user/verification?email=${encodeURIComponent(
      email
    )}&token=${verificationToken}`;

    const verification = {
      email,
      message: "Please verify your email",
      html: `<h1>Verification Link : ${verificationLink}</h1>`,
    };

    //Make axios call to mail service for send mail
    await axios.post(
      `${MAIL_SERVICE_URL}/api/v1/user/send-verification-mail`,
      verification,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(httpStatusCode.CREATED).json({
      message:
        "Please verify your email address by clicking the verification link",
      status: "success",
    });
  } catch (error) {
    // All the error will come in repo layer or service layer will be handled there and throw error here and send this error back to the client.
    return res
      .status(error.statusCode || httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({
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
      // This is custom client error for maybe sending the wrong parameter or details not found!
      throw new ClientError(
        "AttributeNotFound",
        "Invalid username or password!",
        "Please check your email, as there is not record of the email",
        httpStatusCode.NOT_FOUND
      );
    }
    //Check verification
    const isVerified = await userService.checkUserIsVerified(email);
    if (!isVerified) {
      // Send verification mail link
      // Do the email verification process again
      //Create email verification token
      const verificationToken = userService.generateToken(
        { email },
        VERIFY_TOKEN_SECRET
      );
      //Send email for email verification
      const verificationLink = `${MAIL_SERVICE_URL}/api/v1/user/verification?email=${encodeURIComponent(
        email
      )}&token=${verificationToken}`;

      const verification = {
        email,
        message: "Please verify your email",
        html: `<h1>Verification Link : ${verificationLink}</h1>`,
      };

      //Make axios call to mail service for send mail
      await axios.post(
        `${MAIL_SERVICE_URL}/api/v1/user/send-verification-mail`,
        verification,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return res.status(httpStatusCode.BAD_REQUEST).json({
        message:
          "Account is not verified, Please Verify the account by clicking on the link in the email.",
        status: "failed",
      });
    }
    if (!googleId) {
      const isPasswordCorrect = await userService.comparePassword(
        password,
        existedUser.password
      );
      if (!isPasswordCorrect) {
        return res.status(404).json({ message: "Invalid Credentials." });
      }
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
    return res.status(httpStatusCode.OK).json({ result: existedUser, token });
  } catch (error) {
    // All the error will come in repo layer or service layer will be handled there and throw error here and send this error back to the client.
    return res
      .status(error.statusCode || httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({
        message: error.message,
        status: "failed",
        error: error,
      });
  }
};

const updateUserVerification = async (req, res) => {
  const { user } = req.query;
  try {
    const userData = await userService.findByEmail(user);
    userData.isVerified = true;
    await userData.save();
    return res
      .status(httpStatusCode.OK)
      .json({ message: "User Verification is completed!", status: "success" });
  } catch (error) {
    return res.status(error.statusCode).json({
      message: error.message,
      status: "failed",
      error: error,
    });
  }
};

const getUserDetails = async (req, res) => {
  const { user } = req.query;
  try {
    const userData = await userService.getUserById(user);
    return res
      .status(httpStatusCode.OK)
      .json({ data: userData, status: "success" });
  } catch (error) {
    return res
      .status(error.statusCode || httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({
        message: error.message,
        status: "failed",
        error: error,
      });
  }
};

const searchUsersByNameOrEmail = async (req, res) => {
  const keyWords = req?.query?.search;
  const userId = req?.query?.user || req?.userId;
  try {
    const users = await userService.getUsersByNameOrEmail(keyWords, userId);
    return res.status(httpStatusCode.OK).json({ users, status: "success" });
  } catch (error) {
    return res
      .status(error.statusCode || httpStatusCode.INTERNAL_SERVER_ERROR)
      .json({
        message: error.message,
        status: "failed",
        error: error,
      });
  }
};

module.exports = {
  signUp,
  signIn,
  updateUserVerification,
  getUserDetails,
  searchUsersByNameOrEmail,
};
