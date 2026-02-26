import fs from 'fs';

async function sendCode() {
  const phone = "18501965899";
  const url = 'https://flowus.cn/api/auth/send_code';
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Referer': 'https://flowus.cn/login'
    },
    body: JSON.stringify({
      phone: phone,
      country_code: "86"
    })
  });

  const data = await response.json();
  console.log('Send Code Response:', JSON.stringify(data, null, 2));
}

sendCode();
