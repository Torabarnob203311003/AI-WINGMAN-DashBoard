/**
 * API Diagnostic Tool
 * 
 * Copy and paste this entire code into your browser's DevTools Console
 * to run comprehensive API diagnostics
 */

async function diagnosisAPI() {
  console.clear();
  console.log('🔍 AI-WINGMAN API Diagnostic Tool\n');
  
  // ============================================================
  // 1. CHECK ENVIRONMENT & TOKEN
  // ============================================================
  console.log('=== 1. ENVIRONMENT & TOKEN CHECK ===\n');
  
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
  console.log('✓ API Base URL:', apiUrl);
  
  const authTokens = localStorage.getItem('auth_tokens');
  console.log('✓ Auth Tokens in Storage:', authTokens ? '✅ YES' : '❌ NO');
  
  if (authTokens) {
    try {
      const parsed = JSON.parse(authTokens);
      console.log('  - Access Token:', parsed.access_token ? '✅ Present' : '❌ Missing');
      console.log('  - Refresh Token:', parsed.refresh_token ? '✅ Present' : '❌ Missing');
      console.log('  - User ID:', parsed.user_id || '❌ Missing');
    } catch (e) {
      console.error('  - Error parsing tokens:', e.message);
    }
  }
  
  // ============================================================
  // 2. TEST LOGIN ENDPOINT
  // ============================================================
  console.log('\n=== 2. LOGIN ENDPOINT TEST ===\n');
  
  try {
    const loginResponse = await fetch(`${apiUrl}/auth/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'test123'
      })
    });
    
    console.log('✓ Login Endpoint Status:', loginResponse.status);
    console.log('✓ Login Endpoint Reachable:', '✅ YES');
    
    const contentType = loginResponse.headers.get('content-type');
    console.log('✓ Response Type:', contentType || 'unknown');
    
    if (contentType && contentType.includes('application/json')) {
      const data = await loginResponse.json();
      console.log('✓ Returns JSON:', '✅ YES');
    } else {
      console.log('✓ Returns JSON:', '❌ NO');
    }
  } catch (err) {
    console.error('✗ Login Endpoint Error:', err.message);
    console.error('  Backend server might not be running');
  }
  
  // ============================================================
  // 3. TEST PROFILE ENDPOINT (with token)
  // ============================================================
  console.log('\n=== 3. PROFILE ENDPOINT TEST ===\n');
  
  if (authTokens) {
    try {
      const parsed = JSON.parse(authTokens);
      const token = parsed.access_token;
      
      const profileResponse = await fetch(`${apiUrl}/dashboard/settings/profile/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✓ Profile Endpoint Status:', profileResponse.status);
      
      if (profileResponse.status === 401) {
        console.error('✗ Unauthorized (401) - Token might be expired');
      } else if (profileResponse.status === 404) {
        console.error('✗ Not Found (404) - Endpoint might not exist');
      } else if (profileResponse.status === 200) {
        console.log('✓ Success (200)', '✅ YES');
      }
      
      const contentType = profileResponse.headers.get('content-type');
      console.log('✓ Response Type:', contentType || 'unknown');
      
      const responseText = await profileResponse.text();
      console.log('✓ Response Length:', responseText.length, 'bytes');
      
      // Try to parse as JSON
      try {
        const data = JSON.parse(responseText);
        console.log('✓ Valid JSON:', '✅ YES');
        console.log('✓ Response Structure:', {
          hasData: !!data.data,
          hasUser: !!data.user,
          keys: Object.keys(data)
        });
      } catch (e) {
        console.error('✗ Valid JSON:', '❌ NO');
        console.error('  First 200 chars:', responseText.substring(0, 200));
      }
    } catch (err) {
      console.error('✗ Profile Endpoint Error:', err.message);
    }
  } else {
    console.log('⚠️  No token found. Please login first.');
  }
  
  // ============================================================
  // 4. TEST CORS
  // ============================================================
  console.log('\n=== 4. CORS CHECK ===\n');
  
  try {
    const corsTest = await fetch(`${apiUrl}/auth/login/`, {
      method: 'OPTIONS',
      headers: {
        'Origin': window.location.origin
      }
    });
    
    console.log('✓ CORS Headers:');
    console.log('  - Allow Origin:', corsTest.headers.get('access-control-allow-origin') || 'Not set');
    console.log('  - Allow Methods:', corsTest.headers.get('access-control-allow-methods') || 'Not set');
    console.log('  - Allow Headers:', corsTest.headers.get('access-control-allow-headers') || 'Not set');
  } catch (err) {
    console.log('⚠️  CORS preflight failed (may be expected)');
  }
  
  // ============================================================
  // 5. SUMMARY
  // ============================================================
  console.log('\n=== DIAGNOSTIC SUMMARY ===\n');
  
  if (authTokens) {
    console.log('✅ Token is stored in localStorage');
    console.log('⏭️  Next: Try accessing Settings page and check console for detailed logs');
  } else {
    console.log('❌ No token found');
    console.log('⏭️  Next: Login first, then run this again');
  }
  
  console.log('\n📝 Instructions:');
  console.log('1. Check the results above for any ❌ errors');
  console.log('2. If backend URL is wrong, update .env file');
  console.log('3. If token is missing, complete login');
  console.log('4. If endpoint returns HTML, backend endpoint may not exist');
}

// Run the diagnosis
diagnosisAPI();
