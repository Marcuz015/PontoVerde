# Ponto Verde

Guia de descarte responsável para Salto, Itu, Tietê e Cabreúva. Projeto acadêmico de extensão do CEUNSP, no componente Itinerários Extensionistas.

Aplicação estática em Vue 3, Composition API, TypeScript, Vite, Tailwind, Lucide e Leaflet/OpenStreetMap. **Sem banco de dados, login, servidor próprio ou credenciais obrigatórias.** Os locais são mantidos em arquivos JSON versionados, conforme a orientação final do projeto.

## Executar

Requer Node.js 22.12 ou mais recente e npm.

```powershell
cd C:\Users\J\Documents\ChatGPT\MusicBox\ponto-verde
npm ci
npm run dev
```

Abra o endereço Local mostrado pelo Vite. Para validar e compilar:

```powershell
npm test
npm run build
npm run preview
```

O build valida o catálogo, verifica os tipos e gera `dist/`. `npm run format` formata o código.

## O que está implementado

- Página inicial responsiva com busca por cidade e material.
- Busca combinada por cidade, resíduo, nome, bairro e endereço, com filtros na URL.
- Lista e mapa sincronizados; detalhes, fontes, materiais, restrições e rotas Google Maps.
- Geolocalização opcional com distância aproximada em linha reta, calculada no dispositivo.
- Onze guias educativos, com referências e orientações específicas.
- Páginas institucional e de privacidade, menu móvel e navegação por teclado.
- Sugestão, relato e avaliação com validação e **exportação local em JSON ou cópia**. Não há envio automático, armazenamento central ou publicação automática de sugestões.
- QR Code em alta resolução quando a URL pública definitiva estiver configurada.
- Verificações automatizadas de filtros, dados, coordenadas, rotas, URLs e formulários.

## Catálogo inicial e limites

O arquivo `src/data/points.json` contém cinco locais documentados: três em Salto e dois em Itu. As fontes foram consultadas em **20/10/2026**. A data representa consulta documental, não visita presencial ou ligação.

Somente o Ecoponto Jardim Planalto possui coordenadas conferidas por correspondência de nome, rua e número entre a operadora e o OpenStreetMap. Ele aparece como marcador. Os outros quatro continuam na lista e abrem rotas pelo endereço completo, sem coordenadas presumidas.

Os horários dos três locais de Salto não foram confirmados nas fontes específicas e aparecem como desconhecidos. O horário da central telefônica não foi tratado como horário do ecoponto. Itu possui horário e limite documentados na fonte municipal. Recomenda-se confirmação antes da visita.

Não foram adicionados locais sem informação suficiente para Tietê e Cabreúva. Essas cidades continuam selecionáveis e mostram um estado vazio transparente. Categorias não comprovadas para um local não foram presumidas: a expressão genérica “recicláveis” não foi transformada em aceitação de todas as subcategorias.

## Atualizar ou cadastrar um ponto

1. Edite `src/data/points.json`. Copie a estrutura de um registro e use um ID legível e único, como `cidade-nome-local`.
2. Informe o endereço correto e os materiais em `category_slugs`, usando os slugs de `src/data/categories.json`.
3. Registre `source_url`, `verified_at` e `verification_notes`. Confirme atividade, público, materiais, horário e restrições. Use `status: "pending"` quando faltar evidência e `inactive` para retirar da listagem.
4. Deixe `latitude` e `longitude` como `null` e `coordinates_verified: false` até conferir o endereço exato. Para usar um marcador, informe também `coordinate_source_url`.
5. Para campanhas, use `point_type: "campaign"` e `expires_at` em formato ISO. Campanhas encerradas são ocultadas.
6. Execute `npm run check:data`, `npm test` e `npm run build`, revise a prévia e publique a pasta `dist/` novamente.

Não existe painel administrativo que altere o site por navegador. A manutenção ocorre nos arquivos e exige nova publicação; assim, visitantes não têm acesso de escrita ao catálogo.

Consulte [o registro de fontes](docs/fontes.md) e [o roteiro de verificação](docs/verificacao.md).

## Contribuições e avaliação acadêmica

Os formulários funcionam inteiramente no dispositivo. A pessoa prepara, baixa ou copia uma contribuição e pode entregá-la à equipe pelo canal combinado. Não é exibida uma mensagem de envio ao servidor.

Para consolidar avaliações que a equipe **realmente recebeu**, salve os arquivos JSON numa pasta local e execute:

```powershell
node scripts/summarize-feedback.mjs C:\caminho\para\avaliacoes
```

O script elimina arquivos idênticos, valida as respostas e calcula contagens de sim, não e não testei. Não representa uma pessoa única por resposta nem uma amostra representativa. Não publique os arquivos recebidos no repositório.

## Publicar e habilitar o QR Code

O resultado é uma aplicação estática: publique o conteúdo de `dist/` num serviço HTTPS que ofereça fallback de rotas para `index.html`. A aplicação inclui `_redirects` e `_headers`; confirme se a hospedagem escolhida reconhece esses arquivos. Em outro servidor, configure o equivalente a `try_files $uri $uri/ /index.html`.

Para o QR Code definitivo, depois de definir e testar o **endereço público**, copie `.env.example` para `.env.local` e preencha:

```dotenv
VITE_PUBLIC_SITE_URL=https://seu-dominio.example
```

Compile e publique novamente. A página `/compartilhar` terá um QR de 800 pixels, margem de quatro módulos e correção de erro alta, pronto para baixar em PNG. Não use uma URL local ou uma prévia privada em material destinado à comunidade.

A identidade do projeto no Sites está em `.openai/hosting.json`. Preserve seu `project_id` ao atualizar a publicação. A audiência do Sites é privada por padrão; a distribuição à comunidade exige que o responsável configure o acesso público ou use sua hospedagem pública.

## Privacidade e mapas

Sem analytics ou dados pessoais obrigatórios. A localização é opcional e fica no dispositivo para o cálculo. O mapa solicita tiles de OpenStreetMap, mantém atribuição e não executa geocodificação em massa. As rotas abrem Google Maps em nova aba com proteção `noopener noreferrer`.

Os tiles do OpenStreetMap exigem internet e seguem a [política de uso do serviço](https://operations.osmfoundation.org/policies/tiles/). Para tráfego elevado, avalie um provedor compatível. Sem mapa, a lista e os endereços continuam disponíveis após o carregamento da aplicação.

O aplicativo é um guia independente: não representa um serviço oficial municipal e não realiza coleta ou transporte de resíduos.
