const User = require('../schemas/user');

class AuthRepository {
  async findUserByNickname(nickname) {
    const user = await User.findOne({ nickname: nickname });
    return user;
  }

  async createUser(nickname, password) {
    const newUser = await User.create({
      nickname: nickname,
      password: password,
    });

    return newUser;
  }
}

module.exports = AuthRepository;
