# Postman API Testing Guide for AI-WINGMAN Backend

## Setup Postman Environment

### 1. Create New Environment
- Click **Environments** → **Create**
- Name: `AI-WINGMAN-Dev`
- Add variables:

```
Variable Name          | Initial Value                  | Current Value
base_url              | http://localhost:8000         | http://localhost:8000
access_token          |                               | (auto-fill after login)
refresh_token         |                               | (auto-fill after login)
user_id               |                               | (auto-fill after login)
```

### 2. Select Environment
- Top right dropdown → Select `AI-WINGMAN-Dev`

---

## API Endpoints to Test

### 1. LOGIN (POST)
**Endpoint:** `{{base_url}}/auth/login/`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Tests (Add this in Tests tab):**
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("access_token", jsonData.data.token);
    pm.environment.set("refresh_token", jsonData.data.refresh_token);
    pm.environment.set("user_id", jsonData.data.user_id);
}
```

**Expected Response:**
```json
{
  "success": true,
  "code": 200,
  "timestamp": 1768591608,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user_id": 1
  },
  "message": "Successfully logged in."
}
```

---

### 2. REFRESH TOKEN (POST)
**Endpoint:** `{{base_url}}/auth/refresh/`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "refresh": "{{refresh_token}}"
}
```

**Tests:**
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("access_token", jsonData.data.token);
}
```

---

### 3. GET CURRENT USER PROFILE (GET)
**Endpoint:** `{{base_url}}/auth/me/`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{access_token}}
```

**Expected Response:**
```json
{
  "success": true,
  "code": 200,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "User Name",
    "user_id": 1
  },
  "message": "User profile retrieved successfully."
}
```

---

### 4. UPDATE PROFILE (PUT)
**Endpoint:** `{{base_url}}/auth/profile/`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{access_token}}
```

**Body (raw JSON):**
```json
{
  "name": "Updated Name",
  "email": "newemail@example.com"
}
```

---

### 5. CHANGE PASSWORD (POST)
**Endpoint:** `{{base_url}}/auth/change-password/`

**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{access_token}}
```

**Body (raw JSON):**
```json
{
  "current_password": "oldpassword123",
  "new_password": "newpassword123"
}
```

---

### 6. SEND OTP (POST)
**Endpoint:** `{{base_url}}/auth/send-otp/`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "user@example.com"
}
```

---

### 7. VERIFY OTP (POST)
**Endpoint:** `{{base_url}}/auth/verify-otp/`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

---

### 8. RESET PASSWORD (POST)
**Endpoint:** `{{base_url}}/auth/reset-password/`

**Headers:**
```
Content-Type: application/json
```

**Body (raw JSON):**
```json
{
  "email": "user@example.com",
  "token": "reset_token_from_otp",
  "new_password": "newpassword123"
}
```

---

## Testing Workflow

### Step 1: Test Login
1. Go to **LOGIN** request
2. Click **Send**
3. Check response - tokens should auto-fill in environment

### Step 2: Verify Token (Optional)
1. Go to **GET CURRENT USER PROFILE**
2. Click **Send**
3. Should return user data with Authorization header

### Step 3: Test Protected Endpoints
- All endpoints with `Authorization: Bearer {{access_token}}` will work
- Tokens auto-refresh via Tests tab

### Step 4: Test Token Refresh
1. Go to **REFRESH TOKEN** request
2. Paste old `refresh_token`
3. Should return new `access_token`

---

## Quick Postman Collection Export

Create file: `postman_collection.json`

```json
{
  "info": {
    "name": "AI-WINGMAN API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Login",
      "request": {
        "method": "POST",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\"email\": \"user@example.com\", \"password\": \"password123\"}"
        },
        "url": {
          "raw": "{{base_url}}/auth/login/",
          "host": ["{{base_url}}"],
          "path": ["auth", "login", ""]
        }
      }
    }
  ]
}
```

---

## Common Issues

### Issue: "Authorization header invalid"
- Make sure token was saved to environment
- Check `Authorization: Bearer {{access_token}}` format
- Verify token not expired

### Issue: "CORS error"
- Django backend CORS not configured
- Add `http://localhost:5173` to `CORS_ALLOWED_ORIGINS`
- Restart Django server

### Issue: "Token expired"
- Use **REFRESH TOKEN** endpoint
- New token auto-saves to environment

---

## Testing Checklist

✅ Login endpoint returns tokens
✅ Tokens saved to Postman environment
✅ Get current user profile works
✅ Update profile works
✅ Change password works
✅ Send OTP works
✅ Token refresh works
✅ All protected endpoints require Authorization header

Once all pass → Frontend ready to test! 🚀
