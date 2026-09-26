import type { Page } from '@playwright/test';

/**
 * Locator + data khusus organisasi Towing Department (slug: derek).
 *
 * TODO: lengkapi setelah cek UI dev:
 * - customerName: nama customer yang dipakai di combobox Pelanggan.
 * - categoryName / productKeyword / productOptionName:
 *   sesuaikan dengan katalog produk Towing/Derek.
 * - tabName: teks tab filter di halaman /prospects untuk Towing
 *   (sementara "Derek" mengikuti slug; ganti jika di UI tertulis
 *   "Towing" / "TOWING").
 */
export const PROSPECT_DEREK_META = {
  org: 'derek',
  orgLabel: 'Towing Department',
  orgFullName: 'Towing Department',
  tabName: 'Derek',
  customerName: 'TODO: Customer Derek',
  customerRowHint: 'TODO: Customer Derek',
  categoryName: 'TODO: Kategori Derek',
  productKeyword: 'TODO: keyword produk derek',
  productOptionName: 'TODO: opsi produk derek',
  titleBase: 'AUTO PROSPECT DEREK',
} as const;

export function getProspectDerekLocators(page: Page) {
  return {
    meta: PROSPECT_DEREK_META,
    orgOption: page.getByText('Towing Department'),
    customerOption: page.getByText(PROSPECT_DEREK_META.customerName),
    tab: page.getByRole('tab', { name: 'Derek' }),
    categoryOption: page.getByText(PROSPECT_DEREK_META.categoryName),
    productOption: page.getByText(PROSPECT_DEREK_META.productOptionName),
  };
}

export type ProspectDerekLocators = ReturnType<typeof getProspectDerekLocators>;
