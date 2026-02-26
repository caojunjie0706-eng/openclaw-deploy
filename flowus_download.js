import fs from 'fs';

async function downloadFlowUs() {
  const url = 'https://flowus.cn/003ab207-9b44-4bc4-bbb0-855632520799';
  const cookies = JSON.parse(fs.readFileSync('flowus_cookies.json', 'utf8'));
  const cookieHeader = cookies.map(c => `${c.name}=${c.value}`).join('; ');

  console.log('Fetching FlowUs page with cookies...');
  
  const response = await fetch(url, {
    headers: {
      'Cookie': cookieHeader,
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  const text = await response.text();
  console.log('Response Status:', response.status);
  
  if (text.includes('Rework')) {
    console.log('Found "Rework" in response - login likely successful.');
  } else {
    console.log('Warning: "Rework" not found in response HTML.');
  }

  // Save the HTML for analysis if needed
  fs.writeFileSync('flowus_page.html', text);
}

downloadFlowUs();
