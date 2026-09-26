import type { Locator, Page } from '@playwright/test';

/**
 * Locator bersama (org-agnostic) untuk menu Prospect (/prospects).
 *
 * Dipakai oleh ProspectPage untuk semua organisasi.
 * Locator yang berbeda per organisasi (tab, opsi org, customer)
 * ada di file masing-masing: prospectMap, prospectCrane, prospectDerek.
 */
export function getProspectCommonLocators(page: Page) {
  const createDialog = page.getByRole('dialog', { name: 'Tambah Prospect' });
  const editDialog = page.getByRole('dialog', { name: 'Edit Prospect' });
  const updateStatusDialog = page.getByRole('dialog', { name: 'Update Status Prospect' });

  return {
    heading: page.getByRole('heading', { name: 'Prospects Pipeline' }),
    table: page.getByRole('table'),
    addButton: page.getByRole('button', { name: 'Tambah Prospect' }),
    createDialog,
    orgCombobox: page.getByRole('combobox').filter({ hasText: 'Pilih Organisasi' }),
    customerCombobox: page.getByRole('combobox', { name: 'Pelanggan *' }),
    suggestionListbox: page.getByRole('listbox', { name: 'Suggestions' }),
    categoryCombobox: page.getByRole('combobox').filter({ hasText: 'Pilih Kategori...' }),
    productCombobox: page.getByRole('combobox', { name: 'Produk / Layanan *' }),
    productSearchInput: page.getByRole('textbox', { name: 'Cari produk...' }),
    // Input angka (qty/nominal) — aksesibel bernama "0" di DOM saat ini.
    amountInput: page.getByRole('textbox', { name: '0' }),
    titleInput: page.getByRole('textbox', { name: 'Judul' }),
    periodInput: page.getByRole('textbox', { name: 'Periode Paket Rentang Waktu' }),
    /**
     * Tombol tanggal di dalam dialog "Tambah Prospect", terurut sesuai layout form:
     * nth(0) = Periode Awal, nth(1) = Periode Akhir, nth(2) = Target Closing.
     * Di-scope ke dialog (bukan page-wide) dan mencocokkan dua state:
     * belum dipilih ("Pilih tanggal") maupun sudah terisi ("2026-09-01").
     * Jangan pakai page.getByRole('button', {name:'Pilih tanggal'}).nth(i)
     * page-wide: setelah satu tanggal terpilih, labelnya berubah menjadi
     * tanggal sehingga index global bergeser dan klik jatuh ke field yang salah.
     */
    dialogDateButtons: createDialog.getByRole('button', {
      name: /(Pilih tanggal|^\d{4}-\d{2}-\d{2}$)/,
    }),
    /**
     * Popup kalender (react-day-picker): dialog tanpa nama yang memuat grid
     * bulan. Filter `has: grid` membedakannya dari dialog "Tambah Prospect".
     * Bisa ada >1 instance di DOM bila popup sebelumnya tidak menutup,
     * jadi selalu operasikan via `.last()` (popup teratas) dan pastikan
     * menutup tiap selesai memilih tanggal.
     */
    calendarPopups: page.getByRole('dialog').filter({ has: page.getByRole('grid') }),
    saveButton: page.getByRole('button', { name: 'Simpan' }),
    saveConfirmDialog: page.getByRole('alertdialog', { name: 'Simpan?' }),
    confirmButton: page.locator('[data-test="confirm-button"]'),
    createdToast: page.getByText('Prospect berhasil ditambahkan'),

    searchInput: page.getByRole('textbox', { name: 'Cari perusahaan...' }),
    backToListButton: page.getByRole('button', { name: 'Kembali ke daftar prospect' }),
    editButton: page.getByRole('button', { name: 'Edit Prospect' }),
    editDialog,
    updateButton: page.getByRole('button', { name: 'Update' }),
    updateConfirmDialog: page.getByRole('alertdialog', { name: 'Update?' }),
    updatedToast: page.getByText('Perubahan berhasil disimpan'),

    updateStatusButton: page.getByRole('button', { name: 'Update Status' }),
    updateStatusDialog,
    receiptHeading: page.getByRole('heading', { name: 'Detail Kwitansi' }),
    paidButton: page.getByRole('button', { name: 'Lunas' }),
    receiptNumberInput: page.getByRole('textbox', { name: 'Masukkan No. Kwitansi...' }),
    fileInput: page.locator('input[type="file"]'),
    removeFileButton: page.getByRole('button', { name: 'Hapus file' }),
    saveChangesButton: page.getByRole('button', { name: 'Simpan Perubahan' }),

    deleteButton: page.getByRole('button', { name: 'Hapus', exact: true }),
    deleteConfirmDialog: page.getByRole('alertdialog', { name: 'Hapus Prospect?' }),
    deleteConfirmButton: page.getByRole('button', { name: 'Ya, Hapus' }),
    deletedToast: page.getByText('Data berhasil dihapus'),
    loadingDeleteToast: page.getByText('Menghapus data...')
  };
}

export type ProspectCommonLocators = ReturnType<typeof getProspectCommonLocators>;

/** Helper generik: baris tabel yang memuat teks tertentu. */
export function prospectRowContaining(page: Page, text: string): Locator {
  return page.getByRole('row', { name: new RegExp(escapeRegExp(text), 'i') });
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
