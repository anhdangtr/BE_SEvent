# Hướng dẫn Setup Reminder Email trên Production (Vercel)

## Vấn đề
Vercel là serverless platform → không hỗ trợ cron jobs chạy liên tục → `node-cron` không hoạt động.

## Giải pháp đã implement

### 1. Tạo API Endpoint để Check Reminders
- **Endpoint**: `GET /api/cron/check-reminders`
- Có thể gọi bởi external cron service (Cron-Job.org, EasyCron, etc.)

---

## Các Bước Setup

### Bước 1: Cấu hình Environment Variables trên Vercel

1. Vào **Vercel Dashboard** → Project **seventwebsite** → **Settings** → **Environment Variables**

2. Thêm các biến sau:
   ```
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   FRONTEND_URL=https://seventwebsite.vercel.app
   CRON_SECRET=random-secret-string-here-12345
   ```

3. **Important**: `EMAIL_PASSWORD` phải là **App Password** của Gmail, không phải password thường:
   - Vào https://myaccount.google.com/apppasswords
   - Tạo App Password mới cho "Mail"
   - Copy password 16 ký tự và dán vào `EMAIL_PASSWORD`

4. **Redeploy** project sau khi thêm biến

### Bước 2: Setup External Cron Service

#### Option A: Sử dụng Cron-Job.org (Free, Khuyên dùng)

1. Đăng ký tại: https://cron-job.org/
2. Tạo cron job mới:
   - **URL**: `https://seventwebsite.onrender.com/api/cron/check-reminders?secret=YOUR_CRON_SECRET`
   - **Schedule**: Mỗi phút `* * * * *`
   - **Method**: GET
   - **Headers**: 
     ```
     x-cron-secret: YOUR_CRON_SECRET
     ```

#### Option B: Sử dụng EasyCron (Free tier)

1. Đăng ký tại: https://www.easycron.com/
2. Tạo cron job:
   - **URL**: `https://seventwebsite.onrender.com/api/cron/check-reminders?secret=YOUR_CRON_SECRET`
   - **Cron Expression**: `* * * * *` (mỗi phút)

#### Option C: Sử dụng GitHub Actions (Free)

Tạo file `.github/workflows/cron-reminders.yml`:

\`\`\`yaml
name: Check Reminders

on:
  schedule:
    - cron: '* * * * *'  # Chạy mỗi phút
  workflow_dispatch:  # Cho phép trigger manual

jobs:
  check-reminders:
    runs-on: ubuntu-latest
    steps:
      - name: Call reminder endpoint
        run: |
          curl -X GET "https://seventwebsite.onrender.com/api/cron/check-reminders?secret=\${{ secrets.CRON_SECRET }}"
\`\`\`

**Note**: GitHub Actions free tier có giới hạn, khuyên dùng Option A hoặc B.

---

## Bước 3: Debug và Kiểm tra

### 3.1. Kiểm tra logs trên Vercel

1. Vào Vercel Dashboard → Project → **Deployments** → Click deployment mới nhất
2. Click tab **Functions** hoặc **Runtime Logs**
3. Tìm các log bắt đầu bằng `[Scheduler]`, `[Email]`, `[Cron]`

### 3.2. Test endpoint thủ công

```bash
# Thay YOUR_CRON_SECRET bằng giá trị thật
curl "https://seventwebsite.onrender.com/api/cron/check-reminders?secret=YOUR_CRON_SECRET"
```

Response mong đợi:
```json
{
  "success": true,
  "message": "Reminder check completed",
  "stats": {
    "total": 2,
    "sent": 2,
    "failed": 0
  }
}
```

### 3.3. Kiểm tra email config

Vào Vercel logs, tìm dòng:
```
[Email] EMAIL_USER configured: true
[Email] EMAIL_PASSWORD configured: true
Email server is ready to send messages
```

Nếu thấy `false`, nghĩa là chưa config đúng environment variables.

---

## Bước 4: Test End-to-End

1. Tạo reminder trên UI (đặt thời gian sau 1-2 phút)
2. Đợi cron service gọi API
3. Check logs trên Vercel
4. Check email inbox

---

## Troubleshooting

### Lỗi: Email không gửi được

**Kiểm tra:**
1. Environment variables đã set đúng chưa?
   ```bash
   # Check logs để thấy
   [Email] EMAIL_USER configured: true/false
   ```

2. Gmail App Password đúng chưa?
   - Phải dùng App Password 16 ký tự, không phải password thường
   - Enable 2FA trên Gmail account trước khi tạo App Password

3. Firewall/Security:
   - Gmail có thể block nếu detect "less secure app"
   - Vào https://myaccount.google.com/security
   - Enable "Less secure app access" (nếu có)

### Lỗi: Scheduler không chạy

**Nguyên nhân:** Vercel serverless không hỗ trợ background process

**Giải pháp:** Phải dùng external cron service (Bước 2)

### Lỗi: 401 Unauthorized khi call cron endpoint

**Nguyên nhân:** `CRON_SECRET` không khớp

**Giải pháp:** 
- Kiểm tra `CRON_SECRET` trong Vercel environment variables
- Đảm bảo URL có `?secret=YOUR_CRON_SECRET`
- Hoặc header `x-cron-secret: YOUR_CRON_SECRET`

---

## Local Development

Khi chạy local (`npm run dev`), cron scheduler tự động hoạt động. Không cần external service.

Check log:
```
✓ Local cron scheduler started
[Scheduler] Starting reminder scheduler...
[Scheduler] Environment: LOCAL
```

---

## Production Checklist

- [ ] Environment variables đã setup trên Vercel
- [ ] Email App Password đã tạo và config đúng
- [ ] External cron service đã setup (Cron-Job.org/EasyCron)
- [ ] Test endpoint `/api/cron/check-reminders` manually
- [ ] Check Vercel logs có thấy `[Email] ✓ Email sent successfully`
- [ ] Test end-to-end: tạo reminder → đợi → check email

---

## API Reference

### GET /api/cron/check-reminders

**Query Parameters:**
- `secret` (required): CRON_SECRET để xác thực

**Headers:**
- `x-cron-secret` (alternative to query param): CRON_SECRET

**Response:**
```json
{
  "success": true,
  "message": "Reminder check completed",
  "stats": {
    "total": 5,
    "sent": 4,
    "failed": 1
  }
}
```

**Errors:**
- `401`: Unauthorized (wrong secret)
- `500`: Server error

---

## Notes

- Cron job nên chạy **mỗi phút** để không miss reminders
- Free tier của Cron-Job.org cho phép unlimited jobs
- Vercel logs giữ trong 24h, check thường xuyên khi debug
