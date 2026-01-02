import { test } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { TEST_DATA } from '../../data/testData';

test.describe('Login Tests', () => {
  test('Login dengan email salah', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login({ email: 'tahubulat@gmail.com', password: TEST_DATA.passwordLogin });
    await loginPage.assertDashboardNotVisible();
  });
  
  test('Login dengan Kredensial Valid', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login({ email: TEST_DATA.emailLogin, password: TEST_DATA.passwordLogin });
    await loginPage.assertDashboardVisible();
  });

  test('Login dengan Password Salah', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.login({ email: TEST_DATA.emailLogin, password: 'invalidpassword' });
    await loginPage.assertDashboardNotVisible();
  });

  test('Login Tanpa Mengisi Email dan Password', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.submitLoginFormWithoutFillingCredentials();

  });

  test('Navigasi ke halaman lupa kata sandi', async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.navigateToLoginPage();
    await loginPage.navigateToForgotPasswordPage();
    await loginPage.assertForgotPasswordPageVisible();
  });
});
