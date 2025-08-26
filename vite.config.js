import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['appicon.png'],
      manifest: {
        name: 'RouteWise',
        short_name: 'RouteWise',
        theme_color: '#10b981',
        background_color: '#0b0f13',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/appicon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/appicon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/appicon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
    })
  ]
})
