export type RawSearchParams = Record<string, string | string[] | undefined>;
export type BottleIdentityData = {
  lot?: string; bottle?: string; total?: string;
  edition: "Edição Especial";
  isPersonalized: boolean;
  status: "valid" | "generic" | "invalid";
  source: "token" | "query" | "none";
  token?: string;
};
export type BottleUrlInput = { lot: string; bottle: string; total: string };
