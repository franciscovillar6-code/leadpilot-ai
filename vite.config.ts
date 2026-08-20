// @lovable.dev/vite-tanstack-config already includes the core plugins.
// On Vercel we explicitly use Nitro's Vercel preset.

import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const isVercel = !!process.env.VERCEL;

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
  },

  nitro: isVercel
    ? {
        preset: "vercel",
      }
    : true,
});
