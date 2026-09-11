import { describe, expect, it, vi } from "vitest";
vi.mock("server-only", () => ({}));
vi.mock("@/data/experiences", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/data/experiences")>();
  return { ...actual, experiences: { ...actual.experiences,
    "BRG-Z9Z9-Y8Y8": { token: "BRG-Z9Z9-Y8Y8", customer: { name: "Hidden Customer" }, bottle: { lot: "001", number: "001", total: "5" }, pairingId: "missing", status: "active" },
    "BRG-Z9Z9-Y8Y9": { token: "BRG-Z9Z9-Y8Y9", customer: { name: "Hidden Customer" }, bottle: { lot: "001", number: "006", total: "5" }, status: "active" },
  } };
});
import { getExperienceByToken, resolveExperience } from "@/lib/experience";
import { getPairingById } from "@/data/pairings";
import { buildExperienceUrl, sanitizeExperienceToken } from "@/lib/experience-token";
import { sanitizeExperienceEvent } from "@/lib/analytics";

describe("server experience resolution", () => {
  it("resolves only the selected customer, bottle and pairing", () => {
    const experience = getExperienceByToken("BRG-7X9K-P2M8");
    expect(experience.state).toBe("personalized_pairing");
    expect(experience.customer?.name).toBe("Renato");
    expect(experience.bottle).toMatchObject({ lot: "001", bottle: "001", total: "5", source: "token", status: "valid" });
    expect(experience.pairing?.name).toBe("Chocolate amargo 70%");
    expect(experience.message).toBeTruthy();
    expect(JSON.stringify(experience)).not.toMatch(/Convidada|Convidado Cítrico|BRG-N8Q4/);
  });
  it("supports optional message, long customer name and no pairing", () => {
    const result = getExperienceByToken("BRG-N8Q4-T7W2");
    expect(result.state).toBe("personalized");
    expect(result.customer?.name).toBe("Convidada de Demonstração com Nome Extenso");
    expect(result.message).toBeUndefined();
    expect(result.pairing).toBeUndefined();
  });
  it("resolves citrus without inventing optional food claims", () => {
    const result = getExperienceByToken("BRG-C6R9-V3K8");
    expect(result.pairing?.id).toBe("orange-peel");
    expect(result.pairing?.storageNote).toBeUndefined();
    expect(result.pairing?.servingNote).toBeUndefined();
  });
  it.each(["BRG-DOES-NOTX", "", "BRG-7X9K-P2M8!!", "../../BRG-7X9K-P2M8", ["BRG-7X9K-P2M8"], undefined, "__proto__"])("rejects ambiguous or unknown input %j", (input) => {
    const result = getExperienceByToken(input);
    expect(result.state).toBe("invalid");
    expect(result.customer).toBeUndefined();
    expect(result.token).toBeUndefined();
  });
  it("does not disclose disabled customer or bottle", () => {
    const result = getExperienceByToken("BRG-D4S8-B6T9");
    expect(result.state).toBe("disabled");
    expect(result.bottle.isPersonalized).toBe(false);
    expect(JSON.stringify(result)).not.toMatch(/004|desativado de demonstração|dark-chocolate/);
  });
  it.each(["BRG-Z9Z9-Y8Y8", "BRG-Z9Z9-Y8Y9"])("fails closed for inconsistent registry %s", (token) => {
    const result = getExperienceByToken(token);
    expect(result.state).toBe("invalid");
    expect(JSON.stringify(result)).not.toContain("Hidden Customer");
  });
  it("supports both new bottle-only and the original bottle token", () => {
    expect(getExperienceByToken("BRG-F5H8-J9M2")).toMatchObject({ state: "bottle", bottle: { bottle: "005", total: "5" } });
    expect(getExperienceByToken("BRG-001-00037-X8Y2")).toMatchObject({ state: "bottle", bottle: { bottle: "037", total: "250" } });
  });
  it("keeps query fallback and the generic landing", () => {
    expect(resolveExperience({ lote: "001", garrafa: "037", total: "250" })).toMatchObject({ state: "bottle", bottle: { source: "query", bottle: "037" } });
    expect(resolveExperience({})).toMatchObject({ state: "generic", bottle: { isPersonalized: false } });
  });
  it("gives route token priority over query token and legacy identity", () => {
    const query = { token: "BRG-N8Q4-T7W2", lote: "999", garrafa: "999", total: "999" };
    expect(resolveExperience(query, "BRG-7X9K-P2M8").customer?.name).toBe("Renato");
    expect(resolveExperience(query, "bad").state).toBe("invalid");
    expect(resolveExperience({ ...query, token: "bad" }).state).toBe("invalid");
    expect(resolveExperience({ ...query, token: [] }).state).toBe("invalid");
  });
});

describe("pairing, token and privacy helpers", () => {
  it("looks up registered pairings without inheriting object properties", () => {
    expect(getPairingById("dark-chocolate-70")?.howToEnjoy).toHaveLength(4);
    expect(getPairingById("orange-peel")?.name).toBe("Casca de laranja");
    expect(getPairingById("missing")).toBeUndefined();
    expect(getPairingById("constructor")).toBeUndefined();
  });
  it("canonicalizes surrounding space/case but never repairs damaged tokens", () => {
    expect(sanitizeExperienceToken(" brg-7x9k-p2m8 ")).toBe("BRG-7X9K-P2M8");
    expect(sanitizeExperienceToken("BRG-7X9K P2M8")).toBeUndefined();
    expect(sanitizeExperienceToken("BRG-7X9K-P2M8-ABCD")).toBeTruthy();
  });
  it("builds an individual URL without personal query strings or fragments", () => {
    expect(buildExperienceUrl("https://example.com/old?nome=Name#x", "BRG-7X9K-P2M8")).toBe("https://example.com/e/BRG-7X9K-P2M8");
    expect(() => buildExperienceUrl("https://user:pass@example.com", "BRG-7X9K-P2M8")).toThrow();
    expect(() => buildExperienceUrl("file:///", "BRG-7X9K-P2M8")).toThrow();
  });
  it("drops personal data and raw tokens even if provided at runtime", () => {
    const payload = { lot: "001", bottle: "001", pairingId: "dark-chocolate-70", identifier: "a".repeat(64), step: 2, customerName: "Renato", message: "Private", token: "BRG-7X9K-P2M8" };
    expect(sanitizeExperienceEvent(payload)).toEqual({ lot: "001", bottle: "001", pairingId: "dark-chocolate-70", identifier: "a".repeat(64), step: 2 });
    expect(sanitizeExperienceEvent({ identifier: "BRG-7X9K-P2M8", step: -1 })).toEqual({});
  });
});
