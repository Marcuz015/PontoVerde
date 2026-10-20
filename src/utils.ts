import type { DisposalPoint, Filters } from "./types";

export const normalize = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
export const address = (p: DisposalPoint) =>
  `${p.street}${p.number ? ", " + p.number : ""} — ${p.neighborhood}, ${p.city} - SP`;
export function safeUrl(value: string | null | undefined): string | undefined {
  try {
    const url = new URL(value || "");
    return ["https:", "http:"].includes(url.protocol) &&
      !url.username &&
      !url.password
      ? url.href
      : undefined;
  } catch {
    return undefined;
  }
}
export function hasCoordinates(p: DisposalPoint) {
  return (
    p.coordinates_verified &&
    p.latitude !== null &&
    p.longitude !== null &&
    Number.isFinite(p.latitude) &&
    Number.isFinite(p.longitude) &&
    Math.abs(p.latitude) <= 90 &&
    Math.abs(p.longitude) <= 180
  );
}
export function routeUrl(p: DisposalPoint) {
  const destination = hasCoordinates(p)
    ? `${p.latitude},${p.longitude}`
    : address(p);
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}
export function filterPoints(points: DisposalPoint[], filters: Filters) {
  const terms = normalize(filters.search).split(/\s+/).filter(Boolean);
  return points.filter(
    (p) =>
      (!filters.city || p.city === filters.city) &&
      (!filters.category ||
        p.categories.some((c) => c.slug === filters.category)) &&
      terms.every((t) => normalize(`${p.name} ${address(p)}`).includes(t)),
  );
}
export function distanceKm(a: [number, number], b: [number, number]) {
  const rad = (n: number) => (n * Math.PI) / 180;
  const h =
    Math.sin(rad(b[0] - a[0]) / 2) ** 2 +
    Math.cos(rad(a[0])) *
      Math.cos(rad(b[0])) *
      Math.sin(rad(b[1] - a[1]) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, h)));
}
export const formatDate = (date: string | null) =>
  date
    ? new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
      }).format(new Date(date))
    : "Não verificado";
export const needsReview = (date: string | null) =>
  !date || Date.now() - new Date(date).getTime() > 180 * 86400000;
export const statusLabels = {
  pending: "Pendente de verificação",
  published: "Verificado e publicado",
  inactive: "Inativo",
};
