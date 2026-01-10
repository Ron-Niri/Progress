import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file from directory one level up
  const env = loadEnv(mode, '../', '')
  
  const serverPort = env.SERVER_PORT || 5000
  
  return {
    plugins: [react()],
    server: {
      port: parseInt(env.PORT) || 5173
    },
    define: {
      'import.meta.env.VITE_API_URL': mode === 'production' 
        ? JSON.stringify('/api') 
        : JSON.stringify(`http://localhost:${serverPort}/api`)
    }
  }
})
