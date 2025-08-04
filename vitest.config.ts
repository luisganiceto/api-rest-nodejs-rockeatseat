import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
      hookTimeout: 60000, // 60s ou o que achar necessário
    }
  })