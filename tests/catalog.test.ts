import { describe, it, expect } from "vitest";
import { getPoints, getPoint, getCategories } from "../src/services/api";
import { filterPoints, hasCoordinates, routeUrl } from "../src/utils";
import pointData from "../src/data/points.json";
describe("catálogo fixo e sem backend", () => {
  it("entrega cinco locais documentados e onze categorias", async () => {
    expect(await getPoints()).toHaveLength(5);
    expect(await getCategories()).toHaveLength(11);
    for (const p of await getPoints()) {
      expect(p.source_url).toMatch(/^https:\/\//);
      expect(p.categories.length).toBeGreaterThan(0);
      expect(p.verified_at).toBeTruthy();
    }
  });
  it("combina filtros reais e não inventa cobertura nas outras cidades", async () => {
    const points = await getPoints();
    expect(
      filterPoints(points, {
        city: "Itu",
        category: "eletronicos",
        search: "",
      }),
    ).toHaveLength(2);
    expect(
      filterPoints(points, {
        city: "Salto",
        category: "moveis-entulho",
        search: "argelia 361",
      }),
    ).toHaveLength(1);
    expect(
      filterPoints(points, {
        city: "Salto",
        category: "medicamentos",
        search: "",
      }),
    ).toHaveLength(0);
    for (const city of ["Tietê", "Cabreúva"])
      expect(
        filterPoints(points, { city, category: "", search: "" }),
      ).toHaveLength(0);
  });
  it("somente a coordenada de correspondência documentada gera marcador", async () => {
    const mapped = (await getPoints()).filter(hasCoordinates);
    expect(mapped.map((p) => p.id)).toEqual(["salto-jardim-planalto"]);
    expect(mapped[0].coordinate_source_url).toBe(
      "https://www.openstreetmap.org/way/1521815020",
    );
    expect(decodeURIComponent(routeUrl(mapped[0]))).toContain(
      "-23.1820439,-47.2697355",
    );
  });
  it("detalhe usa o mesmo registro da lista e rejeita IDs inexistentes", async () => {
    expect((await getPoint("itu-sao-judas")).street).toBe(
      "Avenida Antônio Almeida Sampaio",
    );
    expect((await getPoint("itu-jardim-aeroporto")).number).toBe("300");
    await expect(getPoint("inexistente")).rejects.toThrow();
  });
  it("não vaza mutações do consumidor para o arquivo do catálogo", async () => {
    const categories = await getCategories();
    categories[0].name = "Alterado no teste";
    expect((await getCategories())[0].name).toBe("Eletrônicos");
    expect(
      pointData.some(
        (p) => p.city === "Salto" && p.category_slugs.includes("lampadas"),
      ),
    ).toBe(false);
  });
});
