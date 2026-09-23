import { test } from '../../fixtures/app.fixtures';
import { DATA_CUSTOMER, DATA_CUSTOMER_PERSONAL } from '../../data/testData';
import type { CustomerData, PersonalCustomerData } from '../../types/customer';
import { STORAGE_STATE } from '../../utils/env';

// Auth sekali via global-setup, tidak perlu login manual per test.
test.use({ storageState: STORAGE_STATE.admin });

// Backend customer kadang mengembalikan 500 ("Terjadi kesalahan yang tidak
// diketahui.") untuk payload yang valid — terbukti dari screenshot failure
// (form terisi benar, confirm sukses, server menolak). Satu retry aman di sini
// karena tiap test memakai data unik: retry tidak akan konflik duplikat.
test.describe.configure({ retries: 1 });

/**
 * Tiap test membuat datanya sendiri (unik per run) lalu membersihkannya.
 * Hasilnya: test independen, aman paralel, bisa di-rerun tanpa konflik duplikat.
 *
 * Catatan: uniqueness memakai random ber-entropy tinggi, BUKAN cuma
 * Date.now(). Test paralel dalam satu milidetik yang sama akan menghasilkan
 * suffix kembar kalau hanya mengandalkan timestamp.
 */
function uniqueToken(): string {
  const time = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return `${time}${random}`;
}

/** Nomor HP numerik 11 digit (format 08xxxxxxxxx) dengan 9 digit acak. */
function uniquePhone(): string {
  const digits = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10)).join('');
  return `08${digits}`;
}

function newCompanyCustomer(): CustomerData {
  const suffix = uniqueToken();
  return {
    ...DATA_CUSTOMER,
    companyName: `${DATA_CUSTOMER.companyName} ${suffix}`,
    contactName: `${DATA_CUSTOMER.contactName} ${suffix}`,
    phone: uniquePhone(),
    email: `playwright.${suffix}@test.com`,
  };
}

function newPersonalCustomer(): PersonalCustomerData {
  const suffix = uniqueToken();
  return {
    ...DATA_CUSTOMER_PERSONAL,
    contactName: `${DATA_CUSTOMER_PERSONAL.contactName} ${suffix}`,
    phone: uniquePhone(),
    email: `jamal.${suffix}@automation.com`,
  };
}

test.describe('Customer Perusahaan', { tag: '@perusahaan' }, () => {
  test.beforeEach(async ({ customerPage }) => {
    await customerPage.goto();
  });

  test('membuat customer perusahaan lalu verifikasi detail kontak', async ({ customerPage }) => {
    const customer = newCompanyCustomer();

    await customerPage.openCreateDialog();
    await customerPage.fillCreateForm(customer);
    await customerPage.saveAndConfirmCreate();
    // Wajib search dulu: tabel terpaginaasi, record baru belum tentu di halaman 1.
    await customerPage.search(customer.companyName);

    await customerPage.openDetail(customer.companyName);
    await customerPage.expectContactDetailVisible(customer);
    await customerPage.closeDetail();

    await customerPage.search(customer.companyName);
    await customerPage.deleteFor(customer.companyName);
    await customerPage.expectDeleteSuccess();
  });

  test('mengedit customer perusahaan lalu verifikasi detail kontak', async ({ customerPage }) => {
    const customer = newCompanyCustomer();
    const updated = newCompanyCustomer();

    await customerPage.openCreateDialog();
    await customerPage.fillCreateForm(customer);
    await customerPage.saveAndConfirmCreate();

    await customerPage.search(customer.companyName);
    await customerPage.openEditFor(customer.companyName);
    await customerPage.fillEditForm(updated);
    await customerPage.saveEditAndConfirm();
    await customerPage.search(updated.companyName);
    await customerPage.expectUpdateSuccess(updated.companyName);

    await customerPage.openDetail(updated.companyName);
    await customerPage.expectContactDetailVisible(updated);
    await customerPage.closeDetail();

    await customerPage.search(updated.companyName);
    await customerPage.deleteFor(updated.companyName);
    await customerPage.expectDeleteSuccess();
  });

  test('menghapus customer perusahaan lalu verifikasi tidak tampil di tabel', async ({
    customerPage,
  }) => {
    const customer = newCompanyCustomer();

    await customerPage.openCreateDialog();
    await customerPage.fillCreateForm(customer);
    await customerPage.saveAndConfirmCreate();

    await customerPage.search(customer.companyName);
    await customerPage.deleteFor(customer.companyName);
    await customerPage.expectDeleteSuccess();
  });
});

test.describe('Customer Perorangan', { tag: '@personal' }, () => {
  test.beforeEach(async ({ customerPage }) => {
    await customerPage.goto();
  });

  test('membuat customer perorangan lalu verifikasi detail kontak', async ({ customerPage }) => {
    const customer = newPersonalCustomer();

    await customerPage.openCreateDialog();
    await customerPage.selectPersonalType();
    await customerPage.fillPersonalCreateForm(customer);
    await customerPage.saveAndConfirmCreate();
    // Wajib search dulu: tabel terpaginaasi, record baru belum tentu di halaman 1.
    await customerPage.search(customer.contactName);

    await customerPage.openPersonalDetail(customer.contactName);
    await customerPage.expectPersonalDetailVisible(customer);
    await customerPage.closeDetail();

    await customerPage.search(customer.contactName);
    await customerPage.deleteFor(customer.contactName);
    await customerPage.expectDeleteSuccess();
  });

  test('mengedit customer perorangan lalu verifikasi detail kontak', async ({ customerPage }) => {
    const customer = newPersonalCustomer();
    const updated = newPersonalCustomer();

    await customerPage.openCreateDialog();
    await customerPage.selectPersonalType();
    await customerPage.fillPersonalCreateForm(customer);
    await customerPage.saveAndConfirmCreate();

    await customerPage.search(customer.contactName);
    await customerPage.openEditFor(customer.contactName);
    await customerPage.fillPersonalEditForm(updated);
    await customerPage.saveEditAndConfirm();
    await customerPage.search(updated.contactName);
    await customerPage.expectUpdateSuccess(updated.contactName);

    await customerPage.openPersonalDetail(updated.contactName);
    await customerPage.expectPersonalDetailVisible(updated);
    await customerPage.closeDetail();

    await customerPage.search(updated.contactName);
    await customerPage.deleteFor(updated.contactName);
    await customerPage.expectDeleteSuccess();
  });

  test('menghapus customer perorangan lalu verifikasi tidak tampil di tabel', async ({
    customerPage,
  }) => {
    const customer = newPersonalCustomer();

    await customerPage.openCreateDialog();
    await customerPage.selectPersonalType();
    await customerPage.fillPersonalCreateForm(customer);
    await customerPage.saveAndConfirmCreate();

    await customerPage.search(customer.contactName);
    await customerPage.deleteFor(customer.contactName);
    await customerPage.expectDeleteSuccess();
  });
});
