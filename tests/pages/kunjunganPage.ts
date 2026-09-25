import { expect, test, type Locator, type Page } from '@playwright/test';
import { ENV, ROUTES, TIMEOUTS } from '../utils/env';
import { UI_TEXT } from '../data/testData';
import type { KunjunganData, KunjunganEditData } from '../types/kunjungan';
import { BasePage } from './base.page';

/**
 * Page Object untuk halaman Kunjungan (/transaksi/kunjungan).
 *
 * Semua interaksi kunjungan (jadwalkan, ubah, selesaikan)
 * wajib lewat method di sini. Spec tidak boleh merakit locator mentah.
 */
export class KunjunganPage extends BasePage {
  private readonly kunjunganUrl = `${ENV.baseUrl}${ROUTES.kunjungan}`;

  readonly addVisitButton: Locator;
  readonly scheduleDialog: Locator;
  readonly customerCombobox: Locator;
  readonly customerSearchInput: Locator;
  readonly locationInput: Locator;
  readonly purposeInput: Locator;
  readonly notesInput: Locator;
  readonly saveButton: Locator;
  readonly saveConfirmDialog: Locator;
  readonly confirmButton: Locator;
  readonly userMenuTrigger: Locator;
  readonly savingToast: Locator;

  readonly table: Locator;
  readonly editDialog: Locator;
  readonly editLocationInput: Locator;
  readonly editPurposeInput: Locator;
  readonly editNotesInput: Locator;
  readonly updateConfirmDialog: Locator;
  readonly updatingToast: Locator;

  readonly completeDialog: Locator;
  readonly getLocationButton: Locator;
  readonly markerButton: Locator;
  readonly resultInput: Locator;
  readonly openCameraText: Locator;
  readonly takePhotoButton: Locator;
  readonly previewImage: Locator;
  readonly completeButton: Locator;
  readonly saveResultConfirmDialog: Locator;
  readonly completedToast: Locator;
  readonly statusDoneText: Locator;

  readonly deleteDialog: Locator;
  readonly deleteConfirmButton: Locator;
  readonly deletedToast: Locator;
  readonly updatedToast: Locator;
  readonly statusPendingText: Locator;

  constructor(page: Page) {
    super(page);
    this.addVisitButton = page.locator('[data-test="btn-add-visit-button"]').first();
    this.scheduleDialog = page.getByRole('dialog', { name: UI_TEXT.scheduleVisitDialog });
    this.customerCombobox = page.getByRole('combobox').filter({ hasText: 'PILIH CUSTOMER...' });
    this.customerSearchInput = page.getByRole('textbox', { name: 'CARI CUSTOMER...' });
    this.locationInput = page.locator('[data-test="visit-location-input"]');
    this.purposeInput = page.getByRole('textbox', { name: 'CONTOH: KIRIM PENAWARAN REVISI' });
    this.notesInput = page.getByRole('textbox', { name: 'TULISKAN AGENDA ATAU CATATAN' });
    this.saveButton = page.getByRole('button', { name: 'Simpan' });
    this.saveConfirmDialog = page.getByRole('alertdialog', { name: UI_TEXT.saveVisitConfirm });
    this.confirmButton = page.locator('[data-test="confirm-button"]');
    this.userMenuTrigger = page.locator('[data-test="btn-dropdown-trigger"]');
    this.savingToast = page.getByText(UI_TEXT.visitSaving);

    this.table = page.getByRole('table');
    this.editDialog = page.getByRole('dialog', { name: UI_TEXT.editVisitDialog });
    this.editLocationInput = page.getByRole('textbox', { name: 'Contoh: Kantor Pusat PT. ABC' });
    this.editPurposeInput = page.getByRole('textbox', { name: 'TUJUAN' });
    this.editNotesInput = page.getByRole('textbox', { name: 'Catatan / Agenda' });
    this.updateConfirmDialog = page.getByRole('alertdialog', { name: UI_TEXT.updateVisitConfirm });
    this.updatingToast = page.getByText(UI_TEXT.visitUpdating);

    this.completeDialog = page.getByRole('dialog', { name: UI_TEXT.completeVisitDialog });
    this.getLocationButton = page.getByRole('button', { name: 'Ambil Lokasi Saya' });
    this.markerButton = page.getByRole('button', { name: 'Marker' });
    this.resultInput = page.getByRole('textbox', { name: 'Hasil Kunjungan *' });
    this.openCameraText = page.getByText('Buka KameraAmbil foto bukti');
    this.takePhotoButton = page.getByRole('button', { name: 'Ambil Foto' });
    this.previewImage = page.getByRole('img', { name: 'Preview' });
    this.completeButton = page.getByRole('button', { name: 'Selesaikan' });
    this.saveResultConfirmDialog = page.getByRole('alertdialog', {
      name: UI_TEXT.saveVisitResultConfirm,
    });
    this.completedToast = page.getByText(UI_TEXT.visitCompleted);
    this.statusDoneText = page.getByRole('table').getByText(UI_TEXT.visitStatusDone);

    this.deleteDialog = page.getByRole('alertdialog', { name: UI_TEXT.deleteVisitConfirm });
    this.deleteConfirmButton = page.getByRole('button', { name: UI_TEXT.deleteCustomerConfirmButton });
    this.deletedToast = page.getByText(UI_TEXT.visitDeleted);
    this.updatedToast = page.getByText(UI_TEXT.visitUpdated);
    this.statusPendingText = page.getByRole('table').getByText(UI_TEXT.visitStatusPending);
  }

  /** Opsi customer di dropdown berdasarkan nama. */
  optionFor(customerName: string): Locator {
    return this.page.getByText(customerName, { exact: true });
  }

  /** Baris tabel kunjungan yang memuat teks tertentu (customer / lokasi). */
  rowContaining(text: string): Locator {
    return this.page.getByRole('row', { name: new RegExp(escapeRegExp(text), 'i') });
  }

  rowFirstContaining(text: string): Locator {
    return this.page.getByText(text).first()
  }
  /** Tombol dropdown aksi di dalam baris tabel target. */
  actionMenuFor(rowText: string): Locator {
    return this.rowContaining(rowText).locator('[data-test="btn-dropdown-trigger"]');
  }

  /** Item menu aksi (Edit / Selesaikan) berdasarkan nama. */
  menuItem(name: string): Locator {
    return this.page.getByRole('menuitem', { name });
  }

  async goto(): Promise<void> {
    await test.step('Buka halaman Kunjungan', async () => {
      await this.gotoPath(this.kunjunganUrl);
      await this.expectLoaded();
    });
  }

  async expectLoaded(): Promise<void> {
    await test.step('Halaman kunjungan termuat', async () => {
      await expect(this.userMenuTrigger).toBeVisible({ timeout: TIMEOUTS.list });
      await expect(this.addVisitButton).toBeVisible({ timeout: TIMEOUTS.dialog });
    });
  }

  async openScheduleDialog(): Promise<void> {
    await test.step('Buka dialog Jadwalkan Kunjungan', async () => {
      await this.addVisitButton.click();
      await expect(this.scheduleDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
    });
  }

  async selectCustomer(customerName: string): Promise<void> {
    await test.step(`Pilih customer "${customerName}"`, async () => {
      await this.customerCombobox.click();
      await this.customerSearchInput.fill(customerName);
      await this.optionFor(customerName).click();
      await expect(this.scheduleDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
    });
  }

  /**
   * Isi form jadwal kunjungan. Lokasi dibuat unik per run (base + 3 angka
   * acak) agar tidak konflik duplikat antar run. Mengembalikan lokasi
   * aktual yang diisi supaya spec bisa memakainya di step berikutnya.
   */
  async fillVisitForm(data: Pick<KunjunganData, 'location' | 'purpose' | 'notes'>): Promise<string> {
    const location = uniqueLocation(data.location);
    await test.step(`Isi form jadwal kunjungan di "${location}"`, async () => {
      await this.locationInput.fill(location);
      await this.purposeInput.fill(data.purpose);
      await this.notesInput.fill(data.notes);
    });
    return location;
  }

  async saveAndConfirm(): Promise<void> {
    await test.step('Simpan dan konfirmasi kunjungan', async () => {
      await this.saveButton.click();
      await expect(this.saveConfirmDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
      await this.confirmButton.click();
    });
  }

  async expectSaveSuccess(): Promise<void> {
    await test.step('Kunjungan tersimpan: kembali ke daftar', async () => {
      await expect(this.userMenuTrigger).toBeVisible({ timeout: TIMEOUTS.list });
    });
  }

  /** Alur lengkap menjadwalkan satu kunjungan. Mengembalikan lokasi aktual. */
  async scheduleVisit(data: KunjunganData): Promise<string> {
    await this.openScheduleDialog();
    await this.selectCustomer(data.customerName);
    const location = await this.fillVisitForm(data);
    await this.saveAndConfirm();
    await this.expectSaveSuccess();
    return location;
  }

  async openEditFor(rowText: string): Promise<void> {
    await test.step(`Buka dialog Edit untuk "${rowText}"`, async () => {
      await expect(this.rowFirstContaining('Admin')).toBeVisible({ timeout: TIMEOUTS.list });
      await this.rowFirstContaining('Admin').click();
      await expect(this.rowContaining(rowText)).toBeVisible({ timeout: TIMEOUTS.list });
      await this.actionMenuFor(rowText).click();
      await this.menuItem('Edit').click();
      await expect(this.editDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
    });
  }

  /**
   * Ubah form jadwal kunjungan. Lokasi edit juga dibuat unik per run
   * (base + 3 angka acak). Mengembalikan lokasi aktual yang diisi.
   */
  async fillEditForm(data: KunjunganEditData): Promise<string> {
    const location = uniqueLocation(data.location);
    await test.step(`Ubah form jadwal kunjungan menjadi "${location}"`, async () => {
      await this.editLocationInput.fill(location);
      await this.editPurposeInput.fill(data.purpose);
      await this.editNotesInput.fill(data.notes);
    });
    return location;
  }

  async saveEditAndConfirm(): Promise<void> {
    await test.step('Simpan perubahan dan konfirmasi update', async () => {
      await this.saveButton.click();
      await expect(this.updateConfirmDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
      await this.confirmButton.click();
    });
  }

  async expectEditSuccess(location: string, purpose: string): Promise<void> {
    await test.step('Perubahan kunjungan tersimpan di tabel', async () => {
      await expect(this.rowContaining(location)).toBeVisible({ timeout: TIMEOUTS.list });
      await expect(this.table.getByText(location)).toBeVisible({ timeout: TIMEOUTS.list });
      await expect(this.page.getByRole('cell', { name: purpose })).toBeVisible({
        timeout: TIMEOUTS.list,
      });
    });
  }

  async openCompleteFor(rowText: string): Promise<void> {
    await test.step(`Buka dialog Selesaikan untuk "${rowText}"`, async () => {
      await expect(this.rowContaining(rowText)).toBeVisible({ timeout: TIMEOUTS.list });
      await this.actionMenuFor(rowText).click();
      await expect(this.menuItem('Edit')).toBeVisible({ timeout: TIMEOUTS.dialog });
      await this.menuItem('Selesaikan').click();
      await expect(this.completeDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
    });
  }

  async fillCompleteForm(result: string): Promise<void> {
    await test.step('Isi form penyelesaian kunjungan', async () => {
      await this.getLocationButton.click();
      await expect(this.markerButton).toBeVisible({ timeout: TIMEOUTS.list });
      await this.resultInput.fill(result);
      await this.openCameraText.click();
      await this.takePhotoButton.click();
      await expect(this.previewImage).toBeVisible({ timeout: TIMEOUTS.list });
    });
  }

  async saveCompleteAndConfirm(): Promise<void> {
    await test.step('Simpan hasil dan konfirmasi penyelesaian', async () => {
      await this.completeButton.click();
      await expect(this.saveResultConfirmDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
      await this.confirmButton.click();
    });
  }

  async expectCompleteSuccess(rowText: string): Promise<void> {
    await test.step('Kunjungan selesai: status tampil di tabel', async () => {
      await expect(this.rowContaining(rowText)).toBeVisible({ timeout: TIMEOUTS.list });
      await expect(this.statusDoneText.first()).toBeVisible({ timeout: TIMEOUTS.list });
    });
  }

  async openDeleteFor(rowText: string): Promise<void> {
    await test.step(`Buka dialog Hapus untuk "${rowText}"`, async () => {
      await expect(this.rowFirstContaining('Admin')).toBeVisible({ timeout: TIMEOUTS.list });
      await this.rowFirstContaining('Admin').click();
      await expect(this.rowContaining(rowText)).toBeVisible({ timeout: TIMEOUTS.list });
      await this.actionMenuFor(rowText).click();
      await expect(this.menuItem('Edit')).toBeVisible({ timeout: TIMEOUTS.dialog });
      await this.menuItem('Hapus').click();
      await expect(this.deleteDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
    });
  }

  async confirmDelete(): Promise<void> {
    await test.step('Konfirmasi hapus kunjungan', async () => {
      await this.deleteConfirmButton.click();
      await this.expectToastAppearAndDismiss(this.deletedToast, UI_TEXT.visitDeleted);
    });
  }

  async expectDeleteSuccess(deletedLocation: string): Promise<void> {
    await test.step('Kunjungan terhapus: data hilang dari tabel', async () => {
      await expect(this.rowContaining(deletedLocation)).toBeHidden({ timeout: TIMEOUTS.list });
    });
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Tambahkan 3 angka unik (100-999) ke base lokasi agar berbeda tiap run.
 * Contoh: "PT Abc" -> "PT Abc 482".
 */
export function uniqueLocation(baseLocation: string): string {
  const suffix = Math.floor(100 + Math.random() * 900).toString();
  return `${baseLocation} ${suffix}`;
}
