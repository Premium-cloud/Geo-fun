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
        // Assets app + blasons/drapeaux courants ; le reste en réseau
        globPatterns: ['**/*.{js,css,html,ico,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-css',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /\/(blasons|flags|mockups)\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'geofun-media',
              expiration: { maxEntries: 800, maxAgeSeconds: 60 * 60 * 24 * 30 },
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
