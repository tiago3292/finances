import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// defineConfig é uma função do Vite que recebe as configurações do projeto
export default defineConfig({
  plugins: [
    react(), // plugin que ensina o Vite a entender arquivos .jsx
    tailwindcss(), // plugin que ativa o Tailwind dentro do Vite
  ],
})