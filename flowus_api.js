import fs from 'fs';

async function testApi() {
  const cookies = JSON.parse(fs.readFileSync('flowus_cookies.json', 'utf8'));
  const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

  // Try to fetch workspace info or something specific
  const apiUrl = 'https://flowus.cn/api/index/workspaces';
  
  const response = await fetch(apiUrl, {
    headers: {
      'Cookie': cookieHeader,
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://flowus.cn/dashboard'
    }
  });

  const data = await response.json();
  console.log('API Response:', JSON.stringify(data, null, 2));
}

testApi();
