import { expect, test, type Locator, type Page } from '@playwright/test';
import { ENV, ROUTES, TIMEOUTS } from '../utils/env';
import { BasePage } from './base.page';
import {
    getProspectCommonLocators,
    getProspectMapLocators,
    getProspectCraneLocators,
    getProspectDerekLocators,
    prospectRowContaining,
    type ProspectOrg,
} from './prospect/locators';
import type { ProspectCreateData, ProspectDealsData, ProspectEditData } from '../types/prospect';

/**
 * Page Object untuk menu Prospect (/prospects).
 *
 * Pola sama seperti ActivityPage/KunjunganPage:
 * - Spec tidak boleh merakit locator mentah.
 * - Locator bersama ada di prospect/locators/prospectCommon.locators.ts.
 * - Locator per organisasi ada di prospectMap / prospectCrane / prospectDerek.
 * - Spec memilih org lewat parameter `org: 'map' | 'crane' | 'derek'`.
 */
export class ProspectPage extends BasePage {
    private readonly prospectUrl = `${ENV.baseUrl}${ROUTES.prospects}`;

    private readonly common = getProspectCommonLocators(this.page);
    private readonly mapLoc = getProspectMapLocators(this.page);
    private readonly craneLoc = getProspectCraneLocators(this.page);
    private readonly derekLoc = getProspectDerekLocators(this.page);

    constructor(page: Page) {
        super(page);
    }

    /** Bundle locator khusus organisasi. */
    orgLocators(org: ProspectOrg) {
        switch (org) {
            case 'crane':
                return this.craneLoc;
            case 'derek':
                return this.derekLoc;
            case 'map':
            default:
                return this.mapLoc;
        }
    }

    // ---------- navigasi ----------

    async goto(): Promise<void> {
        await test.step('Buka halaman Prospect', async () => {
            await this.gotoPath(this.prospectUrl);
            await this.expectLoaded();
        });
    }

    async expectLoaded(): Promise<void> {
        await test.step('Halaman prospect termuat', async () => {
            await expect(this.common.heading).toBeVisible({ timeout: TIMEOUTS.list });
            await expect(this.common.addButton).toBeVisible({ timeout: TIMEOUTS.dialog });
        });
    }

    // ---------- create ----------

    async openCreateDialog(): Promise<void> {
        await test.step('Buka dialog Tambah Prospect', async () => {
            await this.common.addButton.click();
            await expect(this.common.createDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
        });
    }

    async selectOrg(org: ProspectOrg): Promise<void> {
        await test.step(`Pilih organisasi "${org}"`, async () => {
            await this.common.orgCombobox.click();
            await expect(this.orgLocators(org).orgOption).toBeVisible({ timeout: TIMEOUTS.dialog });
            await this.orgLocators(org).orgOption.click();
            await expect(this.common.createDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
        });
    }

    async selectCustomer(org: ProspectOrg): Promise<void> {
        const { customerOption } = this.orgLocators(org);
        await test.step(`Pilih pelanggan org "${org}"`, async () => {
            await this.common.customerCombobox.click();
            await expect(this.common.suggestionListbox).toBeVisible({ timeout: TIMEOUTS.dialog });
            await customerOption.click();
            await expect(this.common.createDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
        });
    }

    async selectCategory(org: ProspectOrg): Promise<void> {
        const { categoryOption } = this.orgLocators(org);
        const categoryName = this.orgLocators(org).meta.categoryName;
        await test.step(`Pilih kategori "${categoryName}"`, async () => {
            await this.common.categoryCombobox.click();
            await expect(categoryOption).toBeVisible({ timeout: TIMEOUTS.dialog });
            await categoryOption.click();
            await expect(this.common.createDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
        });
    }

    async selectProduct(org: ProspectOrg): Promise<void> {
        const { productOption, meta } = this.orgLocators(org);
        await test.step(`Pilih produk "${meta.productOptionName}"`, async () => {
            await this.common.productCombobox.click();
            await expect(this.common.suggestionListbox).toBeVisible({ timeout: TIMEOUTS.dialog });
            await this.common.productSearchInput.fill(meta.productKeyword);
            await productOption.click();
            await expect(this.common.createDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
        });
    }

    /** Popup kalender yang sedang menempel di DOM (bisa >1 bila ada sisa yang tak menutup). */
    private calendarPopups(): Locator {
        return this.common.calendarPopups;
    }

    /** Tombol tanggal ke-`index` di dalam dialog Tambah Prospect (0=Awal, 1=Akhir, 2=Target). */
    private dialogDateButton(index: number): Locator {
        return this.common.dialogDateButtons.nth(index);
    }

    /**
     * Inti pemilihan tanggal: klik `dateButton`, pilih `dateLabel` di dalam
     * popup kalender teratas, lalu pastikan SEMUA popup menutup sebelum lanjut.
     *
     * Kenapa begini (pelajaran dari strict-mode violation):
     * - `page.getByRole('button', {name})` page-wide mengenai 2 kalender
     *   sekaligus (sisa popup sebelumnya + popup baru) → scope ke `.last()`.
     * - Klik di luar kalender TIDAK menutup popup ini, jadi harus
     *   diverifikasi `toBeHidden` + `Escape` paksa bila masih menempel.
     */
    private async pickDateFromButton(dateButton: Locator, dateLabel: string): Promise<void> {
        const calendars = this.calendarPopups();
        // Bersihkan sisa popup dari step sebelumnya agar tidak menumpuk.
        await this.closeAllCalendars();
        await dateButton.click();
        await expect(calendars.last()).toBeVisible({ timeout: TIMEOUTS.dialog });
        // Scope ke popup teratas — JANGAN query page-wide.
        await calendars.last().getByRole('button', { name: dateLabel }).click();
        await this.closeAllCalendars();
        await expect(this.common.createDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
    }

    /** Tekan Escape berulang sampai tidak ada popup kalender yang visible. */
    private async closeAllCalendars(): Promise<void> {
        const calendars = this.calendarPopups();
        for (let i = 0; i < 3; i++) {
            const count = await calendars.count();
            if (count === 0) break;
            const visible = await calendars
                .last()
                .isVisible()
                .catch(() => false);
            if (!visible) break;
            await this.page.keyboard.press('Escape');
        }
        await expect(calendars).toBeHidden({ timeout: TIMEOUTS.dialog });
    }

    /** Pilih tanggal Periode Awal (date-button pertama di dialog). */
    async pickPeriodeAwal(dateLabel: string): Promise<void> {
        await test.step(`Pilih Periode Awal "${dateLabel}"`, async () => {
            await this.pickDateFromButton(this.dialogDateButton(0), dateLabel);
        });
    }

    /** Pilih tanggal Periode Akhir (date-button kedua di dialog). */
    async pickPeriodeAkhir(dateLabel: string): Promise<void> {
        await test.step(`Pilih Periode Akhir "${dateLabel}"`, async () => {
            await this.pickDateFromButton(this.dialogDateButton(1), dateLabel);
        });
    }

    /** Pilih tanggal Target Closing (date-button ketiga di dialog). */
    async pickTargetClosing(dateLabel: string): Promise<void> {
        await test.step(`Pilih Target Closing "${dateLabel}"`, async () => {
            await this.pickDateFromButton(this.dialogDateButton(2), dateLabel);
        });
    }

    /**
     * Isi nominal & judul. Judul dibuat unik per run (base + 3 angka acak)
     * agar tidak konflik antar run. Mengembalikan judul aktual.
     */
    async fillCreateForm(data: Pick<ProspectCreateData, 'title' | 'amount'>): Promise<string> {
        const title = uniqueProspectTitle(data.title);
        await test.step(`Isi form prospect "${title}"`, async () => {
            await this.common.amountInput.fill(data.amount);
            await this.common.titleInput.fill(title);
        });
        return title;
    }

    async saveAndConfirm(): Promise<void> {
        await test.step('Simpan dan konfirmasi prospect', async () => {
            await this.common.saveButton.click();
            await expect(this.common.saveConfirmDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
            await this.common.confirmButton.click();
        });
    }

    async expectCreateSuccess(title: string, org: ProspectOrg): Promise<void> {
        await test.step(`Prospect "${title}" tersimpan di tab org "${org}"`, async () => {
            await expect(this.common.createdToast).toBeVisible({ timeout: TIMEOUTS.toast });
            await this.orgLocators(org).tab.click();
            await expect(this.common.table.getByText(title)).toBeVisible({ timeout: TIMEOUTS.list });
        });
    }

    /** Alur lengkap membuat prospect untuk satu organisasi. Mengembalikan judul aktual. */
    async createProspect(
        data: ProspectCreateData,
        dates: { start: string; end: string; due: string },
    ): Promise<string> {
        await this.openCreateDialog();
        await this.selectOrg(data.org);
        await this.selectCustomer(data.org);
        await this.pickPeriodeAwal(dates.start);
        // Tanggal akhir memakai date-picker kedua; abaikan bila sama dengan start.
        if (dates.end !== dates.start) {
            await this.pickPeriodeAkhir(dates.end);
        }
        await this.selectCategory(data.org);
        await this.selectProduct(data.org);
        const title = await this.fillCreateForm(data);
        await this.pickTargetClosing(dates.due);
        await this.saveAndConfirm();
        await this.expectCreateSuccess(title, data.org);
        return title;
    }

    // ---------- list & detail ----------

    async openOrgTab(org: ProspectOrg): Promise<void> {
        await test.step(`Buka tab organisasi "${org}"`, async () => {
            await this.orgLocators(org).tab.click();
        });
    }

    rowContaining(text: string): Locator {
        return prospectRowContaining(this.page, text);
    }

    async searchCompany(keyword: string): Promise<void> {
        await test.step(`Cari perusahaan "${keyword}"`, async () => {
            await this.common.searchInput.fill(keyword);
        });
    }

    async openDetailByTitle(title: string): Promise<void> {
        await test.step(`Buka detail prospect "${title}"`, async () => {
            await this.common.table.getByText(title).click();
            await expect(this.common.backToListButton).toBeVisible({ timeout: TIMEOUTS.list });
        });
    }

    // ---------- edit ----------

    async openEdit(): Promise<void> {
        await test.step('Buka dialog Edit Prospect', async () => {
            await this.common.editButton.click();
            await expect(this.common.editDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
        });
    }

    /** Ubah form edit. Judul juga dibuat unik. Mengembalikan judul aktual. */
    async fillEditForm(data: ProspectEditData): Promise<string> {
        const title = uniqueProspectTitle(data.title);
        await test.step(`Ubah form prospect menjadi "${title}"`, async () => {
            await this.common.amountInput.fill(data.amount);
            await this.common.periodInput.fill(data.period);
            await this.common.titleInput.fill(title);
        });
        return title;
    }

    async saveEditAndConfirm(): Promise<void> {
        await test.step('Simpan perubahan dan konfirmasi update', async () => {
            await this.common.updateButton.click();
            await expect(this.common.updateConfirmDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
            await this.common.confirmButton.click();
            await expect(this.common.updatedToast).toBeVisible({ timeout: TIMEOUTS.toast });
        });
    }

    async expectEditSuccess(title: string, amountText: string, periodText: string): Promise<void> {
        await test.step(`Perubahan prospect "${title}" tersimpan`, async () => {
            await expect(this.page.getByRole('heading', { name: title })).toBeVisible({
                timeout: TIMEOUTS.list,
            });
            await expect(this.page.getByText(amountText, { exact: true })).toBeVisible({
                timeout: TIMEOUTS.list,
            });
            await expect(this.page.getByText(periodText)).toBeVisible({ timeout: TIMEOUTS.list });
        });
    }

    // ---------- update status ke deals ----------

    async openUpdateStatus(): Promise<void> {
        await test.step('Buka dialog Update Status Prospect', async () => {
            await this.common.updateStatusButton.click();
            await expect(this.common.updateStatusDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
        });
    }

    async chooseStatusDeals(): Promise<void> {
        await test.step('Pilih status Deals', async () => {
            await this.common.updateStatusDialog.getByText('Deals').click();
            await expect(this.common.receiptHeading).toBeVisible({ timeout: TIMEOUTS.dialog });
        });
    }

    /**
     * Isi detail kwitansi. Nomor kwitansi digenerate otomatis per run dengan
     * format DDMM + 3 angka acak (mis. 2609123) agar unik dan tidak perlu
     * hardcode di testData. Mengembalikan nomor aktual yang diisi.
     */
    async fillReceipt(
        data: Pick<ProspectDealsData, 'receiptFilePath'>,
        receiptDateLabel: string,
    ): Promise<string> {
        const receiptNumber = uniqueReceiptNumber();
        await test.step(`Isi detail kwitansi no. "${receiptNumber}"`, async () => {
            const calendars = this.calendarPopups();
            await this.closeAllCalendars();
            // Scope ke dialog Update Status: jangan pakai date-picker page-wide.
            await this.common.updateStatusDialog
                .getByRole('button', { name: /(Pilih tanggal|^\d{4}-\d{2}-\d{2}$)/ })
                .first()
                .click();
            await expect(calendars.last()).toBeVisible({ timeout: TIMEOUTS.dialog });
            await calendars.last().getByRole('button', { name: receiptDateLabel }).click();
            await this.closeAllCalendars();
            await expect(this.common.updateStatusDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
            await this.page.getByRole('button', { name: 'Lunas' }).click();
            await this.common.receiptNumberInput.fill(receiptNumber);
            await this.common.fileInput.setInputFiles(data.receiptFilePath);
            await expect(this.common.removeFileButton).toBeVisible({ timeout: TIMEOUTS.dialog });
        });
        return receiptNumber;
    }

    async saveStatusAndConfirm(): Promise<void> {
        await test.step('Simpan perubahan status', async () => {
            await this.common.saveChangesButton.click();
            await this.page.getByText('Menyimpan perubahan...').waitFor({ state: 'detached', timeout: TIMEOUTS.toast });
            await this.page.getByText('Update Status Prospect').waitFor({ state: 'detached', timeout: TIMEOUTS.toast });
        }); 
    }

    async expectDealsSuccess(): Promise<void> {
        await test.step('Status prospect menjadi Deals/Lunas', async () => {
            await expect(this.page.getByText('Lunas')).toBeVisible({ timeout: TIMEOUTS.list });
            await expect(this.page.getByText('Deals')).toBeVisible({ timeout: TIMEOUTS.list });
        });
    }

    // ---------- hapus ----------

    /**
     * Prospect berstatus Deals tidak bisa langsung dihapus:
     * kembalikan dulu ke Kunjungan, baru tombol Hapus tersedia.
     */
    async revertStatusToKunjungan(): Promise<void> {
        await test.step('Kembalikan status prospect ke Kunjungan', async () => {
            await this.openUpdateStatus();
            await this.common.updateStatusDialog.getByText('Kunjungan').click();
            await this.saveStatusAndConfirm();
            await expect(this.common.backToListButton).toBeVisible({ timeout: TIMEOUTS.list });
        });
    }

    async openDelete(): Promise<void> {
        await test.step('Buka dialog Hapus Prospect', async () => {
            await this.common.deleteButton.click();
            await expect(this.common.deleteConfirmDialog).toBeVisible({ timeout: TIMEOUTS.dialog });
        });
    }

    async confirmDelete(): Promise<void> {
        await test.step('Konfirmasi hapus prospect', async () => {
            await this.common.deleteConfirmButton.click();
            await expect(this.common.deletedToast).toBeVisible({ timeout: TIMEOUTS.toast });
        });
    }

    async expectDeleteSuccess(title: string, org: ProspectOrg): Promise<void> {
        await test.step(`Prospect "${title}" terhapus dari tab org "${org}"`, async () => {
            await this.goto();
            await this.openOrgTab(org);
            await this.searchCompany('Auto');
            await expect(this.rowContaining(title)).toBeHidden({ timeout: TIMEOUTS.list });
        });
    }
}

/**
 * Tambahkan 3 angka unik (100-999) ke base judul agar berbeda tiap run.
 * Contoh: "AUTO PROSPECT" -> "AUTO PROSPECT 482".
 */
export function uniqueProspectTitle(baseTitle: string): string {
    const suffix = Math.floor(100 + Math.random() * 900).toString();
    return `${baseTitle} ${suffix}`;
}

/**
 * Nomor kwitansi unik per run: DDMM tanggal berjalan + 3 angka acak.
 * Contoh: tanggal 26 September -> "2609" + "123" = "2609123".
 */
export function uniqueReceiptNumber(now: Date = new Date()): string {
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const suffix = Math.floor(100 + Math.random() * 900).toString();
    return `${day}${month}${suffix}`;
}
