import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'ongi',
        short_name: '온기',
        description: '온기 - 당신의 일상을 따뜻하게',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        display_override: ["standalone", "browser"],
        scope: '/',
        start_url: '/',
        orientation: 'portrait',
        "icons": [
          {
            "src": "/icon-48x48.png",
            "sizes": "48x48",
            "type": "image/png"
          },
          {
            "src": "/icon-72x72.png",
            "sizes": "72x72",
            "type": "image/png"
          },
          {
            "src": "/icon-96x96.png",
            "sizes": "96x96",
            "type": "image/png"
          },
          {
            "src": "/icon-144x144.png",
            "sizes": "144x144",
            "type": "image/png"
          },
          {
            "src": "/icon-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "/icon-256x256.png",
            "sizes": "256x256",
            "type": "image/png"
          },
          {
            "src": "/icon-384x384.png",
            "sizes": "384x384",
            "type": "image/png"
          },
          {
            "src": "/icon-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
          }
        ]
      }
    })
  ],
  server: {
    port: 5174,
    proxy: {
      '/oauth2': {
        target: 'https://coffeesupliers.shop',
        changeOrigin: true,
        secure: false
      },
      '/api': {
        target: 'https://coffeesupliers.shop',
        changeOrigin: true,
        secure: false
      }
    }
  }

})
