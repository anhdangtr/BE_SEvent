// models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  bannerUrl: String,
  registrationFormUrl: String,
  formSubmissionDeadline: Date,
  publishDate: Date,
  startDate: Date,
  endDate: Date,
  location: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'EventCategory' },
  organization: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Event', eventSchema);
