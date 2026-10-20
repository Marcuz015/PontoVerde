import { describe, it, expect } from "vitest";
import { validateCommunity } from "../shared/community";
describe("validação compartilhada dos formulários", () => {
  it("remove campos não permitidos, inclusive status administrativo", () => {
    const p = validateCommunity("suggestion", {
      name: "Local teste",
      city: "Itu",
      address: "Endereço teste",
      waste_categories: ["eletronicos"],
      status: "published",
      email: "private@example.com",
    });
    expect(p).not.toHaveProperty("status");
    expect(p).not.toHaveProperty("email");
  });
  it("rejeita cidades, tipos, categorias e relatos inválidos", () => {
    expect(() =>
      validateCommunity("suggestion", {
        name: "Teste",
        city: "Outra",
        address: "Rua teste",
        waste_categories: ["eletronicos"],
      }),
    ).toThrow();
    expect(() =>
      validateCommunity("suggestion", {
        name: "Teste",
        city: "Itu",
        address: "Rua teste",
        waste_categories: ["fake"],
      }),
    ).toThrow();
    expect(() =>
      validateCommunity("report", {
        disposal_point_id: "bad",
        report_type: "closed",
        description: "Um relato para verificar.",
      }),
    ).toThrow();
    expect(() => validateCommunity("admin", {})).toThrow();
  });
  it("permite feedback real sem nome ou contato, distinguindo não testado", () => {
    const p = validateCommunity("feedback", {
      found_material: "yes",
      found_city: "no",
      clear_info: "yes",
      map_worked: "untested",
      would_reuse: "yes",
    });
    expect(p.map_worked).toBe("untested");
    expect(p.improvements).toBe("");
  });
  it("impede textos longos ou sem informações suficientes", () => {
    expect(() =>
      validateCommunity("report", {
        disposal_point_id: "itu-sao-judas",
        report_type: "hours",
        description: "curto",
      }),
    ).toThrow(/descrição/);
    expect(() =>
      validateCommunity("feedback", {
        found_material: "yes",
        found_city: "yes",
        clear_info: "yes",
        map_worked: "yes",
        would_reuse: "yes",
        improvements: "x".repeat(2001),
      }),
    ).toThrow();
  });
  it("prepara um relato válido com o identificador do catálogo fixo", () => {
    const payload = validateCommunity("report", {
      disposal_point_id: "itu-sao-judas",
      report_type: "hours",
      description: "O horário informado precisa ser conferido.",
    });
    expect(payload.disposal_point_id).toBe("itu-sao-judas");
    expect(payload.report_type).toBe("hours");
  });
});
