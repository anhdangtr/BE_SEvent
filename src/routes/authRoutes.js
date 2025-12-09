const express = require('express');
const { signup, login } = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: ID của người dùng
 *         username:
 *           type: string
 *           description: Tên đăng nhập
 *         email:
 *           type: string
 *           description: Email người dùng
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           description: Vai trò của người dùng
 *     SignupRequest:
 *       type: object
 *       required:
 *         - username
 *         - email
 *         - password
 *       properties:
 *         username:
 *           type: string
 *           description: Tên đăng nhập
 *         email:
 *           type: string
 *           description: Email
 *         password:
 *           type: string
 *           description: Mật khẩu
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: Email
 *         password:
 *           type: string
 *           description: Mật khẩu
 *     AuthResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *         token:
 *           type: string
 *           description: JWT token
 *         user:
 *           $ref: '#/components/schemas/User'
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SignupRequest'
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Thông tin không hợp lệ
 *       409:
 *         description: Email đã tồn tại
 */
router.post('/signup', signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       400:
 *         description: Thông tin không hợp lệ
 *       401:
 *         description: Sai email hoặc mật khẩu
 */
router.post('/login', login);

module.exports = router;