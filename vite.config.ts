import dts from "vite-plugin-dts";
import { defineConfig } from "vitest/config";
import { name } from "./package.json";

export default defineConfig({
  plugins: [dts()],
  build: {
    lib: {
      entry: "src/index.ts",
      fileName: name,
      formats: ["es", "umd"],
      name,
    },
  },
});
