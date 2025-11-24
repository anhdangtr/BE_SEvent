// src/controllers/eventController.js

const Event = require('../models/Event');
const mongoose = require('mongoose');

// GET /api/events - Lấy danh sách sự kiện + phân trang + tìm kiếm + lọc category
const getAllEvents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const { search, category } = req.query;

    // Xây dựng query tìm kiếm
    let query = {};

    // Tìm theo từ khóa trong title (không phân biệt hoa thường)
    if (search && search.trim() !== '') {
      query.title = { $regex: search.trim(), $options: 'i' };
    }

    // Lọc theo danh mục (category là String: tech, business, education, entertainment)
    if (category && category !== 'all') {
      query.category = category;
    }

    // Đếm tổng số sự kiện thỏa điều kiện
    const totalEvents = await Event.countDocuments(query);

    // Lấy danh sách sự kiện
    const events = await Event.find(query)
      .sort({ startDate: -1, createdAt: -1 }) // Sự kiện sắp tới trước, mới tạo trước
      .skip(skip)
      .limit(limit)
      .select('-__v') // Không trả về trường __v
      .lean(); // Tăng tốc độ

    const totalPages = Math.ceil(totalEvents / limit);

    res.json({
      success: true,
      data: events,
      pagination: {
        page,
        pages: totalPages,
        total: totalEvents,
        limit
      }
    });
  } catch (error) {
    console.error('Error in getAllEvents:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách sự kiện'
    });
  }
};

// GET /api/events/trending - Lấy sự kiện nổi bật (dựa trên interestingCount + saveCount)
const getTrendingEvents = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 6;

    const trendingEvents = await Event.find()
      .sort({
        interestingCount: -1,
        saveCount: -1,
        createdAt: -1
      })
      .limit(limit)
      .select('-__v')
      .lean();

    res.json({
      success: true,
      data: trendingEvents
    });
  } catch (error) {
    console.error('Error in getTrendingEvents:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy sự kiện nổi bật'
    });
  }
};

// GET /api/events/:id - Lấy chi tiết 1 sự kiện
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'ID không hợp lệ' });
    }

    const event = await Event.findById(id).lean();

    if (!event) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sự kiện' });
    }

    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    console.error('Error in getEventById:', error);
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// POST /api/events - Tạo sự kiện mới (cần auth)
const createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      createdBy: req.user.id // từ middleware auth
    };

    const event = await Event.create(eventData);

    res.status(201).json({
      success: true,
      message: 'Tạo sự kiện thành công',
      data: event
    });
  } catch (error) {
    console.error('Error in createEvent:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi tạo sự kiện' });
  }
};

// PUT /api/events/:id - Cập nhật sự kiện
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const event = await Event.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sự kiện' });
    }

    res.json({
      success: true,
      message: 'Cập nhật thành công',
      data: event
    });
  } catch (error) {
    console.error('Error in updateEvent:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi cập nhật' });
  }
};

// DELETE /api/events/:id - Xóa sự kiện
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByIdAndDelete(id);

    if (!event) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sự kiện' });
    }

    res.json({
      success: true,
      message: 'Xóa sự kiện thành công'
    });
  } catch (error) {
    console.error('Error in deleteEvent:', error);
    res.status(500).json({ success: false, message: 'Lỗi khi xóa' });
  }
};

// POST /api/events/:id/like - Like sự kiện (tăng interestingCount)
const likeEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByIdAndUpdate(
      id,
      { $inc: { interestingCount: 1 } },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ success: false, message: 'Sự kiện không tồn tại' });
    }

    res.json({
      success: true,
      message: 'Đã thích sự kiện',
      data: { interestingCount: event.interestingCount }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

// POST /api/events/:id/save - Lưu sự kiện
const saveEvent = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await Event.findByIdAndUpdate(
      id,
      { $inc: { saveCount: 1 } },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ success: false, message: 'Sự kiện không tồn tại' });
    }

    res.json({
      success: true,
      message: 'Đã lưu sự kiện',
      data: { saveCount: event.saveCount }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Lỗi server' });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  getTrendingEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  likeEvent,
  saveEvent
};