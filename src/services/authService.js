const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AuthRepository = require('../repositories/authRepository');
require('dotenv').config();
const env = process.env;

class AuthService {
  constructor() {
    this.authRepository = new AuthRepository();
  }

  //액세스 토큰 발급
  generateAccessToken(userId, userNickname) {
    return jwt.sign(
      { userId: userId, userNickname: userNickname },
      env.ACCESS_KEY,
      {
        expiresIn: '1h',
      }
    );
  }

  // 리프레시 토큰 발급
  generateRefreshToken(userId) {
    return jwt.sign({ userId: userId }, env.REFRESH_KEY, {
      expiresIn: '7d',
    });
  }

  async signup(nickname, password) {
    const user = await this.authRepository.findUserByNickname(nickname);
    if (user) {
      throw new Error('이미 존재하는 닉네임.');
    }

    // 비밀번호 유효성
    const passwordRegex = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{5,}$/;
    if (!passwordRegex.test(password)) {
      throw new Error('비밀번호는 5글자 이상이며 특수문자를 포함해야 합니다.');
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.authRepository.createUser(
      nickname,
      hashedPassword
    );
    console.log(
      '🚀 ~ file: authService.js:28 ~ AuthService ~ signup ~ newUser:',
      newUser
    );

    return newUser;
  }

  async login(nickname, password, accessToken, refreshToken) {
    // Case 1: 처음 로그인하는 경우
    if (!refreshToken) {
      const user = await this.authRepository.findUserByNickname(nickname);

      // 회원 유효성
      if (!user) {
        throw new Error('닉네임이 존재하지 않습니다.');
      }

      // console.log(`유저 아이디: ${user._id}`);

      // 비밀번호 유효성
      const comparePassword = await bcrypt.compare(password, user.password);
      if (!comparePassword) {
        throw new Error('잘못된 비밀번호.');
      }

      const newAccessToken = this.generateAccessToken(user._id, user.nickname);
      const newRefreshToken = this.generateRefreshToken(user._id);

      const userId = user._id.toString();
      const userNickname = user.nickname;

      console.log(userId);

      return {
        userId,
        userNickname,
        newAccessToken,
        newRefreshToken,
        message: '로그인되었습니다.',
      };
    }

    // Case 2: Access Token과 Refresh Token 모두 만료된 경우
    try {
      jwt.verify(refreshToken, env.REFRESH_KEY);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const decodedRefreshToken = jwt.decode(refreshToken);
        const userId = decodedRefreshToken.userId;
        const userNickname = decodedRefreshToken.userNickname;

        const newAccessToken = this.generateAccessToken(userId, userNickname);
        const newRefreshToken = this.generateRefreshToken(userId);

        return {
          userId,
          userNickname,
          newAccessToken,
          newRefreshToken,
          message: 'ACCESS TOKEN과 REFRESH TOKEN이 갱신되었습니다.',
        };
      }
    }

    // Case 3: Access Token은 만료됐지만 Refresh Token은 유효한 경우
    try {
      jwt.verify(accessToken, env.ACCESS_KEY);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        const decodedRefreshToken = jwt.decode(refreshToken);
        const userId = decodedRefreshToken.userId;
        const userNickname = decodedRefreshToken.userNickname;

        const newAccessToken = this.generateAccessToken(userId, userNickname);

        return {
          userId,
          userNickname,
          newAccessToken,
          message: 'ACCESS TOKEN이 갱신되었습니다.',
        };
      }
    }

    // Case 4: Access Token은 유효하지만 Refresh Token은 만료된 경우
    // try {
    //   jwt.verify(refreshToken, env.REFRESH_KEY);
    // } catch (err) {
    //   if (err.name === 'TokenExpiredError') {
    //     const decodedAccessToken = jwt.decode(accessToken);
    //     const userId = decodedAccessToken.userId;

    //     const newRefreshToken = this.generateRefreshToken(userId);

    //     return {
    //       userId,
    //       accessToken,
    //       newRefreshToken,
    //       message: 'REFRESH TOKEN이 갱신되었습니다.',
    //     };
    //   }
    // }

    // Case 5: Access Token과 Refresh Token 모두 유효한 경우
    if (refreshToken) {
      const decodedAccessToken = jwt.decode(accessToken);

      console.log(
        '🚀 ~ file: authService.js:157 ~ AuthService ~ login ~ decodedAccessToken:',
        decodedAccessToken
      );

      const userId = decodedAccessToken.userId;
      const userNickname = decodedAccessToken.userNickname;
      return {
        userId,
        userNickname,
        accessToken,
        message: 'ACCESS TOKEN과 REFRESH TOKEN이 모두 유효합니다.',
      };
    }
  }
}

module.exports = AuthService;
