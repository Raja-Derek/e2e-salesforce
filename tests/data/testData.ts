import { ENV } from '../utils/env';

/**
 * Data statis untuk test.
 * - Kredensial dinamis (env) diambil dari ENV, bukan process.env langsung.
 * - Nama produk / pesan UI dikumpulkan di sini agar spec bebas magic string.
 */

// Kompatibilitas: spec lama memakai TEST_DATA.baseUrl / emailLogin / passwordLogin.
export const TEST_DATA = {
  baseUrl: ENV.baseUrl,
  emailLogin: ENV.loginEmail,
  passwordLogin: ENV.loginPassword,
  notifLogin: 'Berhasil login',
} as const;

export const CREDENTIALS = {
  valid: () => ({
    email: ENV.loginEmail,
    password: ENV.loginPassword,
  }),
  unknownEmail: (password = ENV.loginPassword) => ({
    email: 'tahubulat@gmail.com',
    password,
  }),
  wrongPassword: (email = ENV.loginEmail) => ({
    email,
    password: 'invalidpassword',
  }),
} as const;

export const DATA_PENGGUNA = {
  penggunaTempe: 'TEMPE LONJONG',
  penggunaTempeEdit: 'TEMPE LONJONG EDIT',
} as const;

export const DATA_PERAN = {
  admin: 'auto admin',
  director: 'auto director',
  hr: 'auto hr',
  staff: 'auto staff',
} as const;

export const DATA_PRODUK = {
  autoProduct: 'auto_produk',
  autoCrane: 'Auto Crane',
  platBaja: 'Plat Baja',
} as const;

export const DATA_CUSTOMER = {
  companyName: 'PT Automation Test',
  contactName: 'Playwright',
  position: 'CEO',
  phone: '08123123123',
  email: 'playwright@test.com',
  address: 'Jl. Automation Test Saja',
} as const;

export const DATA_CUSTOMER_EDIT = {
  companyName: 'PT Automation Test Edit',
  contactName: 'Estu',
  position: 'Manager',
  phone: '082111133322',
  email: 'estu@gmail.com',
  address: 'Jl. Automation Test Saja Estu',
} as const;

export const DATA_CUSTOMER_PERSONAL = {
  contactName: 'Jamalution',
  phone: '0821236123',
  email: 'jamal@automation.com',
  address: 'Jalan automation',
} as const;

export const DATA_CUSTOMER_PERSONAL_EDIT = {
  contactName: 'Jamalution Edit',
  phone: '0821236199',
  email: 'jamaledit@automation.com',
  address: 'Jalan automation edit',
} as const;

export const DATA_KUNJUNGAN = {
  customerName: 'Crane Auto',
  location: 'PT Abc',
  purpose: 'test',
  notes: 'test catatan',
} as const;

export const DATA_KUNJUNGAN_EDIT = {
  location: 'PT Abc Edit',
  purpose: 'Edit tujuan',
  notes: 'Edit catatan',
} as const;

export const DATA_KUNJUNGAN_SELESAI = {
  result: 'test',
} as const;

export const DATA_AKTIVITAS = {
  customerName: 'Crane Auto',
  subject: 'MEETING',
  type: 'Meeting',
  status: 'Pending',
} as const;

export const DATA_AKTIVITAS_EDIT = {
  subject: 'MEETING EDIT',
  detail: 'edit',
} as const;

/** Teks UI yang dipakai untuk assertion. Diupdate di satu tempat jika copy berubah. */
export const UI_TEXT = {
  loginFailed: 'Email atau kata sandi salah',
  productUpdated: 'Produk berhasil diperbarui',
  productInactiveBadge: 'PRODUK NONAKTIF',
  deactivateProductButton: 'Nonaktifkan Produk',
  restoreProductButton: 'Pulihkan Produk',
  addCustomerDialog: 'Tambahkan Customer',
  createCustomerConfirm: 'Create Customer?',
  personalTab: 'Personal',
  personalCustomerBadge: 'Personal Customer',
  editCustomerDialog: 'Edit Customer',
  updateCustomerConfirm: 'Update Customer?',
  deleteCustomerConfirm: 'Hapus Customer?',
  deleteCustomerConfirmButton: 'Ya, Hapus',
  customerCreated: 'Menambahkan customer...',
  // Toast error generik dari backend (mis. "Terjadi kesalahan yang tidak diketahui.").
  // Dipakai untuk gagal cepat dengan pesan jelas, bukan timeout 30 detik yang buram.
  createCustomerFailed: 'Terjadi kesalahan',
  customerUpdated: 'Customer berhasil diperbarui',
  customerSuccessfullyAdded: 'Customer berhasil ditambahkan',
  customerDeleted: 'Customer berhasil dihapus',
  emptyStateHeading: 'Tidak ada data ditemukan',
  emptyStateText: 'Belum ada customer yang',
  contactDetailHeading: 'Detail Kontak',
  maleGenderLabel: 'Laki-laki',
  scheduleVisitDialog: 'Jadwalkan Kunjungan',
  saveVisitConfirm: 'SIMPAN KUNJUNGAN?',
  visitSaving: 'Menyimpan kunjungan massal...',
  editVisitDialog: 'Edit Kunjungan',
  updateVisitConfirm: 'Update Kunjungan?',
  visitUpdating: 'Mengubah kunjungan...',
  completeVisitDialog: 'Selesaikan Kunjungan',
  saveVisitResultConfirm: 'Simpan Hasil Kunjungan?',
  visitCompleted: 'Berhasil menyelesaikan',
  visitStatusDone: 'Selesai',
  deleteVisitConfirm: 'Hapus Kunjungan?',
  visitDeleted: 'Berhasil menghapus kunjungan',
  visitUpdated: 'Berhasil mengubah kunjungan',
  visitStatusPending: 'Pending',
  addActivityDialog: 'Tambah Aktivitas Baru',
  saveActivityConfirm: 'Simpan Aktivitas?',
  activitySaved: 'Aktivitas berhasil disimpan',
  editActivityDialog: 'Edit Aktivitas',
  updateActivityConfirm: 'Update Aktivitas?',
  activityUpdated: 'Aktivitas diperbarui',
  deleteActivityConfirm: 'Hapus Aktivitas?',
  deleteActivityConfirmButton: 'Ya, Hapus',
  activityDeleted: 'Aktivitas dihapus',
} as const;
