const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const {getProfile} = require("../controllers/userProfileController");

/**
 * @swagger
 * /api/get-profile/{userID}/profile:
 *   get:
 *     summary: Lấy thông tin profile của người dùng
 *     tags: [User Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userID
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Thông tin profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       404:
 *         description: Không tìm thấy người dùng
 */
router.get("/:userID/profile", auth, getProfile);

module.exports = router;
