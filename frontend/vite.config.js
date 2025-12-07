import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',   // ✅ IMPORTANT for Vercel / GitHub Pages / Static deploy
  plugins: [
    react(),
    tailwindcss(),
  ],
})
