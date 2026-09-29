import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,       // Porta fixa — nunca deixa o Vite mudar para 5174, 5175, etc.
    strictPort: true, // Se 5173 estiver em uso, falha com erro claro em vez de mudar silenciosamente
  }
})
