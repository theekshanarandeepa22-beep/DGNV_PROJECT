import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/integration-api': {
        target: 'http://localhost:9100',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/integration-api/, ''),
      },
    },
  },
})
