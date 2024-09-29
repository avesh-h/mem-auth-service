const userRepository = require("../repositories/user-repository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ServiceError = require("../utils/errors/service-error");

class UserService {
  generateToken(payload, secret, expiryTime) {
    const token = jwt.sign(payload, secret, {
      expiresIn: expiryTime || "1h",
    });
    return token;
  }

  async hashedPassword(password, salt = 12) {
    return await bcrypt.hash(password, salt);
  }

  async createUser({ email, password, name }) {
    try {
      const user = await userRepository.createUser({
        email,
        password,
        name,
        isVerified: false,
      });
      return user;
    } catch (error) {
      if (error.name === "ValidationError") {
        throw error;
      }
      throw new ServiceError("Something Went wrong!");
    }
  }

  async checkUserIsVerified(email) {
    return userRepository.checkUserVerification(email);
  }

  async findByEmail(email) {
    try {
      return await userRepository.findUserByEmail(email);
    } catch (error) {
      //Later we going to add service layer error
      if (error.name === "AttributeNotFound") {
        throw error;
      }
      throw new ServiceError(error.message);
    }
  }

  async comparePassword(userPassword, hashedPassword) {
    try {
      return await bcrypt.compare(userPassword, hashedPassword);
    } catch (error) {
      throw new ServiceError(
        error.message || "Something wrong in password comparison"
      );
    }
  }

  async getUserById(id) {
    try {
      const user = await userRepository.getUserById(id);
      return user;
    } catch (error) {
      throw new ServiceError(
        error.name,
        error.message,
        error.explanation,
        error.statusCode
      );
    }
  }

  async getUsersByNameOrEmail(keyWords, userId) {
    try {
      const users = await userRepository.getUsersByNameOrEmail(
        keyWords,
        userId
      );
      return users;
    } catch (error) {
      throw new ServiceError(
        error.name,
        error.message,
        error.explanation,
        error.statusCode
      );
    }
  }
}

module.exports = new UserService();
