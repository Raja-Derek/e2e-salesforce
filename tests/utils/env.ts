import * as dotenv from 'dotenv';

// Load .env sekali, diabaikan saat CI (secret dari environment).
if (!process.env.CI) {
  dotenv.config();
}

function readEnv(name: string, fallback = ''): string {
  const value = process.env[name] ?? fallback;
  return value.trim();
}

/**
 * Single source of truth untuk environment.
 * Semua Page Object / spec wajib import dari sini,
 * jangan panggil process.env / dotenv langsung.
 */
export const ENV = {
  baseUrl: readEnv('BASE_URL'),
  loginEmail: readEnv('LOGIN_EMAIL'),
  loginPassword: readEnv('LOGIN_PASSWORD'),
} as const;

/** Lokasi storageState hasil global-setup. */
export const STORAGE_STATE = {
  admin: 'tests/auth/admin.json',
} as const;

/** Timeout terpusat agar tidak ada angka magic tersebar di spec. */
export const TIMEOUTS = {
  list: 30_000,
  dialog: 30_000,
  // Budget khusus toast: dipakai sekali untuk menunggu MUNCUL,
  // sekali lagi untuk menunggu HILANG (auto-dismiss).
  toast: 10_000,
  networkIdle: 30_000,
} as const;

/** Route aplikasi terpusat agar perubahan path hanya di satu tempat. */
export const ROUTES = {
  signIn: '/sign-in',
  dashboard: /dashboard/,
  products: '/products',
  customer: '/customer',
} as const;
