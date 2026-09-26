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
