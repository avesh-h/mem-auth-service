// This is gonna be dao file
const User = require("../models/user");
const ClientError = require("../utils/errors/client-error");
const httpStatusCode = require("../utils/httpStatusCode");
const ValidationError = require("../utils/errors/validation-error");

class UserRepository {
  async createUser(userObj) {
    try {
      const user = new User(userObj);
      await user.save();
      return user;
    } catch (error) {
      if (error.name === "ValidationError") {
        throw new ValidationError(error);
      }
      throw error;
    }
  }

  async findUserByEmail(email) {
    try {
      const existingUser = await User.findOne({ email });
      return existingUser;
    } catch (error) {
      throw error;
    }
  }

  async checkUserVerification(email) {
    try {
      const existingUser = await User.findOne({ email });
      return existingUser.isVerified;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const user = await User.findById(id).select("name email _id");
      return user;
    } catch (error) {
      throw error;
    }
  }

  // Get all users by searching match email or name
  async getUsersByNameOrEmail(keyWords, userId) {
    try {
      const searchQuery = keyWords
        ? {
            $or: [
              {
                name: { $regex: keyWords, $options: "i" },
              },
              {
                email: { $regex: keyWords, $options: "i" },
              },
            ],
          }
        : {};
      const users = await User.find(searchQuery).find({ _id: { $ne: userId } }); //For exclude current user account from search
      return users;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserRepository();
