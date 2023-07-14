const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController.js');
const authController = new AuthController();

// 회원가입
router.post('/auth/signup', authController.signup.bind(authController));

// 로그인
router.post('/auth/login', authController.login.bind(authController));

// 로그아웃
router.post('/auth/logout', authController.logout.bind(authController));

module.exports = router;
