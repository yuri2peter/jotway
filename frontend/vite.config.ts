/* eslint-disable node/no-unpublished-import */
import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const FRONTEND_PORT = 8000;
const SERVER_PORT = 3000;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  envPrefix: 'FRONTEND_', // 以 envPrefix 开头的环境变量会通过 import.meta.env 暴露在你的客户端源码中
  resolve: {
    alias: {
      'src/': `${path.resolve(__dirname, 'src')}/`, // 别名，指向 src 目录
    },
  },
  define: {
    'process.env': {}, // 一些包需要此全局变量
  },
  server: {
    port: FRONTEND_PORT, // 开发服务器端口
    host: true, // 监听所有地址，包括局域网和公网地址
    strictPort: true, // 端口被占用时，抛出错误
    proxy: {
      // API请求代理
      '/api': {
        target: `http://127.0.0.1:${SERVER_PORT}`,
      },
      // resources文件代理
      '/uploads': {
        target: `http://127.0.0.1:${SERVER_PORT}`,
      },
      // socket推送
      '/socket.io': {
        target: `ws://127.0.0.1:${SERVER_PORT}`,
        ws: true,
      },
    },
  },
  preview: {
    port: FRONTEND_PORT, // 预览服务器端口
    host: true, // 监听所有地址，包括局域网和公网地址
    strictPort: true, // 端口被占用时，抛出错误
  },
  envDir: '.',
});
