export const messageImports = {
    async en() {
        return (await import('./en.js')).default;
    },
};
