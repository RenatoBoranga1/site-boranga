export type Pairing = {
  id: string;
  name: string;
  category: string;
  shortDescription: string;
  intro: string;
  howToEnjoy: readonly { title: string; description: string }[];
  sensoryNote: string;
  image: string;
  imageAlt: string;
  experienceName?: string;
  allergenNote?: string;
  storageNote?: string;
  servingNote?: string;
};
