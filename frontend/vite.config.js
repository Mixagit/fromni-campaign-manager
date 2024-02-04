import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue()],
	server: {
		watch: {
			usePolling: true,
		},
		host: true,
		strictPort: true,
		port: 5173,
	},
})
