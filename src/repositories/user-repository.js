// This is gonna be dao file
const User = require("../models/user");

class UserRepository {
  async createUser(userObj) {
    const user = new User(userObj);
    await user.save();
    return user;
  }

  async findUserByEmail(email) {
    try {
      const existingUser = await User.findOne({ email });
      return existingUser;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserRepository();
