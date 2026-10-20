import { ref } from "vue";
import type { Category, DisposalPoint } from "../types";
import { getCategories, getPoints } from "../services/api";
import referenceCategories from "../data/categories.json";

const categories = ref<Category[]>(referenceCategories as Category[]);
const points = ref<DisposalPoint[]>([]);
const loading = ref(false);
const error = ref("");
let loaded = false;
let active: Promise<void> | null = null;
export function useCatalog() {
  async function refresh(force = false) {
    if (active) return active;
    if (loaded && !force) return;
    loading.value = true;
    error.value = "";
    active = (async () => {
      try {
        const [c, p] = await Promise.all([getCategories(), getPoints()]);
        categories.value = c;
        points.value = p;
        loaded = true;
      } catch (e) {
        error.value =
          e instanceof Error
            ? e.message
            : "Não foi possível carregar os pontos. Tente novamente.";
        points.value = [];
      } finally {
        loading.value = false;
        active = null;
      }
    })();
    return active;
  }
  return { categories, points, loading, error, refresh };
}
