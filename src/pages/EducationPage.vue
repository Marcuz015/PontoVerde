<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useCatalog } from "../composables/useCatalog";
import Icon from "../components/Icon.vue";
import StatePanel from "../components/StatePanel.vue";
import { safeUrl } from "../utils";
const route = useRoute();
const { categories } = useCatalog();
const category = computed(() =>
  categories.value.find((c) => c.slug === route.params.slug),
);
</script>
<template>
  <div class="page-heading">
    <div class="container">
      <p class="eyebrow">INFORMAÇÃO QUE VIRA ATITUDE</p>
      <h1>
        {{ category?.name || "Cada resíduo," }}<br v-if="!category" /><span
          v-if="!category"
          class="green-text"
          >um cuidado diferente.</span
        >
      </h1>
      <p>
        {{
          category?.description ||
          "Antes de descartar, descubra como separar, armazenar e levar seu material com segurança."
        }}
      </p>
    </div>
  </div>
  <section v-if="!route.params.slug" class="container section compact-top">
    <div class="category-grid all-categories">
      <RouterLink
        v-for="(c, i) in categories"
        :key="c.id"
        :to="`/como-descartar/${c.slug}`"
        class="category-card"
        :class="`category-tone-${i % 3}`"
        ><span class="category-icon"><Icon :name="c.icon" :size="32" /></span>
        <h2>{{ c.name }}</h2>
        <p>{{ c.description }}</p>
        <span class="category-card-bottom"
          >Veja as orientações <Icon name="ArrowUpRight" :size="19" /></span
      ></RouterLink>
    </div>
  </section>
  <section
    v-else-if="category"
    class="container section compact-top education-detail"
  >
    <aside>
      <RouterLink to="/como-descartar" class="text-link"
        ><Icon name="ArrowLeft" :size="17" /> Todos os materiais</RouterLink
      >
      <nav aria-label="Categorias de resíduos">
        <RouterLink
          v-for="c in categories"
          :key="c.id"
          :to="`/como-descartar/${c.slug}`"
          ><Icon :name="c.icon" :size="18" /> {{ c.name }}</RouterLink
        >
      </nav>
    </aside>
    <div class="education-body">
      <div class="education-example">
        <Icon :name="category.icon" :size="48" />
        <div>
          <p class="eyebrow">O QUE ENTRA NESTA CATEGORIA</p>
          <div class="tags">
            <span
              v-for="item in category.disposal_instructions.examples"
              :key="item"
              >{{ item }}</span
            >
          </div>
        </div>
      </div>
      <article>
        <h2><Icon name="CheckCircle2" :size="25" /> Como preparar</h2>
        <ol>
          <li
            v-for="item in category.disposal_instructions.prepare"
            :key="item"
          >
            {{ item }}
          </li>
        </ol>
      </article>
      <article class="avoid-box">
        <h2><Icon name="AlertCircle" :size="24" /> O que evitar</h2>
        <ul>
          <li v-for="item in category.disposal_instructions.avoid" :key="item">
            {{ item }}
          </li>
        </ul>
      </article>
      <article>
        <h2>Por que isso faz diferença?</h2>
        <p>{{ category.disposal_instructions.impact }}</p>
      </article>
      <div class="source-box">
        <Icon name="ShieldCheck" :size="21" />
        <div>
          <h3>Informação com referência</h3>
          <a
            v-for="source in category.disposal_instructions.sources"
            :key="source.url"
            :href="safeUrl(source.url)"
            target="_blank"
            rel="noopener noreferrer"
            >{{ source.title }} <Icon name="ExternalLink" :size="14"
          /></a>
          <p>
            As regras e os tipos aceitos variam por local. Confirme sempre antes
            da entrega.
          </p>
        </div>
      </div>
      <RouterLink
        :to="{ path: '/pontos', query: { residuo: category.slug } }"
        class="button"
        >Onde descartar {{ category.name.toLowerCase() }}
        <Icon name="ArrowUpRight"
      /></RouterLink>
    </div>
  </section>
  <StatePanel
    v-else
    title="Material não encontrado"
    message="Confira as categorias disponíveis no guia."
    ><RouterLink to="/como-descartar" class="button"
      >Ver materiais</RouterLink
    ></StatePanel
  >
</template>
