import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080/Java4_ASM_BackEnd/api', // URL của backend
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // Xóa tiền tố `/api`
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});