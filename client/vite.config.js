import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    https: {
      key: 'server.key', // Chemin vers la clé privée
      cert: 'server.cert', // Chemin vers le certificat
    },
  },
});
