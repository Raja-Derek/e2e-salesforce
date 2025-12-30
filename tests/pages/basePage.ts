import { Page, test } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async waitForLoad() {
    await test.step('Wait for page to load', async () => {
      await this.page.waitForLoadState('networkidle', {
        timeout: 60_000, // 60 detik
      });
    });
  }

}
