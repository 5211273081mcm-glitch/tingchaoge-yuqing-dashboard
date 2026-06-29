import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 纯静态站点构建配置（脱离飞书妙搭平台运行时）。
// - 使用相对 base，方便部署到任意静态托管根目录或子路径
// - 通过 styled-jsx/babel 支持页面内的 <style jsx> 写法，保持与 5 月页面一致
// - 产物输出到项目根目录的 dist/（index.html + assets/）
// GitHub Pages 项目站点部署在子路径下，需要把 base 设为仓库名。
// 可通过环境变量覆盖（如需部署到自定义域名根路径时设为 '/'）。
const base = process.env.VITE_BASE ?? '/tingchaoge-yuqing-dashboard/';

export default defineConfig({
  root: path.resolve(__dirname, 'client'),
  base,
  plugins: [
    react({
      jsxRuntime: 'automatic',
      babel: {
        plugins: [['styled-jsx/babel']],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'client/src'),
      '@client': path.resolve(__dirname, 'client'),
      '@shared': path.resolve(__dirname, 'shared'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'dist'),
    emptyOutDir: true,
    chunkSizeWarningLimit: 1500,
  },
  server: {
    port: 8080,
    host: 'localhost',
  },
});
