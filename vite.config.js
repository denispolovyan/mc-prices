import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: '/mc-prices/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
