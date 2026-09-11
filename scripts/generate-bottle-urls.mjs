import { mkdir, open } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { buildBottleUrl, sanitizeLot, sanitizeNumericCode } from "../src/lib/bottle.ts";
const args = Object.fromEntries(process.argv.slice(2).filter((arg) => arg.startsWith("--") && arg.includes("=")).map((arg) => {
  const [key, ...value] = arg.slice(2).split("=");
  return [key, value.join("=")];
}));
const lot = sanitizeLot(args.lot ?? args.lote ?? "001");
const totalCode = sanitizeNumericCode(args.total ?? "250");
if (!lot || !totalCode) throw new Error("Use um lote válido e um total inteiro maior que zero.");
const total = Number(totalCode);
const baseUrl = args.baseUrl ?? "https://seu-dominio.com/";
buildBottleUrl(baseUrl, { lot, bottle: "1", total: totalCode });
const width = Math.max(3, totalCode.length);
const outputPath = resolve(process.cwd(), args.output ?? `public/examples/boranga-lote-${lot}.csv`);
await mkdir(dirname(outputPath), { recursive: true });
// CSV escaping protects delimiters/quotes in a custom base URL.
const csv = (value) => `"${String(value).replaceAll('"', '""')}"`;
const file = await open(outputPath, "w");
try {
  await file.write("garrafa,lote,url,conteudo_qr\n");
  for (let index = 1; index <= total; index++) {
    const bottle = String(index).padStart(width, "0");
    const url = buildBottleUrl(baseUrl, { lot, bottle, total: totalCode });
    await file.write([bottle, lot, url, url].map(csv).join(",") + "\n");
  }
} finally { await file.close(); }
console.log(`CSV gerado: ${outputPath}\n${total} URLs individuais criadas para o lote ${lot}.`);
