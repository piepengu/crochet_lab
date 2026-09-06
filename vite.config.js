import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('@tensorflow') || id.includes('mobilenet')) return 'tfjs'
          if (id.includes('three') || id.includes('@react-three')) return 'three'
          if (id.includes('@react-pdf')) return 'pdf'
          if (id.includes('framer-motion')) return 'motion'
          if (id.includes('chart.js') || id.includes('react-chartjs')) return 'charts'
        },
      },
    },
    chunkSizeWarningLimit: 900,
  },
})
