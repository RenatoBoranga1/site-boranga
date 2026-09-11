import type { Pairing } from "../types/pairing";

export const pairings: Readonly<Record<string, Pairing>> = {
  "dark-chocolate-70": {
    id: "dark-chocolate-70",
    name: "Chocolate amargo 70%",
    category: "Chocolate",
    experienceName: "Experiência Cacau",
    shortDescription: "A intensidade do cacau encontra o caráter frutado da jabuticaba.",
    intro: "Uma combinação de contraste e persistência pensada para revelar novas camadas de BORANGA.",
    howToEnjoy: [
      { title: "Sirva", description: "Sirva BORANGA entre 8 °C e 12 °C." },
      { title: "Descubra", description: "Experimente primeiro um pequeno gole puro." },
      { title: "Harmonize", description: "Prove um pequeno pedaço do chocolate amargo e aguarde alguns segundos." },
      { title: "Retorne ao copo", description: "Tome outro gole e perceba como o amargor do cacau transforma a percepção da jabuticaba." },
    ],
    sensoryNote: "O amargor do chocolate cria contraste com o dulçor do licor e prolonga a experiência frutada.",
    image: "/images/pairings/dark-chocolate.webp",
    imageAlt: "Pedaços de chocolate amargo sobre pedra escura, sob luz dourada",
    allergenNote: "Consulte a embalagem individual do produto para informações sobre alergênicos.",
  },
  "orange-peel": {
    id: "orange-peel",
    name: "Casca de laranja",
    category: "Cítrica",
    experienceName: "Experiência Cítrica",
    shortDescription: "Aromas cítricos encontram a profundidade da jabuticaba.",
    intro: "Uma experiência aromática que valoriza frescor, fruta e contraste.",
    howToEnjoy: [
      { title: "Sirva", description: "Sirva BORANGA entre 8 °C e 12 °C." },
      { title: "Aproxime", description: "Aproxime a casca de laranja do copo. Perceba primeiro os aromas cítricos." },
      { title: "Perfume", description: "Torça delicadamente a casca sobre o copo para liberar os óleos aromáticos." },
      { title: "Perceba", description: "Experimente BORANGA em pequenos goles, com tempo para perceber os aromas." },
    ],
    sensoryNote: "Os óleos aromáticos da casca podem trazer uma camada cítrica à percepção do licor.",
    image: "/images/pairings/orange.webp",
    imageAlt: "Casca fresca de laranja sobre pedra escura, sob luz dourada",
  },
};

export function getPairingById(id: string | undefined): Pairing | undefined {
  return id && Object.hasOwn(pairings, id) ? pairings[id] : undefined;
}
