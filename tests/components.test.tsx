import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { DigitalCertificate } from "@/sections/DigitalCertificate";
import { BottleIdentity } from "@/sections/BottleIdentity";
import { getBottleIdentity } from "@/lib/bottle";
import { motionConfig } from "@/lib/motion-config";
const token = getBottleIdentity({ token: "BRG-001-00037-X8Y2" });
afterEach(() => { vi.useRealTimers(); });
function clipboard(fn = vi.fn().mockResolvedValue(undefined)) {
  Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: fn } });
  Object.defineProperty(navigator, "share", { configurable: true, value: undefined });
  return fn;
}
describe("DigitalCertificate", () => {
  it("shows a verified registry identity", () => { render(<DigitalCertificate bottle={token} />); expect(screen.getByText("Identificação verificada")).toBeInTheDocument(); expect(screen.getByRole("heading", { name: "Garrafa Nº 037" })).toBeInTheDocument(); });
  it("never calls legacy query verified", () => { render(<DigitalCertificate bottle={getBottleIdentity({ lote: "001", garrafa: "037", total: "250" })} />); expect(screen.getByText("Identificação da edição")).toBeInTheDocument(); expect(screen.queryByText("Identificação verificada")).not.toBeInTheDocument(); });
  it("shows invalid identification without a bottle claim", () => { render(<DigitalCertificate bottle={getBottleIdentity({ token: "bad" })} />); expect(screen.getByRole("heading")).toHaveTextContent("Não foi possível validar"); expect(screen.queryByText(/integra uma edição numerada/)).not.toBeInTheDocument(); });
  it("copies a canonical link", async () => { const copy = clipboard(); render(<DigitalCertificate bottle={token} />); fireEvent.click(screen.getByRole("button")); await screen.findByText("Link da garrafa copiado."); expect(copy).toHaveBeenCalledWith(expect.stringContaining("?token=BRG-001-00037-X8Y2")); });
  it("shows preparation while sharing and prevents repeated requests", async () => {
    let completeCopy!: () => void;
    const copy = clipboard(vi.fn(() => new Promise<void>((resolve) => { completeCopy = resolve; })));
    render(<DigitalCertificate bottle={token} />);
    const button = screen.getByRole("button", { name: "Compartilhar minha garrafa" });
    fireEvent.click(button);
    expect(button).toHaveAccessibleName("Preparando…");
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(copy).toHaveBeenCalledTimes(1);
    await act(async () => { completeCopy(); });
    expect(button).toHaveAccessibleName("Link copiado");
    expect(button).toBeEnabled();
    expect(button).toHaveAttribute("aria-busy", "false");
  });
  it("restores the original label and announcement after the feedback interval", async () => {
    vi.useFakeTimers();
    clipboard();
    render(<DigitalCertificate bottle={token} />);
    await act(async () => { fireEvent.click(screen.getByRole("button")); });
    expect(screen.getByRole("button")).toHaveAccessibleName("Link copiado");
    await act(async () => { vi.advanceTimersByTime(motionConfig.shareFeedbackDuration - 1); });
    expect(screen.getByRole("button")).toHaveAccessibleName("Link copiado");
    await act(async () => { vi.advanceTimersByTime(1); });
    expect(screen.getByRole("button")).toHaveAccessibleName("Compartilhar minha garrafa");
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });
  it("cleans up feedback timers when leaving the certificate", async () => {
    vi.useFakeTimers();
    clipboard();
    const { unmount } = render(<DigitalCertificate bottle={token} />);
    await act(async () => { fireEvent.click(screen.getByRole("button")); });
    expect(vi.getTimerCount()).toBeGreaterThan(0);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
  it("handles failure of both share and clipboard", async () => {
    clipboard(vi.fn().mockRejectedValue(new Error("Denied")));
    Object.defineProperty(navigator, "share", { configurable: true, value: vi.fn().mockRejectedValue(new Error("Denied")) });
    render(<DigitalCertificate bottle={token} />); fireEvent.click(screen.getByRole("button"));
    await screen.findByText(/Não foi possível copiar/); expect(screen.getByRole("button")).toBeEnabled();
  });
  it("does not copy after native share cancellation", async () => {
    const copy = clipboard();
    Object.defineProperty(navigator, "share", { configurable: true, value: vi.fn().mockRejectedValue(new DOMException("Cancelled", "AbortError")) });
    render(<DigitalCertificate bottle={token} />); fireEvent.click(screen.getByRole("button"));
    await waitFor(() => expect(screen.getByRole("button")).toBeEnabled()); expect(copy).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toHaveAccessibleName("Compartilhar minha garrafa");
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });
  it("shares natively when available", async () => {
    const copy = clipboard(); const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "share", { configurable: true, value: share });
    render(<DigitalCertificate bottle={token} />); fireEvent.click(screen.getByRole("button"));
    await screen.findByText("Compartilhamento concluído."); expect(share).toHaveBeenCalled(); expect(copy).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toHaveAccessibleName("Experiência pronta para compartilhar");
  });
  it("falls back to copying when native sharing is unavailable at runtime", async () => {
    const copy = clipboard();
    Object.defineProperty(navigator, "share", { configurable: true, value: vi.fn().mockRejectedValue(new Error("Unavailable")) });
    render(<DigitalCertificate bottle={token} />);
    fireEvent.click(screen.getByRole("button"));
    await screen.findByText("Link da garrafa copiado.");
    expect(copy).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button")).toHaveAccessibleName("Link copiado");
  });
  it("preserves focus and removes the temporary input in the legacy clipboard fallback", async () => {
    clipboard();
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined });
    const copy = vi.fn().mockReturnValue(true);
    Object.defineProperty(document, "execCommand", { configurable: true, value: copy });
    try {
      render(<DigitalCertificate bottle={token} />);
      const button = screen.getByRole("button");
      button.focus();
      fireEvent.click(button);
      await screen.findByText("Link da garrafa copiado.");
      expect(copy).toHaveBeenCalledWith("copy");
      expect(document.querySelector("textarea")).not.toBeInTheDocument();
      expect(button).toHaveFocus();
    } finally { Reflect.deleteProperty(document, "execCommand"); }
  });
});
describe("BottleIdentity", () => {
  it("renders numbered bottle", () => { render(<BottleIdentity bottle={token} />); expect(screen.getByText("037")).toBeInTheDocument(); expect(screen.getByText("Identificação verificada")).toBeInTheDocument(); });
  it("renders generic edition", () => { render(<BottleIdentity bottle={getBottleIdentity({})} />); expect(screen.getByText("Edição Especial BORANGA")).toBeInTheDocument(); });
  it("rejects impossible identity without displaying its numbers", () => { render(<BottleIdentity bottle={getBottleIdentity({ lote: "001", garrafa: "250", total: "50" })} />); expect(screen.getByText("Identificação não validada.")).toBeInTheDocument(); expect(screen.queryByText("250")).not.toBeInTheDocument(); });
});
