// models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  shortDescription: String,
  bannerUrl: String,
  registrationFormUrl: String,
  formSubmissionDeadline: Date,
  publishDate: Date,
  startDate: Date,
  endDate: Date,
  location: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  organization: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },

  // Counter cho lượt like và save
  interestingCount: { type: Number, default: 0 },
  saveCount: { type: Number, default: 0 },

  // ⭐ Mảng user đã like (bắt buộc để .includes() không crash)
  interestingEvents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
});

module.exports = mongoose.model('Event', eventSchema);
