import type { ProspectOrg } from '../pages/prospect/locators';

export interface ProspectCreateData {
  org: ProspectOrg;
  amount: string;
  period?: string;
  title: string;
}

export interface ProspectEditData {
  amount: string;
  period: string;
  title: string;
}

export interface ProspectDealsData {
  /** Path file bukti kwitansi, relatif dari root repo. */
  receiptFilePath: string;
}

/** Field khusus form create Towing (tanpa kategori & periode). */
export interface ProspectTowingCreateData {
  vehicle: string;
  amount: string;
  routeStart: string;
  routeEnd: string;
  title: string;
}

/** Field khusus form edit Towing (tanpa periode). */
export interface ProspectTowingEditData {
  vehicle: string;
  amount: string;
  title: string;
}
