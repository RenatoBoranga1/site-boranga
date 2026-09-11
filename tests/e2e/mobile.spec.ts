import { expect, test } from "@playwright/test";
test("mobile token, menu, certificate and clipboard", async ({ page, context }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/?token=BRG-001-00037-X8Y2");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("BORANGA");
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await expect(page.getByRole("navigation", { name: "Navegação mobile" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Abrir menu" })).toBeFocused();
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await page.getByRole("navigation", { name: "Navegação mobile" }).getByRole("link", { name: "Sua garrafa" }).click();
  await expect(page.locator("body")).toHaveAttribute("data-menu-open", "false");
  const certificate = page.locator("#certificado");
  await certificate.scrollIntoViewIfNeeded();
  await expect(certificate.getByText("Identificação verificada")).toBeVisible();
  await expect(certificate.getByRole("heading")).toHaveText("Garrafa Nº 037");
  await page.evaluate(() => Object.defineProperty(navigator, "share", { value: undefined, configurable: true }));
  await certificate.getByRole("button").click();
  await expect(certificate.getByRole("status")).toHaveText("Link da garrafa copiado.");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain("?token=BRG-001-00037-X8Y2");
  expect(errors).toEqual([]);
});
test("legacy, invalid token priority and generic fallback", async ({ page }) => {
  for (const [query, label] of [
    ["?lote=001&garrafa=037&total=250", "Identificação da edição"],
    ["?token=unknown&lote=001&garrafa=037&total=250", "Identificação não validada."],
    ["?lote=001&garrafa=250&total=50", "Identificação não validada."],
    ["", "Edição Especial BORANGA"],
  ]) {
    await page.goto("/" + query);
    await expect(page.locator("#certificado .certificate__status")).toContainText(label);
  }
});
test("all target widths have no horizontal overflow and show certificate", async ({ page }) => {
  await page.goto("/?token=BRG-001-00037-X8Y2");
  for (const width of [360, 375, 390, 430, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await expect(page.locator(".site-header")).toHaveAttribute("data-scrolled", "false");
    await expect(page.locator(".hero .gold-button")).toHaveCSS("opacity", "1");
    await expect(page.locator(".hero__image")).toHaveCSS("opacity", "1");
    await page.screenshot({ path: `artifacts/hero-${width}.png` });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await page.locator("#certificado").scrollIntoViewIfNeeded();
    await expect(page.locator("#certificate-title")).toBeVisible();
    await expect(page.locator("#certificado .certificate")).toHaveCSS("opacity", "1");
    await page.screenshot({ path: `artifacts/certificate-${width}.png` });
  }
});
test("reduced motion and no-JS content remain accessible", async ({ page, browser }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".hero__image")).toHaveCSS("animation-name", "none");
  await expect(page.locator("[data-parallax]").first()).toHaveCSS("transform", "none");
  await page.locator("#sua-garrafa").scrollIntoViewIfNeeded();
  await expect(page.locator("#sua-garrafa .reveal").first()).toHaveCSS("opacity", "1");
  const context = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await context.newPage();
  await staticPage.goto("http://127.0.0.1:3100/?token=BRG-001-00037-X8Y2");
  await expect(staticPage.locator("#sua-garrafa .reveal").first()).toHaveCSS("opacity", "1");
  await context.close();
});
