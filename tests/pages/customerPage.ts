import { expect, test, type Locator, type Page } from '@playwright/test';
import { ENV, ROUTES, TIMEOUTS } from '../utils/env';
import { UI_TEXT } from '../data/testData';
import type { CustomerData, PersonalCustomerData } from '../types/customer';
import { BasePage } from './base.page';

/**
 * Page Object untuk halaman Customer (/customer).
 *
 * Melayani dua tipe customer: Perusahaan dan Perorangan.
 * Semua interaksi (tambah, cari, ubah, hapus, buka detail)
 * wajib lewat method di sini. Spec tidak boleh merakit locator mentah.
 */
export class CustomerPage extends BasePage {
  private readonly customerUrl = `${ENV.baseUrl}${ROUTES.customer}`;

  readonly heading: Locator;
  readonly searchInput: Locator;
  readonly addButton: Locator;
  readonly createDialog: Locator;
  readonly editDialog: Locator;
  readonly personalTabButton: Locator;
  readonly companyInput: Locator;
  readonly titleBapakButton: Locator;
  readonly nameInput: Locator;
  readonly positionInput: Locator;
  readonly phoneInput: Locator;
  readonly emailInput: Locator;
  readonly addressInput: Locator;
  readonly saveButton: Locator;
  readonly createConfirmDialog: Locator;
  readonly updateConfirmDialog: Locator;
  readonly deleteConfirmDialog: Locator;
  readonly deleteConfirmButton: Locator;
  readonly confirmButton: Locator;
  readonly editOption: Locator;
  readonly deleteOption: Locator;
  readonly createSuccessToast: Locator;
  readonly createErrorToast: Locator;
  readonly updateSuccessToast: Locator;
  readonly deleteSuccessToast: Locator;
  readonly emptyStateHeading: Locator;
  readonly emptyStateText: Locator;
  readonly contactDetailHeading: Locator;
  readonly closeButton: Locator;
  readonly createSuccessAddedToast: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Customers' });
    this.searchInput = page.locator('[data-test="input-search-customer"]');
    this.addButton = page.locator('[data-test="btn-add-customer"]');
    this.createDialog = page.getByRole('dialog', { name: UI_TEXT.addCustomerDialog });
    this.editDialog = page.getByRole('dialog', { name: UI_TEXT.editCustomerDialog });
    this.personalTabButton = this.createDialog.getByRole('button', { name: UI_TEXT.personalTab });
    this.companyInput = page.locator('[data-test="input-company-name"]');
    this.titleBapakButton = page.locator('[data-test="btn-bapak"]');
    this.nameInput = page.locator('[data-test="input-name"]');
    this.positionInput = page.locator('[data-test="input-position"]');
    this.phoneInput = page.locator('[data-test="input-phone"]');
    this.emailInput = page.locator('[data-test="input-email"]');
    this.addressInput = page.locator('[data-test="input-address"]');
    this.saveButton = page.locator('[data-test="btn-save-customer"]');
    this.createConfirmDialog = page.getByRole('alertdialog', { name: UI_TEXT.createCustomerConfirm });
    this.updateConfirmDialog = page.getByRole('alertdialog', { name: UI_TEXT.updateCustomerConfirm });
    this.deleteConfirmDialog = page.getByRole('alertdialog', { name: UI_TEXT.deleteCustomerConfirm });
    this.deleteConfirmButton = page.getByRole('button', { name: UI_TEXT.deleteCustomerConfirmButton });
    this.confirmButton = page.locator('[data-test="confirm-button"]');
    // Item menu memakai suffix UUID per baris (mis. edit-<uuid>),
    // jadi dicari pakai prefix agar tidak hardcoded ke satu record.
    this.editOption = page.locator('[data-test^="edit-"]');
    this.deleteOption = page.locator('[data-test^="delete-"]');
    this.createSuccessToast = page.getByText(UI_TEXT.customerCreated);
    this.createSuccessAddedToast = page.getByText(UI_TEXT.customerSuccessfullyAdded);
    this.createErrorToast = page.getByText(UI_TEXT.createCustomerFailed);
    this.updateSuccessToast = page.getByText(UI_TEXT.customerUpdated);
    this.deleteSuccessToast = page.getByText(UI_TEXT.customerDeleted);
    this.emptyStateHeading = page.getByRole('heading', { name: UI_TEXT.emptyStateHeading });
    this.emptyStateText = page.getByText(UI_TEXT.emptyStateText);
    this.contactDetailHeading = page.getByRole('heading', { name: UI_TEXT.contactDetailHeading });
    this.closeButton = page.getByRole('button', { name: 'Close' });
  }

  // ---------- Locator dinamis ----------

  /** Baris tabel customer berdasarkan nama (perusahaan atau perorangan). */
  rowFor(customerName: string): Locator {
    return this.page.getByRole('row', { name: new RegExp(escapeRegExp(customerName), 'i') });
  }

  /**
   * Tombol menu aksi di baris tabel.
   * Scoping per baris ini penting: suffix-nya UUID unik per record,
   * jadi menu harus dicari DI DALAM baris target (anti selector basi).
   */
  actionMenuFor(customerName: string): Locator {
    return this.rowFor(customerName).locator('[data-test^="action-menu-"]');
  }

  /**
   * Sel nama yang bisa diklik di baris tabel.
   * Baris personal dibuka lewat sel ini (bukan klik tengah baris).
   */
  nameCellFor(customerName: string): Locator {
    return this.rowFor(customerName).locator('[data-test="customer-name"]');
  }

  detailDialog(customerName: string): Locator {
    return this.page.getByRole('dialog', { name: customerName });
  }

  detailHeading(customerName: string): Locator {
    return this.page.getByRole('heading', { name: customerName });
  }

  // ---------- Aksi halaman ----------

  async goto(): Promise<void> {
    await test.step('Buka halaman Customer', async () => {
      await this.gotoPath(this.customerUrl);
      await this.expectLoaded();
      await this.page.waitForTimeout
    });
  }

  async expectLoaded(): Promise<void> {
    await test.step('Halaman customer termuat', async () => {
      await expect(this.heading).toBeVisible({ timeout: TIMEOUTS.list });
      await expect(this.addButton).toBeVisible({ timeout: TIMEOUTS.dialog });
    });
  }

  async search(customerName: string): Promise<void> {
    await test.step(`Cari customer "${customerName}"`, async () => {
      await this.searchInput.fill(customerName);
      await expect(this.rowFor(customerName)).toBeVisible({ timeout: TIMEOUTS.list });
    });
  }

  async openCreateDialog(): Promise<void> {
    await test.step('Buka dialog Tambah Customer', async () => {
      await this.addButton.click();
      await expect(this.createDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
      await this.page.waitForTimeout(3000); // Tunggu animasi dialog selesai (agar tombol bisa diklik)
    });
  }

  async selectPersonalType(): Promise<void> {
    await test.step('Pilih tipe customer Personal', async () => {
      await this.personalTabButton.click();
      await this.page.waitForTimeout(3000); // Tunggu animasi tab selesai (agar tombol bisa diklik)
      await expect(this.nameInput).toBeVisible({ timeout: TIMEOUTS.dialog });
    });
  }

  async fillCreateForm(data: CustomerData): Promise<void> {
    await test.step(`Isi form customer "${data.companyName}"`, async () => {
      await this.companyInput.fill(data.companyName);
      await this.titleBapakButton.click();
      await this.nameInput.fill(data.contactName);
      await this.positionInput.fill(data.position);
      await this.phoneInput.fill(data.phone);
      await this.emailInput.fill(data.email);
      await this.addressInput.fill(data.address);
    });
  }

  async fillPersonalCreateForm(data: PersonalCustomerData): Promise<void> {
    await test.step(`Isi form customer personal "${data.contactName}"`, async () => {
      await this.titleBapakButton.click();
      await this.nameInput.fill(data.contactName);
      await this.phoneInput.fill(data.phone);
      await this.emailInput.fill(data.email);
      await this.addressInput.fill(data.address);
    });
  }

  async saveAndConfirmCreate(): Promise<void> {
    await test.step('Simpan dan konfirmasi pembuatan customer', async () => {
      await this.saveButton.click();
      await expect(this.createConfirmDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
      await this.confirmButton.click();
      await this.expectToastAppearAndDismiss(this.createSuccessToast, UI_TEXT.customerCreated);
      await this.expectToastAppearAndDismiss(this.createSuccessAddedToast, UI_TEXT.customerSuccessfullyAdded);

      // Kalau backend gagal (mis. 500 "Terjadi kesalahan yang tidak diketahui"),
      // aplikasi menampilkan toast error dan dialog tetap terbuka. Gagal cepat
      // dengan pesan yang jelas ketimbang menunggu 30 detik lalu gagal dengan
      // "dialog still visible" yang tidak menjelaskan apa-apa.
      // isVisible() tidak menunggu: kalau toast error sudah auto-dismiss,
      // alur lanjut ke assertion dialog di bawah seperti biasa.
      if (await this.createErrorToast.first().isVisible()) {
        const errorText = ((await this.createErrorToast.first().textContent()) ?? '').trim();
        throw new Error(`Gagal membuat customer: ${errorText || UI_TEXT.createCustomerFailed}`);
      }

      // Tunggu create benar-benar selesai (dialog tertutup).
      // Tanpa ini, assertion berikutnya balapan dengan request create
      // dan gagal dengan pesan menyesatkan "row not found".
      await expect(this.createDialog).toBeHidden({ timeout: TIMEOUTS.list });
    });
  }

  async expectRowVisible(customerName: string): Promise<void> {
    await test.step(`Baris customer "${customerName}" tampil di tabel`, async () => {
      await expect(this.rowFor(customerName)).toBeVisible({ timeout: TIMEOUTS.list });
    });
  }

  async openEditFor(customerName: string): Promise<void> {
    await test.step(`Buka dialog Edit untuk "${customerName}"`, async () => {
      await this.actionMenuFor(customerName).click();
      await this.editOption.click();
      await expect(this.editDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
    });
  }

  async fillEditForm(data: CustomerData): Promise<void> {
    await test.step(`Ubah form customer menjadi "${data.companyName}"`, async () => {
      await this.companyInput.fill(data.companyName);
      await this.nameInput.fill(data.contactName);
      await this.positionInput.fill(data.position);
      await this.phoneInput.fill(data.phone);
      await this.emailInput.fill(data.email);
      await this.addressInput.fill(data.address);
    });
  }

  async fillPersonalEditForm(data: PersonalCustomerData): Promise<void> {
    await test.step(`Ubah form customer personal menjadi "${data.contactName}"`, async () => {
      await this.nameInput.fill(data.contactName);
      await this.phoneInput.fill(data.phone);
      await this.emailInput.fill(data.email);
      await this.addressInput.fill(data.address);
    });
  }

  async saveEditAndConfirm(): Promise<void> {
    await test.step('Simpan perubahan dan konfirmasi update', async () => {
      await this.saveButton.click();
      await expect(this.updateConfirmDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
      await this.confirmButton.click();
      // Toast dicek di sini (segera setelah confirm), bukan di expectUpdateSuccess:
      // toast keburu auto-dismiss kalau menunggu assertion row dulu.
      await this.expectToastAppearAndDismiss(this.updateSuccessToast, UI_TEXT.customerUpdated);
      await expect(this.editDialog).toBeHidden({ timeout: TIMEOUTS.list });
    });
  }

  async expectUpdateSuccess(customerName: string): Promise<void> {
    await test.step(`Customer "${customerName}" berhasil diperbarui`, async () => {
      // Toast sudah diverifikasi (muncul + hilang) di saveEditAndConfirm,
      // di sini cukup assert state stabil: baris tampil dengan data baru.
      await expect(this.rowFor(customerName)).toBeVisible({ timeout: TIMEOUTS.list });
    });
  }

  async deleteFor(customerName: string): Promise<void> {
    await test.step(`Hapus customer "${customerName}"`, async () => {
      await this.actionMenuFor(customerName).click();
      await this.deleteOption.click();
      await expect(this.deleteConfirmDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
      await this.deleteConfirmButton.click();
      // Toast dicek di sini (segera setelah konfirmasi hapus),
      // sebelum assertion empty-state yang menunggu render tabel.
      await this.expectToastAppearAndDismiss(this.deleteSuccessToast, UI_TEXT.customerDeleted);
    });
  }

  async expectDeleteSuccess(): Promise<void> {
    await test.step('Customer terhapus: tabel kosong', async () => {
      // Toast sudah diverifikasi (muncul + hilang) di deleteFor,
      // di sini cukup assert state stabil: empty state tampil.
      await expect(this.emptyStateHeading).toBeVisible({ timeout: TIMEOUTS.list });
      await expect(this.emptyStateText).toBeVisible();
    });
  }

  async openDetail(customerName: string): Promise<void> {
    await test.step(`Buka detail customer "${customerName}"`, async () => {
      await this.rowFor(customerName).click();
      await expect(this.detailDialog(customerName)).toBeVisible({ timeout: TIMEOUTS.dialog });
    });
  }

  async openPersonalDetail(contactName: string): Promise<void> {
    await test.step(`Buka detail customer personal "${contactName}"`, async () => {
      await this.nameCellFor(contactName).click();
      await expect(this.detailDialog(contactName)).toBeVisible({ timeout: TIMEOUTS.dialog });
    });
  }

  async expectContactDetailVisible(data: CustomerData): Promise<void> {
    await test.step(`Detail kontak "${data.companyName}" sesuai form`, async () => {
      const dialog = this.detailDialog(data.companyName);
      await expect(this.detailHeading(data.companyName)).toBeVisible({ timeout: TIMEOUTS.dialog });
      await expect(dialog.getByText(data.contactName, { exact: true })).toBeVisible();
      await expect(this.contactDetailHeading).toBeVisible();
      await expect(dialog.getByText(data.email)).toBeVisible();
      await expect(dialog.getByText(data.phone)).toBeVisible();
      await expect(dialog.getByText(UI_TEXT.maleGenderLabel)).toBeVisible();
      await expect(dialog.getByText(data.address)).toBeVisible();
    });
  }

  async expectPersonalDetailVisible(data: PersonalCustomerData): Promise<void> {
    await test.step(`Detail kontak personal "${data.contactName}" sesuai form`, async () => {
      const dialog = this.detailDialog(data.contactName);
      await expect(this.detailHeading(data.contactName)).toBeVisible({ timeout: TIMEOUTS.dialog });
      await expect(dialog.getByText(UI_TEXT.personalCustomerBadge)).toBeVisible();
      await expect(this.contactDetailHeading).toBeVisible();
      await expect(dialog.getByText(data.email)).toBeVisible();
      await expect(dialog.getByText(data.phone)).toBeVisible();
      await expect(dialog.getByText(UI_TEXT.maleGenderLabel)).toBeVisible();
      await expect(dialog.getByText(data.address)).toBeVisible();
    });
  }

  async closeDetail(): Promise<void> {
    await test.step('Tutup dialog detail customer', async () => {
      await this.closeButton.click();
    });
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
