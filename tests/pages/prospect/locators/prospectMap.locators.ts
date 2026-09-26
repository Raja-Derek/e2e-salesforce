import type { Page } from '@playwright/test';

/**
 * Locator + data khusus organisasi MAP (slug: map).
 * Satu-satunya org yang sudah punya script (prospect_map.spec.ts).
 * File ini jadi acuan bentuk untuk crane & derek.
 */
export const PROSPECT_MAP_META = {
  org: 'map',
  orgLabel: 'MAP',
  orgFullName: 'MAP',
  tabName: 'MAP',
  customerName: 'MAP Auto',
  customerRowHint: 'MAP Auto',
  categoryName: 'OOH',
  productKeyword: 'sudimam',
  productOptionName: 'jl sudimampir',
  titleBase: 'AUTO PROSPECT',
} as const;

export function getProspectMapLocators(page: Page) {
  return {
    meta: PROSPECT_MAP_META,
    // Opsi di dropdown "Pilih Organisasi".
    orgOption: page.getByLabel('MAP').getByText('MAP'),
    // Opsi customer setelah ketik di combobox Pelanggan.
    customerOption: page.getByText('MAP Auto'),
    // Tab filter di daftar prospect.
    tab: page.getByRole('tab', { name: 'MAP' }),
    // Opsi kategori & produk khas MAP.
    categoryOption: page.getByRole('option', { name: 'OOH', exact: true }),
    productOption: page.getByText('jl sudimampir'),
  };
}

export type ProspectMapLocators = ReturnType<typeof getProspectMapLocators>;
