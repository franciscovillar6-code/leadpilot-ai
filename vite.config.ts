import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isVercel = !!process.env.VERCEL;

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },

  vite: {
    ssr: {
      optimizeDeps: {
        include: [
          "@tanstack/react-start",
          "@tanstack/start-client-core",
        ],
      },
    },
  },

  nitro: isVercel
    ? {
        preset: "vercel",
      }
    : true,
});
