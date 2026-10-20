import { readFileSync } from "node:fs";
const points = JSON.parse(
  readFileSync(new URL("../src/data/points.json", import.meta.url), "utf8"),
);
const categories = JSON.parse(
  readFileSync(new URL("../src/data/categories.json", import.meta.url), "utf8"),
);
const ids = new Set();
const slugs = new Set(categories.map((c) => c.slug));
const validUrl = (value) => {
  try {
    const u = new URL(value);
    return (
      ["https:", "http:"].includes(u.protocol) && !u.username && !u.password
    );
  } catch {
    return false;
  }
};
const errors = [];
for (const p of points) {
  const fail = (message) => errors.push(`${p.id || "(sem ID)"}: ${message}`);
  if (!p.id || ids.has(p.id)) fail("ID ausente ou duplicado");
  ids.add(p.id);
  if (!["Salto", "Itu", "Tietê", "Cabreúva"].includes(p.city))
    fail("cidade inválida");
  if (!p.name || !p.street || !p.neighborhood)
    fail("nome ou endereço incompleto");
  if (!["pending", "published", "inactive"].includes(p.status))
    fail("status inválido");
  if (!["permanent", "campaign"].includes(p.point_type))
    fail("tipo de ponto inválido");
  if (
    p.status === "published" &&
    (!validUrl(p.source_url) ||
      !p.verification_notes ||
      !p.verified_at ||
      Number.isNaN(Date.parse(p.verified_at)) ||
      !p.category_slugs?.length)
  )
    fail("publicação sem evidência, data ou material");
  if (!p.category_slugs?.every((s) => slugs.has(s)))
    fail("categoria inexistente");
  if ((p.latitude === null) !== (p.longitude === null))
    fail("coordenadas incompletas");
  if (
    p.latitude !== null &&
    (!Number.isFinite(p.latitude) ||
      Math.abs(p.latitude) > 90 ||
      !Number.isFinite(p.longitude) ||
      Math.abs(p.longitude) > 180)
  )
    fail("coordenadas inválidas");
  if (
    p.coordinates_verified &&
    (p.latitude === null ||
      p.longitude === null ||
      !validUrl(p.coordinate_source_url))
  )
    fail("coordenadas sem fonte");
  if (
    p.point_type === "campaign" &&
    (!p.expires_at || Number.isNaN(Date.parse(p.expires_at)))
  )
    fail("campanha sem encerramento");
  for (const source of p.sources || [])
    if (!validUrl(source.url)) fail("fonte adicional inválida");
}
for (const c of categories)
  if (
    !c.disposal_instructions.sources.length ||
    !c.disposal_instructions.sources.every((s) => validUrl(s.url))
  )
    errors.push(`Categoria ${c.slug}: fonte inválida`);
if (errors.length) {
  console.error(errors.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    `Catálogo validado: ${points.length} pontos e ${categories.length} categorias, com fontes e sem coordenadas presumidas.`,
  );
