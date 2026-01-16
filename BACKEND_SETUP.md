# Backend Setup Guide for AI-WINGMAN

## Frontend & Backend Configuration

### Frontend (React - Vite)
- **URL:** http://localhost:5173
- **API URL:** http://localhost:8000 (configured in `.env`)

### Backend (Django)
- **URL:** http://localhost:8000
- **Status:** Should be running in separate workspace

---

## Django Backend Setup

### 1. Install CORS Package
```bash
pip install django-cors-headers
```

### 2. Update Django Settings (settings.py)

Add to `INSTALLED_APPS`:
```python
INSTALLED_APPS = [
    ...
    'corsheaders',
    'rest_framework',
]
```

Add to `MIDDLEWARE`:
```python
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Add this at the TOP
    'django.middleware.common.CommonMiddleware',
    ...
]
```

Add CORS configuration:
```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',    # Frontend dev server
    'http://127.0.0.1:5173',
    'http://localhost:3000',    # Alternative dev port
]

CORS_ALLOW_CREDENTIALS = True  # Allow cookies
```

### 3. Run Django Server
```bash
python manage.py runserver 8000
```

---

## API Endpoints Required

Your Django backend should have these endpoints:

### Authentication
- **POST** `/auth/login/` - Login user
- **POST** `/auth/refresh/` - Refresh access token
- **POST** `/auth/send-otp/` - Send OTP for password reset
- **POST** `/auth/verify-otp/` - Verify OTP
- **POST** `/auth/reset-password/` - Reset password
- **POST** `/auth/change-password/` - Change password
- **GET** `/auth/me/` - Get current user profile
- **PUT** `/auth/profile/` - Update user profile

### Response Format Expected
```json
{
  "success": true,
  "code": 200,
  "timestamp": 1768591608,
  "data": {
    "token": "eyJ...",
    "refresh_token": "eyJ...",
    "user_id": 1
  },
  "message": "Successfully logged in."
}
```

---

## Troubleshooting

### CORS Error
If you see: `Access to XMLHttpRequest blocked by CORS policy`
- Make sure `corsheaders` is installed
- Check `CORS_ALLOWED_ORIGINS` includes `http://localhost:5173`

### Connection Refused
If you see: `net::ERR_CONNECTION_REFUSED`
- Make sure Django is running: `python manage.py runserver 8000`
- Check `.env` file has correct `VITE_API_BASE_URL`

### Frontend not picking up `.env` changes
- Restart React dev server: `npm run dev`

---

## Running Both Services

**Terminal 1 - Frontend:**
```bash
cd "d:\Arnob\My Projects\AI-WINGMAN"
npm run dev
# Visit: http://localhost:5173
```

**Terminal 2 - Backend (Django):**
```bash
cd "path\to\django\project"
python manage.py runserver 8000
# Backend: http://localhost:8000
```

---

## Frontend Configuration ✅

- `.env` file configured
- `apiClient.js` ready with auto-token refresh
- All pages using `apiClient` for API calls

Ready to test! 🚀
