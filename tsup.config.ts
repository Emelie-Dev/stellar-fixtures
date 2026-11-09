import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "horizon/index": "src/horizon/index.ts",
    "rpc/index": "src/rpc/index.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  splitting: false,
  clean: true,
  sourcemap: true,
  target: "node18",
});
