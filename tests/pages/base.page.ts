import { expect, test, type Locator, type Page } from '@playwright/test';
import { TIMEOUTS } from '../utils/env';

/**
 * Base class untuk semua Page Object.
 * Berisi helper navigasi umum agar tidak diduplikasi di tiap page.
 */
export class BasePage {
  constructor(protected readonly page: Page) {}

  protected async gotoPath(path: string): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Tunggu toast MUNCUL lalu HILANG (auto-dismiss).
   *
   * Aturan pakai (penting):
   * - Panggil SEGERA setelah aksi pemicu (klik Simpan/Hapus),
   *   SEBELUM assertion lain. Toast hanya tampil beberapa detik;
   *   assertion lambat sebelumnya membuat toast keburu hilang dan
   *   test gagal walaupun operasi sebenarnya sukses.
   * - Setelah helper ini, JANGAN assert toast yang sama visible lagi
   *   di step berikutnya — toast-nya sudah hilang.
   */
  protected async expectToastAppearAndDismiss(toast: Locator, label: string): Promise<void> {
    await test.step(`Toast "${label}" muncul lalu hilang`, async () => {
      await expect(toast).toBeVisible({ timeout: TIMEOUTS.toast });
      await expect(toast).toBeHidden({ timeout: TIMEOUTS.toast });
    });
  }
}
