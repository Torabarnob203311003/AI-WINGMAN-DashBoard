# Settings.jsx - API Debugging Guide

## What Changed

### 1. Enhanced Logging in Settings.jsx
Added detailed console logging to show **exactly** what the backend is returning:

**Console Output Will Now Show:**
```
📦 Full response object: {...}
📦 Response status: 200
📦 Response headers: {...}
📦 Response data (raw): ...
📦 Response data type: string|object
📦 Content-Type header: application/json
```

### 2. Added Vite Proxy Configuration
**File:** `vite.config.js`

Now proxies these endpoints to backend:
- `/api/*` → http://localhost:8000
- `/dashboard/*` → http://localhost:8000
- `/auth/*` → http://localhost:8000

This helps with CORS issues.

---

## Debug Steps

### Step 1: Check the Raw Response
1. Open browser DevTools (F12)
2. Go to Settings page
3. **Look for these logs:**
   - 📦 `Response data type:` - Should be **object**, not string
   - 📦 `Response data (raw):` - Shows actual response
   - 📦 `Content-Type header:` - Should be `application/json`

### Step 2: If Response is STRING
If you see:
```
❌ CRITICAL: Response data is STRING, not object!
❌ First 500 chars of response: [HTML content or error]
```

**This means:**
- Backend is returning **HTML error page** instead of JSON
- OR backend is not sending correct Content-Type header
- OR endpoint doesn't exist (404)

### Step 3: Test Backend Directly

**Using Postman or Browser:**

```
GET /dashboard/settings/profile/
Authorization: Bearer {your_token}
```

**Expected Response (200):**
```json
{
  "data": {
    "id": 1,
    "name": "Admin",
    "email": "admin@example.com"
  }
}
```

**Or:**
```json
{
  "user": {
    "id": 1,
    "name": "Admin",
    "email": "admin@example.com"
  }
}
```

**Or flat:**
```json
{
  "id": 1,
  "name": "Admin",
  "email": "admin@example.com"
}
```

### Step 4: Check Backend Response Headers
In Postman, go to **Headers** tab and verify:
```
Content-Type: application/json
```

If it's missing or set to `text/html`, that's the problem!

---

## Common Issues & Solutions

### Issue 1: "Response is HTML"
**Cause:** Endpoint doesn't exist or backend returned error page
**Fix:**
- Verify endpoint exists: `/dashboard/settings/profile/`
- Check backend is running on correct port
- Check ngrok tunnel URL is correct

### Issue 2: "Content-Type is text/html"
**Cause:** Backend not setting correct header
**Fix - Backend (Django/Flask):**
```python
# Django
from django.http import JsonResponse
return JsonResponse({"data": {...}})

# Flask
from flask import jsonify
return jsonify({"data": {...}})
```

### Issue 3: Response data type is "string"
**Cause:** Response not being parsed as JSON
**Fix:**
- Check backend sends `Content-Type: application/json`
- Ensure response body is valid JSON, not wrapped in extra quotes

---

## Current API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/settings/profile/` | Fetch user profile |
| PATCH | `/auth/profile/` | Update profile (FormData) |
| POST | `/auth/change-password/` | Change password (FormData) |

---

## Environment Variables

Make sure `.env` file has:
```
VITE_API_BASE_URL=http://localhost:8000
```

Or for ngrok:
```
VITE_API_BASE_URL=https://quicker-epistylar-barbie.ngrok-free.dev
```

---

## Next Steps

1. **Restart Vite dev server** (npm run dev) for proxy changes to take effect
2. **Open browser console** (F12) and go to Settings page
3. **Take a screenshot** of the console logs with the 📦 messages
4. **Share those logs** and I'll identify the exact issue

---

## What the New Code Does

When you navigate to Settings:

1. ✅ Fetches profile with detailed logging
2. ✅ Shows raw response data
3. ✅ Checks if response is string (likely HTML error)
4. ✅ Tries to parse if needed
5. ✅ Handles multiple response formats (data, user, flat)
6. ✅ Shows first 500 chars of response if it's HTML (for error diagnosis)
7. ✅ Logs Content-Type header
8. ✅ Updates UI with extracted data

---

## Example Console Output (Success)

```
📦 Full response object: {data: {...}, status: 200, ...}
📦 Response status: 200
📦 Response data (raw): {data: {id: 1, name: "Admin", email: "admin@example.com"}}
📦 Response data type: object
📦 Content-Type header: application/json
✅ Profile data is valid object: {...}
✅ Extracted profile data: {id: 1, name: "Admin", email: "admin@example.com"}
✅ Profile state updated: {extractedName: "Admin", extractedEmail: "admin@example.com"}
```

---

## Example Console Output (Error)

```
❌ CRITICAL: Response data is STRING, not object!
❌ First 500 chars of response: <!DOCTYPE html><html>...
❌ Response is HTML! Backend returned error page, not JSON
```

**Action:** Check backend logs and endpoint!
