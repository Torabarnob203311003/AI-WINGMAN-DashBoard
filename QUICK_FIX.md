# Quick Diagnostic Steps

## 🚀 Fast Troubleshooting (2 minutes)

### Step 1: Check Backend is Running
```bash
# Open terminal and check if backend is running
curl http://localhost:8000/health
# OR use ngrok URL from .env
curl https://quicker-epistylar-barbie.ngrok-free.dev/health
```

If no response → **Backend is NOT running** ❌

### Step 2: Check Token is Stored
```javascript
// F12 → Console → Paste this:
const tokens = JSON.parse(localStorage.getItem('auth_tokens') || '{}')
console.log('Access Token:', tokens.access_token ? '✅' : '❌')
console.log('Refresh Token:', tokens.refresh_token ? '✅' : '❌')
```

If both are ❌ → **Need to login first**

### Step 3: Test API Directly
```javascript
// F12 → Console → Paste this:
const tokens = JSON.parse(localStorage.getItem('auth_tokens') || '{}')
const apiUrl = 'https://quicker-epistylar-barbie.ngrok-free.dev'

fetch(`${apiUrl}/dashboard/settings/profile/`, {
  headers: {
    'Authorization': `Bearer ${tokens.access_token}`,
    'Content-Type': 'application/json'
  }
})
.then(r => {
  console.log('Status:', r.status)
  console.log('Content-Type:', r.headers.get('content-type'))
  return r.text()
})
.then(text => {
  console.log('Response:', text.substring(0, 100))
  try {
    console.log('JSON:', JSON.parse(text))
  } catch(e) {
    console.error('Not JSON:', e.message)
  }
})
.catch(e => console.error('Error:', e.message))
```

### Step 4: Check Browser Console for Auto-Logs
Settings.jsx now logs automatically:
```
📍 Fetching profile with token: eyJ0...
✅ Profile response status: 200
✅ Profile data received: {...}
```

Or errors:
```
❌ Error fetching profile: [reason]
```

---

## Most Common Issues

### Issue 1: HTML Response Instead of JSON
**Error:** `Unexpected token '<'`
**Cause:** Backend returned HTML error page
**Fix:**
1. Check backend is running
2. Check endpoint path is correct
3. Check ngrok URL in `.env` is active

### Issue 2: 401 Unauthorized
**Error:** `Status: 401`
**Cause:** Token is expired or invalid
**Fix:** Re-login with correct credentials

### Issue 3: 404 Not Found
**Error:** `Status: 404`
**Cause:** Endpoint doesn't exist on backend
**Fix:** Verify backend has `/dashboard/settings/profile/` endpoint

### Issue 4: No Token Stored
**Error:** `No authentication token found`
**Cause:** Login didn't save token
**Fix:** Check login was successful (modal appeared)

---

## The 3-Point Checklist

```javascript
// F12 → Console → Check all 3:

// 1. Token exists?
!!localStorage.getItem('auth_tokens') // Should be true

// 2. Can reach backend?
fetch('https://quicker-epistylar-barbie.ngrok-free.dev/auth/login/').then(r => console.log(r.status)) // Should be 200 or 405 (not connection error)

// 3. Profile endpoint works?
const t = JSON.parse(localStorage.getItem('auth_tokens') || '{}')
fetch('https://quicker-epistylar-barbie.ngrok-free.dev/dashboard/settings/profile/', {
  headers: {'Authorization': `Bearer ${t.access_token}`}
}).then(r => console.log(r.status)) // Should be 200
```

If all 3 are ✅ → Settings should work!

---

## Debug Mode

Settings.jsx will now output detailed logs. Check DevTools → Console → Filter by "Profile" to see:

```
✅ Success logs:
  📍 Fetching profile with token: ...
  ✅ Profile response status: 200
  ✅ Profile data received: {...}

❌ Error logs:
  ❌ Error fetching profile: [reason]
  📦 Response headers: ...
  Response is not JSON: [first 200 chars]
```

---

## Need to Change Backend URL?

1. Open `.env` file in project root
2. Change `VITE_API_BASE_URL` to your backend URL
3. Save file
4. Restart dev server: `npm run dev`
5. Refresh browser

Example `.env`:
```
VITE_API_BASE_URL=http://localhost:8000
# OR
VITE_API_BASE_URL=https://quicker-epistylar-barbie.ngrok-free.dev
```

---

**Still Stuck?** → Check the full guides:
- `DEBUGGING_GUIDE.md` - Comprehensive troubleshooting
- `API_INTEGRATION_GUIDE.md` - Full API documentation
