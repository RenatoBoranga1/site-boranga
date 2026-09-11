import { expect, test, type Page } from "@playwright/test";

const route = "/e/BRG-7X9K-P2M8";
async function begin(page: Page) {
  const start = page.getByRole("link", { name: "Iniciar experiência" });
  await expect(start).toBeVisible();
  await start.click();
  await expect(page.locator(".experience-gate")).toHaveAttribute("data-state", "started");
  await expect(page.locator("#hero-title")).toBeFocused();
  await expect(page.locator(".hero .gold-button")).toHaveCSS("opacity", "1");
}

test("individual invitation, selected pairing, exact bottle and certificate form one continuous experience", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(route);
  await expect(page.locator("#invitation-name")).toHaveText("Renato");
  await expect(page.locator(".invitation__selection")).toContainText("Chocolate amargo 70%");
  await expect(page.locator(".experience-body")).toBeHidden();
  await expect(page.getByRole("link", { name: "Iniciar experiência" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Iniciar experiência" })).toBeFocused();
  await begin(page);
  await expect(page).toHaveURL(new RegExp(`${route}$`));
  const pairing = page.locator("#sua-experiencia");
  await pairing.scrollIntoViewIfNeeded();
  await expect(pairing.getByRole("heading", { name: "Sua experiência BORANGA" })).toBeVisible();
  await expect(pairing).toContainText("Prove um pequeno pedaço do chocolate amargo");
  for (const index of [0, 1, 2, 3, 1]) {
    const step = pairing.locator("[data-story-step]").nth(index);
    await step.evaluate((node) => node.scrollIntoView({ block: "center", behavior: "instant" }));
    await expect(step).toHaveAttribute("data-active", "true");
  }
  const edition = page.locator("#sua-edicao");
  await edition.scrollIntoViewIfNeeded();
  await expect(edition).toContainText("Preparada para Renato");
  await expect(edition.locator(".edition-number__bottle")).toContainText("001de 5");
  await edition.getByRole("link", { name: "Explorar o certificado" }).click();
  await expect(page.locator("#certificate-title")).toHaveText("Garrafa Nº 001");
  await expect(page.locator(".certificate__status")).toContainText("Identificação digital verificada");
  await expect(page.locator(".certificate__personalization")).toContainText("Chocolate amargo 70%");
  await page.getByRole("button", { name: "Abrir menu" }).click();
  await expect(page.getByRole("navigation", { name: "Navegação mobile" })).toBeVisible();
  await page.keyboard.press("Escape");
  expect(errors).toEqual([]);
});

test("invalid and disabled routes disclose no customer details and do not use query fallback", async ({ page }) => {
  await page.goto("/e/BRG-XXXX-YYYY?token=BRG-7X9K-P2M8&lote=001&garrafa=001&total=5");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Não foi possível validar esta experiência.");
  await expect(page.getByRole("link", { name: "Conhecer BORANGA" })).toHaveAttribute("href", "/");
  await expect(page.locator("body")).not.toContainText("Renato");
  await page.goto("/e/BRG-D4S8-B6T9");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Esta experiência não está disponível.");
  await expect(page.locator("body")).not.toContainText("Convite desativado de demonstração");
  await expect(page.locator("#certificado")).toHaveCount(0);
});

test("long name without pairing, citrus and bottle-only invitations preserve their own content", async ({ page }) => {
  await page.goto("/e/BRG-N8Q4-T7W2");
  await expect(page.locator("#invitation-name")).toContainText("Nome Extenso");
  await expect(page.locator(".invitation__selection")).toHaveCount(0);
  await begin(page);
  await expect(page.locator("#sua-experiencia")).toHaveCount(0);
  await expect(page.locator("#certificate-title")).toHaveText("Garrafa Nº 002");
  await page.goto("/e/BRG-C6R9-V3K8");
  await begin(page);
  await expect(page.locator("#sua-experiencia")).toContainText("Casca de laranja");
  await expect(page.locator("#sua-experiencia")).toContainText("Torça delicadamente a casca");
  await page.goto("/e/BRG-F5H8-J9M2");
  await expect(page.locator(".invitation")).toHaveCount(0);
  await expect(page.locator("#certificate-title")).toHaveText("Garrafa Nº 005");
});

test("reduced-motion invitation remains functional and can appear again on reload", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(route);
  await expect(page.locator(".invitation__name .text-reveal__line > span")).toHaveCSS("animation-name", "none");
  await begin(page);
  for (const layer of await page.locator("[data-parallax]").all()) await expect(layer).toHaveCSS("transform", "none");
  await page.reload();
  await expect(page.locator(".invitation")).toBeVisible();
  expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 });
});

test("all requested widths fit long names, pairing title, start button and certificate", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [360, 375, 390, 430, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/e/BRG-N8Q4-T7W2");
    await expect(page.getByRole("link", { name: "Iniciar experiência" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await begin(page);
    await page.locator("#certificado").scrollIntoViewIfNeeded();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await expect(page.locator(".certificate__personalization")).toContainText("Nome Extenso");
  }
});

test("private routes are noindex, uncached and expose neither other invitations nor the registry in browser scripts", async ({ page, request }) => {
  const response = await page.goto(route);
  expect(response?.headers()["cache-control"]).toContain("no-store");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex.*nofollow/);
  await expect(page.locator('meta[name="referrer"]')).toHaveAttribute("content", "no-referrer");
  const html = await response!.text();
  expect(html).not.toMatch(/BRG-N8Q4-T7W2|Convidado Cítrico|Nome Extenso/);
  const head = await page.locator("head").innerHTML();
  expect(head).not.toContain("Renato");
  const sources = await page.locator("script[src]").evaluateAll((nodes) => nodes.map((node) => (node as HTMLScriptElement).src));
  for (const source of sources) {
    const script = await (await request.get(source)).text();
    expect(script).not.toMatch(/BRG-N8Q4-T7W2|BRG-D4S8-B6T9|Convidado Cítrico/);
  }
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain("/e/");
  await page.goto("/");
  expect(await page.locator('meta[name="robots"]').count()).toBe(0);
});

test("without JavaScript the invitation, ingredient instructions and certificate remain readable", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 375, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto(route);
    await expect(page.locator("#invitation-name")).toHaveText("Renato");
    await page.getByRole("link", { name: "Iniciar experiência" }).click();
    await expect(page.locator("#hero-title")).toBeInViewport();
    await page.locator("#sua-experiencia").scrollIntoViewIfNeeded();
    await expect(page.locator("#sua-experiencia")).toContainText("Retorne ao copo");
    await expect(page.locator(".certificate__status")).toContainText("Identificação digital verificada");
  } finally { await context.close(); }
});

test("personalized query token wins over legacy query and shares a clean individual URL", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "share", { configurable: true, value: async (data: ShareData) => {
      (window as unknown as { shared: ShareData }).shared = data;
    } });
  });
  await page.goto("/?token=BRG-7X9K-P2M8&lote=999&garrafa=999&nome=private");
  await begin(page);
  await page.locator("#certificado").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Compartilhar minha garrafa" }).click();
  const shared = await page.evaluate(() => (window as unknown as { shared: ShareData }).shared);
  expect(shared.text).toBe("Conheça minha experiência BORANGA.");
  expect(shared.title).toBe("BORANGA");
  expect(new URL(shared.url!).pathname).toBe(route);
  expect(new URL(shared.url!).search).toBe("");
  expect(JSON.stringify(shared)).not.toMatch(/Renato|Chocolate|private|999/);
});
