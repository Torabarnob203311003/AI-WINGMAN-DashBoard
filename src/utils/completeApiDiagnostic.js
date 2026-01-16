#!/usr/bin/env node

/**
 * API Integration Test Suite
 * Run this to test all API endpoints and configurations
 * 
 * Usage in browser console:
 * 1. Copy the diagnosisAPI() function
 * 2. Paste in DevTools Console
 * 3. Run: diagnosisAPI()
 */

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(icon, message, value = '') {
  if (value) {
    console.log(`${icon} ${message}: ${value}`);
  } else {
    console.log(`${icon} ${message}`);
  }
}

async function runFullDiagnosis() {
  console.clear();
  console.log('\n' + '='.repeat(60));
  console.log('🔍 AI-WINGMAN COMPLETE API DIAGNOSIS');
  console.log('='.repeat(60) + '\n');
  
  const results = {
    passed: 0,
    failed: 0,
    warnings: 0
  };

  // ============================================================
  // 1. ENVIRONMENT CONFIGURATION
  // ============================================================
  console.log('📋 1. ENVIRONMENT CONFIGURATION\n');
  
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  const isProduction = import.meta.env.PROD;
  
  log('ℹ️ ', 'Environment', isProduction ? 'PRODUCTION' : 'DEVELOPMENT');
  log('ℹ️ ', 'API Base URL', apiUrl);
  
  // Validate URL format
  try {
    new URL(apiUrl);
    log('✅', 'API URL is valid');
    results.passed++;
  } catch (e) {
    log('❌', 'Invalid API URL format', apiUrl);
    results.failed++;
  }

  // ============================================================
  // 2. LOCAL STORAGE CHECK
  // ============================================================
  console.log('\n📋 2. LOCAL STORAGE & TOKENS\n');
  
  const authTokens = localStorage.getItem('auth_tokens');
  const authUser = localStorage.getItem('auth_user');
  
  if (authTokens) {
    log('✅', 'Auth tokens stored in localStorage');
    results.passed++;
    
    try {
      const tokens = JSON.parse(authTokens);
      
      if (tokens.access_token) {
        log('✅', 'Access token present');
        log('ℹ️ ', 'Access token preview', tokens.access_token.substring(0, 30) + '...');
        results.passed++;
      } else {
        log('❌', 'Access token missing');
        results.failed++;
      }
      
      if (tokens.refresh_token) {
        log('✅', 'Refresh token present');
        results.passed++;
      } else {
        log('⚠️ ', 'Refresh token missing');
        results.warnings++;
      }
      
      if (tokens.user_id) {
        log('✅', 'User ID stored', tokens.user_id);
        results.passed++;
      } else {
        log('⚠️ ', 'User ID missing');
        results.warnings++;
      }
    } catch (e) {
      log('❌', 'Invalid token JSON format', e.message);
      results.failed++;
    }
  } else {
    log('⚠️ ', 'No auth tokens stored (login required)');
    results.warnings++;
  }
  
  if (authUser) {
    log('✅', 'User data stored');
    results.passed++;
  } else {
    log('⚠️ ', 'User data not stored');
    results.warnings++;
  }

  // ============================================================
  // 3. CONNECTIVITY TESTS
  // ============================================================
  console.log('\n📋 3. CONNECTIVITY TESTS\n');
  
  // Test 3.1: Backend Availability
  console.log('Testing backend connectivity...');
  try {
    const response = await fetch(apiUrl, { method: 'HEAD', mode: 'no-cors' });
    log('✅', 'Backend server is reachable');
    results.passed++;
  } catch (err) {
    log('❌', 'Cannot reach backend server', err.message);
    log('ℹ️ ', 'Check if backend is running at:', apiUrl);
    results.failed++;
  }

  // ============================================================
  // 4. ENDPOINT TESTS
  // ============================================================
  console.log('\n📋 4. ENDPOINT TESTS\n');
  
  // Test 4.1: Login Endpoint
  console.log('Testing /auth/login/ endpoint...');
  try {
    const response = await fetch(`${apiUrl}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test', password: 'test' })
    });
    
    log('✅', 'Login endpoint is accessible');
    log('ℹ️ ', 'Response status', response.status);
    
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      log('✅', 'Login endpoint returns JSON');
      results.passed += 2;
    } else {
      log('❌', 'Login endpoint does not return JSON');
      results.failed++;
    }
  } catch (err) {
    log('❌', 'Login endpoint error', err.message);
    results.failed++;
  }

  // Test 4.2: Profile Endpoint (requires token)
  if (authTokens) {
    console.log('\nTesting /dashboard/settings/profile/ endpoint...');
    try {
      const tokens = JSON.parse(authTokens);
      const response = await fetch(`${apiUrl}/dashboard/settings/profile/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokens.access_token}`
        }
      });
      
      log('ℹ️ ', 'Profile endpoint status', response.status);
      
      if (response.status === 200) {
        log('✅', 'Profile endpoint returns 200 OK');
        results.passed++;
        
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
          log('✅', 'Profile endpoint returns JSON');
          
          try {
            const data = await response.json();
            if (data.data || data.user) {
              log('✅', 'Profile data structure is valid');
              results.passed += 2;
            } else {
              log('⚠️ ', 'Unexpected data structure');
              results.warnings++;
            }
          } catch (e) {
            log('❌', 'Invalid JSON response', e.message);
            results.failed++;
          }
        } else {
          log('❌', 'Profile endpoint returns', contentType || 'unknown');
          results.failed++;
        }
      } else if (response.status === 401) {
        log('❌', 'Unauthorized (401) - Token may be expired');
        results.failed++;
      } else if (response.status === 404) {
        log('❌', 'Not Found (404) - Endpoint may not exist');
        results.failed++;
      } else {
        log('⚠️ ', 'Unexpected status code', response.status);
        results.warnings++;
      }
    } catch (err) {
      log('❌', 'Profile endpoint error', err.message);
      results.failed++;
    }
  } else {
    log('⚠️ ', 'Skipping profile test (login first)');
    results.warnings++;
  }

  // ============================================================
  // 5. HEADER TESTS
  // ============================================================
  console.log('\n📋 5. REQUEST HEADER TESTS\n');
  
  if (authTokens) {
    try {
      const tokens = JSON.parse(authTokens);
      const response = await fetch(`${apiUrl}/dashboard/settings/profile/`, {
        method: 'HEAD',
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`
        }
      });
      
      if (response.status !== 401) {
        log('✅', 'Authorization header is being sent');
        results.passed++;
      } else {
        log('❌', 'Authorization header rejected');
        results.failed++;
      }
    } catch (err) {
      log('⚠️ ', 'Could not test authorization header');
      results.warnings++;
    }
  }

  // ============================================================
  // 6. FINAL SUMMARY
  // ============================================================
  console.log('\n' + '='.repeat(60));
  console.log('📊 DIAGNOSIS SUMMARY');
  console.log('='.repeat(60) + '\n');
  
  log('✅', 'Passed', `${results.passed} checks`);
  log('⚠️ ', 'Warnings', `${results.warnings} checks`);
  log('❌', 'Failed', `${results.failed} checks`);
  
  console.log('\n');
  
  if (results.failed === 0 && results.warnings === 0) {
    console.log('🎉 All systems operational! API is ready to use.\n');
  } else if (results.failed === 0) {
    console.log('⚠️ Some warnings detected. Review above for details.\n');
  } else {
    console.log('❌ Critical issues detected. See above for fixes.\n');
  }

  // ============================================================
  // 7. RECOMMENDATIONS
  // ============================================================
  console.log('📝 RECOMMENDATIONS:\n');
  
  if (!authTokens) {
    console.log('• 🔑 LOGIN: No tokens found. Please login first.');
  }
  
  if (results.failed > 0) {
    console.log('• 🔍 DIAGNOSE: Review the ❌ failed checks above.');
    console.log('• 📚 GUIDE: Check DEBUGGING_GUIDE.md or QUICK_FIX.md');
    console.log('• ✅ VERIFY: Use curl or Postman to test endpoints directly.');
  }
  
  if (results.passed > 0 && results.failed === 0) {
    console.log('• 🚀 READY: Try accessing the Settings page.');
    console.log('• 📱 MONITOR: Check browser console for detailed logs.');
  }
  
  console.log('\n' + '='.repeat(60) + '\n');
}

// Export for use
export { runFullDiagnosis };

// Auto-run if in browser
if (typeof window !== 'undefined') {
  window.runFullDiagnosis = runFullDiagnosis;
  console.log('💡 Diagnostic tool loaded. Run: runFullDiagnosis()');
}
