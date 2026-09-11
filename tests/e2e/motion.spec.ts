import { expect, test, type Locator, type Page } from "@playwright/test";

async function centerInViewport(locator: Locator) {
  await locator.evaluate((element) => element.scrollIntoView({ block: "center", behavior: "instant" }));
}

async function storyProgress(story: Locator) {
  return story.evaluate((element) => Number.parseFloat(getComputedStyle(element).getPropertyValue("--story-progress")));
}

async function expectCurrentStep(story: Locator, index: number) {
  const current = story.locator("[data-story-step]").nth(index);
  await centerInViewport(current);
  await expect(current).toHaveAttribute("data-active", "true");
  await expect(current).toHaveAttribute("aria-current", "step");
  await expect(story.locator('[data-story-step][data-active="true"]')).toHaveCount(1);
  await expect(story.locator('[data-story-step][aria-current="step"]')).toHaveCount(1);
  await expect(current.getByRole("heading")).toBeInViewport();
  await expect.poll(() => storyProgress(story)).toBeGreaterThanOrEqual(0);
  await expect.poll(() => storyProgress(story)).toBeLessThanOrEqual(1);
}

async function moveInsideTilt(page: Page, tilt: Locator) {
  await centerInViewport(tilt);
  const bounds = await tilt.boundingBox();
  expect(bounds).not.toBeNull();
  await page.mouse.move(bounds!.x + bounds!.width * 0.9, bounds!.y + bounds!.height * 0.1);
}

async function tiltAngles(surface: Locator) {
  return surface.evaluate((element) => {
    const matrix = new DOMMatrix(getComputedStyle(element).transform);
    return {
      x: Math.atan2(matrix.m23, matrix.m22) * 180 / Math.PI,
      y: Math.atan2(-matrix.m13, matrix.m11) * 180 / Math.PI,
    };
  });
}

for (const width of [390, 1440]) {
  test(`sensory and ritual stories follow scroll in both directions at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    for (const name of ["sensory", "ritual"]) {
      const story = page.locator(`[data-scroll-story="${name}"]`);
      await expect(story.locator("[data-story-step]")).toHaveCount(4);
      await expectCurrentStep(story, 0);
      const start = await storyProgress(story);

      for (const index of [1, 2, 3]) await expectCurrentStep(story, index);
      const end = await storyProgress(story);
      expect(end).toBeGreaterThan(start);

      await expectCurrentStep(story, 1);
      await expect.poll(() => storyProgress(story)).toBeLessThan(end);
      await expectCurrentStep(story, 0);

      // Previous steps remain in the reading order instead of becoming hidden panels.
      for (const step of await story.locator("[data-story-step]").all()) {
        await expect(step).not.toHaveAttribute("aria-hidden", "true");
        await expect(step.getByRole("heading")).toBeVisible();
      }
    }
  });
}

test("mobile menu traps keyboard focus, restores it on Escape and releases it on desktop", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("button", { name: "Abrir menu" });
  await toggle.focus();
  await page.keyboard.press("Enter");
  const navigation = page.getByRole("navigation", { name: "Navegação mobile" });
  const links = navigation.getByRole("link");
  await expect(links.first()).toBeFocused();

  for (let index = 1; index < await links.count(); index++) {
    await page.keyboard.press("Tab");
    await expect(links.nth(index)).toBeFocused();
  }
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Fechar menu" })).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  await expect(links.last()).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(toggle).toBeFocused();
  await expect(navigation).toBeHidden();

  await page.keyboard.press("Enter");
  await expect(links.first()).toBeFocused();
  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.locator("body")).toHaveAttribute("data-menu-open", "false");
  await expect(page.locator(".header-logo")).toBeFocused();
  await expect(page.locator("main")).toHaveJSProperty("inert", false);
  await expect(page.locator("footer")).toHaveJSProperty("inert", false);
  await page.keyboard.press("Tab");
  await expect(page.getByRole("navigation", { name: "Navegação principal" }).getByRole("link").first()).toBeFocused();

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(navigation).toBeHidden();
});

test("desktop tilt is subtle and motion stops when the preference changes", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  const tilt = page.locator("[data-tilt]").first();
  const surface = tilt.locator(".tilt-surface");
  await moveInsideTilt(page, tilt);
  await expect.poll(async () => {
    const { x, y } = await tiltAngles(surface);
    return Math.max(Math.abs(x), Math.abs(y));
  }).toBeGreaterThan(0.1);
  const angles = await tiltAngles(surface);
  expect(Math.abs(angles.x)).toBeLessThanOrEqual(1.51);
  expect(Math.abs(angles.y)).toBeLessThanOrEqual(1.51);
  await page.mouse.wheel(0, 24);
  const afterScrollBounds = await tilt.boundingBox();
  await page.mouse.move(afterScrollBounds!.x + afterScrollBounds!.width * .8, afterScrollBounds!.y + afterScrollBounds!.height * .2);
  await expect.poll(async () => {
    const { x, y } = await tiltAngles(surface);
    return Math.max(Math.abs(x), Math.abs(y));
  }).toBeGreaterThan(.1);

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(surface).toHaveCSS("transform", "none");
  const parallax = page.locator("[data-parallax]");
  expect(await parallax.count()).toBeGreaterThan(0);
  for (const layer of await parallax.all()) await expect(layer).toHaveCSS("transform", "none");
  const sweeps = page.locator("[data-light-sweep]");
  expect(await sweeps.count()).toBeGreaterThan(0);
  for (const sweep of await sweeps.all()) {
    await expect.poll(() => sweep.evaluate((element) => getComputedStyle(element, "::after").animationName)).toBe("none");
    await expect.poll(() => sweep.evaluate((element) => getComputedStyle(element, "::after").opacity)).toBe("0");
  }
  const pairing = page.locator(".pairing-card").first();
  await pairing.hover();
  await expect(pairing.locator("img")).toHaveCSS("transform", "none");
  await expect(pairing.locator("h3")).toHaveCSS("transform", "none");

  // Scroll-driven meaning is retained even though spatial effects are disabled.
  const ritual = page.locator('[data-scroll-story="ritual"]');
  await expectCurrentStep(ritual, 3);
  await moveInsideTilt(page, tilt);
  await expect(surface).toHaveCSS("transform", "none");

  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.mouse.move(0, 0);
  await moveInsideTilt(page, tilt);
  await expect.poll(async () => {
    const { x, y } = await tiltAngles(surface);
    return Math.max(Math.abs(x), Math.abs(y));
  }).toBeGreaterThan(0.1);
  await page.mouse.move(0, 0);
  await expect(surface).toHaveCSS("transform", "none");
});

test("touch screens keep bottle images stable", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  try {
    const page = await context.newPage();
    await page.goto("/");
    expect(await page.evaluate(() => matchMedia("(hover: hover) and (pointer: fine)").matches)).toBe(false);
    const tilt = page.locator("[data-tilt]").first();
    await moveInsideTilt(page, tilt);
    await expect(tilt.locator(".tilt-surface")).toHaveCSS("transform", "none");
  } finally {
    await context.close();
  }
});

test("without JavaScript the stories and bottle certificate remain readable", async ({ browser, baseURL }) => {
  const context = await browser.newContext({ baseURL, javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  try {
    const page = await context.newPage();
    await page.goto("/?token=BRG-001-00037-X8Y2");
    for (const name of ["sensory", "ritual"]) {
      const story = page.locator(`[data-scroll-story="${name}"]`);
      await expect(story.locator("[data-story-step]")).toHaveCount(4);
      for (const step of await story.locator("[data-story-step]").all()) {
        await centerInViewport(step);
        await expect(step.getByRole("heading")).toBeInViewport();
        await expect(step).toHaveCSS("opacity", "1");
        await expect(step.locator("p")).toBeVisible();
        await expect(step).not.toHaveAttribute("aria-hidden", "true");
      }
    }
    await page.locator("#certificado").scrollIntoViewIfNeeded();
    await expect(page.locator("#certificate-title")).toHaveText("Garrafa Nº 037");
    await expect(page.locator("#certificado .certificate")).toHaveCSS("opacity", "1");
    const status = page.locator("#certificado .certificate__status");
    await expect(status).toContainText("Identificação verificada");
    await expect(status).toBeVisible();
  } finally {
    await context.close();
  }
});
