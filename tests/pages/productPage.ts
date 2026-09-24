import { expect, test, type Locator, type Page } from '@playwright/test';
import { ENV, ROUTES, TIMEOUTS } from '../utils/env';
import { UI_TEXT } from '../data/testData';
import { BasePage } from './base.page';

/**
 * Page Object untuk halaman Katalog Produk (/products).
 *
 * Semua interaksi produk (search, buka detail, edit, nonaktifkan)
 * wajib lewat method di sini. Spec tidak boleh merakit locator mentah.
 */
export class ProductPage extends BasePage {
  private readonly productsUrl = `${ENV.baseUrl}${ROUTES.products}`;

  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly editDialog: Locator;
  readonly saveChangesButton: Locator;
  readonly updateConfirmDialog: Locator;
  readonly confirmButton: Locator;
  readonly userMenuTrigger: Locator;
  readonly updateSuccessToast: Locator;
  readonly inactiveBadge: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Katalog Produk' });
    this.searchInput = page.getByRole('textbox', { name: 'Cari nama atau SKU...' });
    this.editDialog = page.getByRole('dialog', { name: 'Edit Produk' });
    this.saveChangesButton = page.getByRole('button', { name: 'Simpan Perubahan' });
    this.updateConfirmDialog = page.getByRole('alertdialog', { name: 'Update Produk?' });
    this.confirmButton = page.locator('[data-test="confirm-button"]');
    this.userMenuTrigger = page.locator('[data-test="btn-dropdown-trigger"]');
    this.updateSuccessToast = page.getByText(UI_TEXT.productUpdated);
    this.inactiveBadge = page.getByText(UI_TEXT.productInactiveBadge);
  }

  // ---------- Locator dinamis ----------

  /** Teks nama produk di dalam list (card masih skeleton saat loading). */
  productText(productName: string): Locator {
    return this.page.getByText(new RegExp(escapeRegExp(productName), 'i')).first();
  }

  /**
   * Card produk berdasarkan nama.
   * Scoping ini penting: tiap card punya tombol Edit sendiri,
   * jadi tombol harus dicari DI DALAM card target (anti strict-mode violation).
   */
  cardFor(productName: string): Locator {
    return this.page
      .locator('div.group.flex.h-full, div.group')
      .filter({ hasText: new RegExp(escapeRegExp(productName), 'i') })
      .first();
  }

  detailDialog(productName: string): Locator {
    return this.page.getByRole('dialog').filter({ hasText: productName });
  }

  deactivateConfirmDialog(): Locator {
    return this.page.getByRole('alertdialog', { name: 'Nonaktifkan Produk?' });
  }

  // ---------- Aksi halaman ----------

  async goto(): Promise<void> {
    await test.step('Buka halaman Katalog Produk', async () => {
      await this.gotoPath(this.productsUrl);
      await this.expectLoaded();
    });
  }

  async expectLoaded(): Promise<void> {
    await test.step('Halaman katalog termuat', async () => {
      await expect(this.heading).toBeVisible({ timeout: TIMEOUTS.list });
      await expect(this.searchInput).toBeVisible({ timeout: TIMEOUTS.dialog });
    });
  }

  async search(productName: string): Promise<void> {
    await test.step(`Cari produk "${productName}"`, async () => {
      await this.searchInput.fill(productName);
      await this.searchInput.press('Enter');
      await expect(this.productText(productName)).toBeVisible({ timeout: TIMEOUTS.list });
    });
  }

  async openDetail(productName: string): Promise<void> {
    await test.step(`Buka detail produk "${productName}"`, async () => {
      await expect(this.productText(productName)).toBeVisible({ timeout: TIMEOUTS.list });
      await this.productText(productName).click();
    });
  }

  async expectDetailVisible(productName: string): Promise<void> {
    await test.step(`Dialog detail "${productName}" tampil`, async () => {
      await expect(this.detailDialog(productName)).toBeVisible({ timeout: TIMEOUTS.dialog });
    });
  }

  async openEditFor(productName: string): Promise<void> {
    await test.step(`Buka dialog Edit untuk "${productName}"`, async () => {
      const card = this.cardFor(productName);
      await expect(card).toBeVisible({ timeout: TIMEOUTS.list });
      await card.getByRole('button', { name: 'Edit' }).click();
      await expect(this.editDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
      await this.page.waitForTimeout(3000); // Tunggu animasi dialog selesai (agar tombol bisa diklik)
    });
  }

  async saveEditAndConfirm(): Promise<void> {
    await test.step('Simpan perubahan dan konfirmasi update', async () => {
      await this.saveChangesButton.click();
      await expect(this.updateConfirmDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
      await this.confirmButton.click();
      // Toast dicek di sini (segera setelah confirm), bukan di expectUpdateSuccess:
      // toast keburu auto-dismiss kalau menunggu assertion lain dulu.
      await this.expectToastAppearAndDismiss(this.updateSuccessToast, UI_TEXT.productUpdated);
      await expect(this.editDialog).toBeHidden({ timeout: TIMEOUTS.list });
    });
  }

  async expectUpdateSuccess(): Promise<void> {
    await test.step('Halaman stabil setelah update produk', async () => {
      // Toast sudah diverifikasi (muncul + hilang) di saveEditAndConfirm,
      // di sini cukup assert state stabil: halaman kembali normal.
      await expect(this.userMenuTrigger).toBeVisible({ timeout: TIMEOUTS.list });
    });
  }

  async deactivate(productName: string): Promise<void> {
    await test.step(`Nonaktifkan produk "${productName}"`, async () => {
      const card = this.cardFor(productName);
      await expect(card).toBeVisible({ timeout: TIMEOUTS.list });
      await card.getByRole('button', { name: UI_TEXT.deactivateProductButton }).click();
      await expect(this.deactivateConfirmDialog()).toBeVisible({ timeout: TIMEOUTS.dialog });
      await this.confirmButton.click();
      await expect(this.userMenuTrigger).toBeVisible({ timeout: TIMEOUTS.list });
    });
  }

  /**
   * Precondition: pastikan produk aktif sebelum dinonaktifkan.
   * Tanpa ini test gagal di setiap rerun karena status nonaktif
   * persist di database (tombol berubah jadi "Pulihkan Produk").
   */
  async ensureProductActive(productName: string): Promise<void> {
    await test.step(`Pastikan produk "${productName}" aktif`, async () => {
      const card = this.cardFor(productName);
      await expect(card).toBeVisible({ timeout: TIMEOUTS.list });
      if (await card.getByRole('button', { name: UI_TEXT.restoreProductButton }).isVisible()) {
        await card.getByRole('button', { name: UI_TEXT.restoreProductButton }).click();
        // Judul dialog restore tidak di-hardcode (pakai alertdialog generik)
        // agar tidak rapuh kalau copy-nya berubah.
        await expect(this.page.getByRole('alertdialog')).toBeVisible({ timeout: TIMEOUTS.dialog });
        await this.confirmButton.click();
        await expect(card.getByRole('button', { name: UI_TEXT.deactivateProductButton })).toBeVisible({
          timeout: TIMEOUTS.list,
        });
      }
    });
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
