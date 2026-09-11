import { render, screen, within } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { YourEdition } from "@/sections/YourEdition";
import { Footer } from "@/sections/Footer";
import { DigitalCertificate } from "@/sections/DigitalCertificate";
import { getBottleIdentity } from "@/lib/bottle";

describe("edition and closing ceremony", () => {
  it("renders the exact edition number without a counter or altered padding", () => {
    render(<YourEdition bottle={getBottleIdentity({ token: "BRG-001-00037-X8Y2" })} />);
    expect(screen.getByText("037")).toBeInTheDocument();
    expect(screen.getByText("Lote 001")).toBeInTheDocument();
    expect(screen.getByText("de 250")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Explorar o certificado" })).toHaveAttribute("href", "#certificado");
  });

  it("does not invent a number for an invalid edition", () => {
    render(<YourEdition bottle={getBottleIdentity({ token: "unknown", lote: "001", garrafa: "037" })} />);
    expect(screen.getByText("Não foi possível validar esta identificação.")).toBeInTheDocument();
    expect(screen.queryByText("037")).not.toBeInTheDocument();
    expect(screen.queryByText("Identificação verificada")).not.toBeInTheDocument();
  });

  it("keeps the closing slogan, product information, and all existing navigation", () => {
    render(<Footer />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveTextContent("Mais que um licor. Uma experiência.");
    expect(footer).toHaveTextContent("Licor Extra Luxo de Jabuticaba · 750 mL · 30% vol.");
    expect(footer).toHaveTextContent("Beba com moderação.");
    const navigation = within(footer).getByRole("navigation", { name: "Navegação do rodapé" });
    expect(within(navigation).getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual([
      "#historia", "#ritual", "#harmonizacao", "#sua-garrafa", "#contato",
    ]);
  });

  it("includes the edition and certificate in server HTML before motion initialization", () => {
    const bottle = getBottleIdentity({ lote: "001", garrafa: "037", total: "250" });
    const html = renderToStaticMarkup(<><YourEdition bottle={bottle} /><DigitalCertificate bottle={bottle} /><Footer /></>);
    expect(html).toContain("037");
    expect(html).toContain("Identificação da edição");
    expect(html).toContain("Compartilhar minha garrafa");
    expect(html).not.toContain('data-motion="ready"');
    expect(html).not.toContain("Identificação verificada");
  });
});
