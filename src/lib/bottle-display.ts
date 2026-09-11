import type { BottleIdentityData } from "@/types/bottle";
export function getIdentityLabel(bottle: BottleIdentityData) {
  if (bottle.status === "invalid") return "Identificação não validada.";
  if (bottle.status === "generic") return "Edição Especial BORANGA";
  return bottle.source === "token" ? "Identificação verificada" : "Identificação da edição";
}
export function getBottleShareText(bottle: BottleIdentityData) {
  if (!bottle.isPersonalized) return "Conheça BORANGA — Licor Extra Luxo de Jabuticaba.";
  return `Minha garrafa BORANGA é a ${bottle.bottle}${bottle.total ? ` de ${bottle.total}` : ""}, do lote ${bottle.lot}.`;
}
export function getShareUrl(currentUrl: string, bottle: BottleIdentityData, experiencePath?: string) {
  const url = new URL(currentUrl);
  url.search = "";
  url.hash = "";
  if (experiencePath && /^\/e\/BRG-[A-Z0-9-]{8,24}$/.test(experiencePath)) {
    url.pathname = experiencePath;
    return url.toString();
  }
  if (bottle.status === "valid") {
    if (bottle.source === "token" && bottle.token) url.searchParams.set("token", bottle.token);
    else {
      url.searchParams.set("lote", bottle.lot!);
      url.searchParams.set("garrafa", bottle.bottle!);
      if (bottle.total) url.searchParams.set("total", bottle.total);
    }
  }
  return url.toString();
}
