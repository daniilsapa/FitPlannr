import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// A workaround for the issue with client-side routing.
// When the user refreshes the page (on a page like /workout/:id), the server returns 404.
const createEntityProxy = (entity: string) => {
	return {
		[`/${entity}`]: {
			target: `http://localhost:5173`,
			changeOrigin: false,
			rewrite: (path: string) => path.replace(new RegExp(`^/${entity}`), ''),
		},
	};
};

// https://vitejs.dev/config/
export default defineConfig({
	appType: 'spa',
	server: {
		proxy: {
			...createEntityProxy('workout'),
			...createEntityProxy('exercise'),
			...createEntityProxy('category'),
			...createEntityProxy('client'),
		},
	},
	build: {
		outDir: '../dist',
	},
	plugins: [react()],
});
