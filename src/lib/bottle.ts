import type {
  BottleIdentityData,
  BottleUrlInput,
  RawSearchParams,
} from "@/types/bottle";

const MAX_CODE_LENGTH = 12;
const MAX_NUMBER_LENGTH = 7;

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function sanitizeLot(value: string | string[] | undefined) {
  const raw = firstValue(value)?.trim().toUpperCase();
  if (!raw) return undefined;

  const sanitized = raw.replace(/[^A-Z0-9-]/g, "").slice(0, MAX_CODE_LENGTH);
  return sanitized || undefined;
}

export function sanitizeNumericCode(
  value: string | string[] | undefined,
) {
  const raw = firstValue(value)?.trim();
  if (!raw) return undefined;

  const sanitized = raw.replace(/\D/g, "").slice(0, MAX_NUMBER_LENGTH);
  if (!sanitized || Number(sanitized) < 1) return undefined;

  return sanitized;
}

export function getBottleIdentity(
  searchParams: RawSearchParams,
): BottleIdentityData {
  const lot = sanitizeLot(searchParams.lote);
  const bottle = sanitizeNumericCode(searchParams.garrafa);
  const total = sanitizeNumericCode(searchParams.total);

  return {
    lot,
    bottle,
    total,
    edition: "Edição Especial",
    isPersonalized: Boolean(lot && bottle),
  };
}

export function buildBottleUrl(baseUrl: string, input: BottleUrlInput) {
  const url = new URL(baseUrl);
  url.searchParams.set("lote", sanitizeLot(input.lot) ?? "");
  url.searchParams.set("garrafa", sanitizeNumericCode(input.bottle) ?? "");
  url.searchParams.set("total", sanitizeNumericCode(input.total) ?? "");
  return url.toString();
}

export function getBottleShareText(bottle: BottleIdentityData) {
  if (!bottle.isPersonalized) {
    return "Conheça BORANGA — Licor Extra Luxo de Jabuticaba.";
  }

  const total = bottle.total ? ` de ${bottle.total}` : "";
  return `Minha garrafa BORANGA é a ${bottle.bottle}${total}, do lote ${bottle.lot}.`;
}
