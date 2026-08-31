const https = require('https');
https.get('https://fitnessfusiongym.vercel.app/api/admin/members', (res) => {
  console.log('statusCode:', res.statusCode);
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => console.log('Response:', data));
}).on('error', e => console.error(e));
