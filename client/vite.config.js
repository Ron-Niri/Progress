import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file from directory one level up
  const env = loadEnv(mode, '../', '')
  
  const serverPort = env.SERVER_PORT || 5001
  
  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.png', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
        manifest: {
          name: 'Progress',
          short_name: 'Progress',
          description: 'Track your personal evolution with precision and style.',
          theme_color: '#3B82F6',
          background_color: '#FBFBFA',
          display: 'standalone',
          scope: '/',
          start_url: '/',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable'
            }
          ]
        }
      })
    ],
    server: {
      port: parseInt(env.PORT) || 5173
    },
    define: {
      'import.meta.env.VITE_ADMIN_USERNAME': JSON.stringify(env.VITE_ADMIN_USERNAME || 'Ron')
    }
  }
})
