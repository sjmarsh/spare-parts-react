import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from 'fs';
import dns from 'dns';

dns.setDefaultResultOrder('verbatim');

export default defineConfig({
  server: {
    host: 'localhost',
    port: 3000,
    open: true,
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