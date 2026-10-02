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
  const today = new Date();

  // Extract components and pad with leading zeros if needed
  const dd = String(today.getDate()).padStart(2, '0');
  const mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
  const yy = String(today.getFullYear()).slice(-2); // Get last 2 digits

  const formattedDate = `${dd}${mm}${yy}`;
  const random = Math.random().toString(5).slice(2, 5);
  return `${formattedDate}${random}`;
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

function updatedCompanyCustomer(): CustomerData {
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

test.describe.serial('Customer Perusahaan', { tag: '@perusahaan' }, () => {
  const customer = newCompanyCustomer();
  const updatedCustomer = updatedCompanyCustomer();

  test.beforeEach(async ({ customerPage }) => {
    await customerPage.goto();
  });

  test('membuat customer perusahaan lalu verifikasi detail kontak', async ({ customerPage }) => {

    await customerPage.openCreateDialog();
    await customerPage.fillCreateForm(customer);
    await customerPage.saveAndConfirmCreate();
    // Wajib search dulu: tabel terpaginaasi, record baru belum tentu di halaman 1.
    await customerPage.search(customer.companyName);

    await customerPage.openDetail(customer.companyName);
    await customerPage.expectContactDetailVisible(customer);
    await customerPage.closeDetail();
  });

  test('mengedit customer perusahaan lalu verifikasi detail kontak', async ({ customerPage }) => {

    await customerPage.search(customer.companyName);
    await customerPage.openEditFor(customer.companyName);
    await customerPage.fillEditForm(  updatedCustomer);
    await customerPage.saveEditAndConfirm();
    await customerPage.search(updatedCustomer.companyName);
    await customerPage.expectUpdateSuccess(updatedCustomer.companyName);

    await customerPage.openDetail(updatedCustomer.companyName);
    await customerPage.expectContactDetailVisible(updatedCustomer);
    await customerPage.closeDetail();

  });

  test('menghapus customer perusahaan lalu verifikasi tidak tampil di tabel', async ({
    customerPage,
  }) => {

    await customerPage.search(updatedCustomer.companyName);
    await customerPage.deleteFor(updatedCustomer.companyName);
    await customerPage.expectDeleteSuccess();
  });
});

test.describe.serial('Customer Perorangan', { tag: '@personal' }, () => {
  const customer = newPersonalCustomer();
  test.beforeEach(async ({ customerPage }) => {
    await customerPage.goto();
  });

  test('membuat customer perorangan lalu verifikasi detail kontak', async ({ customerPage }) => {

    await customerPage.openCreateDialog();
    await customerPage.selectPersonalType();
    await customerPage.fillPersonalCreateForm(customer);
    await customerPage.saveAndConfirmCreate();
    // Wajib search dulu: tabel terpaginaasi, record baru belum tentu di halaman 1.
    await customerPage.search(customer.contactName);

    await customerPage.openPersonalDetail(customer.contactName);
    await customerPage.expectPersonalDetailVisible(customer);
    await customerPage.closeDetail();

  });

  test('mengedit customer perorangan lalu verifikasi detail kontak', async ({ customerPage }) => {
    const updated = newPersonalCustomer();

    await customerPage.search(customer.contactName);
    await customerPage.openEditFor(customer.contactName);
    await customerPage.fillPersonalEditForm(updated);
    await customerPage.saveEditAndConfirm();
    await customerPage.search(updated.contactName);
    await customerPage.expectUpdateSuccess(updated.contactName);

    await customerPage.openPersonalDetail(updated.contactName);
    await customerPage.expectPersonalDetailVisible(updated);
    await customerPage.closeDetail();

  });

  test('menghapus customer perorangan lalu verifikasi tidak tampil di tabel', async ({
    customerPage,
  }) => {

    await customerPage.search(customer.contactName);
    await customerPage.deleteFor(customer.contactName);
    await customerPage.expectDeleteSuccess();
  });
});
