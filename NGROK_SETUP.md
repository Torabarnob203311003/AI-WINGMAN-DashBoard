# Django CORS Configuration for ngrok Backend

## Update your Django `settings.py` with this:

```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',  # Add this
    'rest_framework',  # If using
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Add at TOP
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

# CORS Configuration
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',                           # Local dev
    'http://127.0.0.1:5173',                          # Local dev alternative
    'https://quicker-epistylar-barbie.ngrok-free.dev', # ngrok frontend tunnel (if used)
]

CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

# If using ngrok, you might need:
CSRF_TRUSTED_ORIGINS = [
    'https://*.ngrok-free.dev',
    'http://localhost:5173',
]
```

## Important Notes:

1. **Restart Django after changes:**
   ```bash
   python manage.py runserver 8000
   ```

2. **ngrok URL changes when restarted!**
   - Each time you restart ngrok, you get a new URL
   - Update `.env` with the new URL
   - Update Django `CORS_ALLOWED_ORIGINS` with new URL

3. **ngrok Command:**
   ```bash
   ngrok http 8000
   # Shows: Forwarding: https://quicker-epistylar-barbie.ngrok-free.dev -> http://localhost:8000
   ```

4. **To Use Same URL Always:**
   - Use ngrok paid plan
   - Or use `ngrok start` with saved tunnel name

---

## Quick Test:

After updating Django settings:

1. **Restart Django:**
   ```bash
   python manage.py runserver 8000
   ```

2. **Reload Frontend:**
   - Go to `http://localhost:5173/login`
   - Try login

3. **Check Browser Console:**
   ```
   🔧 API Client initialized
   📍 API Base URL: https://quicker-epistylar-barbie.ngrok-free.dev
   🌍 Environment: development
   ```

4. **Should Work Now!** ✅
