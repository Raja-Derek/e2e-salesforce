import { test } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { TEST_DATA } from '../../data/testData';
import { qase } from 'playwright-qase-reporter';

test.describe('Login Tests', () => {
  test('[Supervisor] login to platform', async ({ page }) => {
    qase.id(733);
    const loginPage = new LoginPage(page);

    await loginPage.login(TEST_DATA.supervisorEmail, TEST_DATA.supervisorPassword);
    await loginPage.assertDashboardVisible();
  });

  test('[Director] login to platform', async ({ page }) => {
    qase.id(737);
    const loginPage = new LoginPage(page);

    await loginPage.login(TEST_DATA.dirutEmail, TEST_DATA.dirutPassword);
    await loginPage.assertDashboardVisible();
  });

  test('[HR] login to platform', async ({ page }) => {
    qase.id(745);
    const loginPage = new LoginPage(page);
    
    await loginPage.login(TEST_DATA.hrEmail, TEST_DATA.hrPassword);
    await loginPage.assertDashboardVisible();
  });
});
