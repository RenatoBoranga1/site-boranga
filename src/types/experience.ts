import type { BottleIdentityData } from "./bottle";
import type { Pairing } from "./pairing";

export type ExperienceRecord = {
  token: string;
  customer?: { name: string };
  bottle: { lot: string; number: string; total: string };
  message?: string;
  pairingId?: string;
  status: "active" | "disabled";
};

export type ResolvedExperience = {
  state: "personalized_pairing" | "personalized" | "bottle" | "generic" | "invalid" | "disabled";
  bottle: BottleIdentityData;
  customer?: { name: string };
  message?: string;
  pairing?: Pairing;
  token?: string;
};

/** Minimal presentation props, separate from the private registry. */
export type ExperiencePersonalization = {
  customerName?: string;
  pairingName?: string;
  message?: string;
};
