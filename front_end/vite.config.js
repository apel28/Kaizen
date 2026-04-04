import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: true,   // ✅ THIS is the key fix
    proxy: {
      '/api': 'http://localhost:5001'
    }
  }
})
