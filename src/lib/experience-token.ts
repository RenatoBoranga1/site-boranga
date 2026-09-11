// Safe to share with the CLI. No registry or customer data in this module.
export function sanitizeExperienceToken(value: unknown): string | undefined {
  if (typeof value !== "string" || value.length > 40) return undefined;
  const token = value.trim().toUpperCase();
  return /^BRG-(?:[A-Z2-9]{8,12}|[A-Z2-9]{4}-[A-Z2-9]{4}(?:-[A-Z2-9]{4})?)$/.test(token) ? token : undefined;
}

export function buildExperienceUrl(baseUrl: string, input: string): string {
  const token = sanitizeExperienceToken(input);
  if (!token) throw new Error("Token de experiência inválido.");
  const url = new URL(baseUrl);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
    throw new Error("Use uma URL HTTP(S) sem credenciais.");
  }
  url.pathname = `/e/${token}`;
  url.search = "";
  url.hash = "";
  return url.toString();
}
