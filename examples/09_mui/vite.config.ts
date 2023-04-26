import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
    optimizeDeps: {
        exclude: ['@mui/material', '@emotion/react', '@emotion/styled'],
    },
});
