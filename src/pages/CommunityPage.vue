<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { cities } from "../types";
import { useCatalog } from "../composables/useCatalog";
import { validateCommunity } from "../../shared/community";
import Icon from "../components/Icon.vue";
const route = useRoute();
const { categories, points } = useCatalog();
const kind = computed(() =>
  route.params.kind === "reportar"
    ? "report"
    : route.params.kind === "avaliar"
      ? "feedback"
      : "suggestion",
);
const titles = {
  suggestion: "Um novo ponto. Mais possibilidades.",
  report: "Sua atenção faz a diferença.",
  feedback: "Como foi a sua experiência?",
};
const form = reactive({
  name: "",
  city: "",
  address: "",
  waste_categories: [] as string[],
  observations: "",
  disposal_point_id: "",
  report_type: "",
  description: "",
  found_material: "",
  found_city: "",
  clear_info: "",
  map_worked: "",
  would_reuse: "",
  improvements: "",
});
const questions = [
  { key: "found_material", text: "Conseguiu encontrar o tipo de resíduo?" },
  { key: "found_city", text: "Encontrou um ponto na sua cidade?" },
  { key: "clear_info", text: "As informações estavam claras?" },
  { key: "map_worked", text: "O mapa e a rota funcionaram?" },
  { key: "would_reuse", text: "Você usaria a plataforma novamente?" },
] as const;
const error = ref("");
const prepared = ref("");
const message = ref("");
watch(
  () => route.fullPath,
  () => {
    prepared.value = "";
    error.value = "";
    message.value = "";
    form.disposal_point_id =
      typeof route.query.ponto === "string" ? route.query.ponto : "";
  },
  { immediate: true },
);
function prepare() {
  error.value = "";
  message.value = "";
  prepared.value = "";
  try {
    const payload = validateCommunity(kind.value, form);
    if (
      kind.value === "report" &&
      !points.value.some((p) => p.id === payload.disposal_point_id)
    )
      throw new Error("Selecione um ponto do catálogo.");
    prepared.value = JSON.stringify(
      {
        project: "Ponto Verde",
        version: 1,
        kind: kind.value,
        created_at: new Date().toISOString(),
        payload,
      },
      null,
      2,
    );
  } catch (e) {
    error.value = (e as Error).message;
  }
}
function download() {
  const url = URL.createObjectURL(
    new Blob([prepared.value], { type: "application/json;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `ponto-verde-${kind.value}-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10000);
  message.value =
    "Arquivo preparado para download. Ele não foi enviado à equipe automaticamente.";
}
async function copy() {
  try {
    await navigator.clipboard.writeText(prepared.value);
    message.value =
      "Conteúdo copiado. Você pode compartilhá-lo com a equipe do projeto.";
  } catch {
    message.value =
      "Não foi possível copiar. Use o botão para baixar o arquivo.";
  }
}
</script>
<template>
  <div class="page-heading">
    <div class="container">
      <p class="eyebrow">CONSTRUÍDO COM A COMUNIDADE</p>
      <h1>{{ titles[kind] }}</h1>
      <p>
        Prepare uma contribuição sem informar nome, e-mail, telefone ou CPF.
      </p>
    </div>
  </div>
  <section class="container section community-layout">
    <aside class="community-aside">
      <RouterLink to="/participar/sugerir"
        ><Icon name="Plus" /> Sugerir um ponto</RouterLink
      ><RouterLink to="/participar/reportar"
        ><Icon name="AlertCircle" /> Informar um problema</RouterLink
      ><RouterLink to="/participar/avaliar"
        ><Icon name="Heart" /> Avaliar a plataforma</RouterLink
      >
      <div class="source-box">
        <Icon name="ShieldCheck" :size="24" />
        <p>
          Esta versão usa um catálogo fixo. A contribuição é gerada no seu
          dispositivo para você compartilhar com a equipe; não há envio
          automático.
        </p>
      </div>
    </aside>
    <div class="form-card">
      <div v-if="prepared" class="contribution-ready" role="status">
        <span class="state-icon"><Icon name="CheckCircle2" :size="32" /></span>
        <h2>Sua contribuição está pronta para compartilhar.</h2>
        <p>
          Baixe o arquivo ou copie o conteúdo e entregue à equipe acadêmica pelo
          canal combinado. Nenhum dado foi enviado a um servidor.
        </p>
        <div class="state-actions">
          <button class="button" @click="download">
            <Icon name="Download" :size="18" /> Baixar contribuição</button
          ><button class="button button-outline" @click="copy">
            Copiar conteúdo
          </button>
        </div>
        <p v-if="message" class="inline-success">{{ message }}</p>
        <button
          class="text-link"
          @click="
            prepared = '';
            message = '';
          "
        >
          <Icon name="ArrowLeft" :size="16" /> Voltar e revisar
        </button>
      </div>
      <form v-else @submit.prevent="prepare">
        <h2>
          {{
            kind === "suggestion"
              ? "Conte sobre o local"
              : kind === "report"
                ? "O que precisa ser atualizado?"
                : "Sua opinião ajuda a melhorar"
          }}
        </h2>
        <p class="small-muted">
          Campos com * são obrigatórios. Não inclua dados pessoais.
        </p>
        <p class="inline-notice">
          Ao concluir, você poderá baixar ou copiar sua contribuição. Ela não
          será enviada automaticamente nem publicada no catálogo.
        </p>
        <template v-if="kind === 'suggestion'"
          ><label
            >Nome do local *<input
              v-model="form.name"
              required
              minlength="3"
              maxlength="160"
              placeholder="Como o local é conhecido?" /></label
          ><label
            >Cidade *<select v-model="form.city" required>
              <option disabled value="">Selecione a cidade</option>
              <option v-for="city in cities" :key="city">{{ city }}</option>
            </select></label
          ><label
            >Endereço ou referência de localização *<input
              v-model="form.address"
              required
              minlength="5"
              maxlength="400"
              placeholder="Rua, número e bairro"
          /></label>
          <fieldset>
            <legend>Quais materiais o local recebe? *</legend>
            <div class="checkbox-grid">
              <label v-for="c in categories" :key="c.id"
                ><input
                  v-model="form.waste_categories"
                  type="checkbox"
                  :value="c.slug"
                />
                {{ c.name }}</label
              >
            </div>
          </fieldset>
          <label
            >Observações<textarea
              v-model="form.observations"
              maxlength="2000"
              rows="4"
              placeholder="Informe uma fonte pública, horário ou restrição que você conheça."
            /></label
        ></template>
        <template v-else-if="kind === 'report'"
          ><label
            >Ponto de descarte *<select
              v-model="form.disposal_point_id"
              required
            >
              <option disabled value="">Selecione um ponto</option>
              <option v-for="p in points" :key="p.id" :value="p.id">
                {{ p.name }} · {{ p.city }}
              </option>
            </select></label
          ><label
            >Tipo de problema *<select v-model="form.report_type" required>
              <option disabled value="">Selecione uma opção</option>
              <option value="closed">Local fechado</option>
              <option value="address">Endereço incorreto</option>
              <option value="hours">Horário incorreto</option>
              <option value="material">Material não aceito</option>
              <option value="other">Outra informação desatualizada</option>
            </select></label
          ><label
            >Descreva o que encontrou *<textarea
              v-model="form.description"
              required
              minlength="10"
              maxlength="2000"
              rows="5"
              placeholder="Conte o que precisa ser conferido, sem dados pessoais."
            /></label
        ></template>
        <template v-else
          ><label v-for="q in questions" :key="q.key"
            >{{ q.text }} *<select v-model="form[q.key]" required>
              <option value="" disabled>Selecione sua resposta</option>
              <option value="yes">Sim</option>
              <option value="no">Não</option>
              <option value="untested">Não testei / não se aplica</option>
            </select></label
          ><label
            >O que poderia melhorar?<textarea
              v-model="form.improvements"
              rows="4"
              maxlength="2000"
            /></label
        ></template>
        <p v-if="error" class="form-error" role="alert">{{ error }}</p>
        <button class="button" type="submit">
          Preparar contribuição <Icon name="ArrowUpRight" :size="18" />
        </button>
        <p class="small-muted">
          O arquivo contém apenas suas respostas e a data.
          <RouterLink to="/privacidade">Saiba mais sobre privacidade</RouterLink
          >.
        </p>
      </form>
    </div>
  </section>
</template>
