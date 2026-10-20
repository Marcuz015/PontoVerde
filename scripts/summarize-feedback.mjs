import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
const directory = process.argv[2];
if (!directory) {
  console.error(
    "Uso: node scripts/summarize-feedback.mjs <pasta-com-jsons-recebidos>",
  );
  process.exit(1);
}
const keys = [
  "found_material",
  "found_city",
  "clear_info",
  "map_worked",
  "would_reuse",
];
const labels = [
  "Encontrou o material",
  "Encontrou ponto na cidade",
  "Informações claras",
  "Mapa e rota funcionaram",
  "Usaria novamente",
];
const answers = [];
const seen = new Set();
let skipped = 0;
for (const name of readdirSync(resolve(directory))) {
  if (!name.endsWith(".json")) continue;
  try {
    const raw = readFileSync(resolve(directory, name), "utf8");
    const hash = createHash("sha256").update(raw).digest("hex");
    if (seen.has(hash)) {
      skipped++;
      continue;
    }
    const f = JSON.parse(raw);
    if (
      f.project !== "Ponto Verde" ||
      f.kind !== "feedback" ||
      !keys.every((k) => ["yes", "no", "untested"].includes(f.payload?.[k]))
    ) {
      skipped++;
      continue;
    }
    seen.add(hash);
    answers.push(f.payload);
  } catch {
    skipped++;
  }
}
console.log(
  `Avaliações válidas recebidas: ${answers.length}. Arquivos inválidos ou duplicados ignorados: ${skipped}.`,
);
console.log("Indicador;Sim;Não;Não testei;Base de respostas testadas");
keys.forEach((key, i) => {
  const yes = answers.filter((a) => a[key] === "yes").length;
  const no = answers.filter((a) => a[key] === "no").length;
  const untested = answers.filter((a) => a[key] === "untested").length;
  console.log(`${labels[i]};${yes};${no};${untested};${yes + no}`);
});
console.log(
  "Uma resposta não equivale a uma pessoa única. Não generalize os resultados para a população.",
);
