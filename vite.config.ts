import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from 'vite-plugin-pwa';
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    headers: {
      // Enable HTTPS headers for PWA features in development
      'Cross-Origin-Embedder-Policy': 'credentialless',
      'Cross-Origin-Opener-Policy': 'same-origin',
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'icon.svg', 'offline.html', 'offline-image.svg'],
      manifest: {
        name: 'EdVise - AI Career Guidance Platform',
        short_name: 'EdVise',
        description: 'Comprehensive AI-powered career guidance, college recommendations, and scholarship discovery platform for students',
        theme_color: '#3b82f6',
        background_color: '#0f172a',
        display: 'standalone',
        orientation: 'portrait-primary',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'icon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Career Assessment Quiz',
            short_name: 'Quiz',
            description: 'Take AI-powered career assessment to discover your ideal career path',
            url: '/quiz',
            icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml' }]
          },
          {
            name: 'Explore Colleges',
            short_name: 'Colleges',
            description: 'Browse colleges and universities with detailed information and rankings',
            url: '/colleges',
            icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml' }]
          },
          {
            name: 'Find Scholarships',
            short_name: 'Scholarships',
            description: 'Discover scholarship opportunities tailored to your profile',
            url: '/scholarships',
            icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml' }]
          },
          {
            name: 'Timeline Tracker',
            short_name: 'Timeline',
            description: 'Track important deadlines and application timelines',
            url: '/timeline-tracker',
            icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml' }]
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(gstatic|googleapis)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          },
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/v1\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 5 // 5 minutes
              },
              networkTimeoutSeconds: 10
            }
          },
          {
            urlPattern: /\.(png|jpg|jpeg|svg|gif|webp)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Enhanced build configuration for PWA
    rollupOptions: {
      output: {
        // Better chunk naming for caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        // Optimized manual chunks for better caching and loading
        manualChunks: {
          // Core React libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI components and icons
          'ui-vendor': [
            '@radix-ui/react-dialog', 
            '@radix-ui/react-dropdown-menu', 
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            'lucide-react'
          ],
          // Backend and API
          'api-vendor': ['@supabase/supabase-js', '@tanstack/react-query'],
          // Charts and visualization
          'chart-vendor': ['chart.js', 'react-chartjs-2', 'recharts'],
          // PWA and offline features
          'pwa-vendor': ['workbox-window'],
          // Utilities
          'utils-vendor': ['date-fns', 'zod', 'clsx'],
        },
      },
    },
    // Optimize chunk size for better loading performance
    chunkSizeWarningLimit: 1000,
    // Enable source maps only in development
    sourcemap: process.env.NODE_ENV === 'development',
    // Use esbuild for faster builds
    minify: 'esbuild',
    // Target modern browsers that support PWAs
    target: ['es2020', 'edge88', 'firefox78', 'chrome87', 'safari13.1'],
    // Optimize CSS
    cssCodeSplit: true,
    // Report compressed size
    reportCompressedSize: true,
    // Build output directory
    outDir: 'dist',
    // Assets directory
    assetsDir: 'assets',
  },
  // Enable caching
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'lucide-react',
    ],
  },
});
