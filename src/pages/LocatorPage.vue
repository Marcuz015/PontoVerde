<script setup lang="ts">
import { computed, ref, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { cities } from "../types";
import { filterPoints, hasCoordinates, distanceKm } from "../utils";
import { useCatalog } from "../composables/useCatalog";
import Icon from "../components/Icon.vue";
import PointCard from "../components/PointCard.vue";
import PointMap from "../components/PointMap.vue";
import StatePanel from "../components/StatePanel.vue";
const route = useRoute();
const router = useRouter();
const catalog = useCatalog();
const { categories, points, loading, error } = catalog;
const city = ref("");
const category = ref("");
const search = ref("");
const selected = ref("");
const view = ref("list");
const location = ref<[number, number] | null>(null);
const locating = ref(false);
const locationError = ref("");
function sync() {
  city.value = cities.includes(route.query.cidade as any)
    ? String(route.query.cidade)
    : "";
  category.value =
    typeof route.query.residuo === "string" ? route.query.residuo : "";
  search.value = typeof route.query.busca === "string" ? route.query.busca : "";
}
sync();
watch(() => route.query, sync);
function update() {
  router.replace({
    query: {
      ...(city.value ? { cidade: city.value } : {}),
      ...(category.value ? { residuo: category.value } : {}),
      ...(search.value.trim() ? { busca: search.value.trim() } : {}),
    },
  });
}
function clear() {
  city.value = "";
  category.value = "";
  search.value = "";
  update();
}
const results = computed(() => {
  const result = filterPoints(points.value, {
    city: city.value,
    category: category.value,
    search: search.value,
  });
  return location.value
    ? result.sort((a, b) => distance(a) - distance(b))
    : result;
});
function distance(p: (typeof points.value)[number]) {
  return location.value && hasCoordinates(p)
    ? distanceKm(location.value, [p.latitude!, p.longitude!])
    : Infinity;
}
function select(id: string) {
  selected.value = id;
}
function locate() {
  locationError.value = "";
  if (!navigator.geolocation) {
    locationError.value =
      "Seu navegador não oferece localização. Escolha uma cidade para continuar.";
    return;
  }
  locating.value = true;
  navigator.geolocation.getCurrentPosition(
    (p) => {
      location.value = [p.coords.latitude, p.coords.longitude];
      locating.value = false;
    },
    () => {
      locating.value = false;
      locationError.value =
        "Não foi possível acessar sua localização. Você pode continuar usando os filtros.";
    },
    { timeout: 10000, maximumAge: 60000, enableHighAccuracy: false },
  );
}
watch(results, () => {
  if (!results.value.some((p) => p.id === selected.value)) selected.value = "";
});
onMounted(() => void catalog.refresh());
</script>
<template>
  <div class="page-heading">
    <div class="container">
      <p class="eyebrow">ENCONTRE O SEU PRÓXIMO DESTINO</p>
      <h1>
        Um ponto certo.<br /><span class="green-text">Perto de você.</span>
      </h1>
      <p>
        Selecione sua cidade e o material. Confira as informações antes de sair.
      </p>
    </div>
  </div>
  <div class="container locator-content">
    <form class="locator-filters" @submit.prevent="update">
      <label
        >Cidade<select v-model="city" @change="update">
          <option value="">Todas as cidades</option>
          <option v-for="item in cities" :key="item">{{ item }}</option>
        </select></label
      ><label
        >Tipo de resíduo<select v-model="category" @change="update">
          <option value="">Todos os materiais</option>
          <option v-for="c in categories" :key="c.id" :value="c.slug">
            {{ c.name }}
          </option>
        </select></label
      ><label class="filter-search"
        >Nome, bairro ou endereço
        <div class="input-icon">
          <Icon name="Search" :size="18" /><input
            v-model="search"
            placeholder="O que você procura?"
            type="search"
            @input="update"
          /></div></label
      ><button
        type="button"
        class="button button-outline location-button"
        :disabled="locating"
        @click="locate"
      >
        <Icon name="LocateFixed" :size="18" />{{
          locating ? "Localizando…" : "Usar localização"
        }}
      </button>
    </form>
    <p v-if="locationError" class="inline-notice" role="status">
      {{ locationError }}
    </p>
    <p v-if="location" class="small-muted">
      Resultados ordenados por distância aproximada em linha reta. O cálculo é
      feito no seu dispositivo.
    </p>
    <div class="results-toolbar">
      <p aria-live="polite">
        <strong>{{ loading ? "Buscando…" : results.length }}</strong>
        {{
          loading
            ? ""
            : results.length === 1
              ? "ponto encontrado"
              : "pontos encontrados"
        }}<span v-if="city"> em {{ city }}</span>
      </p>
      <div class="view-switch" aria-label="Visualização">
        <button
          :class="{ active: view === 'list' }"
          :aria-pressed="view === 'list'"
          @click="view = 'list'"
        >
          <Icon name="List" :size="17" /> Lista</button
        ><button
          :class="{ active: view === 'map' }"
          :aria-pressed="view === 'map'"
          @click="view = 'map'"
        >
          <Icon name="Map" :size="17" /> Mapa
        </button>
      </div>
    </div>
    <div class="locator-layout" :class="{ 'map-view': view === 'map' }">
      <div class="results-list">
        <div v-if="loading" class="loading-state" role="status">
          <Icon name="LoaderCircle" class="spin" :size="25" /> Consultando o
          catálogo…
        </div>
        <StatePanel
          v-else-if="error"
          title="Não foi possível abrir o catálogo"
          :message="error"
          icon="Sprout"
          ><button class="button button-outline" @click="catalog.refresh(true)">
            Tentar novamente</button
          ><RouterLink to="/como-descartar" class="text-link"
            >Aprenda a separar
            <Icon name="ArrowRight" :size="16" /></RouterLink></StatePanel
        ><StatePanel
          v-else-if="!results.length"
          title="Ainda não encontramos um ponto"
          message="Não há pontos confirmados para esta combinação. Isso não significa que a cidade não tenha serviços de descarte. Ajude a ampliar o guia sugerindo um local."
          ><button
            v-if="city || category || search"
            class="button button-outline"
            @click="clear"
          >
            Limpar filtros</button
          ><RouterLink to="/participar/sugerir" class="text-link"
            >Sugerir um ponto
            <Icon name="Plus" :size="16" /></RouterLink></StatePanel
        ><PointCard
          v-for="point in results"
          v-else
          :key="point.id"
          :point="point"
          :selected="selected === point.id"
          :distance="
            Number.isFinite(distance(point)) ? distance(point) : undefined
          "
          @select="select"
        />
      </div>
      <div class="locator-map">
        <PointMap
          v-if="view === 'map'"
          :points="results"
          :city="city"
          :selected="selected"
          :location="location"
          @select="select"
        />
        <p>
          <Icon name="CircleHelp" :size="15" /> Somente pontos com coordenadas
          verificadas aparecem no mapa. Todos os resultados estão disponíveis na
          lista.
        </p>
      </div>
    </div>
    <div class="contribute-banner">
      <span class="state-icon"><Icon name="MapPin" :size="24" /></span>
      <div>
        <h3>Conhece um ponto que ainda não está aqui?</h3>
        <p>Sua sugestão passa pela equipe antes de ser publicada.</p>
      </div>
      <RouterLink to="/participar/sugerir" class="text-link"
        >Sugerir um ponto <Icon name="ArrowUpRight" :size="18"
      /></RouterLink>
    </div>
  </div>
</template>
