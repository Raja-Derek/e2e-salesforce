import { TEST_DATA } from '../data/testData';
import { helper } from '../utils/helper';
import { BasePage } from './basePage';
import { expect, test } from '@playwright/test';

export class AspekPage extends BasePage {

    async navigateAspekPenilaian() {
        await test.step('Navigate to aspek penilaian page', async () => {
            await this.page.goto(TEST_DATA.baseUrl + '/core/performance-aspect');
            await expect(this.page.getByText('Tidak ada data ditemukan')).not.toBeVisible();

        }
        );
    }

    async assertAspekPageVisible() {
        await test.step('Aspek penilaian page is visible', async () => {
            await expect(this.page.getByRole('heading', { name: 'Aspek Penilaian Performa' })).toBeVisible();
            await expect(this.page.getByText('Kelola aspek penilaian')).toBeVisible();
            await expect(this.page.getByRole('textbox', { name: 'Cari nama atau deskripsi' })).toBeVisible();
            await expect(this.page.getByRole('columnheader', { name: 'Nama' })).toBeVisible();
            await expect(this.page.getByRole('columnheader', { name: 'Deskripsi' })).toBeVisible();
            await expect(this.page.getByRole('columnheader', { name: 'Poin Penilaian' })).toBeVisible();
            await expect(this.page.getByRole('cell', { name: 'Managerial Skill' })).toBeVisible();
            await expect(this.page.getByRole('cell', { name: 'Professional Skill' })).toBeVisible();
            await expect(this.page.getByRole('cell', { name: 'Kepribadian' })).toBeVisible();
        }
        );
    }

    async searchAspek(aspekName: string) {
        await test.step(`Search aspek with name ${aspekName}`, async () => {
            await this.page.getByRole('textbox', { name: 'Cari nama atau deskripsi' }).fill(aspekName);
            await this.page.getByRole('textbox', { name: 'Cari nama atau deskripsi' }).press('Enter');
        }
        );
    }

    async assertAspekNotFound() {
        await test.step('Aspek not found message is visible', async () => {
            await expect(this.page.getByText('Tidak ada data ditemukan')).toBeVisible();
            await expect(this.page.getByText('Coba ubah kata kunci')).toBeVisible();
        })
    }

    async assertAspekFounded(aspekName: string) {
        await test.step('Aspek is found', async () => {
            await expect(this.page.getByText(aspekName)).toBeVisible();

        })
    }

}
