import IntegrationTestWrapperComponent from './IntegrationTestWrapper.vue';
import { mount } from '@vue/test-utils';

export class IntegrationTestWrapper {
    static mount(component = {}, options = {}) {
        return mount(IntegrationTestWrapperComponent, IntegrationTestWrapper.getMountOptions(component, options));
    }

    static getMountOptions(component, options = {}) {
        const componentName = Object.keys(component)[0];

        return {
            global: { components: component },
            ...options,
            props: {
                component: componentName,
                ...(options.props || {}),
            },
        };
    }
}
