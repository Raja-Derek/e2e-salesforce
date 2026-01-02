import * as dotenv from 'dotenv';

if (!process.env.CI) {
  dotenv.config();
}

export const TEST_DATA = {
  emailLogin: process.env.LOGIN_EMAIL || '',
  passwordLogin: process.env.LOGIN_PASSWORD || '',
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