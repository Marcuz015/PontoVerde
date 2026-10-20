<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import QRCode from "qrcode";
import Icon from "../components/Icon.vue";
const configuredUrl = import.meta.env.VITE_PUBLIC_SITE_URL?.trim() || "";
const publicUrl = computed(() => {
  try {
    const u = new URL(configuredUrl);
    return u.protocol === "https:" &&
      !["localhost", "127.0.0.1"].includes(u.hostname) &&
      !u.username &&
      !u.password
      ? u.origin + "/"
      : "";
  } catch {
    return "";
  }
});
const qr = ref("");
const message = ref("");
onMounted(async () => {
  if (publicUrl.value)
    qr.value = await QRCode.toDataURL(publicUrl.value, {
      width: 800,
      margin: 4,
      errorCorrectionLevel: "H",
      color: { dark: "#10251b", light: "#ffffff" },
    });
});
async function share() {
  try {
    if (navigator.share)
      await navigator.share({
        title: "Ponto Verde",
        text: "O destino certo para cada resíduo.",
        url: publicUrl.value,
      });
    else {
      await navigator.clipboard.writeText(publicUrl.value);
      message.value = "Link copiado.";
    }
  } catch (e) {
    if (!(e instanceof DOMException && e.name === "AbortError"))
      message.value =
        "Não foi possível compartilhar automaticamente. Copie o endereço exibido.";
  }
}
</script>
<template>
  <div class="page-heading">
    <div class="container">
      <p class="eyebrow">UMA BOA IDEIA MERECE CIRCULAR</p>
      <h1>
        Compartilhe informação.<br /><span class="green-text"
          >Multiplique o cuidado.</span
        >
      </h1>
      <p>
        Leve o Ponto Verde para conversas, apresentações e materiais da
        comunidade.
      </p>
    </div>
  </div>
  <section class="container section share-layout">
    <div>
      <Icon name="Share2" :size="38" />
      <h2>O primeiro passo pode ser um link.</h2>
      <p>
        Compartilhe a aplicação com quem quer dar um destino melhor aos
        resíduos.
      </p>
      <template v-if="publicUrl"
        ><p class="share-url">{{ publicUrl }}</p>
        <button class="button" @click="share">
          Compartilhar o site <Icon name="ArrowUpRight" />
        </button>
        <p v-if="message" role="status">{{ message }}</p></template
      >
      <p v-else class="inline-notice">
        O QR Code definitivo será disponibilizado depois da configuração e
        publicação da URL pública. Assim, o material impresso sempre levará à
        aplicação correta.
      </p>
      <p class="small-muted">
        Este recurso é do site final. Ele é diferente do QR Code do questionário
        de diagnóstico.
      </p>
    </div>
    <div class="qr-card">
      <Icon name="Sprout" :size="33" />
      <h2>Ponto Verde</h2>
      <img
        v-if="qr"
        :src="qr"
        width="260"
        height="260"
        :alt="`QR Code para ${publicUrl}`"
      />
      <div v-else class="qr-placeholder">
        <Icon name="Share2" :size="62" /><span
          >Em breve, seu ponto<br />de partida estará aqui.</span
        >
      </div>
      <p>O destino certo para cada resíduo.</p>
      <a
        v-if="qr"
        class="text-link"
        :href="qr"
        download="ponto-verde-qrcode.png"
        ><Icon name="Download" :size="17" /> Baixar QR Code para impressão</a
      >
    </div>
  </section>
</template>
