import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Otimizações de bundle
    target: 'esnext',
    // Use esbuild minifier (mais rápido e sem dependências extras)
    minify: 'esbuild',
    // Code splitting otimizado
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'axios-vendor': ['axios']
        }
      }
    },
    // Otimizações de chunk
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    sourcemap: false
  },
  // Remover console/debugger no build usando esbuild
  esbuild: {
    drop: ['console', 'debugger']
  },
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    // Configurações para evitar bloqueios de extensões
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization'
    }
  },
  preview: {
    port: 4173,
    strictPort: false
  }
})
