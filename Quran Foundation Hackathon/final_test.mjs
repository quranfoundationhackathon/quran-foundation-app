import http from 'http';

const tests = [
  { url: 'http://localhost:3001/api/chapters', name: 'Chapters', expectedKey: 'chapters' },
  { url: 'http://localhost:3001/api/chapters/1/verses', name: 'Ch1 Verses', expectedKey: 'verses' },
  { url: 'http://localhost:3001/api/chapters/2/verses', name: 'Ch2 Verses (286)', expectedKey: 'verses' }
];

let completed = 0;

for (const test of tests) {
  http.get(test.url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        const count = json[test.expectedKey].length;
        console.log(`✓ ${test.name}: ${count} items`);
      } catch (e) {
        console.log(`✗ ${test.name}: Error - ${e.message}`);
      }
      completed++;
      if (completed === tests.length) {
        process.exit(0);
      }
    });
  }).on('error', (e) => {
    console.log(`✗ ${test.name}: ${e.message}`);
    completed++;
    if (completed === tests.length) {
      process.exit(1);
    }
  });
}
