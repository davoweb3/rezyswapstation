import { mount } from '@vue/test-utils';
import { destroyWrapper } from 'fantom-vue3-components/src/test/utils.js';
import AppTheme from './AppTheme.vue';
import { FAppTheme } from 'fantom-vue3-components';
import { useAppStore } from '@/modules/app/store.js';
import { vi } from 'vitest';
import { nextTick } from 'vue';

let wrapper = null;
const THEMES = ['theme-default', 'theme-dark'];
const DEFAULT_THEME = 'theme-dark';
const store = useAppStore();

function createWrapper(
    options = {
        props: {
            themes: THEMES,
            defaultTheme: DEFAULT_THEME,
        },
    }
) {
    return mount(AppTheme, options);
}

afterEach(() => {
    destroyWrapper(wrapper);
});

describe('AppTheme', () => {
    it('should pass props to FAppTheme', () => {
        wrapper = createWrapper();
        const fAppTheme = wrapper.findComponent(FAppTheme);

        expect(fAppTheme.vm.themes).toEqual(THEMES);
    });

    it.skip('should accept `defaultTheme` prop', () => {
        wrapper = createWrapper();
        const fAppTheme = wrapper.findComponent(FAppTheme);

        expect(fAppTheme.vm.theme).toBe(DEFAULT_THEME);
    });

    it('should pick default theme from the store', () => {
        destroyWrapper(wrapper);
        store.theme = 'theme-default';
        wrapper = createWrapper();
        const fAppTheme = wrapper.findComponent(FAppTheme);

        expect(fAppTheme.vm.theme).toBe('theme-default');
    });

    it('should pick dark theme if user prefers dark color scheme', async () => {
        store.theme = 'theme-default';
        store.autoDarkTheme = true;
        const windowMatchMedia = window.matchMedia;
        window.matchMedia = vi.fn().mockImplementation((query) => ({
            matches: true,
            media: query,
            addEventListener: vi.fn(),
        }));

        wrapper = createWrapper();
        await nextTick();

        expect(wrapper.vm.currTheme).toBe('theme-dark');

        window.matchMedia = windowMatchMedia;
    });

    it('should pick previous theme if `autoDarkTheme` is switched to `false`', async () => {
        store.theme = 'theme-default';
        store.autoDarkTheme = true;
        const windowMatchMedia = window.matchMedia;
        window.matchMedia = vi.fn().mockImplementation((query) => ({
            matches: true,
            media: query,
            addEventListener: vi.fn(),
        }));

        wrapper = createWrapper();
        await nextTick();

        store.autoDarkTheme = false;
        await nextTick();

        expect(wrapper.vm.currTheme).toBe('theme-default');

        window.matchMedia = windowMatchMedia;
    });
});
