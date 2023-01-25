import { delay } from 'fantom-vue3-components';

export async function setupMocking(startApp, useMocking = false) {
    if (useMocking) {
        await import('./register-mocks.js');
        await delay(150);
    }

    startApp();
}
