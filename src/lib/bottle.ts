import { getBottleByToken } from "../data/bottles";
import type { BottleIdentityData, BottleUrlInput, RawSearchParams } from "../types/bottle";

// Reject ambiguous or damaged codes instead of silently repairing their identity.
export function sanitizeLot(value: string | string[] | undefined) {
  if (typeof value !== "string") return undefined;
  const raw = value.trim().toUpperCase();
  return /^[A-Z0-9][A-Z0-9-]{0,11}$/.test(raw) ? raw : undefined;
}
export function sanitizeNumericCode(value: string | string[] | undefined) {
  if (typeof value !== "string") return undefined;
  const raw = value.trim();
  return /^\d{1,7}$/.test(raw) && Number(raw) > 0 ? raw : undefined;
}
export function getBottleIdentity(params: RawSearchParams): BottleIdentityData {
  const base: BottleIdentityData = {
    edition: "Edição Especial", isPersonalized: false, status: "generic", source: "none",
  };
  if (params.token !== undefined) {
    const record = typeof params.token === "string" && /^[A-Za-z0-9-]{1,80}$/.test(params.token)
      ? getBottleByToken(params.token) : undefined;
    if (!record) return { ...base, status: "invalid", source: "token" };
    const identity = getBottleIdentity({ lote: record.lot, garrafa: record.bottle, total: record.total });
    return { ...identity, source: "token", token: identity.status === "valid" ? record.token : undefined };
  }
  if (![params.lote, params.garrafa, params.total].some((value) => value !== undefined)) return base;
  const lot = sanitizeLot(params.lote);
  const bottle = sanitizeNumericCode(params.garrafa);
  const total = sanitizeNumericCode(params.total);
  // Legacy links without total remain supported; a supplied total must be valid.
  if (!lot || !bottle || (params.total !== undefined && !total) || (total && Number(bottle) > Number(total))) {
    return { ...base, status: "invalid", source: "query" };
  }
  return { ...base, lot, bottle, total, status: "valid", source: "query", isPersonalized: true };
}
export function buildBottleUrl(baseUrl: string, input: BottleUrlInput) {
  const url = new URL(baseUrl);
  if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) throw new Error("Use uma URL HTTP(S) sem credenciais.");
  const identity = getBottleIdentity({ lote: input.lot, garrafa: input.bottle, total: input.total });
  if (identity.status !== "valid" || !identity.total) throw new Error("Identificação inválida.");
  url.searchParams.delete("token");
  url.searchParams.set("lote", identity.lot!);
  url.searchParams.set("garrafa", identity.bottle!);
  url.searchParams.set("total", identity.total);
  return url.toString();
}
