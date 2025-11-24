const express = require('express');
const { 
  getAllEvents, 
  getEventById, 
  getTrendingEvents,
  createEvent, 
  updateEvent, 
  deleteEvent,
  likeEvent,
  saveEvent
} = require('../controllers/eventController');
const auth = require('../middleware/authMiddleware'); // Middleware xác thực JWT

const router = express.Router();

// Public Routes (không cần auth)
router.get('/', getAllEvents);                    // Lấy tất cả events với pagination
router.get('/trending', getTrendingEvents);       // Lấy events nổi bật
router.get('/:id', getEventById);                 // Lấy chi tiết event

// Private Routes (cần auth), dành cho admin
router.post('/', auth, createEvent);              // Tạo event mới
router.put('/:id', auth, updateEvent);            // Cập nhật event
router.delete('/:id', auth, deleteEvent);         // Xóa event
router.post('/:id/like', auth, likeEvent);        // Like event
router.post('/:id/save', auth, saveEvent);        // Save event

module.exports = router;