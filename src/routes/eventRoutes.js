const express = require('express');
const { 
  getAllEvents, 
  getEventById, 
  getTrendingEvents,
  createEvent, 
  updateEvent, 
  deleteEvent,
  checkIfUserLiked,
  toggleLikeEvent,
  toggleSaveEvent
} = require('../controllers/eventController');

const auth = require('../middleware/authMiddleware');

const router = express.Router();


// PUBLIC ROUTES
router.get('/', getAllEvents);                 // Lấy tất cả events (có pagination)
router.get('/trending', getTrendingEvents);    // Lấy events nổi bật

// USER ACTIONS (CẦN LOGIN)
router.post('/:eventId/toggle-like', auth, toggleLikeEvent);  // Like / Unlike
router.post('/:eventId/toggle-save', auth, toggleSaveEvent);  // Save / Unsave (folder Watch Later)
router.get('/:eventId/check-liked', auth, checkIfUserLiked); // Kiểm tra user đã like event chưa
router.get('/:eventId', auth, getEventById);   // Lấy chi tiết event (cần login vì có thông tin user đã like/save chưa)

// ADMIN ROUTES (CẦN LOGIN + ADMIN ROLE)
router.post('/', auth, createEvent);           // Tạo event mới
router.put('/:eventId', auth, updateEvent);    // Cập nhật event
router.delete('/:eventId', auth, deleteEvent); // Xóa event

module.exports = router;
