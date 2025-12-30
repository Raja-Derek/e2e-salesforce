import { test } from '../../fixtures/roles';
import { qase } from 'playwright-qase-reporter';

test.describe('Menu Aspek Penilaian Performa', () => {
    test('Validate menu "Aspek Penilaian"', async ({ adminPage }) => {
        qase.id(771)

        await adminPage.navigateAspekPenilaian();
        await adminPage.assertAspekPageVisible();
    })

    test('Search "Aspek" with valid data', async ({ adminPage }) => {
        qase.id(772)

        await adminPage.navigateAspekPenilaian();
        await adminPage.searchAspek('Kemampuan membuat rencana kerja')
        await adminPage.assertAspekFounded('Kemampuan membuat rencana kerja');
    })
    
    test('Search "Aspek" with invalid data', async ({ adminPage }) => {
        qase.id(772)

        await adminPage.navigateAspekPenilaian();
        await adminPage.searchAspek('tahu bulat')
        await adminPage.assertAspekNotFound();
    })

})