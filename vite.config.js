import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/charai/',
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  //
  server: {
    host: '0.0.0.0', // Permite conexiones desde cualquier IP
    port: 5173,      // Puerto (puedes cambiarlo)
    strictPort: true, // No probar otros puertos si este está ocupado
}})