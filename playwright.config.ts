import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e", timeout: 60000, workers: 1,
  use: { baseURL: "http://127.0.0.1:3100", viewport: { width: 390, height: 844 }, trace: "retain-on-failure", screenshot: "only-on-failure" },
  webServer: { command: "pnpm start --port 3100", url: "http://127.0.0.1:3100", reuseExistingServer: !process.env.CI, timeout: 60000 },
});
