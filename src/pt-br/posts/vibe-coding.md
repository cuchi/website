---
title: "Desenvolvi um App Full-Stack com Vibe Coding por $2.96"
date: 2026-08-04
layout: post
tags: posts
permalink: /pt-br/posts/vibe-coding/
description: "Como desenvolvi um app full-stack em produção — backend em Rust, frontend em React, deploy no Render — inteiramente através de Agentic Engineering com DeepSeek, por menos de três dólares."
---

> _Ou: como desenvolvi um app real do zero até produção com Agentic Engineering — em dois dias._


<div class="vibe-note">
🤖 <em>Este post foi inteiramente vibe-editado com DeepSeek. A IA escreveu, reestruturou, poliu e nesta versão em português, também traduziu — eu apenas disse o que queria.</em>
</div>


Algumas semanas atrás tive uma ideia: um app de apostas sem dinheiro real para o grupo dos meus amigos. Nada de dinheiro de verdade — apenas pontos, direito de se gabar e um ranking. Todo mundo coloca 100 pontos no Flamengo. Alguém ganha muito, alguém vai à falência. Você entendeu a ideia.

Eu tinha duas restrições:
1. Queria lançar antes da próxima rodada do Brasileirão
2. Queria tentar desenvolver tudo através de "vibe coding"

**Vibe coding** é um termo que tem circulado. A ideia é simples: você descreve o que quer para um agente de IA, ele escreve o código, você itera, e você nunca toca no código fonte.

O que eu realmente fiz está mais próximo de **Agentic Engineering** — um termo que captura o mesmo fluxo de trabalho mas com uma distinção importante. Vibe coding sugere uma abordagem passiva, de "deixa a IA resolver" onde você confia no resultado sem questionar. Agentic Engineering é mais deliberada: você atua como arquiteto, tomando decisões de alto nível (qual API usar, como estruturar o banco de dados, quando refatorar), enquanto o agente cuida dos detalhes de implementação. Você revisa cada mudança, testa os resultados e corrige o rumo quando necessário.

Na prática, usei "vibe coding" informalmente para descrever a experiência — parecia que eu estava _vibing_ com o agente. Mas a metodologia era Agentic Engineering: nunca deixei de ser eu no controle.

Usei o [Zed](https://zed.dev) como editor. Ele tem um painel de agente integrado onde você pode conectar qualquer LLM que exponha uma API compatível com OpenAI. Apontei para o DeepSeek — especificamente DeepSeek V4, que no momento em que escrevo custa uma fração do que GPT-4 ou Claude cobram por token. O agente roda diretamente dentro do editor: ele lê todo o seu projeto, busca entre arquivos, escreve e edita código inline e mostra diffs antes de aplicar as mudanças. Sem copiar e colar entre uma janela de chat e sua IDE. Sem troca de contexto.

O fluxo de trabalho é simples: digite o que você quer no painel do agente, aperte enter, veja ele trabalhar. Ele pode ler cinco arquivos, editar três deles e escrever um novo — tudo em uma única resposta. Se algo quebrar, cole o erro. Se o resultado parecer errado, diga "desfaça isso" ou "tente uma abordagem diferente". O agente tem contexto completo da sua base de código, então você não desperdiça tokens re-explicando a estrutura do seu projeto a cada mensagem.

Não escrevi uma única linha de Rust, TypeScript, SQL ou CSS. Não escrevi um Dockerfile. Não configurei CORS. A IA fez tudo. Eu apenas dizia o que queria, revisava o resultado e mantinha a conversa fluindo. Meus prompts reais eram coisas como (em inglês):

- _"Adicione um pipeline de CI (apenas build por enquanto)"_
- _"Mude o estilo da rolagem para algo mais adequado"_
- _"Remova as ações manuais nas apostas"_
- _"Vamos tornar isso responsivo agora"_
- _"Quero fazer deploy deste app no Render"_

Aqui está como foi.

## A proposta

Abri um projeto novo e disse ao agente:

> _"I want to bootstrap a fullstack application with a Rust backend, choose some frontend stack that is compatible and easy to work with the Rust backend"_

O agente voltou com React + TypeScript + Vite para o frontend, Axum para o framework HTTP e SQLx para Postgres.

## O plano

Antes de escrever qualquer código de funcionalidade, descrevi toda a visão para o agente — apostas sem dinheiro, grupos privados com códigos de convite, saldos por grupo, dados reais de futebol. Então:

> _"Don't implement anything for now, add a structured PLAN.md with the next possible tasks based on what I just said."_

Ele escreveu um roadmap: Fase 1 até Fase 6, com checkboxes, diagramas de esquema e tabelas de endpoints da API. Este arquivo se tornou o cérebro compartilhado entre mim e o agente. Toda vez que terminávamos algo, eu dizia:

> _"Update the PLAN.md"_

E ele marcava itens concluídos e adicionava novos. Quando eu mudava de direção — como trocar de API de futebol quatro vezes — eu dizia:

> _"The plan still mentions the old api"_

E ele limpava todas as referências.

Com o tempo, o plano cresceu de uma simples checklist para um documento vivo: esquema atual, tabela completa de endpoints da API, variáveis de ambiente do deploy no Render e fases para trabalho futuro como internacionalização e polimento do SPA. Na maioria das vezes, eu só dizia "atualize o PLAN.md" depois de uma sessão e o agente sincronizava tudo — caixas marcadas, novas funcionalidades, mudanças de esquema, tudo refletido em um commit.

## Autenticação e core

O agente criou a estrutura do projeto e encontrou seu primeiro obstáculo imediatamente:

> _"Getting this during the build — error[E0433]: cannot find `EnvFilter` in `tracing_subscriber`"_

Faltava uma feature flag do Cargo. Corrigido em uma linha. Depois veio o banco de dados:

> _"That's a good start, let's add a database, I want to use Postgres. Can you add a docker-compose file that spins it up?"_

O agente escreveu `docker-compose.yml`, configurou SQLx com pool de conexões e auto-migrations, e conectou tudo. Próximo: autenticação.

> _"Let's add users to our database, how about a google sign-up?"_

O agente integrou Google OAuth — mas nada é tão simples assim. Primeiro faltava um pacote npm. Depois:

> _"Updated the envs but still getting a 401: invalid_client in the google popup"_

Tive que adicionar `http://localhost:5173` às Origens JavaScript Autorizadas no Google Cloud Console — não era um problema de código, era de configuração. Resolvido, a autenticação funcionou. Mas então:

> _"The user avatar doesn't show up, any setup required on GCP maybe?"_

O payload do token do Google inclui `picture` — o agente só precisava armazenar `avatar_url` no registro do usuário e exibi-lo.

Com a autenticação funcionando, o agente adicionou a tabela de apostas, endpoints de criar/resolver e uma lista compartilhada de apostas. Neste ponto, dei um passo atrás e pensei em produção:

> _"I want to deploy this product to a production environment afterwards, make sure we don't expose any technical data to the user."_

O agente reforçou o tratamento de erros — `AppError::Internal` agora registra o detalhe completo mas retorna apenas "Internal server error" para o cliente. Adicionou um hook de pânico personalizado, configurou CORS e configurou logging estruturado com `tracing`.

Então criei o plano — Fase 1 estava concluída e o roadmap estava definido.

![O app após autenticação e apostas principais](/assets/images/vibe-phase1.png)

## Grupos e rankings

Antes de escrever qualquer código, estabeleci os requisitos — que foram direto para o plano:

> _"This will be a closed beta, I will only allow a small list of e-mails to be able to sign-up initially. Users can be invited to a group via a unique invite link, only the group admin (the creator) can do that. The balance per-user is scoped by the group."_

Então, referenciando os números de fase do plano:

> _"Implement phase 2."_

O agente destruiu o esquema e o reconstruiu. Esta foi a maior migração: `groups`, `group_members`, removendo a coluna global `balance` de `users`, adicionando `group_id` às apostas. O sistema de convite de grupo gerava códigos aleatórios de 8 caracteres com suporte a regeneração. A consulta do ranking ordenava os membros por saldo com linhas de pódio 🥇🥈🥉.

Também queria uma forma rápida de testar sem passar pelo Google OAuth todas as vezes:

> _"I want a button that will only be enabled in the development env, just for testing. This button will create a random user and login."_

O agente adicionou `POST /api/dev/login` — cria um usuário de teste aleatório, popula a lista de permissões do beta, retorna um JWT. Protegido por `ENVIRONMENT != "production"` para nunca ser enviado para produção.

Quando o núcleo estava funcionando, o polimento de UX começou:

> _"Two small changes: both Join/Create group actions should be separate buttons, take them out of the dropdown. The dropdown arrow is too far to the right."_

> _"Add a Cancel button to both actions too."_

Depois, quando o recurso de convite entrou no ar:

> _"The 'Invite button' shows the URL, but we can't close it."_

O agente adicionou um botão de dispensar à barra de convite. Esses pequenos ajustes de UX se acumularam — cada um levava 30 segundos para solicitar e mais ou menos o mesmo para implementar.

Lembro de pensar: _isso teria me levado uma semana manualmente._

![Grupos, sistema de convite e ranking](/assets/images/vibe-groups.png)

## Dados reais de partidas

Até agora, as apostas eram apenas um formulário placeholder — você digitava odds e um valor, sem times, sem partidas. Eu precisava de jogos reais do Brasileirão.

O agente tentou **api-futebol.com.br**. Sem partidas para o plano gratuito.

> _"Change of plans, we're using https://footballdata.io now"_

O agente refez a função de sincronização. Testei o endpoint. Nada aconteceu — zero partidas, zero odds. A API retornava ligas europeias completamente irrelevantes.

> _"You have to filter for country=Brazil"_

Ainda nada. O plano gratuito não cobria futebol sul-americano.

> _"Change of plans, the current API doesn't support our leagues, let's use this one instead. Keep the features intact, change just the API interaction, report back any incompatibility with me. Good luck."_

Mandei o agente para **api-football.com**. Ele encontrou o ID da liga do Brasileirão. Sincronizou. Zero partidas. O plano gratuito não tinha dados recentes.

> _"This API also doesn't have recent data for the free tier. Let's switch to this one. Do the same changes, make sure everything works. Good luck."_

Quarta tentativa: **the-odds-api.com**. O agente reescreveu tudo mais uma vez — nova estrutura de URL, novo formato JSON, nova lógica de extração de odds.

> _"Neat! it works"_

Finalmente. Partidas reais. Odds reais. O agente tinha trocado de API quatro vezes sem quebrar mais nada.

Se eu tivesse gastado cinco minutos lendo a página de preços de cada API antes de mergulhar, teria pulado as três primeiras e economizado alguns tokens. Mas esse é o tradeoff da Agentic Engineering — a velocidade de iteração é tão rápida que "apenas tente" muitas vezes é mais barato que "pesquise primeiro". Às vezes você gasta alguns centavos descobrindo isso.

Neste ponto eu tinha este fluxo de usuário: abrir o app → ver partidas futuras com odds reais → escolher uma partida → escolher um palpite → fazer uma aposta → vê-la na lista compartilhada de apostas.

## Polimento que importa

É aqui que o vibe coding realmente brilha. Em vez de passar horas ajustando CSS, eu simplesmente dizia coisas como:

- _"Make the event listing buttons white (or near white), change the inner element styles accordingly"_
- _"The icon crests are showing inside a circle, this breaks the visual for some of them"_
- _"Make the team crests slightly bigger"_
- _"Let's make the team crests even bigger, maybe 48px?"_
- _"Change the (crest) Team A vs (crest) Team B layout to (Team A (crest) vs (crest) Team B), the VS should be aligned"_
- _"The VS should be equidistant between the crests"_
- _"Make the crest shadow a little bit smoother"_
- _"Is it possible to add a white border to the PNG images? I want the border to be on the actual crest, not in the image square itself"_
- _"Now change the match cards to dark again"_
- _"Let's make this responsive now: use an ellipsis when the team name is too long, show just the crests when the screen is too narrow"_
- _"In the 'your pick' buttons, put the odds in the next line, style it differently"_
- _"Use a pill to encapsulate the odds value inside the prediction button"_
- _"As an user, the matches I already betted should be blocked in some way, and I should see that"_

Cada solicitação levava cerca de 30 segundos. O agente refatorou o grid CSS, adicionou filtros `drop-shadow()`, criou breakpoints responsivos e reestruturou todo o layout dos cards de evento — tudo enquanto eu assistia.

Alguns desses eram problemas genuinamente difíceis de CSS. O alinhamento vertical do "vs" entre cards exigiu trocar de flexbox para CSS grid com posicionamento explícito de `grid-column`. A borda do escudo exigiu chamadas `drop-shadow()` que seguem o canal alpha do PNG. E então houve o bug do botão amarelo:

> _"The .bet-form button has a yellow background, and .team-name which lives inside it, has a white color, it's ugly"_

> _"The yellow is coming from .bet-form button"_

Um vazamento de especificidade CSS — os estilos de botão do formulário de aposta estavam vazando para os cards de evento. O agente adicionou overrides para travar os cards de evento em seu próprio tema. Eu não teria pego esse bug de especificidade sem rolar pelos estilos computados por 20 minutos.

Os escudos vieram de uma tabela HTML bruta que eu colei:

> _"Download all the crests, it's better to have them locally"_

> _"Here are the actual logos"_

(seguido por uma tabela HTML enorme com 75 logos de times)

O agente extraiu cada `<img>` src, baixou, mas havia um problema:

> _"Now for the actual crest files, they are all different sizes, formats and some of them are missing the transparent background, how can we solve that? I have imagemagick"_

> _"Most of the crests have white as part of the crest, I just want to remove their background"_

O agente escreveu comandos ImageMagick para floodfill do fundo para transparente, normalizar cada escudo para um tamanho consistente e converter todos para PNG. Setenta e cinco logos de times, processados em lote, com as partes brancas dos escudos preservadas.

![Fazendo uma aposta com barra de previsão](/assets/images/vibe-bet-desktop.png)

![Visualização mobile responsiva](/assets/images/vibe-bet-mobile.png)

## A backdoor administrativa

Eu precisava de uma forma de sincronizar dados de partidas sem expor isso aos usuários.

> _"Let's expose administrative endpoints inside admin/ which can be only accessed using a super secret token, this is our little backdoor. Add the sync action there."_

O agente:
- Criou um extrator `AdminAuth` em Rust que verifica um header `X-Admin-Token`
- Moveu o endpoint de sincronização para `POST /admin/events/sync`
- Removeu a antiga rota pública de sincronização e o botão do frontend
- Adicionou `ADMIN_TOKEN` às variáveis de ambiente

Este foi um atalho deliberado. O plano tinha uma fase inteira para workers em background — uma tarefa Tokio que faria auto-sync de eventos e resolveria apostas em loop. Mas o plano gratuito do Render desliga após 15 minutos de inatividade, o que mata qualquer processo de longa duração. Até eu fazer upgrade ou configurar cron jobs, um one-liner `curl` resolve. O endpoint está pronto para ser chamado por qualquer coisa — um cron job, um Render Cron Job, ou só eu acionando manualmente antes da rodada.

![Sincronizando eventos via endpoint admin](/assets/images/vibe-events.jpeg)

## Enviando para produção

Então, pulando direto para a última fase do plano:

> _"Let's jump to phase 8, I want to ship this app to render. Let's make both the frontend and backend live in the same container, once started, both will behave as one."_

O agente:
- Escreveu um Dockerfile multi-estágio: Node compila o frontend, Rust compila o backend, Debian slim roda ambos
- Adicionou `VITE_GOOGLE_CLIENT_ID` como arg de build do Docker
- Criou um `.dockerignore`
- Configurou `ENVIRONMENT=production` e `CORS_ALLOWED_ORIGINS`

O primeiro deploy falhou. Colei o erro:

> _"Got this on render: error: rustc 1.86.0 is not supported by the following packages..."_

O agente atualizou a imagem Rust para `1.88` e funcionou.

Depois o app saiu sem logs — apenas "Application exited early." Eu disse:

> _"There are no logs, it just says the application exited early"_

Acontece que o binário estava crashando porque `libssl3` estava faltando na imagem de runtime. O agente adicionou e o deploy ficou verde.

Em poucas iterações, o app estava no ar em [sobrounadapro.bet](https://sobrounadapro.bet). (Eu mesmo registrei o domínio e apontei para o Render — o agente não tem cartão de crédito.)

![App completo em produção](/assets/images/vibe-prod.png)

## Quanto custou o vibe coding

Usei o DeepSeek através de sua API, cobrado por token. Em todas as sessões — desde criar o projeto até fazer deploy no Render, e sim, incluindo escrever este post — o total foi **$2.96 USD**.

Dois dólares e noventa e seis centavos. Por um app full-stack, em produção, mais o post que você está lendo agora.

Para colocar em perspectiva: o domínio foi o item mais caro. A IA que construiu tudo custou menos que um pastel com caldo de cana convertendo em Real.

![Painel de faturamento da API do DeepSeek](/assets/images/vibe-deepseek.png)

## Como foi a sensação do vibe coding

A conversa com o agente era contínua. Eu descrevia uma funcionalidade, ele lia minha base de código, fazia mudanças em múltiplos arquivos e me dizia o que fez. Eu testava, encontrava um problema e dizia "isso está quebrado porque X". Ele corrigia. Ficamos nesse vai e vem por cerca de 16 horas no total, em várias sessões dentro de 2 dias.

As partes mais difíceis não eram técnicas — eram problemas de comunicação. Às vezes eu descrevia algo mal e o agente implementava a coisa errada. Às vezes corrigia um bug mas introduzia outro. Mas a velocidade de iteração era tão rápida que raramente importava. Eu podia dizer "desfaça isso" ou "tente uma abordagem diferente" e ele pivotava imediatamente.

O agente era especialmente bom em:
- Boilerplate: criar componentes inteiros, conectar rotas, escrever migrations
- CSS: layouts complexos, design responsivo, efeitos visuais sutis
- Debugging: ler mensagens de erro e corrigir causas raiz
- Documentação: manter PLAN.md e AGENTS.md em sincronia enquanto desenvolvíamos

Ele teve mais dificuldade com:
- Entender comportamento de UI com nuances ("o VS deve estar alinhado verticalmente" levou 5 iterações)
- Conflitos de especificidade CSS de mudanças anteriores ("o amarelo está vindo do .bet-form button")
- Saber quando refatorar em vez de remendar

## É assim que desenvolvemos agora

Seis meses atrás, desenvolver um app full-stack significava semanas de trabalho solo — scaffolding, debugging, estilização, deploy. Hoje é uma conversa.

O agente não está substituindo desenvolvedores. Está mudando o que "desenvolvimento" significa. Você não passa horas escrevendo layouts de CSS grid — você descreve o comportamento que quer e itera em loops de 30 segundos. Você não precisa memorizar feature flags do Cargo ou sintaxe de queries SQLx — você cola o erro e o agente corrige. Você não lê documentações de API do início ao fim — você joga o agente nelas e vê o que cola.

Mas você ainda precisa ser quem toma as decisões. O agente não sabe que a terceira API de futebol tem odds reais no plano gratuito, ou que você deve reforçar o tratamento de erros antes de enviar para produção, ou que $2.96 é o preço de um app full-stack mais um post de blog.

Agentic Engineering não é sobre substituir desenvolvedores — é sobre remover o trabalho braçal para que você possa focar nas escolhas que importam. O agente escreve o código. Você toma as decisões.

## O que vem a seguir

O MVP está pronto — você pode fazer login, entrar em um grupo, apostar em partidas reais do Brasileirão e subir no ranking. Mas há mais no plano.

O auto-resolve já está implementado. O endpoint (`POST /admin/bets/resolve`) busca resultados da the-odds-api.com e resolve cada aposta pendente — comparando palpites com resultados reais, atualizando status, creditando pagamentos. O porém: ainda não foi testado. A temporada do Brasileirão começa em 8 de agosto. Quando os jogos começarem a terminar, um único comando `curl` me dirá se funciona.

O plano original previa um worker em background — uma tarefa Tokio que sincroniza eventos e resolve apostas em loop diário. Mas o plano gratuito do Render desliga após 15 minutos de inatividade, o que mata qualquer processo de longa duração. Em vez disso, estou usando endpoints administrativos acionados manualmente ou via cron. É menos elegante, mas é prático — e não custa nada.

Além do auto-resolve: notificações por email quando apostas são liquidadas, um feed de atividades, histórico de apostas com sequências de vitórias/derrotas e suporte a i18n para português brasileiro. O plano tem tudo mapeado. O agente está esperando.

O código fonte completo está no [GitHub](https://github.com/cuchi/sobrou-nada-pro-bet) sob Apache 2.0.

---

_Escrito pelo DeepSeek V4 Pro, curado e vibe-editado por Paulo Henrique Cuchi_
