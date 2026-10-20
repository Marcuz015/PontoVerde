<script setup lang="ts">
import Icon from "./Icon.vue";
defineProps<{ title: string; message: string; icon?: string }>();
</script>
<template>
  <div class="state-panel" role="status">
    <span class="state-icon"><Icon :name="icon || 'MapPin'" :size="29" /></span>
    <h3>{{ title }}</h3>
    <p>{{ message }}</p>
    <div class="state-actions"><slot /></div>
  </div>
</template>
