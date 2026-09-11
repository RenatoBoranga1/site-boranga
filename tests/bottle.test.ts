import { describe, expect, it } from "vitest";
import { buildBottleUrl, getBottleIdentity, sanitizeLot, sanitizeNumericCode } from "@/lib/bottle";
import { getBottleByToken } from "@/data/bottles";
import { getShareUrl } from "@/lib/bottle-display";
const valid = { lote: "001", garrafa: "037", total: "250" };
describe("strict identity parsing", () => {
  it("normalizes only whitespace and case", () => { expect(sanitizeLot(" ab-01 ")).toBe("AB-01"); expect(sanitizeNumericCode(" 037 ")).toBe("037"); });
  it.each(["<A>", "ab/c", "a".repeat(13), "", "-A"])("rejects malformed lot %s", (lot) => expect(sanitizeLot(lot)).toBeUndefined());
  it.each(["-1", "1.5", "1e2", "abc037", "000", "0", "12345678", ""])("rejects malformed number %s", (number) => expect(sanitizeNumericCode(number)).toBeUndefined());
  it("rejects duplicate values", () => { expect(sanitizeLot(["001", "002"])).toBeUndefined(); expect(sanitizeNumericCode(["1"])).toBeUndefined(); });
  it("returns a generic edition without identity parameters", () => { expect(getBottleIdentity({ utm_source: "qr" }).status).toBe("generic"); });
  it("accepts a complete legacy identity", () => expect(getBottleIdentity(valid)).toMatchObject({ status: "valid", source: "query", bottle: "037", isPersonalized: true }));
  it("preserves legacy links without total", () => expect(getBottleIdentity({ lote: "001", garrafa: "037" })).toMatchObject({ status: "valid", total: undefined }));
  it.each([
    { garrafa: "251" }, { garrafa: "0" }, { total: "0" }, { total: "" },
    { lote: "" }, { garrafa: ["037", "038"] }, { total: "50", garrafa: "250" },
  ])("rejects inconsistent identity %j", (patch) => {
    const result = getBottleIdentity({ ...valid, ...patch });
    expect(result).toMatchObject({ status: "invalid", isPersonalized: false });
    expect(result.bottle).toBeUndefined();
  });
  it("rejects partial identities", () => expect(getBottleIdentity({ total: "250" }).status).toBe("invalid"));
  it("accepts last bottle", () => expect(getBottleIdentity({ ...valid, garrafa: "250" }).status).toBe("valid"));
  it("looks up a token", () => expect(getBottleByToken("BRG-001-00037-X8Y2")?.bottle).toBe("037"));
  it("gives registry priority over query", () => expect(getBottleIdentity({ ...valid, garrafa: "999", token: "BRG-001-00037-X8Y2" })).toMatchObject({ status: "valid", source: "token", bottle: "037" }));
  it.each(["unknown", "", "<script>", ["BRG-001-00037-X8Y2"]])("never downgrades an invalid token %s", (token) => expect(getBottleIdentity({ ...valid, token }).status).toBe("invalid"));
});
describe("generated and shared URLs", () => {
  it("round trips and removes stale token and duplicate codes", () => {
    const url = new URL(buildBottleUrl("https://boranga.example/?token=old&garrafa=1&garrafa=2", { lot: "ab-1", bottle: "037", total: "250" }));
    expect(url.searchParams.has("token")).toBe(false);
    expect(url.searchParams.getAll("garrafa")).toEqual(["037"]);
    expect(getBottleIdentity(Object.fromEntries(url.searchParams))).toMatchObject({ status: "valid", lot: "AB-1" });
  });
  it.each(["javascript:alert(1)", "ftp://example.com", "https://user:pass@example.com", "garbage"])("rejects unsafe base %s", (base) => expect(() => buildBottleUrl(base, { lot: "001", bottle: "037", total: "250" })).toThrow());
  it("does not generate an impossible QR code", () => expect(() => buildBottleUrl("https://example.com", { lot: "001", bottle: "250", total: "50" })).toThrow());
  it("shares only registry token, without unrelated or conflicting parameters", () => {
    expect(getShareUrl("https://example.com/?lote=bad&utm_source=qr#section", getBottleIdentity({ token: "BRG-001-00037-X8Y2" }))).toBe("https://example.com/?token=BRG-001-00037-X8Y2");
  });
  it("does not share invalid identity claims", () => expect(getShareUrl("https://example.com/?token=bad", getBottleIdentity({ token: "bad" }))).toBe("https://example.com/"));
});
