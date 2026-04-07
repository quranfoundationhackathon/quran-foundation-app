// Simple test script
import http from 'http';

http.get('http://localhost:3001/api/chapters', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    console.log(`Chapters loaded: ${json.chapters.length}`);
  });
});
