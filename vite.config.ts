import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "src/index.ts",
      name: "execution",
      fileName: () => "index.js",
      formats: ["es"],
    },
    rollupOptions: {
      external: ["node:fs", "node:path", "node:fs/promises"],
    },
    sourcemap: true,
    minify: false,
  },
  plugins: [
    dts({
      rollupTypes: true,
    }),
  ],
});
