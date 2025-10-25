import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import pkg from './package.json';

export default defineConfig((env) => ({
    plugins: [dts({ outDir: './dist/types' }), react()],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: pkg.name,
            fileName: 'react-promise-bridge',
        },
        rollupOptions: {
            external: ['react'],
            output: {
                globals: {
                    react: 'React',
                },
            },
        },
    },
    define: env.command === 'build' ? { 'process.env.NODE_ENV': "'production'" } : undefined,
    test: {
        environment: 'happy-dom',
        coverage: {
            provider: 'v8',
        },
    },
}));
