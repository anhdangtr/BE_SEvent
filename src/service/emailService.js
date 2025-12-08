const transporter = require('../config/email');

const EMAIL_USER = process.env.EMAIL_USER && process.env.EMAIL_USER.trim();
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD && process.env.EMAIL_PASSWORD.trim();

const sendReminderEmail = async (userEmail, userName, eventData, note, reminderDateTime) => {
  console.log(`[Email] Attempting to send reminder to ${userEmail}`);
  console.log(`[Email] EMAIL_USER configured: ${!!EMAIL_USER}`);
  console.log(`[Email] EMAIL_PASSWORD configured: ${!!EMAIL_PASSWORD}`);
  
  // If credentials are not configured, skip attempting to send and log a clear message.
  if (!EMAIL_USER || !EMAIL_PASSWORD) {
    console.warn('[Email] ✗ Skipping sendReminderEmail: missing EMAIL_USER or EMAIL_PASSWORD');
    return false;
  }

  // Extract event details
  const eventTitle = typeof eventData === 'string' ? eventData : eventData.title;
  const eventTime = eventData.startTime ? new Date(eventData.startTime).toLocaleString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : 'Chưa xác định';
  const eventLocation = eventData.location || 'Chưa xác định';
  const eventId = eventData._id || eventData.id || '';
  const eventLink = eventId ? `${process.env.FRONTEND_URL || 'http://localhost:5174'}/events/${eventId}` : '#';

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: `Sevent reminds you about: ${eventTitle}`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 650px; margin: 0 auto; background: #f5f5f5;">
        <!-- Header: Purple Sevent Reminder -->
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px 20px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 600; letter-spacing: 1px;">
            🔔 Sevent Reminder
          </h1>
        </div>
        
        <!-- Main Content: White Box -->
        <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; margin-bottom: 20px;">
          <p style="font-size: 16px; color: #333; margin-bottom: 25px;">
            Dear <strong style="color: #667eea;">${userName}</strong>,
          </p>
          
          <!-- Event Details Box -->
          <div style="background: #f8f9ff; padding: 20px; border-radius: 8px; border-left: 5px solid #667eea; margin: 20px 0;">
            <h2 style="color: #333; margin: 0 0 15px 0; font-size: 22px; font-weight: 600;">
              ${eventTitle}
            </h2>
            
            <p style="margin: 10px 0; font-size: 15px; color: #555; line-height: 1.6;">
              <span style="display: inline-block; width: 25px;">⏰</span>
              <strong>Time:</strong> ${eventTime}
            </p>
            
            <p style="margin: 10px 0; font-size: 15px; color: #555; line-height: 1.6;">
              <span style="display: inline-block; width: 25px;">📍</span>
              <strong>Location:</strong> ${eventLocation}
            </p>
            
            ${note ? `
            <p style="margin: 10px 0; font-size: 15px; color: #555; line-height: 1.6;">
              <span style="display: inline-block; width: 25px; vertical-align: top;">🗒️</span>
              <strong>Your notes:</strong><br/>
              <span style="margin-left: 25px; display: inline-block; margin-top: 5px; color: #666; font-style: italic;">
                ${note}
              </span>
            </p>
            ` : `
            <p style="margin: 10px 0; font-size: 15px; color: #555; line-height: 1.6;">
              <span style="display: inline-block; width: 25px;">🗒️</span>
              <strong>Your notes:</strong> <span style="color: #999;">No notes</span>
            </p>
            `}
          </div>
          
          <!-- Footer Message -->
          <p style="color: #666; font-size: 14px; margin: 25px 0 20px 0; line-height: 1.5;">
            This is an automatic message. You can check the event's details here: 
            <a href="${eventLink}" style="color: #667eea; text-decoration: none; font-weight: 600;">
              ${eventTitle}
            </a>
          </p>
          
          <!-- View Event Button -->
          <div style="text-align: center; margin-top: 25px;">
            <a href="${eventLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 35px; text-decoration: none; border-radius: 25px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);">
              View Event Details
            </a>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background: #f0f0f0; padding: 20px; text-align: center; color: #666; font-size: 12px; border-radius: 0 0 10px 10px;">
          <p style="margin: 5px 0;">© ${new Date().getFullYear()} Sevent. All rights reserved.</p>
          <p style="margin: 5px 0;">Never miss an important event again! 🎉</p>
        </div>
      </div>
    `
  };

  try {
    console.log(`[Email] Sending email to ${userEmail}...`);
    await transporter.sendMail(mailOptions);
    console.log(`[Email] ✓ Email sent successfully to ${userEmail}`);
    return true;
  } catch (error) {
    console.error(`[Email] ✗ Error sending email to ${userEmail}:`, error.message);
    console.error('[Email] Full error:', error);
    return false;
  }
};

module.exports = { sendReminderEmail };