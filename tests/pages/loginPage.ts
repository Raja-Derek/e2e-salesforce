import { Page, expect, test } from '@playwright/test';
import { TEST_DATA } from '../data/testData';
import { LoginData } from '../types/login';

export class LoginPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private readonly loginURL = TEST_DATA.baseUrl + '/sign-in';

  async navigateToLoginPage() {
    await this.page.goto(this.loginURL);
  }

  async logout(karyawanName: string) {
    await this.page.getByRole('button', { name: karyawanName }).click();
    await this.page.getByRole('button', { name: 'Keluar' }).click();
    await expect(this.page.getByTestId('sign-in_email-input')).toBeVisible();
    await expect(this.page.getByTestId('sign-in_password-input')).toBeVisible();
  }

  async login(data: LoginData) {
    await test.step('User navigate to login page', async () => {
      await this.page.goto(this.loginURL);
      await expect(this.page).toHaveURL(this.loginURL);
    })

    await test.step('User submit login form', async () => {
      await expect(this.page.getByRole('textbox', { name: 'Email Address' })).toBeVisible({timeout: 10000});
      await this.page.getByRole('textbox', { name: 'Email Address' }).fill(data.email);
      await this.page.getByRole('textbox', { name: '••••••••' }).fill(data.password);
      await this.page.getByRole('button', { name: 'Sign In to Dashboard' }).click();

    });
  }

  async navigateToForgotPasswordPage() {
    await test.step('User navigate to login page', async () => {
      await this.page.getByRole('link', { name: 'Forgot your password?' }).click();

    })
  }

  async assertForgotPasswordPageVisible(){
    await test.step('Forgot Password page is visible', async () => {
      await expect(this.page.getByRole('heading', { name: 'Forgot Your Password?' })).toBeVisible();
    })
  }

  async submitLoginFormWithoutFillingCredentials() {
    await test.step('User navigate to login page', async () => {
      await this.page.goto(this.loginURL);
    })

    await test.step('User submit login form without filling credentials', async () => {
      await expect(this.page.getByRole('button', { name: 'Sign In to Dashboard' })).toBeDisabled();
    });
  }


  async assertDashboardVisible() {
    await test.step('Dashboard page is visible', async () => {
      await this.page.waitForResponse(res =>
        res.url().includes('/dashboard') && res.status() === 200
      )
    });
  }

  async assertDashboardNotVisible() {
    await test.step('Dashboard page is not visible', async () => {
      await expect(this.page.getByRole('heading', { name: 'Dashboard this.Page' })).not.toBeVisible();
      await expect(this.page.getByRole('link', { name: 'dashboard' })).not.toBeVisible();

      await expect(this.page.getByText('Email atau kata sandi salah')).toBeVisible();

    });
  }
}
