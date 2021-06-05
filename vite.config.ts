import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.tsx'),
      name: 'viewerjs_react'
    },
    rollupOptions: {
      external: ['react', 'viewerjs', 'react-dom'],
    },
    minify: false,
  },
  plugins: [reactRefresh()]
})
