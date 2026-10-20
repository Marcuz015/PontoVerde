<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute } from "vue-router";
import { getPoint } from "../services/api";
import type { DisposalPoint } from "../types";
import { address, routeUrl, safeUrl, formatDate, needsReview } from "../utils";
import PointMap from "../components/PointMap.vue";
import StatePanel from "../components/StatePanel.vue";
import Icon from "../components/Icon.vue";
const route = useRoute();
const point = ref<DisposalPoint | null>(null);
const error = ref("");
const loading = ref(true);
watch(
  () => route.params.id,
  async () => {
    loading.value = true;
    error.value = "";
    point.value = null;
    try {
      point.value = await getPoint(String(route.params.id));
    } catch (e) {
      error.value =
        e instanceof Error ? e.message : "Falha ao carregar o ponto.";
    } finally {
      loading.value = false;
    }
  },
  { immediate: true },
);
</script>
<template>
  <div class="container section">
    <RouterLink to="/pontos" class="text-link back-link"
      ><Icon name="ArrowLeft" :size="18" /> Voltar para os pontos</RouterLink
    >
    <div v-if="loading" class="loading-state">Carregando o ponto…</div>
    <StatePanel
      v-else-if="error"
      title="Não foi possível abrir este ponto"
      :message="error"
      icon="AlertCircle"
    /><template v-else-if="point"
      ><div class="point-detail-heading">
        <div>
          <p class="eyebrow">{{ point.city }} · {{ point.neighborhood }}</p>
          <h1>{{ point.name }}</h1>
          <p>{{ address(point) }}</p>
        </div>
        <a
          :href="routeUrl(point)"
          class="button"
          target="_blank"
          rel="noopener noreferrer"
          ><Icon name="Navigation" /> Como chegar</a
        >
      </div>
      <p v-if="needsReview(point.verified_at)" class="inline-notice">
        Esta fonte foi consultada há mais de 180 dias. Confirme as informações
        com o responsável antes de sair.
      </p>
      <p v-if="point.point_type === 'campaign'" class="inline-notice">
        Campanha temporária. Encerramento: {{ formatDate(point.expires_at) }}.
      </p>
      <div class="point-detail-grid">
        <div class="prose">
          <p>{{ point.description }}</p>
          <h2>Materiais aceitos</h2>
          <div class="tags large-tags">
            <RouterLink
              v-for="c in point.categories"
              :key="c.id"
              :to="`/como-descartar/${c.slug}`"
              ><Icon :name="c.icon" :size="19" />{{ c.name }}</RouterLink
            >
          </div>
          <template v-if="point.not_accepted"
            ><h2>Materiais não aceitos</h2>
            <p>{{ point.not_accepted }}</p></template
          >
          <h2>Antes de ir</h2>
          <p>
            <strong>Horário:</strong>
            {{
              point.opening_hours ||
              "Ainda não confirmado. Consulte o responsável."
            }}
          </p>
          <p v-if="point.phone">
            <strong>Contato:</strong>
            <a :href="`tel:${point.phone.replace(/[^+\d]/g, '')}`">{{
              point.phone
            }}</a>
          </p>
          <p v-if="point.observations">{{ point.observations }}</p>
          <a
            v-if="safeUrl(point.website)"
            :href="safeUrl(point.website)"
            target="_blank"
            rel="noopener noreferrer"
            class="text-link"
            >Site do responsável <Icon name="ExternalLink" :size="16"
          /></a>
          <div class="source-box">
            <Icon name="ShieldCheck" :size="23" />
            <div>
              <h3>Fonte consultada em {{ formatDate(point.verified_at) }}</h3>
              <a
                v-if="safeUrl(point.source_url)"
                :href="safeUrl(point.source_url)"
                target="_blank"
                rel="noopener noreferrer"
                >Consultar fonte oficial
                <Icon name="ExternalLink" :size="15" /></a
              ><a
                v-for="source in point.sources"
                :key="source.url"
                :href="safeUrl(source.url)"
                target="_blank"
                rel="noopener noreferrer"
                >{{ source.title }} <Icon name="ExternalLink" :size="15" /></a
              ><a
                v-if="safeUrl(point.coordinate_source_url)"
                :href="safeUrl(point.coordinate_source_url)"
                target="_blank"
                rel="noopener noreferrer"
                >Origem das coordenadas · OpenStreetMap
                <Icon name="ExternalLink" :size="15"
              /></a>
              <p>{{ point.verification_notes }}</p>
            </div>
          </div>
          <RouterLink
            :to="{ path: '/participar/reportar', query: { ponto: point.id } }"
            class="text-link"
            ><Icon name="AlertCircle" :size="17" /> Informar um problema com
            este cadastro</RouterLink
          >
        </div>
        <div>
          <PointMap :points="[point]" :city="point.city" />
          <p class="small-muted">
            A rota usa as coordenadas verificadas ou o endereço cadastrado.
          </p>
        </div>
      </div></template
    >
  </div>
</template>
