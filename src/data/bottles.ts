// Demonstration registry. Replace with a server-side repository before issuing real QR codes.
export const bottles = [
  { token: "BRG-001-00037-X8Y2", lot: "001", bottle: "037", total: "250", status: "valid" },
] as const;
export function getBottleByToken(token: string) {
  return bottles.find((record) => record.token === token);
}
