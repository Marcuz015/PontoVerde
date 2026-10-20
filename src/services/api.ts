import type { Category, DisposalPoint } from "../types";
import categoryData from "../data/categories.json";
import pointData from "../data/points.json";

export async function getCategories(): Promise<Category[]> {
  return structuredClone(categoryData) as Category[];
}
export async function getPoints(): Promise<DisposalPoint[]> {
  const categories = await getCategories();
  return pointData
    .filter(
      (p) =>
        p.status === "published" &&
        p.verified_at &&
        (p.point_type !== "campaign" ||
          (p.expires_at && new Date(p.expires_at).getTime() > Date.now())),
    )
    .map(({ category_slugs, ...point }) => ({
      ...point,
      categories: categories.filter((c) => category_slugs.includes(c.slug)),
    })) as DisposalPoint[];
}
export async function getPoint(id: string): Promise<DisposalPoint> {
  const point = (await getPoints()).find((p) => p.id === id);
  if (!point)
    throw new Error("Este ponto não foi encontrado no catálogo publicado.");
  return point;
}





