import * as dotenv from 'dotenv';

if (!process.env.CI) {
  dotenv.config();
}

export const TEST_DATA = {
  supervisorEmail: process.env.SUPERVISOR_EMAIL || '',
  supervisorPassword: process.env.SUPERVISOR_PASSWORD || '',
  dirutEmail: process.env.DIRUT_EMAIL || '',
  dirutPassword: process.env.DIRUT_PASSWORD || '',
  hrEmail: process.env.HR_EMAIL || '',
  hrPassword: process.env.HR_PASSWORD || '',
  adminEmail: process.env.ADMIN_EMAIL || '',
  adminPassword: process.env.ADMIN_PASSWORD || '',
  baseUrl: process.env.BASE_URL || '',
  notifLogin: 'Berhasil login' // ubah sesuai pesan notifikasi yang diharapkan
};

export const DATA_PENGGUNA = {
  penggunaTempe: 'TEMPE LONJONG',
  penggunaTempeEdit: 'TEMPE LONJONG EDIT'
}

export const DATA_PERAN = {
  admin: 'auto admin',
  director: 'auto director',
  hr: 'auto hr',
  staff: 'auto staff'
}