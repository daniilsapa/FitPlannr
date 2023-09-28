import { configDefaults, defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
// import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), tsconfigPaths()],
	test: {
		globals: true,
		environment: 'jsdom',
		exclude: [...configDefaults.exclude, './scripts/*', '**/setupTests.ts'],
		include: ['**/*.{test,spec}.?(c|m)[jt]s?(x)'],
		setupFiles: ['./config/setupTests.ts'],
	},
});
