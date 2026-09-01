/// <reference types="vitest" />
import {defineConfig} from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: 'src/setupTests.ts',
        testTimeout: 120000,
        hookTimeout: 60000,
    },
});
