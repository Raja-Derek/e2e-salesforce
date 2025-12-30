import { test as base, Page } from '@playwright/test';
import { KaryawanPage } from '../pages/karyawanPage';
import { AspekPage } from '../pages/aspekPage';
import { ProfilePage } from '../pages/profilePage';

export const test = base.extend<{
    _createAuth: undefined;
    cookiesLogin: KaryawanPage;
    adminPage: AspekPage & ProfilePage;
}>({
    // small helper to create an authenticated page from a storage state file
    _createAuth: [async ({ browser }, use) => {
        // placeholder fixture, not exposed — used below via browser param
        await use(undefined);
    }, { auto: true }],

    cookiesLogin: async ({ browser }, use) => {
        const context = await browser.newContext({ storageState: './tests/auth/hr.json' });
        const page = await context.newPage();
        await use(new KaryawanPage(page));
        await context.close();
    },

    adminPage: async ({ browser }, use) => {
        const context = await browser.newContext({ storageState: './tests/auth/admin.json' });
        const page = await context.newPage();

        const aspek = new AspekPage(page);
        const profile = new ProfilePage(page);

        const targets = [aspek, profile] as const;

        const combined = new Proxy(aspek as unknown as AspekPage & ProfilePage,{
            get(_target, prop, _receiver) {
                for (const obj of targets) {
                    if (prop in obj) {
                        const value = (obj as any)[prop as keyof typeof obj];
                        return typeof value === 'function' ? (value as Function).bind(obj) : value;
                    }
                }
                return undefined;
            },
            set(_target, prop, value) {
                for (const obj of targets) {
                    if (prop in obj) {
                        (obj as any)[prop as keyof typeof obj] = value;
                        return true;
                    }
                }
                (aspek as any)[prop as keyof typeof aspek] = value;
                return true;
            },
            has(_target, prop) {
                return targets.some(obj => prop in obj);
            }
        });

        await use(combined);
        await context.close();
    }
});
