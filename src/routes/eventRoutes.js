// src/routes/eventRoutes.js

const express = require('express');
const { 
  getAllEvents, 
  getEventById, 
  getTrendingEvents,
  createEvent, 
  updateEvent, 
  deleteEvent,
  checkIfUserLiked,
  checkIfUserSaved,
  toggleLikeEvent,
  toggleSaveEvent
} = require('../controllers/eventController');

const auth = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Event:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *           description: Tên sự kiện
 *         description:
 *           type: string
 *           description: Mô tả sự kiện
 *         location:
 *           type: string
 *           description: Địa điểm
 *         startTime:
 *           type: string
 *           format: date-time
 *         endTime:
 *           type: string
 *           format: date-time
 *         category:
 *           type: string
 *           description: ID của category
 *         imageUrl:
 *           type: string
 *         organizer:
 *           type: string
 *           description: Người tổ chức
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *         saves:
 *           type: array
 *           items:
 *             type: string
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Lấy tất cả sự kiện (có phân trang)
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Số trang
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Số lượng mỗi trang
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Lọc theo category
 *     responses:
 *       200:
 *         description: Danh sách sự kiện
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 events:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Event'
 *                 pagination:
 *                   type: object
 */
router.get('/', getAllEvents);

/**
 * @swagger
 * /api/events/trending:
 *   get:
 *     summary: Lấy các sự kiện nổi bật
 *     tags: [Events]
 *     responses:
 *       200:
 *         description: Danh sách sự kiện nổi bật
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 */
router.get('/trending', getTrendingEvents);

/**
 * @swagger
 * /api/events/{eventId}:
 *   get:
 *     summary: Lấy chi tiết sự kiện
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của sự kiện
 *     responses:
 *       200:
 *         description: Chi tiết sự kiện
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 *       404:
 *         description: Không tìm thấy sự kiện
 */
router.get('/:eventId', auth, getEventById);

/**
 * @swagger
 * /api/events/{eventId}/check-liked:
 *   get:
 *     summary: Kiểm tra người dùng đã like sự kiện chưa
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trạng thái like
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 liked:
 *                   type: boolean
 */
router.get('/:eventId/check-liked', auth, checkIfUserLiked);

/**
 * @swagger
 * /api/events/{eventId}/check-saved:
 *   get:
 *     summary: Kiểm tra người dùng đã lưu sự kiện chưa
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trạng thái save
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 saved:
 *                   type: boolean
 */
router.get('/:eventId/check-saved', auth, checkIfUserSaved);

/**
 * @swagger
 * /api/events/{eventId}/toggle-like:
 *   post:
 *     summary: Like/Unlike sự kiện
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 liked:
 *                   type: boolean
 */
router.post('/:eventId/toggle-like', auth, toggleLikeEvent);

/**
 * @swagger
 * /api/events/{eventId}/toggle-save:
 *   post:
 *     summary: Lưu/Bỏ lưu sự kiện
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 saved:
 *                   type: boolean
 */
router.post('/:eventId/toggle-save', auth, toggleSaveEvent);

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Tạo sự kiện mới
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - startTime
 *               - endTime
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               category:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               organizer:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo sự kiện thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 */
router.post('/', auth, createEvent);

/**
 * @swagger
 * /api/events/{eventId}:
 *   put:
 *     summary: Cập nhật sự kiện
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               location:
 *                 type: string
 *               startTime:
 *                 type: string
 *                 format: date-time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *               category:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *               organizer:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Event'
 */
router.put('/:eventId', auth, updateEvent);

/**
 * @swagger
 * /api/events/{eventId}:
 *   delete:
 *     summary: Xóa sự kiện
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy sự kiện
 */
router.delete('/:eventId', auth, deleteEvent);

module.exports = router;