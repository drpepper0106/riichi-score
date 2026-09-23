import { webcrypto } from 'node:crypto'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

if (!globalThis.crypto?.getRandomValues) {
  globalThis.crypto = webcrypto
}

const repoBase = '/riichi-score/'
const appBase = process.env.GITHUB_PAGES === 'true' ? repoBase : '/'

export default defineConfig({
  base: appBase,
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon.svg'],
      manifest: {
        id: appBase,
        name: '日麻算点助手',
        short_name: '算点助手',
        description: '选牌型，算符数。中文日麻算点助手，附役种参考与点数速查表。',
        theme_color: '#154f46',
        background_color: '#f2f5f4',
        display: 'standalone',
        orientation: 'any',
        lang: 'zh-CN',
        scope: appBase,
        start_url: appBase,
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
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
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
      devOptions: {
        enabled: true,
      },
    }),
  ],
})
