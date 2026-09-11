import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vitest";
import { DigitalCertificate } from "@/sections/DigitalCertificate";
import { PersonalPairing } from "@/sections/PersonalPairing";
import { PersonalInvitation } from "@/sections/PersonalInvitation";
import { getPairingById } from "@/data/pairings";
import { getBottleIdentity } from "@/lib/bottle";

it("shares only the individual URL and neutral copy even with customer details on screen", async () => {
  const share = vi.fn().mockResolvedValue(undefined);
  Object.defineProperty(navigator, "share", { configurable: true, value: share });
  const bottle = { ...getBottleIdentity({ lote: "001", garrafa: "001", total: "5" }), source: "token" as const, token: "BRG-7X9K-P2M8" };
  render(<DigitalCertificate bottle={bottle} personalization={{ customerName: "Renato", pairingName: "Chocolate amargo 70%" }} experiencePath="/e/BRG-7X9K-P2M8" />);
  fireEvent.click(screen.getByRole("button", { name: "Compartilhar minha garrafa" }));
  await waitFor(() => expect(share).toHaveBeenCalledOnce());
  const data = share.mock.calls[0][0];
  expect(data.title).toBe("BORANGA");
  expect(data.text).toBe("Conheça minha experiência BORANGA.");
  expect(new URL(data.url).pathname).toBe("/e/BRG-7X9K-P2M8");
  expect(JSON.stringify(data)).not.toMatch(/Renato|Chocolate|message|nome/);
  expect(screen.getByText("Identificação digital verificada")).toBeInTheDocument();
  await waitFor(() => expect(screen.getByRole("button", { name: "Experiência pronta para compartilhar" })).toBeInTheDocument());
});
it("keeps all pairing instructions and the current recipient in server HTML", () => {
  const html = renderToStaticMarkup(<PersonalPairing pairing={getPairingById("dark-chocolate-70")!} customerName="Renato" />);
  expect(html).toContain("Sua experiência");
  expect(html).toContain("Renato");
  expect(html).toContain("Retorne ao copo");
  expect(html).toContain("Consulte a embalagem individual");
  expect(html).not.toContain("Armazenamento");
  expect(html).not.toContain('data-motion="ready"');
});
it("uses a restrained fallback message and escapes code-like customer names", () => {
  const html = renderToStaticMarkup(<PersonalInvitation name={'<script>alert("x")</script>'} />);
  expect(html).not.toContain("<script>");
  expect(html).toContain("&lt;script&gt;");
  expect(html).toContain("Esta experiência BORANGA foi preparada especialmente para você.");
  expect(html).not.toContain("Experiência selecionada");
});
