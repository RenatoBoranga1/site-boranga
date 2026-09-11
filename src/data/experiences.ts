import "server-only";
import type { ExperienceRecord } from "../types/experience";

// Publicly documented DEMONSTRATIONS, not customer records or secret production tokens.
// Keep real customer registries private; never import this module into client code.
export const experiences: Readonly<Record<string, ExperienceRecord>> = {
  "BRG-7X9K-P2M8": {
    token: "BRG-7X9K-P2M8",
    customer: { name: "Renato" },
    bottle: { lot: "001", number: "001", total: "5" },
    message: "Esta experiência BORANGA foi preparada especialmente para você.",
    pairingId: "dark-chocolate-70",
    status: "active",
  },
  "BRG-N8Q4-T7W2": {
    token: "BRG-N8Q4-T7W2",
    customer: { name: "Convidada de Demonstração com Nome Extenso" },
    bottle: { lot: "001", number: "002", total: "5" },
    status: "active",
  },
  "BRG-C6R9-V3K8": {
    token: "BRG-C6R9-V3K8",
    customer: { name: "Convidado Cítrico" },
    bottle: { lot: "001", number: "003", total: "5" },
    pairingId: "orange-peel",
    status: "active",
  },
  "BRG-D4S8-B6T9": {
    token: "BRG-D4S8-B6T9",
    customer: { name: "Convite desativado de demonstração" },
    bottle: { lot: "001", number: "004", total: "5" },
    pairingId: "dark-chocolate-70",
    status: "disabled",
  },
  "BRG-F5H8-J9M2": {
    token: "BRG-F5H8-J9M2",
    bottle: { lot: "001", number: "005", total: "5" },
    status: "active",
  },
};
