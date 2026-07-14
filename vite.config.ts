import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// PWA vorerst deaktiviert, bis vite-plugin-pwa im Repo installiert ist.
// import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    // VitePWA({ registerType: "autoUpdate" }),
  ],
  base: "/lernapp/",
});
