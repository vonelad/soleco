import { defineConfig } from "vitest/config";
import solid from "vite-plugin-solid";

export default defineConfig({
  test: {
    setupFiles: "./test/setup.ts",
    environment: "jsdom",
    pool: "forks",
    poolOptions: {
      forks: {
        isolate: false,
      },
    },
    deps: {
      optimizer: {
        web: {
          exclude: ["solid-js"],
        },
      },
    },
    globals: true,
  },
  plugins: [solid()],
  resolve: {
    conditions: ["development", "browser"],
  },
});
