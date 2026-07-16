import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
import react from "@vitejs/plugin-react";
// PWA vorerst deaktiviert, bis vite-plugin-pwa im Repo installiert ist.
// import { VitePWA } from "vite-plugin-pwa";
export default defineConfig({
    plugins: [
        react(),
        // VitePWA({ registerType: "autoUpdate" }),
    ],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    base: "/lernapp/",
});
