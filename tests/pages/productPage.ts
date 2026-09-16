import { Page, expect, test } from '@playwright/test';
import { TEST_DATA, DATA_PRODUK } from '../data/testData';
import { LoginData } from '../types/login';

export class ProductPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private readonly productsURL = TEST_DATA.baseUrl + '/products';

  async navigateToProductsPage() {
    await this.page.goto(this.productsURL);
  }

  async openProductDetail(productName: string) {
    await this.page.getByRole('button', { name: productName }).click();
    await this.page.getByRole('button', { name: 'Keluar' }).click();
    await expect(this.page.getByTestId('sign-in_email-input')).toBeVisible();
    await expect(this.page.getByTestId('sign-in_password-input')).toBeVisible();
  }

}
