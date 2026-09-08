export type RawSearchParams = Record<
  string,
  string | string[] | undefined
>;

export type BottleIdentityData = {
  lot?: string;
  bottle?: string;
  total?: string;
  edition: "Edição Especial";
  isPersonalized: boolean;
};

export type BottleUrlInput = {
  lot: string;
  bottle: string;
  total: string;
};
