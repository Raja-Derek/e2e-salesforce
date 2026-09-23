import { expect, test } from '../../fixtures/app.fixtures';
import { DATA_PRODUK } from '../../data/testData';
import { STORAGE_STATE } from '../../utils/env';

// Auth sekali via global-setup, tidak perlu login manual per test.
test.use({ storageState: STORAGE_STATE.admin });

test.describe('Katalog Produk', { tag: '@products' }, () => {
  test.beforeEach(async ({ productPage }) => {
    await productPage.goto();
  });

  test('membuka detail produk', async ({ productPage }) => {
    await productPage.openDetail(DATA_PRODUK.autoCrane);
    await productPage.expectDetailVisible(DATA_PRODUK.autoCrane);
  });

  test('mencari produk berdasarkan nama', async ({ productPage }) => {
    await productPage.search(DATA_PRODUK.autoCrane);
    await expect(productPage.productText(DATA_PRODUK.autoCrane)).toBeVisible();
  });

  test('mengedit produk lalu menyimpan perubahan', async ({ productPage }) => {
    await productPage.search(DATA_PRODUK.autoCrane);
    await productPage.openEditFor(DATA_PRODUK.autoCrane);
    await productPage.saveEditAndConfirm();
    await productPage.expectUpdateSuccess();
  });

  test('menonaktifkan produk', async ({ productPage }) => {
    await productPage.search(DATA_PRODUK.platBaja);
    // Precondition: status nonaktif persist antar run, pulihkan dulu bila perlu.
    await productPage.ensureProductActive(DATA_PRODUK.platBaja);
    await productPage.deactivate(DATA_PRODUK.platBaja);

    // Verifikasi status nonaktif lewat dialog detail.
    await productPage.openDetail(DATA_PRODUK.platBaja);
    await productPage.expectDetailVisible(DATA_PRODUK.platBaja);
    await expect(productPage.inactiveBadge).toBeVisible();
  });
});
