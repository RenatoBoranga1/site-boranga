import { mkdir, open, unlink } from "node:fs/promises";
import { resolve } from "node:path";
import QRCode from "qrcode";
import { buildExperienceUrl, sanitizeExperienceToken } from "../src/lib/experience-token.ts";
import { parseArgs } from "./experience-cli.mjs";

try {
  const args = parseArgs(process.argv.slice(2), ["token", "baseUrl", "outputDir"]);
  const token = sanitizeExperienceToken(args.token);
  if (!token) throw new Error("Informe um token de experiência válido.");
  const url = buildExperienceUrl(args.baseUrl ?? "https://boranga.com.br", token);
  const directory = resolve(args.outputDir ?? "public/qrcodes");
  const options = { errorCorrectionLevel: "Q", margin: 4, width: 1200, color: { dark: "#000000", light: "#ffffff" } };
  const png = await QRCode.toBuffer(url, { ...options, type: "png" });
  const svg = await QRCode.toString(url, { ...options, type: "svg" });
  await mkdir(directory, { recursive: true });
  const created = [];
  try {
    for (const [extension, content] of [["png", png], ["svg", svg]]) {
      const path = resolve(directory, `${token}.${extension}`);
      const file = await open(path, "wx");
      created.push(path);
      try { await file.writeFile(content); } finally { await file.close(); }
    }
  } catch (error) {
    await Promise.all(created.map((path) => unlink(path)));
    throw error;
  }
  console.log(`QR Code gerado:\n${created.join("\n")}\nURL: ${url}\nA URL exige o token cadastrado e ativo no site. O comando não publica nem cadastra a experiência.`);
} catch (error) {
  const message = error?.code === "EEXIST" ? "Já existe um QR com esse token. Use outro diretório para preservar os arquivos anteriores." : error instanceof Error ? error.message : "Não foi possível gerar o QR Code.";
  console.error(message);
  process.exitCode = 1;
}
