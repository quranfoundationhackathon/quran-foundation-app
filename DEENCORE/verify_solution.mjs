// Final verification test
import http from 'http';
import { strictEqual } from 'assert';

const results = {};

function testEndpoint(url, name, expectedKey, expectedCount) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const actual = json[expectedKey].length;
          const pass = actual === expectedCount;
          results[name] = {
            pass,
            expected: expectedCount,
            actual: actual,
            message: pass ? `✓ ${name}: ${actual} items (expected ${expectedCount})` : `✗ ${name}: ${actual} items (expected ${expectedCount})`
          };
        } catch (e) {
          results[name] = {
            pass: false,
            message: `✗ ${name}: Parse error - ${e.message}`
          };
        }
        resolve();
      });
    }).on('error', (e) => {
      results[name] = {
        pass: false,
        message: `✗ ${name}: Connection error - ${e.message}`
      };
      resolve();
    });
  });
}

async function runTests() {
  console.log('Testing Quran app endpoints...\n');
  
  await testEndpoint('http://localhost:3001/api/chapters', 'All Chapters', 'chapters', 114);
  await testEndpoint('http://localhost:3001/api/chapters/1/verses', 'Chapter 1 (Al-Fatihah)', 'verses', 7);
  await testEndpoint('http://localhost:3001/api/chapters/2/verses', 'Chapter 2 (Al-Baqarah)', 'verses', 286);
  
  console.log('='.repeat(50));
  let allPass = true;
  for (const [name, result] of Object.entries(results)) {
    console.log(result.message);
    if (!result.pass) allPass = false;
  }
  console.log('='.repeat(50));
  
  if (allPass) {
    console.log('\n✓✓✓ SUCCESS! All data loads completely! ✓✓✓\n');
    console.log('Summary:');
    console.log('- All 114 surahs load in the menu');
    console.log('- Chapter 1 loads all 7 ayahs');
    console.log('- Chapter 2 loads all 286 ayahs');
    console.log('\nThe Quran app is fully functional!\n');
    process.exit(0);
  } else {
    console.log('\n✗ Some tests failed\n');
    process.exit(1);
  }
}

runTests();
