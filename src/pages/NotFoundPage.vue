<script setup lang="ts">
import StatePanel from "../components/StatePanel.vue";
</script>
<template>
  <section class="container section">
    <StatePanel
      title="Este caminho ainda não tem um ponto."
      message="A página não foi encontrada. Volte ao início para continuar."
      ><RouterLink to="/" class="button"
        >Ir para o início</RouterLink
      ></StatePanel
    >
  </section>
</template>
