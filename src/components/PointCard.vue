<script setup lang="ts">
import type { DisposalPoint } from "../types";
import { address, routeUrl, formatDate } from "../utils";
import Icon from "./Icon.vue";
defineProps<{ point: DisposalPoint; selected?: boolean; distance?: number }>();
defineEmits<{ select: [id: string] }>();
</script>
<template>
  <article class="point-card" :class="{ selected }">
    <div class="point-top">
      <span class="point-symbol"><Icon name="MapPin" :size="24" /></span
      ><span class="badge"
        ><Icon name="ShieldCheck" :size="14" /> Fonte conferida</span
      >
    </div>
    <p class="eyebrow">
      {{ point.city }} <span>·</span> {{ point.neighborhood }}
    </p>
    <h3>
      <button class="text-button" @click="$emit('select', point.id)">
        {{ point.name }}
      </button>
    </h3>
    <p class="address">{{ address(point) }}</p>
    <div class="tags">
      <span v-for="c in point.categories" :key="c.id">{{ c.name }}</span>
    </div>
    <p class="point-meta">
      <Icon name="Clock" :size="15" />
      {{ point.opening_hours || "Horário não confirmado" }}
    </p>
    <p class="point-meta">
      Fonte consultada: {{ formatDate(point.verified_at) }}
    </p>
    <p v-if="distance !== undefined" class="point-meta">
      Aprox. {{ distance.toFixed(1) }} km em linha reta
    </p>
    <p v-if="point.point_type === 'campaign'" class="badge">
      Campanha temporária · até {{ formatDate(point.expires_at) }}
    </p>
    <div class="card-actions">
      <RouterLink :to="`/pontos/${point.id}`" class="text-link"
        >Ver detalhes <Icon name="ArrowRight" :size="16" /></RouterLink
      ><a
        :href="routeUrl(point)"
        target="_blank"
        rel="noopener noreferrer"
        class="route-link"
        ><Icon name="Navigation" :size="16" /> Como chegar</a
      >
    </div>
  </article>
</template>
