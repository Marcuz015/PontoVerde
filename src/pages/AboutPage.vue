<script setup lang="ts">
import Icon from "../components/Icon.vue";
</script>
<template>
  <div class="page-heading">
    <div class="container">
      <p class="eyebrow">SOBRE O PONTO VERDE</p>
      <h1>
        A informação aproxima.<br /><span class="green-text"
          >O cuidado transforma.</span
        >
      </h1>
      <p>
        Um projeto acadêmico para ajudar pessoas a encontrar o destino adequado
        para seus resíduos.
      </p>
    </div>
  </div>
  <section class="container section about-grid">
    <div class="prose">
      <h2>Da universidade para o nosso dia a dia.</h2>
      <p>
        O Ponto Verde é um projeto de extensão universitária do CEUNSP,
        desenvolvido no componente Itinerários Extensionistas. A proposta é
        aproximar o conhecimento acadêmico de uma necessidade concreta da
        comunidade: saber onde e como descartar resíduos.
      </p>
      <p>
        O guia atende inicialmente Salto, Itu, Tietê e Cabreúva, no interior de
        São Paulo. A plataforma organiza informações de pontos existentes, com
        fontes, materiais aceitos e data da última verificação.
      </p>
      <h2>Uma dificuldade que ouvimos de perto.</h2>
      <p>
        Um questionário de diagnóstico com 15 participantes ajudou a definir a
        proposta. Os resultados representam apenas esse pequeno grupo e não
        devem ser generalizados para a população.
      </p>
      <div class="survey-grid">
        <article>
          <strong>15 de 15</strong>
          <p>já usaram o lixo comum por não saber onde levar resíduos.</p>
        </article>
        <article>
          <strong>13 de 15</strong>
          <p>usariam um site ou QR Code para encontrar pontos.</p>
        </article>
        <article>
          <strong>14 de 15</strong>
          <p>acreditam que a informação pode reduzir o descarte incorreto.</p>
        </article>
        <article>
          <strong>8 de 15</strong>
          <p>não conhecem ou não têm certeza sobre pontos próximos.</p>
        </article>
      </div>
      <h2>Transparência também é cuidado.</h2>
      <p>
        O Ponto Verde é um guia informativo independente. Não é um serviço
        oficial das prefeituras e não realiza coleta nem transporte. Sugestões
        da comunidade passam por avaliação antes de serem publicadas. Sem
        informação confirmada, mostramos essa ausência de forma clara.
      </p>
      <RouterLink to="/participar/sugerir" class="button"
        >Ajude a construir o guia <Icon name="ArrowUpRight"
      /></RouterLink>
    </div>
    <aside class="about-aside">
      <div class="ods-card">
        <span class="ods-number">15</span
        ><Icon name="Sprout" :size="62" :stroke-width="1.2" />
        <h3>Vida terrestre</h3>
        <p>
          Vínculo principal do trabalho: cuidado com o solo, a biodiversidade e
          os ecossistemas terrestres.
        </p>
      </div>
      <div class="ods-card secondary">
        <span class="ods-number">12</span
        ><Icon name="Recycle" :size="48" :stroke-width="1.2" />
        <h3>Consumo e produção responsáveis</h3>
        <p>
          Vínculo complementar: prevenção de resíduos, reúso e destinação
          adequada.
        </p>
      </div>
      <a
        href="https://brasil.un.org/pt-br/sdgs"
        target="_blank"
        rel="noopener noreferrer"
        class="text-link"
        >Conheça os ODS na ONU <Icon name="ExternalLink" :size="15"
      /></a>
    </aside>
  </section>
</template>
