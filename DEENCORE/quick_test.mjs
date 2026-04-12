import http from 'http';

const tests = [
  { url: 'http://localhost:3001/api/chapters', name: 'Chapters' },
  { url: 'http://localhost:3001/api/chapters/1/verses', name: 'Chapter 1 Verses' },
  { url: 'http://localhost:3001/api/chapters/2/verses', name: 'Chapter 2 Verses' }
];

for (const test of tests) {
  http.get(test.url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        const key = Object.keys(json).find(k => Array.isArray(json[k]));
        console.log(`${test.name}: ${json[key].length} items`);
      } catch (e) {
        console.log(`${test.name}: Error parsing response`);
      }
    });
  }).on('error', (e) => {
    console.log(`${test.name}: Connection error - ${e.message}`);
  });
}
