import { expect, test, type Locator, type Page } from '@playwright/test';
import { ENV, ROUTES, TIMEOUTS } from '../utils/env';
import { UI_TEXT } from '../data/testData';
import type { ActivityData, ActivityEditData } from '../types/activity';
import { BasePage } from './base.page';

/**
 * Page Object untuk halaman Activity (/transaksi/aktivitas).
 *
 * Semua interaksi activity (tambah, ubah, hapus)
 * wajib lewat method di sini. Spec tidak boleh merakit locator mentah.
 */
export class ActivityPage extends BasePage {
  private readonly activityUrl = `${ENV.baseUrl}${ROUTES.aktivitas}`;

  readonly heading: Locator;
  readonly table: Locator;
  readonly adminGroup: Locator;
  readonly addActivityButton: Locator;
  readonly createDialog: Locator;
  readonly customerCombobox: Locator;
  readonly customerSearchInput: Locator;
  readonly subjectInput: Locator;
  readonly typeCombobox: Locator;
  readonly statusCombobox: Locator;
  readonly saveButton: Locator;
  readonly saveConfirmDialog: Locator;
  readonly confirmButton: Locator;
  readonly savedToast: Locator;

  readonly editDialog: Locator;
  readonly editSubjectInput: Locator;
  readonly editNotesInput: Locator;
  readonly updateConfirmDialog: Locator;
  readonly updatedToast: Locator;

  readonly deleteDialog: Locator;
  readonly deleteConfirmButton: Locator;
  readonly deletedToast: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Transaksi Aktivitas' });
    this.table = page.locator('[data-test="table-aktivitas"]');
    this.adminGroup = this.table.getByText('Admin');
    this.addActivityButton = page.locator('[data-test="btn-add-activity-top"]').first();
    this.createDialog = page.getByRole('dialog', { name: UI_TEXT.addActivityDialog });
    this.customerCombobox = page.getByRole('combobox').filter({ hasText: 'PILIH CUSTOMER...' });
    this.customerSearchInput = page.getByRole('textbox', { name: 'CARI CUSTOMER...' });
    this.subjectInput = page.getByRole('textbox', { name: 'CONTOH: MEETING DENGAN PAK' });
    this.typeCombobox = page.getByRole('combobox').filter({ hasText: 'PILIH TIPE' });
    this.statusCombobox = page.getByRole('combobox').filter({ hasText: 'PILIH STATUS' });
    this.saveButton = page.getByRole('button', { name: 'Simpan' });
    this.saveConfirmDialog = page.getByRole('alertdialog', { name: UI_TEXT.saveActivityConfirm });
    this.confirmButton = page.locator('[data-test="confirm-button"]');
    this.savedToast = page.getByText(UI_TEXT.activitySaved);

    this.editDialog = page.getByRole('dialog', { name: UI_TEXT.editActivityDialog });
    this.editSubjectInput = page.getByRole('textbox', { name: 'Subjek / Judul' });
    this.editNotesInput = page.getByRole('textbox', { name: 'Detail & Catatan' });
    this.updateConfirmDialog = page.getByRole('alertdialog', { name: UI_TEXT.updateActivityConfirm });
    this.updatedToast = page.getByText(UI_TEXT.activityUpdated);

    this.deleteDialog = page.getByRole('alertdialog', { name: UI_TEXT.deleteActivityConfirm });
    this.deleteConfirmButton = page.getByRole('button', { name: UI_TEXT.deleteActivityConfirmButton });
    this.deletedToast = page.getByText(UI_TEXT.activityDeleted);
  }

  /** Opsi dropdown (customer / tipe / status) berdasarkan nama. */
  optionFor(name: string): Locator {
    return this.page.getByText(name, { exact: true });
  }

  /** Opsi combobox berdasarkan role option (lebih ketat untuk tipe/status). */
  optionByRole(name: string): Locator {
    return this.page.getByRole('option', { name });
  }

  /** Baris tabel activity yang memuat teks tertentu (customer / subjek). */
  rowContaining(text: string): Locator {
    return this.page.getByRole('row', { name: new RegExp(escapeRegExp(text), 'i') });
  }

  rowFirstContaining(text: string): Locator {
    return this.page.getByText(text).first();
  }

  /** Tombol dropdown aksi di dalam baris tabel target. */
  actionMenuFor(rowText: string): Locator {
    return this.rowContaining(rowText).locator('[data-test="btn-dropdown-trigger"]');
  }

  /** Item menu aksi (Edit / Hapus) berdasarkan nama. */
  menuItem(name: string): Locator {
    return this.page.getByRole('menuitem', { name });
  }

  async goto(): Promise<void> {
    await test.step('Buka halaman Activity', async () => {
      await this.gotoPath(this.activityUrl);
      await this.expectLoaded();
    });
  }

  async expectLoaded(): Promise<void> {
    await test.step('Halaman activity termuat', async () => {
      await expect(this.heading).toBeVisible({ timeout: TIMEOUTS.list });
      await expect(this.addActivityButton).toBeVisible({ timeout: TIMEOUTS.dialog });
    });
  }

  async openCreateDialog(): Promise<void> {
    await test.step('Buka dialog Tambah Aktivitas', async () => {
      await this.addActivityButton.click();
      await expect(this.createDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
    });
  }

  async selectCustomer(customerName: string): Promise<void> {
    await test.step(`Pilih customer "${customerName}"`, async () => {
      await this.customerCombobox.click();
      await this.customerSearchInput.fill(customerName);
      await this.optionFor(customerName).click();
      await expect(this.createDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
    });
  }

  async selectType(type: string): Promise<void> {
    await test.step(`Pilih tipe "${type}"`, async () => {
      await this.typeCombobox.click();
      await expect(this.optionByRole(type)).toBeVisible({ timeout: TIMEOUTS.dialog });
      await this.optionFor(type).click();
      await expect(this.createDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
    });
  }

  async selectStatus(status: string): Promise<void> {
    await test.step(`Pilih status "${status}"`, async () => {
      await this.statusCombobox.click();
      await expect(this.optionByRole(status)).toBeVisible({ timeout: TIMEOUTS.dialog });
      // Pending muncul di banyak tempat (filter tabel, dsb),
      // jadi klik option yang terlihat di dalam dropdown aktif.
      await this.optionByRole(status).click();
      await expect(this.createDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
    });
  }

  /**
   * Isi form tambah activity. Subjek dibuat unik per run (base + 3 angka
   * acak) agar tidak konflik duplikat antar run. Mengembalikan subjek
   * aktual yang diisi supaya spec bisa memakainya di step berikutnya.
   */
  async fillCreateForm(data: Pick<ActivityData, 'subject'>): Promise<string> {
    const subject = uniqueSubject(data.subject);
    await test.step(`Isi subjek activity "${subject}"`, async () => {
      await this.subjectInput.fill(subject);
    });
    return subject;
  }

  async saveAndConfirm(): Promise<void> {
    await test.step('Simpan dan konfirmasi activity', async () => {
      await this.saveButton.click();
      await expect(this.saveConfirmDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
      await this.confirmButton.click();
      await this.expectToastAppearAndDismiss(this.savedToast, UI_TEXT.activitySaved);
    });
  }

  async expectSaveSuccess(subject: string): Promise<void> {
    await test.step('Activity tersimpan: subjek tampil di tabel', async () => {
      // Halaman awal adalah ringkasan per sales (Tanggal | Sales | Rencana ...),
      // jadi drill-down dulu via baris "Admin" sebelum mencari subjek.
      await this.expandAdminGroup();
      await expect(this.rowContaining(subject)).toBeVisible({ timeout: TIMEOUTS.list });
    });
  }

  /** Alur lengkap membuat satu activity. Mengembalikan subjek aktual. */
  async createActivity(data: ActivityData): Promise<string> {
    await this.openCreateDialog();
    await this.selectCustomer(data.customerName);
    const subject = await this.fillCreateForm(data);
    await this.selectType(data.type);
    await this.selectStatus(data.status);
    await this.saveAndConfirm();
    await this.expectSaveSuccess(subject);
    return subject;
  }

  /** Grup tabel dikelompokkan per sales ("Admin"); expand dulu bila collapsed. */
  private async expandAdminGroup(): Promise<void> {
    await expect(this.adminGroup.first()).toBeVisible({ timeout: TIMEOUTS.list });
    // Klik grup hanya kalau baris target belum terlihat (hindari collapse ulang).
    // Spec selalu memanggil ini sebelum mencari row, jadi aman dan idempoten.
    await this.adminGroup.first().click();
  }

  async openEditFor(rowText: string): Promise<void> {
    await test.step(`Buka dialog Edit untuk "${rowText}"`, async () => {
      await this.expandAdminGroup();
      await expect(this.rowContaining(rowText)).toBeVisible({ timeout: TIMEOUTS.list });
      await this.actionMenuFor(rowText).click();
      await this.menuItem('Edit').click();
      await expect(this.editDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
    });
  }

  /**
   * Ubah form edit activity. Subjek edit juga dibuat unik per run
   * (base + 3 angka acak). Mengembalikan subjek aktual yang diisi.
   */
  async fillEditForm(data: ActivityEditData): Promise<string> {
    const subject = uniqueSubject(data.subject);
    await test.step(`Ubah form activity menjadi "${subject}"`, async () => {
      await this.editSubjectInput.fill(subject);
      await this.editNotesInput.fill(data.detail);
    });
    return subject;
  }

  async saveEditAndConfirm(): Promise<void> {
    await test.step('Simpan perubahan dan konfirmasi update', async () => {
      await this.saveButton.click();
      await expect(this.updateConfirmDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
      await this.confirmButton.click();
      await this.expectToastAppearAndDismiss(this.updatedToast, UI_TEXT.activityUpdated);
    });
  }

  async expectEditSuccess(subject: string): Promise<void> {
    await test.step('Perubahan activity tersimpan di tabel', async () => {
      await expect(this.page.getByRole('table').getByText(subject)).toBeVisible({
        timeout: TIMEOUTS.list,
      });
    });
  }

  async openDeleteFor(rowText: string): Promise<void> {
    await test.step(`Buka dialog Hapus untuk "${rowText}"`, async () => {
      await this.expandAdminGroup();
      await expect(this.rowContaining(rowText)).toBeVisible({ timeout: TIMEOUTS.list });
      await this.actionMenuFor(rowText).click();
      await expect(this.menuItem('Edit')).toBeVisible({ timeout: TIMEOUTS.dialog });
      await this.menuItem('Hapus').click();
      await expect(this.deleteDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
    });
  }

  async confirmDelete(): Promise<void> {
    await test.step('Konfirmasi hapus activity', async () => {
      await this.deleteConfirmButton.click();
      await this.expectToastAppearAndDismiss(this.deletedToast, UI_TEXT.activityDeleted);
    });
  }

  async expectDeleteSuccess(deletedSubject: string): Promise<void> {
    await test.step('Activity terhapus: data hilang dari tabel', async () => {
      await expect(this.rowContaining(deletedSubject)).toBeHidden({ timeout: TIMEOUTS.list });
    });
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Tambahkan 3 angka unik (100-999) ke base subjek agar berbeda tiap run.
 * Contoh: "MEETING" -> "MEETING 482".
 */
export function uniqueSubject(baseSubject: string): string {
  const suffix = Math.floor(100 + Math.random() * 900).toString();
  return `${baseSubject} ${suffix}`;
}
