import { test } from '../../fixtures/app.fixtures';
import { DATA_AKTIVITAS, DATA_AKTIVITAS_EDIT } from '../../data/testData';
import { STORAGE_STATE } from '../../utils/env';

// Auth sekali via global-setup, tidak perlu login manual per test.
test.use({ storageState: STORAGE_STATE.admin });

test.describe.serial('Activity', { tag: '@activity' }, () => {
  // Subjek dibuat unik per run oleh fillCreateForm / fillEditForm
  // (base + 3 angka acak). Disimpan di sini agar test serial
  // berikutnya (edit, hapus) memakai subjek aktual yang sama.
  let subject: string = DATA_AKTIVITAS.subject;
  let editedSubject: string = DATA_AKTIVITAS_EDIT.subject;

  test.beforeEach(async ({ activityPage }) => {
    await activityPage.goto();
  });

  test('membuat activity baru lalu verifikasi tersimpan', async ({ activityPage }) => {
    await activityPage.openCreateDialog();
    await activityPage.selectCustomer(DATA_AKTIVITAS.customerName);
    subject = await activityPage.fillCreateForm(DATA_AKTIVITAS);
    await activityPage.selectType(DATA_AKTIVITAS.type);
    await activityPage.selectStatus(DATA_AKTIVITAS.status);
    await activityPage.saveAndConfirm();
    await activityPage.expectSaveSuccess(subject);
  });

  test('mengedit activity lalu verifikasi tersimpan', async ({ activityPage }) => {
    await activityPage.openEditFor(subject);
    editedSubject = await activityPage.fillEditForm(DATA_AKTIVITAS_EDIT);
    await activityPage.saveEditAndConfirm();
    await activityPage.expectEditSuccess(editedSubject);
  });

  test('menghapus activity lalu verifikasi data hilang', async ({ activityPage }) => {
    await activityPage.openDeleteFor(editedSubject);
    await activityPage.confirmDelete();
    await activityPage.expectDeleteSuccess(editedSubject);
  });
});
