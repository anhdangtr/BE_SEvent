const express = require('express');
const router = express.Router();
const EventCategory = require('../models/Category');

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *           description: Tên danh mục
 *         description:
 *           type: string
 *           description: Mô tả danh mục
 */

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Xóa danh mục và các sự kiện liên quan
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của danh mục
 *     responses:
 *       200:
 *         description: Xóa danh mục thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Không tìm thấy danh mục
 *       500:
 *         description: Lỗi server
 */
router.delete('/categories/:id', async (req, res) => {
  try {
    const category = await EventCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ message: 'Category not found' });
    
    await category.deleteOne(); // Middleware sẽ tự động chạy
    res.json({ message: 'Category and related events deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;