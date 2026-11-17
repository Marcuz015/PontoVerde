<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import Icon from "./components/Icon.vue";
import { useCatalog } from "./composables/useCatalog";
const route = useRoute();
const menu = ref(false);
const offline = ref(!navigator.onLine);
const scrolled = ref(false);
const showTop = ref(false);
watch(
  () => route.fullPath,
  () => {
    menu.value = false;
  },
);
const updateConnection = () => {
  offline.value = !navigator.onLine;
};
let ticking = false;
const onScroll = () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    scrolled.value = window.scrollY > 12;
    showTop.value = window.scrollY > 900;
    ticking = false;
  });
};
const onKey = (e: KeyboardEvent) => {
  if (e.key === "Escape" && menu.value) menu.value = false;
};
const toTop = () => {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  document.querySelector<HTMLElement>("main")?.focus({ preventScroll: true });
};
onMounted(() => {
  window.addEventListener("online", updateConnection);
  window.addEventListener("offline", updateConnection);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("keydown", onKey);
  onScroll();
  void useCatalog().refresh();
});
onBeforeUnmount(() => {
  window.removeEventListener("online", updateConnection);
  window.removeEventListener("offline", updateConnection);
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("keydown", onKey);
});
</script>
<template>
  <a href="#conteudo" class="skip-link">Ir para o conteúdo</a>
  <div class="site-top" :class="{ 'is-scrolled': scrolled, 'menu-open': menu }">
    <div class="top-strip">
      <span
        ><Icon name="Leaf" :size="13" /> Uma pequena atitude. Um futuro mais
        verde.</span
      ><RouterLink to="/sobre"
        >Um projeto de extensão CEUNSP <Icon name="ArrowUpRight" :size="13"
      /></RouterLink>
    </div>
    <header class="site-header">
      <div class="container header-inner">
        <RouterLink to="/" class="brand" aria-label="Ponto Verde, início"
          ><span class="brand-mark"><Icon name="Sprout" :size="24" /></span
          ><span>ponto<span class="brand-light">verde</span><i></i></span
        ></RouterLink>
        <nav class="desktop-nav" aria-label="Navegação principal">
          <RouterLink to="/" exact-active-class="active">Início</RouterLink
          ><RouterLink to="/pontos">Encontrar pontos</RouterLink
          ><RouterLink to="/como-descartar">Como descartar</RouterLink
          ><RouterLink to="/sobre">Sobre o projeto</RouterLink>
        </nav>
        <RouterLink to="/pontos" class="button header-cta"
          ><Icon name="MapPin" :size="17" /> Encontrar ponto</RouterLink
        >
        <button
          class="menu-toggle"
          :aria-expanded="menu"
          aria-controls="mobile-nav"
          :aria-label="menu ? 'Fechar menu' : 'Abrir menu'"
          @click="menu = !menu"
        >
          <Icon :name="menu ? 'X' : 'Menu'" :size="24" />
        </button>
      </div>
      <Transition name="menu">
        <nav
          v-if="menu"
          id="mobile-nav"
          class="mobile-nav"
          aria-label="Navegação móvel"
        >
          <RouterLink to="/"
            ><Icon name="Sprout" :size="19" /> Início</RouterLink
          ><RouterLink to="/pontos"
            ><Icon name="MapPin" :size="19" /> Encontrar pontos</RouterLink
          ><RouterLink to="/como-descartar"
            ><Icon name="Recycle" :size="19" /> Como descartar</RouterLink
          ><RouterLink to="/sobre"
            ><Icon name="Heart" :size="19" /> Sobre o projeto</RouterLink
          ><RouterLink to="/participar/sugerir" class="button button-lime"
            ><Icon name="Plus" :size="18" /> Sugerir um ponto</RouterLink
          >
        </nav>
      </Transition>
    </header>
    <p v-if="offline" class="connection-banner" role="alert">
      Você está sem conexão. O mapa e as rotas precisam de internet. O catálogo
      já carregado continua disponível.
    </p>
  </div>
  <Transition name="fade">
    <div
      v-if="menu"
      class="menu-backdrop"
      aria-hidden="true"
      @click="menu = false"
    ></div>
  </Transition>
  <main id="conteudo" tabindex="-1">
    <RouterView v-slot="{ Component, route: r }">
      <Transition name="page" mode="out-in">
        <div :key="r.matched[0]?.path ?? r.path" class="page"><component :is="Component" /></div>
      </Transition>
    </RouterView>
  </main>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-cta" v-reveal>
        <div>
          <p class="eyebrow">FAÇA PARTE DO GUIA</p>
          <h2>Conhece um ponto de descarte que ainda não está aqui?</h2>
        </div>
        <RouterLink to="/participar/sugerir" class="button button-lime"
          ><Icon name="Plus" :size="18" /> Sugerir um ponto</RouterLink
        >
      </div>
      <div class="footer-top">
        <div>
          <RouterLink to="/" class="brand"
            ><span class="brand-mark"><Icon name="Sprout" :size="23" /></span
            ><span>ponto<span class="brand-light">verde</span><i></i></span
          ></RouterLink>
          <p>
            O destino certo para cada resíduo.<br />O primeiro passo começa com
            você.
          </p>
        </div>
        <div>
          <h3>Explore</h3>
          <RouterLink to="/pontos">Encontre um ponto</RouterLink
          ><RouterLink to="/como-descartar">Aprenda a descartar</RouterLink
          ><RouterLink to="/sobre">Conheça o projeto</RouterLink>
        </div>
        <div>
          <h3>Faça parte</h3>
          <RouterLink to="/participar/sugerir">Sugira um ponto</RouterLink
          ><RouterLink to="/participar/avaliar">Avalie a plataforma</RouterLink
          ><RouterLink to="/compartilhar">Compartilhe a ideia</RouterLink>
        </div>
        <div class="footer-note">
          <Icon name="Heart" :size="22" />
          <p>Feito para cuidar<br />de onde a gente vive.</p>
          <span>Salto · Itu · Tietê · Cabreúva</span>
        </div>
      </div>
      <div class="footer-bottom">
        <p>
          © {{ new Date().getFullYear() }} Ponto Verde · Projeto acadêmico de
          extensão CEUNSP.<br />Guia informativo independente. Não realizamos
          coleta ou transporte.
        </p>
        <div>
          <RouterLink to="/privacidade">Privacidade e fontes</RouterLink
          ><RouterLink to="/compartilhar"
            >Compartilhar o projeto <Icon name="ArrowUpRight" :size="13"
          /></RouterLink>
        </div>
      </div>
    </div>
  </footer>
  <Transition name="fade">
    <button
      v-if="showTop"
      class="back-to-top"
      type="button"
      aria-label="Voltar ao topo"
      @click="toTop"
    >
      <Icon name="ArrowUp" :size="20" />
    </button>
  </Transition>
</template>
