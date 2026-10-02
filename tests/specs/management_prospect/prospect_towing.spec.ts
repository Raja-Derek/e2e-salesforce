import { expect, test } from '../../fixtures/app.fixtures';
import {
  DATA_PROSPECT_DEREK,
  DATA_PROSPECT_DEREK_DEALS,
  DATA_PROSPECT_DEREK_EDIT,
} from '../../data/testData';
import { PROSPECT_DEREK_META } from '../../pages/prospect/locators';
import { STORAGE_STATE, TIMEOUTS } from '../../utils/env';

// Auth sekali via global-setup, tidak perlu login manual per test.
test.use({ storageState: STORAGE_STATE.admin });

test.describe.serial('Prospect Towing', { tag: '@prospect-towing' }, () => {
  // Judul dibuat unik per run oleh fillTowingCreateForm / fillTowingEditForm
  // (base + 3 angka acak). Disimpan di sini agar test serial
  // berikutnya (edit, update status) memakai judul aktual yang sama.
  let title: string = DATA_PROSPECT_DEREK.title;
  let editedTitle: string = DATA_PROSPECT_DEREK_EDIT.title;

  test.beforeEach(async ({ prospectPage }) => {
    await prospectPage.goto();
  });

  test('membuat prospect organisasi Towing lalu verifikasi tersimpan', async ({ prospectPage }) => {
    await prospectPage.openCreateDialog();
    await prospectPage.selectOrg('derek');
    await prospectPage.selectCustomer('derek');
    await prospectPage.selectProduct('derek');
    title = await prospectPage.fillTowingCreateForm(DATA_PROSPECT_DEREK);
    await prospectPage.pickTanggal(DATA_PROSPECT_DEREK.dateLabel);
    await prospectPage.saveAndConfirm();
    await prospectPage.expectCreateSuccess(title, 'derek');
  });

  test('mengedit prospect organisasi Towing lalu verifikasi tersimpan', async ({ prospectPage }) => {
    await prospectPage.openOrgTab('derek');
    await prospectPage.searchCompany('Towing Auto');
    await expect(prospectPage.rowContaining(title)).toBeVisible({ timeout: TIMEOUTS.list });
    await prospectPage.openDetailByTitle(title);
    await prospectPage.openEdit();
    await prospectPage.selectProductInEdit(PROSPECT_DEREK_META.productEditOptionName);
    editedTitle = await prospectPage.fillTowingEditForm(DATA_PROSPECT_DEREK_EDIT);
    await prospectPage.saveEditAndConfirm();
    await prospectPage.expectTowingEditSuccess(
      editedTitle,
      DATA_PROSPECT_DEREK_EDIT.amountText,
      DATA_PROSPECT_DEREK_EDIT.vehicleText,
    );
  });

  test('update status prospect Towing ke deals lalu verifikasi tersimpan', async ({ prospectPage }) => {
    await prospectPage.openOrgTab('derek');
    await prospectPage.searchCompany('Towing Auto');
    await expect(prospectPage.rowContaining(editedTitle)).toBeVisible({ timeout: TIMEOUTS.list });
    await prospectPage.openDetailByTitle(editedTitle);
    await prospectPage.openUpdateStatus();
    await prospectPage.chooseStatusDeals();
    await prospectPage.selectReceiptCity(PROSPECT_DEREK_META.receiptCityName);
    // Nomor kwitansi digenerate otomatis (DDMM + 3 angka acak, mis. 2609123).
    await prospectPage.fillReceipt(
      DATA_PROSPECT_DEREK_DEALS,
      DATA_PROSPECT_DEREK_DEALS.receiptDateLabel,
    );
    await prospectPage.saveStatusAndConfirm();
    await prospectPage.expectDealsSuccess();
  });

  test('hapus prospect Towing lalu verifikasi data hilang', async ({ prospectPage }) => {
    await prospectPage.openOrgTab('derek');
    await prospectPage.searchCompany('Towing Auto');
    await expect(prospectPage.rowContaining(editedTitle)).toBeVisible({ timeout: TIMEOUTS.list });
    await prospectPage.openDetailByTitle(editedTitle);
    // Status Deals tidak bisa langsung dihapus: kembalikan ke Kunjungan dulu.
    await prospectPage.revertStatusToKunjungan();
    await prospectPage.openDelete();
    await prospectPage.confirmDelete();
    await prospectPage.expectDeleteSuccess(editedTitle, 'derek');
  });
});
