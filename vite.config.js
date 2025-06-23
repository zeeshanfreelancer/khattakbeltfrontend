import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/khattakbeltfrontend",
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000/',
        changeOrigin: true,
        secure: false
      }
    }
  }
});