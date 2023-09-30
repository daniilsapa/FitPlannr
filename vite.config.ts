import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// A workaround for the issue with client-side routing.
// When the user refreshes the page (on a page like /workout/:id), the server returns 404.
const createEntityProxy = (entity: string) => {
	const createBaseProxy = () => {
		return {
			target: `http://localhost:5173`,
			changeOrigin: false,
			rewrite: (path: string) => {
				const components = path.split('/').filter((c) => c !== '');
				const lastComponent = components[components.length - 1];

				if (lastComponent.indexOf('.') === -1) {
					return `/${lastComponent}`;
				}

				return `${components[components.length - 2]}/${lastComponent}`;
			},
		};
	};

	return {
		[`/${entity}s`]: createBaseProxy(),
		[`/${entity}`]: createBaseProxy(),
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
		outDir: './dist',
	},
	plugins: [react()],
});
