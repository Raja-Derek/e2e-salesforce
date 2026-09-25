import { test } from '../../fixtures/app.fixtures';
import { DATA_KUNJUNGAN, DATA_KUNJUNGAN_EDIT } from '../../data/testData';
import { STORAGE_STATE } from '../../utils/env';

// Auth sekali via global-setup, tidak perlu login manual per test.
test.use({ storageState: STORAGE_STATE.admin });

test.describe.serial('Kunjungan', { tag: '@kunjungan' }, () => {
  // Lokasi dibuat unik per run oleh fillVisitForm / fillEditForm
  // (base + 3 angka acak). Disimpan di sini agar test serial
  // berikutnya (edit, hapus) memakai lokasi aktual yang sama.
  let visitLocation: string = DATA_KUNJUNGAN.location;
  let editedLocation: string = DATA_KUNJUNGAN_EDIT.location;

  test.beforeEach(async ({ kunjunganPage }) => {
    await kunjunganPage.goto();
  });

  test('menjadwalkan kunjungan baru lalu verifikasi tersimpan', async ({ kunjunganPage }) => {
    await kunjunganPage.openScheduleDialog();
    await kunjunganPage.selectCustomer(DATA_KUNJUNGAN.customerName);
    visitLocation = await kunjunganPage.fillVisitForm(DATA_KUNJUNGAN);
    await kunjunganPage.saveAndConfirm();
    await kunjunganPage.expectSaveSuccess();
  });

  test('mengedit jadwal kunjungan lalu verifikasi tersimpan', async ({ kunjunganPage }) => {
    await kunjunganPage.openEditFor(visitLocation);
    editedLocation = await kunjunganPage.fillEditForm(DATA_KUNJUNGAN_EDIT);
    await kunjunganPage.saveEditAndConfirm();
    await kunjunganPage.expectEditSuccess(editedLocation, DATA_KUNJUNGAN_EDIT.purpose);
  });

  test('menghapus kunjungan lalu verifikasi data hilang', async ({ kunjunganPage }) => {
    await kunjunganPage.openDeleteFor(editedLocation);
    await kunjunganPage.confirmDelete();
    await kunjunganPage.expectDeleteSuccess(editedLocation);
  });
});
