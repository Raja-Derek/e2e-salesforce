import { Page, expect, test } from '@playwright/test';
import { SELECTORS } from '../data/selectors';
import { TEST_DATA } from '../data/testData';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto(TEST_DATA.baseUrl);
  }

  async enterEmail(email: string) {
    await this.page.fill(SELECTORS.emailInput, email);
  }

  async enterPassword(password: string) {
    await this.page.fill(SELECTORS.passwordInput, password);
  }

  async clickLogin() {
    await this.page.click(SELECTORS.loginButton);
  }

  async assertDashboardVisible() {
    await test.step('Dashboard page is visible', async () => {
      await this.page.waitForResponse(res =>
        res.url().includes('/core') && res.status() === 200
      )
    });
  }

  async logout(karyawanName: string) {
    await this.page.getByRole('button', { name: karyawanName }).click();
    await this.page.getByRole('button', { name: 'Keluar' }).click();
    await expect(this.page.getByTestId('sign-in_email-input')).toBeVisible();
    await expect(this.page.getByTestId('sign-in_password-input')).toBeVisible();
  }

  async login(email: string, password: string) {
    await test.step('User navigate to login page', async () => {
      await this.navigate();
    })

    await test.step('User submit login form', async () => {
      await this.enterEmail(email);
      await this.enterPassword(password);
      await this.clickLogin();
      await expect(this.page.getByText('Lagi cek keaslian email...', { exact: true })).not.toBeVisible({timeout: 60000});

    }
    );
  }

}
