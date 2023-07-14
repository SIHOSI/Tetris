const AuthService = require('../services/authService');

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }

  // 회원가입
  async signup(req, res) {
    try {
      const { nickname, password } = req.body;
      // 값이 비어있을 때
      if (!nickname || !password) {
        return res
          .status(401)
          .json({ message: '닉네임과 비밀번호를 입력해주세요.' });
      }

      // 회원가입 처리
      const newUser = await this.authService.signup(nickname, password);
      res.status(201).json({ message: '회원가입 완료', newUser });
    } catch (error) {
      console.log(
        '🚀 ~ file: authController.js:23 ~ AuthController ~ signup ~ error:',
        error
      );
      res.status(500).json({ message: '회원가입 오류' });
    }
  }

  async login(req, res) {
    try {
      const { nickname, password } = req.body;
      // 로그인 처리
      const response = await this.authService.login(
        nickname,
        password,
        req.cookies.accessToken,
        req.cookies.refreshToken
      );

      console.log(
        '🚀 ~ file: authController.js:42 ~ AuthController ~ login ~ response:',
        response
      );

      if (response.newAccessToken && response.newRefreshToken) {
        res
          .cookie('accessToken', response.newAccessToken, { httpOnly: true })
          .cookie('refreshToken', response.newRefreshToken, { httpOnly: true })
          .json(response);
      }
      if (response.newAccessToken && !response.newRefreshToken) {
        res
          .cookie('accessToken', response.newAccessToken, { httpOnly: true })
          .json(response);
      }
      if (!response.newAccessToken && response.newRefreshToken) {
        res
          .cookie('refreshToken', response.newRefreshToken, { httpOnly: true })
          .json(response);
      }
      if (!response.newAccessToken && !response.newRefreshToken) {
        res.json(response);
      }
    } catch (error) {
      console.log(
        '🚀 ~ file: authController.js:35 ~ AuthController ~ login ~ error:',
        error
      );
      res.status(500).json({ message: '로그인 오류' });
    }
  }

  async logout(req, res) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ message: '로그아웃되었습니다.' });
  }
}

module.exports = AuthController;
