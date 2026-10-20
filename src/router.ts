import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("./pages/HomePage.vue"),
      meta: { title: "O destino certo para cada resíduo" },
    },
    {
      path: "/pontos",
      component: () => import("./pages/LocatorPage.vue"),
      meta: { title: "Encontrar pontos" },
    },
    {
      path: "/pontos/:id",
      component: () => import("./pages/PointPage.vue"),
      meta: { title: "Detalhes do ponto" },
    },
    {
      path: "/como-descartar/:slug?",
      component: () => import("./pages/EducationPage.vue"),
      meta: { title: "Como descartar" },
    },
    {
      path: "/sobre",
      component: () => import("./pages/AboutPage.vue"),
      meta: { title: "Sobre o projeto" },
    },
    {
      path: "/participar/:kind?",
      component: () => import("./pages/CommunityPage.vue"),
      meta: { title: "Faça parte" },
    },
    {
      path: "/compartilhar",
      component: () => import("./pages/SharePage.vue"),
      meta: { title: "Compartilhe o Ponto Verde" },
    },
    {
      path: "/privacidade",
      component: () => import("./pages/PrivacyPage.vue"),
      meta: { title: "Privacidade e fontes" },
    },
    {
      path: "/:pathMatch(.*)*",
      component: () => import("./pages/NotFoundPage.vue"),
      meta: { title: "Página não encontrada" },
    },
  ],
  scrollBehavior(to, from, saved) {
    return saved || (to.path === from.path ? false : { top: 0 });
  },
});
router.afterEach((to, from) => {
  document.title = `${String(to.meta.title || "Guia ambiental")} · Ponto Verde`;
  if (to.path !== from.path) {
    requestAnimationFrame(() =>
      document
        .querySelector<HTMLElement>("main")
        ?.focus({ preventScroll: true }),
    );
  }
});
export default router;
