import { TEST_DATA } from '../data/testData';
import { BasePage } from './basePage';
import { expect, test } from '@playwright/test';

export class ProfilePage extends BasePage {

    async navigateProfilePage() {
        await test.step('Navigate to Profile page', async () => {
            await this.page.goto(TEST_DATA.baseUrl + '/settings/profile');
            console.log(await this.page.url());
        })
    }

    async assertProfilePageVisible() {
        await test.step('Assert profile page is visible', async () => {
            await expect(this.page.getByRole('heading', { name: 'Pengaturan' })).toBeVisible();
            await expect(this.page.getByText('Pengaturan sistem')).toBeVisible();
            await expect(this.page.getByRole('heading', { name: 'Admin' })).toBeVisible();
            await expect(this.page.locator('span').filter({ hasText: 'admin@lcc.com' })).toBeVisible();
            await expect(this.page.getByRole('img', { name: 'Admin' })).toBeVisible();
            await expect(this.page.getByText('Informasi Pribadi')).toBeVisible();
            await expect(this.page.getByText('Detail informasi akun Anda')).toBeVisible();
            await expect(this.page.getByText('Nama Lengkap')).toBeVisible();
            await expect(this.page.locator('div').filter({ hasText: /^Nama LengkapAdmin$/ }).first()).toBeVisible();
            await expect(this.page.locator('div').filter({ hasText: /^Emailadmin@lcc\.com$/ }).first()).toBeVisible();
            await expect(this.page.locator('div').filter({ hasText: /^DivisiTidak ada divisi$/ }).first()).toBeVisible();
            await expect(this.page.locator('div').filter({ hasText: /^DepartemenTidak ada departemen$/ }).first()).toBeVisible();
            await expect(this.page.locator('div').filter({ hasText: /^PosisiAdemin$/ }).first()).toBeVisible();
            await expect(this.page.getByText('Autentikasi Dua FaktorLindungi akun Anda dengan 2FANonaktif')).toBeVisible();
            await expect(this.page.getByText('Verifikasi EmailStatus verifikasi email AndaBelum Terverifikasi')).toBeVisible();
            await expect(this.page.getByText('Tindakan KeamananUbah Kata')).toBeVisible();
        })
    }
}
