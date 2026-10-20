<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import Icon from "./components/Icon.vue";
import { useCatalog } from "./composables/useCatalog";
const route = useRoute();
const menu = ref(false);
const offline = ref(!navigator.onLine);
watch(
  () => route.fullPath,
  () => {
    menu.value = false;
  },
);
const updateConnection = () => {
  offline.value = !navigator.onLine;
};
onMounted(() => {
  window.addEventListener("online", updateConnection);
  window.addEventListener("offline", updateConnection);
  void useCatalog().refresh();
});
onBeforeUnmount(() => {
  window.removeEventListener("online", updateConnection);
  window.removeEventListener("offline", updateConnection);
});
</script>
<template>
  <a href="#conteudo" class="skip-link">Ir para o conteúdo</a>
  <div class="top-strip">
    <span>Uma pequena atitude. Um futuro mais verde.</span
    ><RouterLink to="/sobre"
      >Um projeto de extensão CEUNSP <Icon name="ArrowUpRight" :size="13"
    /></RouterLink>
  </div>
  <header class="site-header">
    <div class="container header-inner">
      <RouterLink to="/" class="brand" aria-label="Ponto Verde, início"
        ><span class="brand-mark"><Icon name="Sprout" :size="26" /></span
        ><span>ponto<span class="brand-light">verde</span><i></i></span
      ></RouterLink>
      <nav class="desktop-nav" aria-label="Navegação principal">
        <RouterLink to="/" exact-active-class="active">Início</RouterLink
        ><RouterLink to="/pontos">Encontrar pontos</RouterLink
        ><RouterLink to="/como-descartar">Como descartar</RouterLink
        ><RouterLink to="/sobre">Sobre o projeto</RouterLink>
      </nav>
      <RouterLink to="/pontos" class="button header-cta"
        >Encontrar ponto <Icon name="ArrowUpRight" :size="17"
      /></RouterLink>
      <button
        class="menu-toggle"
        :aria-expanded="menu"
        aria-controls="mobile-nav"
        :aria-label="menu ? 'Fechar menu' : 'Abrir menu'"
        @click="menu = !menu"
      >
        <Icon :name="menu ? 'X' : 'Menu'" :size="25" />
      </button>
    </div>
    <nav
      v-if="menu"
      id="mobile-nav"
      class="mobile-nav"
      aria-label="Navegação móvel"
    >
      <RouterLink to="/">Início</RouterLink
      ><RouterLink to="/pontos">Encontrar pontos</RouterLink
      ><RouterLink to="/como-descartar">Como descartar</RouterLink
      ><RouterLink to="/sobre">Sobre o projeto</RouterLink
      ><RouterLink to="/participar/sugerir">Sugerir um ponto</RouterLink>
    </nav>
  </header>
  <p v-if="offline" class="connection-banner" role="alert">
    Você está sem conexão. O mapa e as rotas precisam de internet. O catálogo já
    carregado continua disponível.
  </p>
  <main id="conteudo" tabindex="-1"><RouterView /></main>
  <footer class="site-footer">
    <div class="container">
      <div class="footer-top">
        <div>
          <RouterLink to="/" class="brand"
            ><span class="brand-mark"><Icon name="Sprout" :size="25" /></span
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
</template>
