import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { TEST_DATA } from '../data/testData';
import { SELECTORS } from '../data/selectors';

async function createStorageState(roleName: string, email: string, password: string) {
  // Launch browser with TLS error tolerance and in a context to allow https endpoints in CI/local envs
  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const context = await browser.newContext({ ignoreHTTPSErrors: true });
  const page = await context.newPage();

  // Attach listeners to capture client-side errors and console output (useful in CI logs)
  page.on('console', msg => console.log(`[console][${roleName}] ${msg.type()}: ${msg.text()}`));
  page.on('pageerror', err => console.log(`[pageerror][${roleName}] ${err.message}`));
  page.on('requestfailed', req => console.log(`[requestfailed][${roleName}] ${req.url()} ${req.failure()?.errorText || ''}`));

  // Validate base URL before navigation. TEST_DATA.baseUrl should be defined via env (.env or CI secrets).
  const baseUrl = TEST_DATA.baseUrl;
  let finalBaseUrl: string;
  if (baseUrl) {
    finalBaseUrl = baseUrl.startsWith('http') ? baseUrl : `http://${baseUrl}`;
  } else {
    const fallbackUrl = process.env.BASE_URL || 'http://localhost:3000';
    console.warn(`BASE_URL is not defined. Using fallback: ${fallbackUrl}. Set BASE_URL environment variable to run against the desired environment.`);
    finalBaseUrl = fallbackUrl;
  }
  console.log(`🔎 Navigating to: ${finalBaseUrl}`);
  try {
    await page.goto(finalBaseUrl, { waitUntil: 'load' });
  } catch (err) {
    console.warn(`[${roleName}] Navigation to ${finalBaseUrl} failed: ${err}`);
  }
  await page.waitForTimeout(3000); // wait for 5 seconds to ensure the page is fully loaded

  // Perform login
  console.log(`🔐 Logging in as ${roleName} (${email})`);
  await page.fill(SELECTORS.emailInput, email);
  await page.fill(SELECTORS.passwordInput, password);
  await page.click(SELECTORS.loginButton);
  await page.getByText('Berhasil login').click({timeout:20000});

  await page.waitForURL(/.*core/);

  // Save storage state
  const outputPath = path.join(__dirname, `${roleName}.json`);
  await page.context().storageState({ path: outputPath });

  await browser.close();
  console.log(`✅ Storage generated for ${roleName}`);
}

async function globalSetup() {
  console.log('🔥 Cleaning old auth session...');
  const authDir = path.join(__dirname);

  fs.readdirSync(authDir)
    .filter(file => file.endsWith('.json'))
    .forEach(file => fs.unlinkSync(path.join(authDir, file)));

  console.log('🔐 Generating auth sessions...');

  await createStorageState('supervisor', TEST_DATA.supervisorEmail, TEST_DATA.supervisorPassword);
  await createStorageState('director', TEST_DATA.dirutEmail, TEST_DATA.dirutPassword);
  await createStorageState('hr', TEST_DATA.hrEmail, TEST_DATA.hrPassword);
  await createStorageState('admin', TEST_DATA.adminEmail, TEST_DATA.adminPassword);

  console.log('🏁 All sessions generated!');
}

export default globalSetup;
