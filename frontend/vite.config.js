import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // Esto es para el docker 
  server: {
    host: true,      // Permite conexiones desde fuera del contenedor
    strictPort: true,
    port: 5173,
    watch: {
      usePolling: true, // ¡CRUCIAL para que Windows detecte los cambios!
    }
  }

})
