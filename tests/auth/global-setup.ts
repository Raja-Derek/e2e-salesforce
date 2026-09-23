import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { ENV, ROUTES, STORAGE_STATE } from '../utils/env';

async function createStorageState(roleName: string, email: string, password: string): Promise<void> {
  if (!ENV.baseUrl) {
    throw new Error('BASE_URL belum di-set. Isi .env atau environment CI.');
  }
  if (!email || !password) {
    throw new Error(`Kredensial ${roleName} kosong. Isi LOGIN_EMAIL / LOGIN_PASSWORD.`);
  }

  const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  try {
    const context = await browser.newContext({ ignoreHTTPSErrors: true });
    const page = await context.newPage();

    const signInUrl = `${ENV.baseUrl}${ROUTES.signIn}`;
    await page.goto(signInUrl, { waitUntil: 'domcontentloaded' });
    await page.getByRole('textbox', { name: 'Email Address' }).fill(email);
    await page.getByRole('textbox', { name: '••••••••' }).fill(password);
    await page.getByRole('button', { name: 'Sign In to Dashboard' }).click();
    await page.waitForURL(ROUTES.dashboard, { timeout: 30_000 });

    const outputPath = path.join(__dirname, `${roleName}.json`);
    await page.context().storageState({ path: outputPath });
  } finally {
    await browser.close();
  }
}

async function globalSetup(): Promise<void> {
  // Hapus session lama agar tidak pakai cookie basi.
  for (const file of Object.values(STORAGE_STATE)) {
    const fullPath = path.join(__dirname, path.basename(file));
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
  }

  await createStorageState('admin', ENV.loginEmail, ENV.loginPassword);
}

export default globalSetup;
