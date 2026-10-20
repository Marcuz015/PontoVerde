import { describe, it, expect } from "vitest";
import {
  normalize,
  filterPoints,
  safeUrl,
  routeUrl,
  distanceKm,
  hasCoordinates,
} from "../src/utils";
import type { DisposalPoint } from "../src/types";
const point = {
  id: "test",
  name: "Local de teste",
  city: "Salto",
  neighborhood: "Nações",
  street: "Rua Argélia",
  number: "361",
  latitude: null,
  longitude: null,
  coordinates_verified: false,
  categories: [{ slug: "eletronicos" }],
} as DisposalPoint;
describe("localização e busca", () => {
  it("combina cidade, material, bairro, nome e endereço sem acentos", () => {
    expect(
      filterPoints([point], {
        city: "Salto",
        category: "eletronicos",
        search: "argelia nacoes 361",
      }),
    ).toHaveLength(1);
    expect(
      filterPoints([point], {
        city: "Itu",
        category: "eletronicos",
        search: "",
      }),
    ).toHaveLength(0);
    expect(
      filterPoints([point], {
        city: "Salto",
        category: "lampadas",
        search: "",
      }),
    ).toHaveLength(0);
    expect(normalize(" Tietê ")).toBe("tiete");
  });
  it("não mapeia coordenadas ausentes, inválidas ou não verificadas", () => {
    expect(hasCoordinates(point)).toBe(false);
    expect(hasCoordinates({ ...point, latitude: -23, longitude: -47 })).toBe(
      false,
    );
    expect(
      hasCoordinates({
        ...point,
        latitude: -23,
        longitude: -47,
        coordinates_verified: true,
      }),
    ).toBe(true);
    expect(
      hasCoordinates({
        ...point,
        latitude: 99,
        longitude: -47,
        coordinates_verified: true,
      }),
    ).toBe(false);
  });
  it("rota usa endereço completo ou coordenadas verificadas, incluindo zero", () => {
    expect(decodeURIComponent(routeUrl(point))).toContain(
      "Rua Argélia, 361 — Nações, Salto - SP",
    );
    expect(
      decodeURIComponent(
        routeUrl({
          ...point,
          latitude: 0,
          longitude: -47,
          coordinates_verified: true,
        }),
      ),
    ).toContain("destination=0,-47");
  });
  it("calcula distância em linha reta", () => {
    expect(distanceKm([-23, -47], [-23, -47])).toBe(0);
    expect(distanceKm([0, 0], [0, 1])).toBeCloseTo(111.195, 2);
  });
  it("bloqueia URLs executáveis e credenciais embutidas", () => {
    for (const url of [
      "javascript:alert(1)",
      "data:text/html,test",
      "https://user:pass@example.com",
      "/relative",
    ])
      expect(safeUrl(url)).toBeUndefined();
    expect(safeUrl("https://salto.sp.gov.br/")).toBe(
      "https://salto.sp.gov.br/",
    );
  });
});
