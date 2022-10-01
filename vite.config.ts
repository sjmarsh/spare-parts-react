import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from 'fs';

export default defineConfig({
  server: {
    host: 'localhost',
    port: 3000,
    https: {
      key: fs.readFileSync('../reactcert/key.pem'),
      cert: fs.readFileSync('../reactcert/cert.pem')
    }
  },
  plugins: [react()],
    test: {
      globals: true,
      setupFiles: 'src/setupTests.js',
      environment: 'jsdom'
    }
});