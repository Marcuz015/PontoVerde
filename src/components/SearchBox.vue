<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { cities } from "../types";
import { useCatalog } from "../composables/useCatalog";
import Icon from "./Icon.vue";
const city = ref("");
const category = ref("");
const router = useRouter();
const { categories } = useCatalog();
function search() {
  router.push({
    path: "/pontos",
    query: {
      ...(city.value ? { cidade: city.value } : {}),
      ...(category.value ? { residuo: category.value } : {}),
    },
  });
}
</script>
<template>
  <form class="search-box" @submit.prevent="search">
    <label
      ><span class="field-label"
        ><Icon name="MapPin" :size="16" /> SUA CIDADE</span
      ><select v-model="city" aria-label="Sua cidade">
        <option value="">Selecione sua cidade</option>
        <option v-for="item in cities" :key="item">{{ item }}</option>
      </select></label
    >
    <label
      ><span class="field-label"
        ><Icon name="Recycle" :size="16" /> O QUE VAI DESCARTAR?</span
      ><select v-model="category" aria-label="Tipo de resíduo">
        <option value="">Selecione um material</option>
        <option v-for="item in categories" :key="item.id" :value="item.slug">
          {{ item.name }}
        </option>
      </select></label
    >
    <button type="submit" class="button button-lime">
      <Icon name="Search" /> Buscar pontos
      <Icon name="ArrowUpRight" :size="19" />
    </button>
  </form>
</template>
