import type { Page } from '@playwright/test';

/**
 * Locator + data khusus organisasi Towing Department (slug: derek).
 *
 * Form Towing berbeda dari MAP: tidak ada pilihan Kategori &
 * Periode Awal/Akhir, melainkan field Kendaraan, Rute Awal/Akhir,
 * dan satu tanggal. Alur deals memakai pilihan Kota + input
 * "Masukkan angka..." untuk No. Kwitansi.
 */
export const PROSPECT_DEREK_META = {
  org: 'derek',
  orgLabel: 'Towing Department',
  orgFullName: 'Towing Department',
  tabName: 'Towing Department',
  customerName: 'Towing Auto',
  customerRowHint: 'Towing Auto',
  productKeyword: 'Derek',
  productOptionName: 'Derek Hidrolik',
  productEditOptionName: 'Derek Gantung',
  receiptCityName: 'Bandung',
  titleBase: 'PENDEREKAN DESA KONOHA',
} as const;

export function getProspectDerekLocators(page: Page) {
  return {
    meta: PROSPECT_DEREK_META,
    orgOption: page.getByLabel('Towing Department').getByText('Towing Department'),
    customerOption: page.getByRole('option', { name: 'Towing Auto' }),
    tab: page.getByRole('tab', { name: 'Towing Department' }),
    productOption: page.getByText('Derek Hidrolik'),
    productEditOption: page.getByText('Derek Gantung'),
    cityOption: page.getByRole('option', { name: 'Bandung' }),
  };
}

export type ProspectDerekLocators = ReturnType<typeof getProspectDerekLocators>;
