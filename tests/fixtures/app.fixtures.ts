import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import { ProductPage } from '../pages/productPage';
import { CustomerPage } from '../pages/customerPage';

/**
 * Fixture aplikasi.
 *
 * Kenapa fixture?
 * - Spec tidak perlu `new LoginPage(page)` berulang.
 * - Cukup tulis `async ({ loginPage }) => ...`.
 * - Gampang ditambah (mis. apiContext, role tertentu) tanpa ubah semua spec.
 *
 * Cara pakai di spec:
 *   import { test, expect } from '../../fixtures/app.fixtures';
 */
type AppFixtures = {
  loginPage: LoginPage;
  productPage: ProductPage;
  customerPage: CustomerPage;
};

export const test = base.extend<AppFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  customerPage: async ({ page }, use) => {
    await use(new CustomerPage(page));
  },
});

export { expect } from '@playwright/test';
