const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  saveEvent,
  getSavedEvents,
  updateSavedEvent,
  deleteSavedEvent,
  getFolderList,
  createFolder,
  getSavedEventsByFolder
} = require('../controllers/savedEventController');

/**
 * @swagger
 * components:
 *   schemas:
 *     SavedEvent:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         eventId:
 *           type: string
 *         folderName:
 *           type: string
 *         savedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/saved-events:
 *   post:
 *     summary: Lưu sự kiện vào thư mục
 *     tags: [Saved Events]
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
 *             properties:
 *               eventId:
 *                 type: string
 *               folderName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Lưu sự kiện thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SavedEvent'
 */
router.post('/', auth, saveEvent);

/**
 * @swagger
 * /api/saved-events:
 *   get:
 *     summary: Lấy tất cả sự kiện đã lưu
 *     tags: [Saved Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách sự kiện đã lưu
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SavedEvent'
 */
router.get('/', auth, getSavedEvents);

/**
 * @swagger
 * /api/saved-events/{eventId}:
 *   put:
 *     summary: Di chuyển sự kiện sang thư mục khác
 *     tags: [Saved Events]
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
 *               folderName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Di chuyển thành công
 */
router.put('/:eventId', auth, updateSavedEvent);

/**
 * @swagger
 * /api/saved-events/{eventId}:
 *   delete:
 *     summary: Xóa sự kiện đã lưu
 *     tags: [Saved Events]
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
 */
router.delete('/:eventId', auth, deleteSavedEvent);

/**
 * @swagger
 * /api/saved-events/get-folders:
 *   get:
 *     summary: Lấy danh sách các thư mục
 *     tags: [Saved Events]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Danh sách thư mục
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 */
router.get('/get-folders', auth, getFolderList);

/**
 * @swagger
 * /api/saved-events/folder/{folderName}:
 *   get:
 *     summary: Lấy các sự kiện trong thư mục
 *     tags: [Saved Events]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: folderName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách sự kiện trong thư mục
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SavedEvent'
 */
router.get('/folder/:folderName', auth, getSavedEventsByFolder);

/**
 * @swagger
 * /api/saved-events/post-folders:
 *   post:
 *     summary: Tạo thư mục mới
 *     tags: [Saved Events]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - folderName
 *             properties:
 *               folderName:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo thư mục thành công
 */
router.post('/post-folders', auth, createFolder);

module.exports = router;
