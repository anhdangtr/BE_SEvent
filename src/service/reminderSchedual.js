const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const User = require('../models/User');
const Event = require('../models/Event');
const { sendReminderEmail } = require('./emailService');

// Kiểm tra reminders mỗi phút
const startReminderScheduler = () => {
  console.log('[Scheduler] Starting reminder scheduler...');
  console.log('[Scheduler] Environment:', process.env.VERCEL ? 'VERCEL' : 'LOCAL');
  
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      console.log('[Scheduler] Checking reminders at:', now.toISOString());
      
      // Tìm các reminder trong vòng 2 phút
      const reminders = await Reminder.find({
        isSent: false,
        reminderDateTime: {
          $gte: new Date(now.getTime() - 120000),
          $lte: now
        }
      }).populate('userId').populate('eventId');
      
      console.log(`[Scheduler] Found ${reminders.length} pending reminders`);

      for (const reminder of reminders) {
        try {
          const user = reminder.userId;
          const event = reminder.eventId;

          console.log(`[Scheduler] Processing reminder ${reminder._id} for user ${user.email}`);

          // Gửi email với đầy đủ thông tin event
          const emailSent = await sendReminderEmail(
            user.email,
            user.name,
            event, // Truyền full event object thay vì chỉ event.title
            reminder.note,
            reminder.reminderDateTime
          );

          // Cập nhật status nếu gửi thành công
          if (emailSent) {
            reminder.isSent = true;
            await reminder.save();
            console.log(`[Scheduler] ✓ Email sent successfully for reminder ${reminder._id}`);
          } else {
            console.log(`[Scheduler] ✗ Email failed for reminder ${reminder._id}`);
          }
        } catch (error) {
          console.error(`[Scheduler] Error processing reminder ${reminder._id}:`, error);
        }
      }
    } catch (error) {
      console.error('Lỗi reminder scheduler:', error);
    }
  });

  console.log('Reminder scheduler đã khởi động');
};

module.exports = { startReminderScheduler };