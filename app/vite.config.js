import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import eslint from 'vite-plugin-eslint'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		react(),
		eslint({
			cache: false,
			include: ['./src/**/*.js', './src/**/*.jsx'],
			exclude: ['**/node_modules/**'],
		}),
	],
	build: {
		outDir: '../universe/www',
	},
})
