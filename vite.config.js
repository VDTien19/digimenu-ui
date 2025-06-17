import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss()
    ],
    resolve: {
        alias: {
            '~': path.resolve('src'), // Alias cho thư mục src
        },
    },
    css: {
        modules: {
          generateScopedName: function (name, filename) {
            const file = filename.match(/([^/\\]+)\.module\.scss$/)?.[1] || "unknown";
            // eslint-disable-next-line no-undef
            return `${file}__${name}__${Buffer.from(name).toString('base64').slice(0, 5)}`;
          }
        }
    },
    server: {
        proxy: {
            '/socket.io': {
                target: 'https://digimenu-backend-production.up.railway.app',
                ws: true,
                changeOrigin: true,
                secure: true, // Đảm bảo chấp nhận chứng chỉ SSL
                logLevel: 'debug', // Để debug chi tiết lỗi proxy
            },
        },
    },
});
