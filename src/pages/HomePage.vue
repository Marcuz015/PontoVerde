<script setup lang="ts">
import Icon from "../components/Icon.vue";
import SearchBox from "../components/SearchBox.vue";
import { useCatalog } from "../composables/useCatalog";
import { cities } from "../types";
const { categories } = useCatalog();
</script>
<template>
  <section class="home-hero">
    <div class="container">
      <div class="hero-grid">
        <div class="hero-copy">
          <div class="hero-kicker">
            <span class="live-dot"></span> CONECTANDO PESSOAS A UM FUTURO MELHOR
          </div>
          <h1>
            O que você descarta <br />pode ser um <br /><span>novo começo.</span
            ><svg viewBox="0 0 320 12" aria-hidden="true">
              <path
                d="M3 8Q140-3 315 6"
                fill="none"
                stroke="currentColor"
                stroke-width="5"
                stroke-linecap="round"
              />
            </svg>
          </h1>
          <p>
            Descartar corretamente ficou mais fácil. Encontre o lugar certo para
            seus resíduos e faça a diferença perto de você.
          </p>
          <a href="#buscar" class="hero-anchor"
            >Encontre seu ponto de partida <Icon name="ArrowRight" :size="18"
          /></a>
        </div>
        <div
          class="hero-art"
          role="img"
          aria-label="Ilustração de uma planta e ciclos de reaproveitamento"
        >
          <div class="art-grid"></div>
          <div class="orbit orbit-one"></div>
          <div class="orbit orbit-two"></div>
          <div class="orbit orbit-three"></div>
          <div class="art-label">MENOS DESCARTE.<br />MAIS POSSIBILIDADES.</div>
          <svg
            class="plant-art"
            viewBox="0 0 440 440"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="leaf-a"
                x1="120"
                y1="120"
                x2="300"
                y2="260"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#d7ff9e" />
                <stop offset="1" stop-color="#79b93a" />
              </linearGradient>
              <linearGradient
                id="leaf-b"
                x1="300"
                y1="80"
                x2="250"
                y2="260"
                gradientUnits="userSpaceOnUse"
              >
                <stop stop-color="#b8ef6d" />
                <stop offset="1" stop-color="#367c40" />
              </linearGradient>
            </defs>
            <ellipse
              cx="224"
              cy="357"
              rx="100"
              ry="16"
              fill="#10251b"
              opacity=".12"
            />
            <path
              d="M217 345c11-72 19-131 56-201"
              stroke="#174c34"
              stroke-width="10"
              stroke-linecap="round"
            />
            <path
              d="M229 280c-15-38-49-61-83-83"
              stroke="#174c34"
              stroke-width="7"
              stroke-linecap="round"
            />
            <path
              d="M240 242C201 144 287 91 346 94c8 80-32 148-106 148Z"
              fill="url(#leaf-b)"
            />
            <path
              d="M244 238c25-54 53-90 83-119"
              stroke="#174c34"
              stroke-width="2"
              opacity=".5"
            />
            <path
              d="M227 287C135 298 97 230 103 166c80-1 145 45 124 121Z"
              fill="url(#leaf-a)"
            />
            <path
              d="M224 279c-35-45-62-65-96-89"
              stroke="#477c35"
              stroke-width="2"
              opacity=".6"
            />
            <path d="M156 340h127l-16 43h-95l-16-43Z" fill="#174c34" />
            <path
              d="M150 334c0-6 5-11 11-11h116c6 0 11 5 11 11v8H150v-8Z"
              fill="#245c3d"
            />
            <path d="M215 346h12v22h-12z" fill="#b8ef6d" opacity=".5" />
            <path
              d="m121 111 19-8-5 20M138 103c-44 8-67 50-60 84M335 304l-21 3 10-19M317 307c43-20 62-66 48-99"
              stroke="#174c34"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
              opacity=".5"
            />
          </svg>
          <div class="floating-chip chip-one">
            <span><Icon name="Recycle" :size="24" /></span> Uma escolha
            consciente.
          </div>
          <div class="floating-chip chip-two">
            <span><Icon name="MapPin" :size="22" /></span> Um destino melhor.
          </div>
          <span class="art-coordinates"
            >23° S &nbsp; 47° O<br />INTERIOR DE SÃO PAULO</span
          ><span class="art-spark spark-one">✳</span
          ><span class="art-spark spark-two">+</span>
        </div>
      </div>
      <div id="buscar" class="hero-search">
        <div class="search-heading">
          <h2>Qual será o seu próximo descarte?</h2>
          <span>Encontre. Separe. Leve ao ponto certo.</span>
        </div>
        <SearchBox />
        <div class="search-shortcuts">
          <span>Mais buscados</span
          ><RouterLink
            v-for="c in categories.slice(0, 4)"
            :key="c.slug"
            :to="{ path: '/pontos', query: { residuo: c.slug } }"
            ><Icon :name="c.icon" :size="15" /> {{ c.name }}</RouterLink
          >
        </div>
      </div>
    </div>
  </section>
  <div class="trust-strip container">
    <span><Icon name="ShieldCheck" /> Compromisso com fontes confiáveis</span
    ><span><Icon name="MapPin" /> Informação perto de você</span
    ><span><Icon name="Heart" /> Acesso gratuito e sem cadastro</span>
  </div>
  <section class="section container">
    <div class="section-head">
      <div>
        <p class="eyebrow">CADA MATERIAL TEM O SEU CAMINHO</p>
        <h2>Separe a dúvida.<br />Descarte do jeito certo.</h2>
      </div>
      <div>
        <p>
          De uma pilha a um móvel antigo,<br />descubra o destino de cada
          resíduo.
        </p>
        <RouterLink to="/como-descartar" class="text-link"
          >Conheça todos os materiais <Icon name="ArrowUpRight" :size="17"
        /></RouterLink>
      </div>
    </div>
    <div class="category-grid">
      <RouterLink
        v-for="(c, index) in categories.slice(0, 6)"
        :key="c.id"
        :to="`/como-descartar/${c.slug}`"
        class="category-card"
        :class="`category-tone-${index % 3}`"
        ><span class="category-icon"><Icon :name="c.icon" :size="31" /></span
        ><span class="category-index">0{{ index + 1 }}</span>
        <h3>{{ c.name }}</h3>
        <span class="category-card-bottom"
          >Saiba como descartar <Icon name="ArrowUpRight" :size="19" /></span
      ></RouterLink>
    </div>
  </section>
  <section class="how-section">
    <div class="container">
      <div class="section-head">
        <div>
          <p class="eyebrow">COMPLICADO É DEIXAR PARA DEPOIS</p>
          <h2>Três passos.<br />Uma boa atitude.</h2>
        </div>
        <p>
          Você não precisa mudar tudo de uma vez.<br />Comece pelo que tem aí na
          sua casa.
        </p>
      </div>
      <div class="steps-grid">
        <article
          v-for="(step, i) in [
            {
              icon: 'Search',
              title: 'Encontre o lugar',
              text: 'Escolha sua cidade e o material. Consulte os pontos de recebimento cadastrados.',
            },
            {
              icon: 'Package',
              title: 'Prepare seu resíduo',
              text: 'Veja as orientações de separação e confira o que o local realmente recebe.',
            },
            {
              icon: 'Navigation',
              title: 'Dê o destino certo',
              text: 'Confira o horário, abra a rota e leve o material ao ponto indicado.',
            },
          ]"
          :key="step.title"
        >
          <div class="step-top">
            <span class="step-number">0{{ i + 1 }}</span
            ><Icon :name="step.icon" :size="30" />
          </div>
          <h3>{{ step.title }}</h3>
          <p>{{ step.text }}</p>
        </article>
      </div>
    </div>
  </section>
  <section class="section container cities-section">
    <div>
      <p class="eyebrow">PERTINHO DE VOCÊ</p>
      <h2>O cuidado começa<br />na nossa região.</h2>
      <p>
        Uma rede de informação ambiental para quatro cidades do interior de São
        Paulo. Construída com atenção, ampliada com a comunidade.
      </p>
      <RouterLink to="/pontos" class="text-link"
        >Explore o mapa <Icon name="ArrowUpRight" :size="17"
      /></RouterLink>
    </div>
    <div class="city-list">
      <RouterLink
        v-for="(city, i) in cities"
        :key="city"
        :to="{ path: '/pontos', query: { cidade: city } }"
        ><span class="city-index">0{{ i + 1 }}</span
        ><span>{{ city }}</span
        ><span class="city-state">São Paulo</span><Icon name="ArrowUpRight"
      /></RouterLink>
    </div>
  </section>
  <section class="container">
    <div class="impact-banner">
      <div class="impact-symbol">
        <Icon name="Sprout" :size="70" :stroke-width="1" />
      </div>
      <div>
        <p class="eyebrow">BOM PARA A CIDADE. MELHOR PARA TODOS.</p>
        <h2>Um resíduo no lugar certo.<br />Muitas formas de cuidar.</h2>
        <p>
          Proteja o solo e a água, mantenha materiais em circulação e valorize o
          trabalho de quem recicla.
        </p>
      </div>
      <RouterLink to="/como-descartar" class="button button-lime"
        >Comece por aqui <Icon name="ArrowUpRight"
      /></RouterLink>
    </div>
  </section>
  <section class="section container project-teaser">
    <div>
      <p class="eyebrow">CONHECIMENTO QUE SAI DA SALA DE AULA</p>
      <h2>Uma ideia da universidade.<br />Um convite à comunidade.</h2>
      <p>
        O Ponto Verde nasceu no componente Itinerários Extensionistas do CEUNSP
        para aproximar informação, pessoas e cuidado com o meio ambiente.
      </p>
      <RouterLink to="/sobre" class="text-link"
        >Nossa história <Icon name="ArrowUpRight" :size="18"
      /></RouterLink>
    </div>
    <div class="project-stamp">
      <span>APRENDER.</span><span>COMPARTILHAR.</span
      ><span class="green-text"
        >TRANSFORMAR.<Icon name="ArrowUpRight" :size="35"
      /></span>
      <div>EXTENSÃO UNIVERSITÁRIA <span>CEUNSP</span></div>
    </div>
  </section>
</template>
