import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/logs': 'http://localhost:8080',
      '/alerts': 'http://localhost:8080',
      '/anomalies': 'http://localhost:8080',
      '/rca': 'http://localhost:8080',
    }
  }
})
