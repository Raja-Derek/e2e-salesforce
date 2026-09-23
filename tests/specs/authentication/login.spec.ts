import { test } from '../../fixtures/app.fixtures';
import { CREDENTIALS } from '../../data/testData';

test.describe('Login', { tag: '@auth' }, () => {
  test('menolak login dengan email tidak terdaftar', async ({ loginPage }) => {
    await loginPage.login(CREDENTIALS.unknownEmail());
    await loginPage.expectLoginFailed();
  });

  test('berhasil login dengan kredensial valid', async ({ loginPage }) => {
    await loginPage.login(CREDENTIALS.valid());
    await loginPage.expectLoginSuccess();
  });

  test('menolak login dengan password salah', async ({ loginPage }) => {
    await loginPage.login(CREDENTIALS.wrongPassword());
    await loginPage.expectLoginFailed();
  });

  test('menonaktifkan tombol Sign In saat form kosong', async ({ loginPage }) => {
    await loginPage.expectSignInDisabledWhenEmpty();
  });
});
