import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: [
        'favicon.svg',
        'icons/apple-touch-icon.png',
        'icons/icon.svg',
      ],
      manifest: {
        name: 'GeoFun',
        short_name: 'GeoFun',
        description: 'Cartes, quiz et packs géographie — France, territoires, monde.',
        theme_color: '#163040',
        background_color: '#f4f1ea',
        display: 'standalone',
        orientation: 'portrait-primary',
        lang: 'fr',
        start_url: '/',
        scope: '/',
        categories: ['education', 'games'],
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Hors-ligne après 1 ouverture en ligne : shell + drapeaux/blasons/cartes/maps
        globPatterns: ['**/*.{js,css,html,ico,svg,png,json,webmanifest,woff2}'],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        navigateFallback: 'index.html',
        runtimeCaching: [
          {
            urlPattern: /\/(blasons|flags|mockups|maps)\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'geofun-media',
              expiration: {
                maxEntries: 1200,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 43125,
    strictPort: true,
  },
})
