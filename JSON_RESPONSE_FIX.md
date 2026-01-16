# ✅ API JSON Response Fix Guide

## Problem
API returning text/html instead of JSON

## Solution: Backend Configuration

### ✅ Backend Must Return JSON

All API endpoints should return JSON with correct headers:

```python
# ✅ CORRECT - Django/Python Example
from django.http import JsonResponse

@api_view(['GET'])
def get_profile(request):
    data = {
        "data": {
            "name": "Admin",
            "email": "admin@example.com",
            "username": "admin"
        },
        "message": "Profile retrieved successfully"
    }
    return JsonResponse(data)
```

### Required Headers
```
Content-Type: application/json; charset=utf-8
```

---

## API Response Format Requirements

### ✅ Success Response (200)
```json
{
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe"
  },
  "message": "Success"
}
```

### ✅ Error Response (4xx/5xx)
```json
{
  "error": "Error message here",
  "message": "User not found",
  "detail": "No user with this ID"
}
```

### ❌ DO NOT Return HTML
```html
<!-- This will cause: "Unexpected token '<'" error -->
<!DOCTYPE html>
<html>
  <body>404 Not Found</body>
</html>
```

---

## Backend Configuration by Framework

### Django/Django REST Framework
```python
# settings.py
INSTALLED_APPS = [
    'rest_framework',
    'corsheaders',
]

REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ]
}

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://yourdomain.com",
]

# Ensure JSON responses
@api_view(['GET', 'POST'])
@renderer_classes([JSONRenderer])
def your_endpoint(request):
    data = {"data": {...}}
    return Response(data)
```

### Express/Node.js
```javascript
// ✅ Ensure JSON responses
app.get('/api/endpoint', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json({
    data: {
      name: "John",
      email: "john@example.com"
    }
  });
});

// ✅ Error handling
app.use((err, req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(err.status || 500).json({
    error: err.message,
    message: "Server error"
  });
});
```

### Flask
```python
from flask import jsonify

@app.route('/api/profile', methods=['GET'])
def get_profile():
    data = {
        "data": {
            "name": "Admin",
            "email": "admin@example.com"
        }
    }
    return jsonify(data)  # ✅ Automatically sets Content-Type to JSON
```

### FastAPI
```python
from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI()

@app.get("/dashboard/settings/profile/")
async def get_profile(request: Request):
    data = {
        "data": {
            "name": "Admin",
            "email": "admin@example.com",
            "username": "admin"
        }
    }
    return JSONResponse(data)  # ✅ Returns proper JSON
```

---

## API Endpoints That Must Return JSON

### 1. Login Endpoint
```
POST /auth/login/

Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Response (200):
{
  "data": {
    "user_id": "123",
    "token": "eyJ0eXAi...",
    "refresh_token": "eyJ0eXAi...",
    "user": {
      "email": "user@example.com",
      "name": "John Doe"
    }
  },
  "message": "Login successful"
}

Response (401):
{
  "error": "Invalid credentials",
  "message": "Email or password is incorrect"
}
```

### 2. Profile Endpoint
```
GET /dashboard/settings/profile/

Headers:
Authorization: Bearer eyJ0eXAi...

Response (200):
{
  "data": {
    "name": "John Doe",
    "email": "john@example.com",
    "username": "johndoe",
    "user_id": "123"
  },
  "message": "Profile retrieved"
}

Response (401):
{
  "error": "Unauthorized",
  "message": "Invalid or expired token"
}

Response (404):
{
  "error": "Not Found",
  "message": "User profile not found"
}
```

### 3. Update Profile Endpoint
```
PUT /auth/profile/

Headers:
Authorization: Bearer eyJ0eXAi...

Request:
{
  "name": "New Name",
  "email": "newemail@example.com"
}

Response (200):
{
  "data": {
    "name": "New Name",
    "email": "newemail@example.com"
  },
  "message": "Profile updated successfully"
}
```

---

## CORS Headers Required

Add these headers to all API responses:

```
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true
```

---

## Testing Endpoints

### Using curl
```bash
# Test Profile Endpoint
curl -X GET "http://localhost:8000/dashboard/settings/profile/" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"

# Should output JSON:
# {"data":{"name":"Admin","email":"admin@example.com"}}

# If you see HTML or error, check:
# 1. Backend is running
# 2. Endpoint path is correct
# 3. Authorization header is included
# 4. Backend returns Content-Type: application/json
```

### Using Postman
1. Create GET request to endpoint
2. Add header: `Authorization: Bearer YOUR_TOKEN`
3. Add header: `Content-Type: application/json`
4. Send
5. Check response:
   - Should be JSON (not HTML)
   - Should have `Content-Type: application/json` header

### Using Browser DevTools
```javascript
// In Console:
const token = JSON.parse(localStorage.getItem('auth_tokens')).access_token;

fetch('http://localhost:8000/dashboard/settings/profile/', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(r => {
  console.log('Status:', r.status);
  console.log('Content-Type:', r.headers.get('content-type'));
  return r.text();
})
.then(text => {
  console.log('Response:', text);
  // Should be JSON, not HTML
  try {
    JSON.parse(text);
    console.log('✅ Valid JSON');
  } catch(e) {
    console.log('❌ Invalid JSON (HTML?)');
  }
})
```

---

## Common Issues & Fixes

### Issue 1: "Unexpected token '<'"
**Cause:** API returning HTML
**Fix:** Backend must return JSON with Content-Type header

### Issue 2: "Unexpected token 'u' in undefined"
**Cause:** API returning empty response
**Fix:** Check endpoint exists, backend is running

### Issue 3: CORS error
**Cause:** Missing CORS headers
**Fix:** Add CORS middleware/headers to backend

### Issue 4: 404 with HTML error page
**Cause:** Endpoint doesn't exist
**Fix:** Verify endpoint path spelling, backend has endpoint

---

## Checklist for Backend

- [ ] All endpoints return JSON (not HTML)
- [ ] All responses have `Content-Type: application/json` header
- [ ] Error responses are JSON (not HTML error pages)
- [ ] CORS headers are set correctly
- [ ] Authorization header is checked
- [ ] Status codes are correct (200, 401, 404, 500, etc)
- [ ] Response format matches expected structure
- [ ] Token validation works
- [ ] Backend returns proper error messages

---

## Frontend Configuration (Already Done)

Settings.jsx already handles:
- ✅ Checks Content-Type header
- ✅ Validates response is JSON
- ✅ Shows detailed error if HTML received
- ✅ Logs response to console
- ✅ User-friendly error messages

---

## Quick Diagnostic

Run this in browser console after login:

```javascript
const token = JSON.parse(localStorage.getItem('auth_tokens')).access_token;

fetch('http://localhost:8000/dashboard/settings/profile/', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(r => {
  const contentType = r.headers.get('content-type');
  console.log('✅ Status:', r.status);
  console.log('✅ Content-Type:', contentType);
  
  if (!contentType?.includes('application/json')) {
    console.log('❌ ERROR: Content-Type is not JSON!');
  }
  
  return r.text();
})
.then(text => {
  console.log('Response (first 200 chars):', text.substring(0, 200));
  
  if (text.startsWith('<')) {
    console.log('❌ ERROR: Response is HTML, not JSON!');
  } else {
    try {
      JSON.parse(text);
      console.log('✅ Valid JSON received');
    } catch(e) {
      console.log('❌ ERROR: Invalid JSON -', e.message);
    }
  }
})
.catch(e => console.log('❌ Fetch error:', e.message));
```

---

## Summary

**Frontend (✅ Already Fixed):**
- Validates JSON responses
- Shows clear errors
- Handles HTML gracefully

**Backend (You Need to Fix):**
- All endpoints must return JSON
- Set `Content-Type: application/json` header
- Error responses must be JSON (not HTML)
- Include CORS headers

Once backend returns proper JSON, Settings page will work perfectly! ✅
