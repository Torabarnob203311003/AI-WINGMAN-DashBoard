# API & Authentication Debugging Guide

## Issue: Settings Page Getting HTML Instead of JSON

### Root Causes to Check:

#### 1. **Token Storage & Authentication**
After successful login, open your browser's DevTools (F12):

```javascript
// In Console, check if token is stored:
localStorage.getItem('auth_tokens')
// Should output something like:
// {"access_token":"eyJ0eXAiOi...", "refresh_token":"...", "user_id":"..."}
```

**If empty or null:**
- ❌ Token was not saved during login
- ✅ Solution: Check Login.jsx line 50-55 - verify `signin()` is being called with token data

---

#### 2. **API Base URL Configuration**
Check which API server the frontend is connecting to:

```javascript
// In Console:
import.meta.env.VITE_API_BASE_URL
// Or check the default:
// Development: http://localhost:8000
// Production: https://api.yourdomain.com
```

**If incorrect:**
- ❌ Frontend pointing to wrong backend server
- ✅ Solution: Create `.env` file in project root:
```
VITE_API_BASE_URL=http://localhost:8000
```

---

#### 3. **Endpoint Verification**
Test if the endpoint exists and returns JSON:

```bash
# In Terminal (replace TOKEN with actual token from localStorage):
curl -X GET "http://localhost:8000/dashboard/settings/profile/" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json"
```

**If returns HTML (DOCTYPE):**
- ❌ Endpoint doesn't exist or is returning 404 page
- ✅ Solutions:
  - Verify backend has `/dashboard/settings/profile/` endpoint
  - Check backend is running: `http://localhost:8000`
  - Check endpoint returns JSON, not HTML

---

#### 4. **Real-time Debugging Steps**

**Step 1: Open Browser DevTools (F12)**

**Step 2: Go to Network Tab**
- Login with your credentials
- Watch network requests
- Look for the API call to `/auth/login/`
- Check response has `data.token` and `data.refresh_token`

**Step 3: Go to Console Tab**
After login, watch for console logs:
```
✅ Login successful - Tokens stored: YES
✅ Access Token exists: true
✅ Refresh Token exists: true
```

**Step 4: Go to Settings Page**
Watch console for:
```
📍 Fetching profile with token: eyJ0...
✅ Profile response status: 200
✅ Profile data received: {...}
```

**OR if error:**
```
❌ Error fetching profile: Failed to fetch profile (Status: 404)
```

---

#### 5. **Token Format in Headers**
The apiClient automatically adds token:

```javascript
// Correct format (from apiClient.js):
Authorization: "Bearer eyJ0eXAiOiJKV1QiLC..."

// If token not being added = endpoint returns 401 or redirects
```

---

### Common Error Messages & Solutions:

| Error | Cause | Fix |
|-------|-------|-----|
| `No authentication token found` | Login didn't save token | Check localStorage in DevTools |
| `Status: 404` | Endpoint doesn't exist | Verify backend endpoint path |
| `Status: 401` | Invalid/expired token | Re-login |
| `Unexpected token '<'` | Got HTML instead of JSON | Check backend is running |
| `CORS error` | Cross-origin issue | Configure backend CORS |

---

### Quick Checklist:

- [ ] Backend server running on `http://localhost:8000`?
- [ ] Token in localStorage after login? (`localStorage.getItem('auth_tokens')`)
- [ ] Endpoint exists? (Test with curl/Postman)
- [ ] Endpoint returns JSON? (Not HTML error page)
- [ ] Token passed in Authorization header? (Check Network tab)
- [ ] Token is not expired?

---

### Manual Testing with Postman:

1. **Login Endpoint:**
   ```
   POST http://localhost:8000/auth/login/
   Body: {
     "email": "test@example.com",
     "password": "password123"
   }
   ```

2. **Copy the token from response**

3. **Profile Endpoint:**
   ```
   GET http://localhost:8000/dashboard/settings/profile/
   Header: Authorization: Bearer <paste_token_here>
   ```

---

### If Still Failing:

Check the actual API response in DevTools → Network → Click failed request → Response tab
- If you see `<DOCTYPE` → HTML error page
- Show this HTML in console to identify the real error

```javascript
// In Console:
// From the response that shows HTML
document.body.innerText
// This will show you the actual error message
```
