import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://flowus.cn/login');
  
  // Wait for the page to load
  await page.waitForTimeout(2000);
  
  // Fill phone number
  await page.fill('input[placeholder="请输入手机号"]', '18501965899');
  
  // Click send code button
  // Need to find the exact button, usually it has text like "获取验证码"
  const sendCodeBtn = await page.locator('text=获取验证码').first();
  await sendCodeBtn.click();
  
  console.log('Clicked send code button.');
  
  // Screenshot for user to see
  await page.screenshot({ path: 'flowus_login_screen.png' });
  
  await browser.close();
})();
