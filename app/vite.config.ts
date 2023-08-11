import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // resolve: {
  //   alias: [{ find: '@modules', replacement: fileURLToPath(new URL('./src/modules', import.meta.url)) }]
  // },
  build: {
    outDir: '../universe/www'
  }
})
