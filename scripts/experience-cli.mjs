import { randomInt } from "node:crypto";

export function parseArgs(args, allowed) {
  const values = {};
  for (const arg of args) {
    if (arg === "--") continue;
    const match = /^--([A-Za-z]+)=(.*)$/s.exec(arg);
    if (!match || !allowed.includes(match[1]) || Object.hasOwn(values, match[1])) {
      throw new Error("Use argumentos únicos no formato --campo=valor. Consulte o README.");
    }
    values[match[1]] = match[2];
  }
  return values;
}

export function createToken() {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const chars = Array.from({ length: 12 }, () => alphabet[randomInt(alphabet.length)]).join("");
  return `BRG-${chars.slice(0, 4)}-${chars.slice(4, 8)}-${chars.slice(8)}`;
}

export function humanText(value, max, label) {
  const text = value?.trim();
  if (!text || text.length > max || /[\u0000-\u001f\u007f]/u.test(text)) {
    throw new Error(`${label}: informe entre 1 e ${max} caracteres, sem controles de linha.`);
  }
  return text;
}
