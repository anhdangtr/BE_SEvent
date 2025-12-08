// src/routes/cronRoutes.js
const express = require('express');
const Reminder = require('../models/Reminder');
const { sendReminderEmail } = require('../service/emailService');

const router = express.Router();

// Endpoint để check và gửi reminders (được gọi bởi external cron service)
router.get('/check-reminders', async (req, res) => {
  try {
    // Bảo mật: chỉ cho phép request từ cron service
    const cronSecret = req.headers['x-cron-secret'] || req.query.secret;
    if (cronSecret !== process.env.CRON_SECRET) {
      return res.status(401).json({ 
        success: false, 
        message: 'Unauthorized' 
      });
    }

    console.log('[Cron] Manual check triggered at:', new Date().toISOString());

    const now = new Date();
    // Tìm các reminder cần gửi (trong vòng 2 phút)
    const reminders = await Reminder.find({
      isSent: false,
      reminderDateTime: {
        $gte: new Date(now.getTime() - 120000),
        $lte: now
      }
    }).populate('userId').populate('eventId');

    console.log(`[Cron] Found ${reminders.length} pending reminders`);

    let sentCount = 0;
    let failedCount = 0;

    for (const reminder of reminders) {
      try {
        const user = reminder.userId;
        const event = reminder.eventId;

        console.log(`[Cron] Processing reminder ${reminder._id} for ${user.email}`);

        const emailSent = await sendReminderEmail(
          user.email,
          user.name,
          event,
          reminder.note,
          reminder.reminderDateTime
        );

        if (emailSent) {
          reminder.isSent = true;
          await reminder.save();
          sentCount++;
          console.log(`[Cron] ✓ Sent reminder ${reminder._id}`);
        } else {
          failedCount++;
          console.log(`[Cron] ✗ Failed reminder ${reminder._id}`);
        }
      } catch (error) {
        failedCount++;
        console.error(`[Cron] Error processing reminder ${reminder._id}:`, error);
      }
    }

    res.json({
      success: true,
      message: 'Reminder check completed',
      stats: {
        total: reminders.length,
        sent: sentCount,
        failed: failedCount
      }
    });

  } catch (error) {
    console.error('[Cron] Error in check-reminders:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
