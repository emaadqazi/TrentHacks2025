import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5001', // Changed to 5001 (5000 is used by AirPlay)
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.error('❌ Proxy error:', err.message);
          });
          proxy.on('proxyReq', (_proxyReq, req, _res) => {
            console.log('🔄 Proxying:', req.method, req.url, '→ http://localhost:5001' + req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('📥 Proxy response:', proxyRes.statusCode, 'for', req.url);
          });
        },
      },
    },
  },
})

