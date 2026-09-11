import { readFile, readdir } from "node:fs/promises";
import { join } from "node:path";

const root = new URL("..", import.meta.url);
const htmlPath = new URL("dist/OmniWarehouse3D.html", root);
const html = await readFile(htmlPath, "utf8");

if (!html.includes("<!DOCTYPE html>")) throw new Error("HTML principal inválido.");
if (!html.includes("OmniWarehouse.Application")) throw new Error("Camada de aplicação não consolidada.");
if (!html.includes("OmniWarehouse.Domain")) throw new Error("Camada de domínio não consolidada.");

const scripts = [...html.matchAll(/<script(?:[^>]*)>([\s\S]*?)<\/script>/gi)]
  .map(match => match[1])
  .filter(code => code.trim());

for (const [index, code] of scripts.entries()) {
  try {
    new Function(code);
  } catch (error) {
    throw new Error(`Erro de sintaxe no script inline ${index + 1}: ${error.message}`);
  }
}

const requiredFolders = ["domain", "application", "infrastructure", "presentation"];
const sourceFolders = await readdir(new URL("src", root));
for (const folder of requiredFolders) {
  if (!sourceFolders.includes(folder)) throw new Error(`Camada ausente: ${folder}`);
}

console.log(`OmniWarehouse 3D validado: ${scripts.length} scripts inline e estrutura completa.`);
