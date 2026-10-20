export type SubmissionKind = "suggestion" | "report" | "feedback";
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}
const cities = ["Salto", "Itu", "Tietê", "Cabreúva"];
const slugs = [
  "eletronicos",
  "pilhas-baterias",
  "oleo-cozinha",
  "medicamentos",
  "papel-papelao",
  "plasticos",
  "vidros",
  "metais",
  "lampadas",
  "pneus",
  "moveis-entulho",
];
function text(value: unknown, name: string, min: number, max: number) {
  if (
    typeof value !== "string" ||
    value.trim().length < min ||
    value.trim().length > max
  )
    throw new ValidationError(`Revise o campo ${name}.`);
  return value.trim();
}
function choice(value: unknown, choices: string[], name: string) {
  if (typeof value !== "string" || !choices.includes(value))
    throw new ValidationError(`Selecione uma opção válida em ${name}.`);
  return value;
}
export function validateCommunity(
  kind: unknown,
  input: unknown,
): Record<string, any> {
  if (!input || typeof input !== "object" || Array.isArray(input))
    throw new ValidationError("Formulário inválido.");
  const p = input as Record<string, unknown>;
  if (kind === "suggestion") {
    if (
      !Array.isArray(p.waste_categories) ||
      !p.waste_categories.length ||
      p.waste_categories.length > 11 ||
      !p.waste_categories.every((s) => slugs.includes(s))
    )
      throw new ValidationError("Escolha ao menos um material válido.");
    return {
      name: text(p.name, "nome", 3, 160),
      city: choice(p.city, cities, "cidade"),
      address: text(p.address, "endereço", 5, 400),
      waste_categories: [...new Set(p.waste_categories)],
      observations: text(p.observations ?? "", "observações", 0, 2000),
    };
  }
  if (kind === "report") {
    const id = text(p.disposal_point_id, "ponto", 3, 100);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(id))
      throw new ValidationError("Ponto inválido.");
    return {
      disposal_point_id: id,
      report_type: choice(
        p.report_type,
        ["closed", "address", "hours", "material", "other"],
        "tipo de problema",
      ),
      description: text(p.description, "descrição", 10, 2000),
    };
  }
  if (kind === "feedback") {
    const result: Record<string, string> = {};
    for (const key of [
      "found_material",
      "found_city",
      "clear_info",
      "map_worked",
      "would_reuse",
    ])
      result[key] = choice(p[key], ["yes", "no", "untested"], key);
    result.improvements = text(p.improvements ?? "", "melhorias", 0, 2000);
    return result;
  }
  throw new ValidationError("Tipo de formulário inválido.");
}
