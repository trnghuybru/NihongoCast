import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/auth": {
        target: "http://localhost:8000",
        changeOrigin: true,
        secure: false,
      },
      // '/api': 'http://localhost:5000'
      '/api': 'http://localhost:5000',
      '/module2-api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      }

    },
  },
});
