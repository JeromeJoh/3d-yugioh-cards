import { defineConfig } from "vite";
import path from "path";

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';

  return {
    root: process.cwd(),
    base: "./",
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '~components': path.resolve(__dirname, 'src/components'),
      },
      extensions: ['.js', '.ts', '.json'],
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          vol1: path.resolve(__dirname, 'vol1/index.html'),
          vol2: path.resolve(__dirname, 'vol2/index.html'),
          vol3: path.resolve(__dirname, 'vol3/index.html'),
          vol4: path.resolve(__dirname, 'vol4/index.html'),
        },
        output: {
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
        },
        esbuild: isProd
          ? {
            drop: ['console', 'debugger'],
          }
          : {},
      },
    },
  }
});