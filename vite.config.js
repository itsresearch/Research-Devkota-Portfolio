import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: '/', // this is correct for custom domain
  plugins: [react()],
});
