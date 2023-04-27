import { defineConfig, type Plugin } from 'vite';

export function sourcemapExclude(): Plugin {
    const packages = ['@mui/material', '@emotion/styled', '@emotion/react'];

    return {
        name: 'exclude-sourcemap',
        transform(code: string, id: string) {
            if (packages.some((pkg) => id.includes(pkg))) {
                return {
                    code,
                    map: { mappings: '' },
                };
            }
        },
    };
}

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [sourcemapExclude()],
});
