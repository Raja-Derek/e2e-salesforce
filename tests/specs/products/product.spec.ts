import { expect, test } from '@playwright/test';
import { TEST_DATA } from '../../data/testData';

// Langsung pakai cookie login yang sudah disimpan global-setup (tests/auth/admin.json)
// Jadi tidak perlu login manual di tiap test
test.use({ storageState: 'tests/auth/admin.json' });

test.describe('Product Tests', () => {
    test('Membuka detail produk', async ({ page }) => {
        // Sudah authenticated via storageState, langsung ke dashboard
        await page.goto(TEST_DATA.baseUrl + '/products');

        await expect(page.getByRole('heading', { name: 'Katalog Produk' })).toBeVisible();

        // Tunggu produk selesai loading (di screenshot gagal terlihat masih skeleton).
        // Produk muncul sebagai card/teks, BUKAN dialog. Dialog baru ada setelah produk di-klik.
        const product = page.getByText('Plat Baja');
        await expect(product).toBeVisible({ timeout: 15000 });

        await product.click();
        await expect(
            page.getByRole('dialog').filter({ hasText: 'Plat Baja' })
        ).toBeVisible({ timeout: 10000 });
    });

    test('Search produk', async ({ page }) => {
        await page.goto(TEST_DATA.baseUrl + '/products');

        await expect(page.getByRole('heading', { name: 'Katalog Produk' })).toBeVisible();

        const search = page.getByRole('textbox', { name: 'Cari nama atau SKU...' });
        await expect(search).toBeVisible();
        await search.click();
        await search.fill('Plat baja');

        // Produk muncul sebagai card/teks, BUKAN heading.
        // Pakai getByText + timeout panjang karena list masih skeleton saat search (lihat test-failed-1.png).
        await expect(page.getByText(/Plat Baja/i).first()).toBeVisible({ timeout: 15000 });
    })
});
