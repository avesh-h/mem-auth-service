const userRepository = require("../repositories/user-repository");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
      console.log("Error in service layer");
      throw error;
    }
  }

  async findByEmail(email) {
    return await userRepository.findUserByEmail(email);
  }

  //   async signIn({ email, password, googleId }) {
  //     try {
  //       const existingUser = await userRepository.findUserByEmail(email);
  //       if (!existingUser) {
  //       }
  //     } catch (error) {}
  //   }
}

module.exports = new UserService();
