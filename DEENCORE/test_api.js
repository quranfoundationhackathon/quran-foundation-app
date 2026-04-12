// Test script to understand API response structures
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config({ path: './server/.env' });

const { QF_CLIENT_ID, QF_CLIENT_SECRET, QF_AUTH_URL, QF_API_BASE } = process.env;

async function getToken() {
  const auth = Buffer.from(`${QF_CLIENT_ID}:${QF_CLIENT_SECRET}`).toString('base64');
  const response = await fetch(`${QF_AUTH_URL}/oauth2/token`, {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  
  const data = await response.json();
  return data.access_token;
}

async function testEndpoint(token, endpoint, label) {
  console.log(`\n=== Testing ${label} ===`);
  const url = `${QF_API_BASE}/content/api/v4${endpoint}`;
  console.log(`URL: ${url}`);
  
  const response = await fetch(url, {
    headers: {
      'x-auth-token': token,
      'x-client-id': QF_CLIENT_ID
    }
  });
  
  const data = await response.json();
  const keys = Object.keys(data);
  console.log(`Response keys: ${keys.join(', ')}`);
  
  // Check for common pagination structures
  for (const key of keys) {
    if (Array.isArray(data[key])) {
      console.log(`Array key "${key}": ${data[key].length} items`);
      if (data[key].length > 0) {
        console.log(`  First item keys: ${Object.keys(data[key][0]).slice(0, 3).join(', ')}`);
      }
    }
  }
}

async function main() {
  try {
    console.log('Getting access token...');
    const token = await getToken();
    console.log('Token obtained');
    
    await testEndpoint(token, '/chapters?language=en&page=1&limit=50', 'Chapters (page 1, limit 50)');
    await testEndpoint(token, '/chapters?language=en&page=2&limit=50', 'Chapters (page 2, limit 50)');
    await testEndpoint(token, '/verses/by_chapter/2?language=en&translations=131&page=1&limit=50', 'Verses for Chapter 2 (page 1, limit 50)');
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
