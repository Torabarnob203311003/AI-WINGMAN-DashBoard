# 🚀 Environment Configuration Guide

## Overview

Your React app now automatically switches between **Development** and **Production** environments without hardcoding URLs.

---

## Files Structure

```
📁 AI-WINGMAN/
├── .env                    ← Development config (localhost)
├── .env.production        ← Production config (yourdomain.com)
├── .env.example           ← Template for team
├── vite.config.js         ← Vite config
└── src/
    └── utils/
        └── apiClient.js   ← Smart API client
```

---

## Environment Variables

### `.env` (Development)
```env
VITE_API_BASE_URL=http://localhost:8000
```
**When used:** `npm run dev`
**Frontend:** http://localhost:5173
**Backend:** http://localhost:8000

### `.env.production` (Production)
```env
VITE_API_BASE_URL=https://api.yourdomain.com
```
**When used:** `npm run build`
**Frontend:** https://yourdomain.com
**Backend:** https://api.yourdomain.com

---

## How It Works

### Development Mode (`npm run dev`)
```javascript
// apiClient.js automatically uses:
API_BASE_URL = 'http://localhost:8000'  // from .env
```

### Production Mode (`npm run build`)
```javascript
// apiClient.js automatically uses:
API_BASE_URL = 'https://api.yourdomain.com'  // from .env.production
```

---

## Setup Instructions

### Step 1: Development Setup ✅
Your `.env` is already configured:
```env
VITE_API_BASE_URL=http://localhost:8000
```

### Step 2: Production Setup
Update `.env.production`:
```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

Replace `yourdomain.com` with your actual domain!

### Step 3: Run Commands

**Development:**
```bash
npm run dev
# Frontend: http://localhost:5173
# Backend: http://localhost:8000
```

**Production Build:**
```bash
npm run build
# Uses .env.production
# Backend: https://api.yourdomain.com
```

**Preview Production Build:**
```bash
npm run build
npm run preview
```

---

## Console Debugging

When running in development, check browser console for:
```
🔧 API Client initialized
📍 API Base URL: http://localhost:8000
🌍 Environment: development
```

---

## Common Scenarios

### Scenario 1: Local Development (Current)
```
✅ Frontend: http://localhost:5173
✅ Backend: http://localhost:8000
✅ Config: .env (VITE_API_BASE_URL=http://localhost:8000)
```

### Scenario 2: Production Deployment
```
✅ Frontend: https://ai-wingman.com
✅ Backend: https://api.ai-wingman.com
✅ Config: .env.production (VITE_API_BASE_URL=https://api.ai-wingman.com)
```

### Scenario 3: Staging Environment
Create `.env.staging`:
```env
VITE_API_BASE_URL=https://api-staging.ai-wingman.com
```

Run:
```bash
npm run build -- --mode staging
```

---

## Why This Approach?

✅ **No Hardcoding** - URLs change automatically per environment
✅ **Security** - Production URLs never exposed in dev
✅ **Team Friendly** - `.env.example` as template
✅ **Git Safe** - `.env` and `.env.production` in `.gitignore`
✅ **Scalable** - Easy to add staging, testing, etc.

---

## Troubleshooting

### Issue: API still showing `http://localhost:8000` in production
- Make sure `.env.production` is configured
- Rebuild: `npm run build`

### Issue: Wrong URL being used
- Check console logs: 📍 API Base URL
- Verify `.env` or `.env.production` file
- Restart dev server: `npm run dev`

### Issue: Production build uses dev URL
- Ensure `.env.production` exists
- Check `VITE_API_BASE_URL` value
- Run: `npm run build` (not `npm run dev`)

---

## Next Steps

1. ✅ Development ready
2. 📋 Update `.env.production` with your production domain
3. 🚀 Deploy when ready

**Questions?** Check `apiClient.js` comments for more details.
