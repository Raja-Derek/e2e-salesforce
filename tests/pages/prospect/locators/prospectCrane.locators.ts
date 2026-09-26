import type { Page } from '@playwright/test';

/**
 * Locator + data khusus organisasi Crane Service Department (slug: crane).
 *
 * TODO: lengkapi setelah cek UI dev:
 * - customerName: nama customer yang dipakai di combobox Pelanggan
 *   (sementara "Crane Auto" dari baris tabel di spec MAP).
 * - categoryName / productKeyword / productOptionName:
 *   sesuaikan dengan katalog produk Crane.
 * - tabName: teks tab filter di halaman /prospects untuk Crane
 *   (sementara "Crane" — ganti jika di UI tertulis lain,
 *   mis. "CRANE" / "Crane Service").
 */
export const PROSPECT_CRANE_META = {
  org: 'crane',
  orgLabel: 'Crane Service Department',
  orgFullName: 'Crane Service Department',
  tabName: 'Crane',
  customerName: 'Crane Auto',
  customerRowHint: 'Crane Auto',
  categoryName: 'TODO: Kategori Crane',
  productKeyword: 'TODO: keyword produk crane',
  productOptionName: 'TODO: opsi produk crane',
  titleBase: 'AUTO PROSPECT CRANE',
} as const;

export function getProspectCraneLocators(page: Page) {
  return {
    meta: PROSPECT_CRANE_META,
    orgOption: page.getByText('Crane Service Department'),
    customerOption: page.getByText('Crane Auto'),
    tab: page.getByRole('tab', { name: 'Crane' }),
    // Dibuat generik agar tidak throw saat TODO belum diisi;
    // ganti ke getByRole('option', ...) setelah nilai fix.
    categoryOption: page.getByText(PROSPECT_CRANE_META.categoryName),
    productOption: page.getByText(PROSPECT_CRANE_META.productOptionName),
  };
}

export type ProspectCraneLocators = ReturnType<typeof getProspectCraneLocators>;
