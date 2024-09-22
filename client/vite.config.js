import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      path: 'path-browserify', 
      url: 'url-polyfill', 
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        secure: false,
      },
    },
  },
  optimizeDeps: {
    exclude: ['source-map-js', 'fs'],
  },
  
  plugins: [react()],
})
