// models/Reminder.js
const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
<<<<<<< HEAD
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  reminderTime: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  isSend: { type: Boolean, default: false }
});

module.exports = mongoose.model('Reminder', reminderSchema);
=======
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  reminderDateTime: { type: Date, required: true },
  note: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  isSent: { type: Boolean, default: false }
});

// Index to enforce unique reminder times per user per event
reminderSchema.index({ userId: 1, eventId: 1, reminderDateTime: 1 }, { unique: true });

module.exports = mongoose.model('Reminder', reminderSchema);
>>>>>>> 33bf93028ade5eb5ffd3c543919c5ec2305b1787
