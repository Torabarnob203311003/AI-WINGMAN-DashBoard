# API Integration - Issue Resolution & Troubleshooting

## What Was Fixed

### 1. **Enhanced Settings.jsx** ✅
- ✅ Added token validation before making API call
- ✅ Added comprehensive error logging
- ✅ Check for JSON response before parsing
- ✅ Handle multiple response data structures (data.data or data.user)
- ✅ Show success/error messages to user
- ✅ Added debugging logs with emojis for clarity

### 2. **Enhanced Login.jsx** ✅
- ✅ Added token storage verification after login
- ✅ Log whether tokens are saved in localStorage
- ✅ Display success/error status in console

### 3. **API Client (apiClient.js)** ✅
- ✅ Automatically adds Authorization header with token
- ✅ Handles 401 Unauthorized with token refresh
- ✅ Supports GET, POST, PUT, DELETE, PATCH methods
- ✅ Base URL configurable via .env

---

## How to Diagnose & Fix

### **Option 1: Use Browser DevTools (Easiest)**

**Step 1: Open Console**
```
Press F12 → Console tab
```

**Step 2: Run Diagnostic**
```javascript
// Copy from src/utils/apiDiagnostic.js and paste in console
// Or import and run: import apiDiagnostic from '@/utils/apiDiagnostic'
```

**Step 3: Check Results**
- ✅ means working
- ❌ means needs fixing

---

### **Option 2: Manual Checklist**

#### Check 1: Is Token Stored?
```javascript
// In DevTools Console:
localStorage.getItem('auth_tokens')
```
**Expected:** Should show object with `access_token`, `refresh_token`, `user_id`
**If empty:** Login didn't work or token not saved

---

#### Check 2: Is API URL Correct?
```javascript
// In DevTools Console:
import.meta.env.VITE_API_BASE_URL
```
**Expected:** Should be your ngrok URL or backend domain
**Current:** `https://quicker-epistylar-barbie.ngrok-free.dev`
**If wrong:** Edit `.env` file in project root

---

#### Check 3: Does Endpoint Exist?

**Test with curl (in terminal):**
```bash
# Get your token first
TOKEN=$(grep -o 'access_token":"[^"]*' <<< "$(cat /path/to/token)" | cut -d'"' -f3)

# Test endpoint
curl -X GET "https://quicker-epistylar-barbie.ngrok-free.dev/dashboard/settings/profile/" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

**Expected:** JSON response like:
```json
{
  "data": {
    "name": "Admin",
    "email": "admin@example.com"
  }
}
```

**If HTML response:** Endpoint doesn't exist or backend returned error

---

#### Check 4: Token Being Sent?

**In Browser DevTools:**
1. F12 → Network tab
2. Go to Settings page
3. Look for request to `/dashboard/settings/profile/`
4. Click it → Headers tab
5. Scroll to "Request Headers"
6. Should see: `Authorization: Bearer eyJ0...`

---

### **Option 3: Test with Postman**

1. **Get Token:**
   - POST `{base_url}/auth/login/`
   - Body: `{"email": "your@email.com", "password": "password"}`
   - Copy `data.token` from response

2. **Test Profile Endpoint:**
   - GET `{base_url}/dashboard/settings/profile/`
   - Header: `Authorization: Bearer {paste_token_here}`
   - Should return user data as JSON

---

## Common Errors & Solutions

### Error: "No authentication token found. Please log in again."
```
❌ Problem: localStorage doesn't have auth_tokens
✅ Solution: 
  1. Check if login was successful (see success modal)
  2. Check browser storage (DevTools → Application → localStorage)
  3. Try logging in again
```

### Error: "Failed to fetch profile (Status: 404)"
```
❌ Problem: Endpoint doesn't exist
✅ Solution:
  1. Check backend has /dashboard/settings/profile/ endpoint
  2. Verify it's spelled correctly
  3. Check backend is running
```

### Error: "Failed to fetch profile (Status: 401)"
```
❌ Problem: Token is invalid or expired
✅ Solution:
  1. Token refresh failed
  2. Try logging out and logging back in
  3. Check if refresh token exists in localStorage
```

### Error: "Unexpected token '<'"
```
❌ Problem: Got HTML instead of JSON (likely error page)
✅ Solution:
  1. Backend might be returning error page
  2. Check ngrok URL is correct in .env
  3. Check if backend server is running
  4. Check internet connection (ngrok tunnel might be down)
```

### Error: "Invalid response format: Expected JSON but received text/html"
```
❌ Problem: API returned HTML (404 page likely)
✅ Solution:
  1. Verify endpoint path is correct
  2. Backend might not have this endpoint implemented
  3. Check API documentation for correct endpoint
```

---

## Configuration Files

### `.env` (Development)
```
VITE_API_BASE_URL=https://quicker-epistylar-barbie.ngrok-free.dev
```

To change backend URL:
1. Open `.env` file in project root
2. Update `VITE_API_BASE_URL` to your backend URL
3. Restart the dev server (`npm run dev`)

---

## Console Logs to Watch For

**After Login:**
```
✅ Login successful - Tokens stored: YES
✅ Access Token exists: true
✅ Refresh Token exists: true
```

**On Settings Page:**
```
📍 Fetching profile with token: eyJ0...
✅ Profile response status: 200
✅ Profile data received: {...}
```

**If Error:**
```
❌ Error fetching profile: [detailed error message]
```

---

## Quick Fixes Checklist

- [ ] Backend server is running (`http://localhost:8000` or ngrok tunnel active)
- [ ] `.env` has correct `VITE_API_BASE_URL`
- [ ] Can successfully login (success modal appears)
- [ ] Token shows in localStorage after login
- [ ] Endpoint `/dashboard/settings/profile/` exists on backend
- [ ] Backend endpoint returns JSON (not HTML)
- [ ] Token is not expired

---

## Files Modified

1. **src/pages/Settings.jsx**
   - Added token validation
   - Added detailed error logging
   - Added success message
   - Handle multiple response formats

2. **src/pages/Login.jsx**
   - Added token storage verification
   - Added console logs for debugging

3. **Created: src/utils/apiDiagnostic.js**
   - Comprehensive API diagnostic tool
   - Run in browser console

4. **Created: DEBUGGING_GUIDE.md**
   - Detailed troubleshooting guide

---

## Next Steps

1. **Run Diagnostic:** Open browser → F12 → Console → Paste apiDiagnostic.js code
2. **Check Results:** Look for ❌ errors in output
3. **Fix Issues:** Follow solutions above
4. **Test Again:** Navigate to Settings page
5. **Monitor Logs:** Watch console for success/error messages

**Need Help?** Check the console logs - they now have detailed error messages with emojis! 🎯
