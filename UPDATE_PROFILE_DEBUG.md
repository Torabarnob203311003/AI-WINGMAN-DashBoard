# Update Profile Button - Debug Guide

## Steps to Test

1. **Open Browser DevTools**
   - Press `F12` to open Developer Console

2. **Navigate to Settings Page**
   - Log in first
   - Go to Settings page
   - You should see "Loading profile..." then the form fields

3. **Make Changes**
   - Edit the Name field (e.g., change it from "Admin" to "Admin User")
   - Edit the Email field (optional)
   - Click "**Update profile**" button

4. **Check Console Logs**
   - Look for these log messages in order:
   
   ```
   🔵 Update button clicked
   Current name: [your name]
   Current email: [your email]
   📍 Sending update request with: {name: "...", email: "..."}
   📍 API Base URL: https://quicker-epistylar-barbie.ngrok-free.dev
   📍 Endpoint: /auth/profile/
   ```

5. **If Success:**
   ```
   ✅ Profile saved successfully: [response data]
   ✅ Response status: 200
   📍 Refetching profile to confirm update...
   ✅ Profile refetch complete
   ```

6. **If Error - Look for:**
   ```
   ❌ Update profile error: [error message]
   ❌ API returned error status: [404, 400, 401, 500, etc]
   ❌ Error data: [backend error response]
   ```

## Common Issues & Fixes

### Issue 1: "API returned error status: 401"
**Problem:** Authentication token not working
**Fix:** 
- Log out and log back in
- Check that token is stored in localStorage (F12 > Application > Local Storage > auth_tokens)

### Issue 2: "Request made but no response received"
**Problem:** Backend server not running or ngrok tunnel disconnected
**Fix:**
- Check Backend is running (port 8000 or ngrok tunnel)
- Update VITE_API_BASE_URL in .env if ngrok URL changed
- Restart the frontend dev server: `npm run dev`

### Issue 3: "API returned error status: 404"
**Problem:** Wrong endpoint or backend route not found
**Fix:**
- Verify backend has `/auth/profile/` PUT endpoint
- Check endpoint path matches backend exactly (case-sensitive)

### Issue 4: "API returned error status: 400"
**Problem:** Invalid request data format
**Fix:**
- Check request body: `{name: "...", email: "..."}`
- Ensure name and email are not empty strings
- Verify backend expects exactly these field names

## Expected Request

```
PUT /auth/profile/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

## Expected Response (Success)

```
Status: 200

{
  "message": "Profile updated successfully",
  "data": {
    "id": 1,
    "name": "Updated Name",
    "email": "updated@example.com",
    ...
  }
}
```

## Code Location

- **File:** `src/pages/Settings.jsx`
- **Function:** `handleUpdateProfile()` (lines ~165-220)
- **Button:** Lines ~425-445
- **State:** Lines 5-14 (name, email, loading states)

## Token Info

Token should be stored as:
```javascript
localStorage.auth_tokens = {
  "access_token": "eyJ0eXAi...",
  "refresh_token": "eyJ0eXAi...",
  "user_id": 1
}
```

The token is automatically injected into every request via axios interceptor.
