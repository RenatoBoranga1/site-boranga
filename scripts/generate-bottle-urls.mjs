import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

function parseArgs(args) {
  return Object.fromEntries(
    args
      .filter((arg) => arg.startsWith("--") && arg.includes("="))
      .map((arg) => {
        const [key, ...value] = arg.slice(2).split("=");
        return [key, value.join("=")];
      }),
  );
}

function sanitizeLot(value) {
  return String(value ?? "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9-]/g, "")
    .slice(0, 12);
}

function positiveInteger(value) {
  const parsed = Number.parseInt(String(value), 10);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined;
}

function buildBottleUrl(baseUrl, { lot, bottle, total }) {
  const url = new URL(baseUrl);
  url.searchParams.set("lote", lot);
  url.searchParams.set("garrafa", bottle);
  url.searchParams.set("total", total);
  return url.toString();
}

const args = parseArgs(process.argv.slice(2));
const lot = sanitizeLot(args.lot ?? args.lote ?? "001");
const total = positiveInteger(args.total ?? "250");
const baseUrl = args.baseUrl ?? "https://seu-dominio.com/";

if (!lot || !total) {
  throw new Error("Use um lote válido e um total inteiro maior que zero.");
}

new URL(baseUrl);

const width = Math.max(3, String(total).length);
const rows = ["garrafa,lote,url,conteudo_qr"];

for (let index = 1; index <= total; index += 1) {
  const bottle = String(index).padStart(width, "0");
  const url = buildBottleUrl(baseUrl, {
    lot,
    bottle,
    total: String(total),
  });
  rows.push(`${bottle},${lot},${url},${url}`);
}

const defaultOutput = `public/examples/boranga-lote-${lot}.csv`;
const outputPath = resolve(process.cwd(), args.output ?? defaultOutput);

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${rows.join("\n")}\n`, "utf8");

console.log(`CSV gerado: ${outputPath}`);
console.log(`${total} URLs individuais criadas para o lote ${lot}.`);
