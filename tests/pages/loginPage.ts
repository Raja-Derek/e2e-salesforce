import { expect, test, type Locator, type Page } from '@playwright/test';
import { ENV, ROUTES, TIMEOUTS } from '../utils/env';
import { UI_TEXT } from '../data/testData';
import type { LoginData } from '../types/login';
import { BasePage } from './base.page';

/**
 * Page Object untuk halaman Sign In.
 *
 * Aturan:
 * - Semua selector hidup sebagai field Locator (mudah diupdate).
 * - Setiap aksi publik dibungkus test.step agar laporan Allure terbaca.
 * - Spec tidak boleh memakai page.getBy* langsung untuk halaman ini.
 */
export class LoginPage extends BasePage {
  private readonly loginUrl = `${ENV.baseUrl}${ROUTES.signIn}`;

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly loginErrorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByRole('textbox', { name: 'Email Address' });
    this.passwordInput = page.getByRole('textbox', { name: '••••••••' });
    this.signInButton = page.getByRole('button', { name: 'Sign In to Dashboard' });
    this.loginErrorMessage = page.getByText(UI_TEXT.loginFailed);
  }

  async goto(): Promise<void> {
    await test.step('Buka halaman login', async () => {
      await this.gotoPath(this.loginUrl);
      await expect(this.page).toHaveURL(this.loginUrl);
    });
  }

  async login(data: LoginData): Promise<void> {
    await test.step('Buka halaman login', async () => {
      await this.page.goto(this.loginUrl);
      await expect(this.page).toHaveURL(this.loginUrl);
    });

    await test.step(`Login sebagai ${data.email}`, async () => {
      await expect(this.emailInput).toBeVisible({ timeout: TIMEOUTS.dialog });
      await this.emailInput.fill(data.email);
      await this.passwordInput.fill(data.password);
      await this.signInButton.click();
    });
  }

  async expectLoginSuccess(): Promise<void> {
    await test.step('Dashboard tampil setelah login', async () => {
      await expect(this.page).toHaveURL(ROUTES.dashboard, { timeout: TIMEOUTS.list });
    });
  }

  async expectLoginFailed(): Promise<void> {
    await test.step('Pesan error login tampil, dashboard tidak terbuka', async () => {
      await this.page.waitForLoadState('networkidle', { timeout: TIMEOUTS.networkIdle }).catch(() => {});
      await expect(this.page).not.toHaveURL(ROUTES.dashboard);
      await expect(this.loginErrorMessage).toBeVisible({ timeout: TIMEOUTS.list });
    });
  }

  async expectSignInDisabledWhenEmpty(): Promise<void> {
    await test.step('Tombol Sign In disabled saat form kosong', async () => {
      await this.gotoPath(this.loginUrl);
      await expect(this.signInButton).toBeDisabled({ timeout: TIMEOUTS.dialog });
    });
  }
}
