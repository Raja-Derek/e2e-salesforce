import { test } from '../../fixtures/roles';
import { qase } from 'playwright-qase-reporter';

test.describe('HR Karyawan Menu Tests', () => {
    test('[HR] Validate menu karyawan', async ({ cookiesLogin }) => {
        qase.id([826]);

        await cookiesLogin.navigate();
        await cookiesLogin.assertKaryawanPageVisible();
    });

    test('[HR] can see their employee', async ({ cookiesLogin }) => {
        qase.id(747)

        await cookiesLogin.navigate();
        await cookiesLogin.searchKaryawan('TESTER1');
    })
})