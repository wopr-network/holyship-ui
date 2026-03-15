import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 180_000,
  retries: 0,
  use: {
    baseURL: process.env.HOLYSHIP_URL ?? "http://localhost:3000",
    trace: "retain-on-failure",
  },
  webServer: undefined,
});
