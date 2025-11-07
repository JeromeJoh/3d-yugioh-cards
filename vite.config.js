import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  root: process.cwd(),
  base: "./",
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '~components': path.resolve(__dirname, 'src/components'),
    },
    extensions: ['.js', '.ts', '.json'],
  },
});