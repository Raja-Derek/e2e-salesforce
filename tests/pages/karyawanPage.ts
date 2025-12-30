import { TEST_DATA } from '../data/testData';
import { helper } from '../utils/helper';
import { BasePage } from './basePage';
import { expect, test } from '@playwright/test';

export class KaryawanPage extends BasePage {

    async navigate() {
        await test.step('Navigate to karyawan page', async () => {
            await this.page.goto(TEST_DATA.baseUrl + '/core/employees');
            console.log(await this.page.url());
            await expect(this.page.getByRole('heading', { name: 'Karyawan' })).toBeVisible({ timeout: 30000 });

        }
        );
    }

    async assertKaryawanPageVisible() {
        await test.step('Karyawan page is visible', async () => {
            await expect(
                this.page.getByRole('heading', { name: 'Karyawan' })
            ).toBeVisible({ timeout: 20000 });

            await expect(this.page.getByText('Kelola data karyawan dan')).toBeVisible();
            await expect(this.page.getByTestId('employees-core_statistics_total-karyawan')).toBeVisible();
            await expect(this.page.getByTestId('employees-core_statistics_perlu-ditinjau')).toBeVisible();
            await expect(this.page.getByTestId('employees-core_statistics_sudah-dinilai')).toBeVisible();
            await expect(this.page.getByTestId('employees-core_tabs_semua')).toBeVisible();
            await expect(this.page.getByTestId('employees-core_tabs_pending')).toBeVisible();
            await expect(this.page.getByTestId('employees-core_tabs_reviewed')).toBeVisible();
            await expect(this.page.getByText('Hanya Bawahan Saya')).toBeVisible();
            await expect(this.page.getByRole('button', { name: 'Desember' })).toBeVisible();
            await expect(this.page.getByRole('textbox', { name: 'Cari nama atau email...' })).toBeVisible();
            await expect(this.page.locator('.overflow-hidden.rounded-lg')).toBeVisible();
        })

    }

    async searchKaryawan(namaKaryawan: string) {
        await test.step(`Search karyawan with name ${namaKaryawan}`, async () => {
            await this.page.waitForTimeout(5000);
            const searchBox = this.page.getByRole('textbox', { name: 'Cari nama atau email...' });
            await searchBox.click();
            await searchBox.fill(namaKaryawan);
            // Trigger search if the UI requires an Enter to run the filter
            await searchBox.press('Enter');
            // Use a looser text match to accommodate possible name casing or extra whitespace
            await expect(this.page.getByText(namaKaryawan, { exact: true })).toBeVisible({ timeout: 20000 });
            await this.page.waitForTimeout(3000);
        })
    }

    
}
