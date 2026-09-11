import "server-only";
import { experiences } from "../data/experiences";
import { getPairingById } from "../data/pairings";
import { getBottleIdentity } from "./bottle";
import { sanitizeExperienceToken } from "./experience-token";
import type { RawSearchParams } from "../types/bottle";
import type { ExperienceRecord, ResolvedExperience } from "../types/experience";

function unavailable(state: "invalid" | "disabled"): ResolvedExperience {
  return { state, bottle: { edition: "Edição Especial", isPersonalized: false, status: "invalid", source: "token" } };
}

function resolveRecord(record: ExperienceRecord, token: string): ResolvedExperience {
  if (record.status === "disabled") return unavailable("disabled");
  if (record.status !== "active" || record.token !== token) return unavailable("invalid");
  const bottle = getBottleIdentity({ lote: record.bottle.lot, garrafa: record.bottle.number, total: record.bottle.total });
  if (bottle.status !== "valid" || !bottle.total) return unavailable("invalid");
  const pairing = getPairingById(record.pairingId);
  if (record.pairingId !== undefined && !pairing) return unavailable("invalid");
  const name = record.customer?.name.trim();
  if (record.customer && (!name || name.length > 160)) return unavailable("invalid");
  const message = record.message?.trim();
  if (message && message.length > 600) return unavailable("invalid");
  return {
    state: name ? pairing ? "personalized_pairing" : "personalized" : "bottle",
    bottle: { ...bottle, source: "token", token },
    token,
    ...(name ? { customer: { name } } : {}),
    ...(message ? { message } : {}),
    ...(pairing ? { pairing } : {}),
  };
}

export function getExperienceByToken(input: unknown): ResolvedExperience {
  const token = sanitizeExperienceToken(input);
  if (token && Object.hasOwn(experiences, token)) return resolveRecord(experiences[token], token);
  // Preserve the original bottle token without accepting malformed new invitations.
  const legacy = getBottleIdentity({ token: typeof input === "string" ? input : [] });
  if (legacy.status === "valid") return { state: "bottle", bottle: legacy, token: legacy.token };
  return unavailable("invalid");
}

export function resolveExperience(params: RawSearchParams, routeToken?: string): ResolvedExperience {
  if (routeToken !== undefined) return getExperienceByToken(routeToken);
  if (params.token !== undefined) return getExperienceByToken(params.token);
  const bottle = getBottleIdentity(params);
  return { state: bottle.status === "valid" ? "bottle" : bottle.status, bottle };
}
