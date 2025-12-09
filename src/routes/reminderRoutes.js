const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createReminder,
  getReminders,
  deleteReminder,
  updateReminder
} = require('../controllers/reminderController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Reminder:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         eventId:
 *           type: string
 *         reminderTime:
 *           type: string
 *           format: date-time
 *         message:
 *           type: string
 *         sent:
 *           type: boolean
 */

/**
 * @swagger
 * /api/reminders/{eventId}:
 *   get:
 *     summary: Lấy tất cả reminder của một sự kiện
 *     tags: [Reminders]
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
 *         description: Danh sách reminder
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Reminder'
 */
router.get('/:eventId', auth, getReminders);

/**
 * @swagger
 * /api/reminders:
 *   post:
 *     summary: Tạo reminder mới
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *               - reminderTime
 *             properties:
 *               eventId:
 *                 type: string
 *               reminderTime:
 *                 type: string
 *                 format: date-time
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo reminder thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reminder'
 */
router.post('/', auth, createReminder);

/**
 * @swagger
 * /api/reminders/{reminderId}:
 *   put:
 *     summary: Cập nhật reminder
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reminderId
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
 *               reminderTime:
 *                 type: string
 *                 format: date-time
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Reminder'
 */
router.put('/:reminderId', auth, updateReminder);

/**
 * @swagger
 * /api/reminders/{reminderId}:
 *   delete:
 *     summary: Xóa reminder
 *     tags: [Reminders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: reminderId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy reminder
 */
router.delete('/:reminderId', auth, deleteReminder);

module.exports = router;
