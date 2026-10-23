import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Any request the frontend makes to /api/* is forwarded to your
      // Express backend during local development.
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
})
