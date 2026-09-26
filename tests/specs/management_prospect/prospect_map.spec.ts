import { expect, test } from '../../fixtures/app.fixtures';
import {
  DATA_PROSPECT_MAP,
  DATA_PROSPECT_MAP_DEALS,
  DATA_PROSPECT_MAP_EDIT,
} from '../../data/testData';
import { STORAGE_STATE, TIMEOUTS } from '../../utils/env';

// Auth sekali via global-setup, tidak perlu login manual per test.
test.use({ storageState: STORAGE_STATE.admin });

test.describe.serial('Prospect MAP', { tag: '@prospect-map' }, () => {
  // Judul dibuat unik per run oleh fillCreateForm / fillEditForm
  // (base + 3 angka acak). Disimpan di sini agar test serial
  // berikutnya (edit, update status) memakai judul aktual yang sama.
  let title: string = DATA_PROSPECT_MAP.title;
  let editedTitle: string = DATA_PROSPECT_MAP_EDIT.title;

  test.beforeEach(async ({ prospectPage }) => {
    await prospectPage.goto();
  });

  test('membuat prospect organisasi MAP lalu verifikasi tersimpan', async ({ prospectPage }) => {
    await prospectPage.openCreateDialog();
    await prospectPage.selectOrg('map');
    await prospectPage.selectCustomer('map');
    await prospectPage.pickPeriodeAwal(DATA_PROSPECT_MAP.startDateLabel);
    await prospectPage.pickPeriodeAkhir(DATA_PROSPECT_MAP.endDateLabel);
    await prospectPage.selectCategory('map');
    await prospectPage.selectProduct('map');
    title = await prospectPage.fillCreateForm(DATA_PROSPECT_MAP);
    await prospectPage.pickTargetClosing(DATA_PROSPECT_MAP.dueDateLabel);
    await prospectPage.saveAndConfirm();
    await prospectPage.expectCreateSuccess(title, 'map');
  });

  test('mengedit prospect organisasi MAP lalu verifikasi tersimpan', async ({ prospectPage }) => {
    await prospectPage.openOrgTab('map');
    await prospectPage.searchCompany('Auto');
    await expect(prospectPage.rowContaining(title)).toBeVisible({ timeout: TIMEOUTS.list });
    await prospectPage.openDetailByTitle(title);
    await prospectPage.openEdit();
    editedTitle = await prospectPage.fillEditForm(DATA_PROSPECT_MAP_EDIT);
    await prospectPage.saveEditAndConfirm();
    await prospectPage.expectEditSuccess(
      editedTitle,
      DATA_PROSPECT_MAP_EDIT.amountText,
      DATA_PROSPECT_MAP_EDIT.periodText,
    );
  });

  test('update status prospect MAP ke deals lalu verifikasi tersimpan', async ({ prospectPage }) => {
    await prospectPage.openOrgTab('map');
    await prospectPage.searchCompany('Auto');
    await expect(prospectPage.rowContaining(editedTitle)).toBeVisible({ timeout: TIMEOUTS.list });
    await prospectPage.openDetailByTitle(editedTitle);
    await prospectPage.openUpdateStatus();
    await prospectPage.chooseStatusDeals();
    // Nomor kwitansi digenerate otomatis (DDMM + 3 angka acak, mis. 2609123).
    await prospectPage.fillReceipt(
      DATA_PROSPECT_MAP_DEALS,
      DATA_PROSPECT_MAP_DEALS.receiptDateLabel,
    );
    await prospectPage.saveStatusAndConfirm();
    await prospectPage.expectDealsSuccess();
  });

  test('hapus prospect MAP lalu verifikasi data hilang', async ({ prospectPage }) => {
    await prospectPage.openOrgTab('map');
    await prospectPage.searchCompany('Auto');
    await expect(prospectPage.rowContaining(editedTitle)).toBeVisible({ timeout: TIMEOUTS.list });
    await prospectPage.openDetailByTitle(editedTitle);
    // Status Deals tidak bisa langsung dihapus: kembalikan ke Kunjungan dulu.
    await prospectPage.revertStatusToKunjungan();
    await prospectPage.openDelete();
    await prospectPage.confirmDelete();
    await prospectPage.expectDeleteSuccess(editedTitle, 'map');
  });
});
