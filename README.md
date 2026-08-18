# Kazunari Advocacia — Landing pages

Páginas institucionais estáticas do escritório, construídas sobre um design system próprio,
sem dependências de build ou frameworks externos.

## Páginas

| Arquivo | Tema |
| --- | --- |
| `index.html` | Isenção de IRPF e restituição retroativa para portadores de doenças graves |
| `superendividamento.html` | Repactuação de dívidas e limitação de consignados de servidores públicos |
| `revisao-consignado.html` | Revisão de contratos de consignado de servidores municipais, estaduais e federais |

## Estrutura

```
index.html                     página de isenção de IRPF (inclui o simulador)
superendividamento.html        página de superendividamento (inclui a triagem de sinais)
revisao-consignado.html        página de revisão de consignado (gráficos e calculadora de taxa)
assets/css/design-system.css   tokens, componentes e camada de movimento
assets/js/motion.js            orquestração de movimento compartilhada
```

Basta abrir os arquivos em um navegador ou servir o diretório estaticamente
(`python3 -m http.server`). Não há etapa de compilação.

## Design system

### Identidade

Minimalismo editorial: papel quente, tipografia serifada de exibição, um único acento
institucional e movimento discreto. A marca é o monograma **K** em bloco escuro, com o
nome em caixa-alta espaçada e a linha de apoio "Advocacia".

### Tokens

Todos os tokens ficam em `:root`, em `assets/css/design-system.css`.

- **Superfícies** — `--paper`, `--paper-raised`, `--paper-sunken`, `--ink`, `--ink-raised`
- **Texto** — `--text-strong`, `--text`, `--text-muted`, `--text-faint` e as variantes
  `--on-dark-*` para seções escuras
- **Acento** — `--accent` (`#1E4D3F`), com `--accent-hover`, `--accent-bright`,
  `--accent-light`, `--accent-wash` e `--accent-line`
- **Tipografia** — `Instrument Serif` para exibição e `Inter` para interface, com escala
  fluida (`--fs-display` … `--fs-eyebrow`) baseada em `clamp()`
- **Espaço, raio e sombra** — `--sp-1` … `--sp-12`, `--r-xs` … `--r-full`, `--shadow-1` … `--shadow-3`
- **Movimento** — `--ease-out`, `--ease-inout`, `--ease-soft` e as durações `--dur-1` … `--dur-4`

Para alterar a paleta ou o ritmo de animação de todo o site, edite apenas os tokens.

### Componentes

`brandmark`, `header`, `navlink`, `btn` (`--primary`, `--outline`, `--light`, `--lg`, `--block`),
`pill`, `card` (`--dark`), `icon-badge`, `stats` / `stat`, `ticker`, `panel`, `field`,
`input`, `select`, `range`, `result`, `check`, `accordion`, `note`, `scroll-cue`, `objection`,
`steps` / `step`, `footer`, `dock`.

Gráficos: `figure`, `bars` / `bar` (`--signal`, `--muted`), `donut`, `curve`, `legend` e `versus`.

Navegação: `menu-toggle` e o menu lateral (`drawer`, `drawer__panel`, `drawer__area`, `drawer__jump`).

Seções usam `.section` com os modificadores `--dark`, `--sunken`, `--tight` e `--hairline`;
a largura é controlada por `.container`, `.container--mid` e `.container--narrow`.

### Movimento

`assets/js/motion.js` ativa cada módulo somente quando o markup correspondente existe:

| Atributo | Efeito |
| --- | --- |
| `data-reveal="up \| fade \| left \| right \| scale \| clip"` | Revelação ao entrar na viewport |
| `data-stagger="90"` | Escalona os filhos revelados, em milissegundos |
| `data-header` | Estado compacto do cabeçalho ao rolar |
| `data-progress` | Barra de progresso de leitura |
| `data-dock` / `data-dock-after="id"` | Exibe o contato flutuante após a seção indicada |
| `data-count-to` | Contagem animada, com `data-count-prefix`, `-suffix`, `-decimals`, `-duration` |
| `data-spotlight` | Realce que acompanha o cursor sobre o cartão |
| `data-accordion` (`multi` para permitir vários abertos) | Acordeão acessível com `aria-expanded` |
| `data-chart` | Dispara o traçado dos gráficos ao entrar na viewport |
| `data-spy` | Destaca o link da seção visível |
| `data-drawer` / `data-drawer-toggle` / `data-drawer-close` | Menu lateral: painel, botão que abre e fecho (aplicável ao scrim e ao botão dedicado) |
| `data-year` | Ano corrente |

A entrada do herói é puramente CSS (`.hero-in` e `.line-mask`), para não depender do
carregamento do script. Todo o movimento é suprimido sob `prefers-reduced-motion: reduce`.

Como os estados iniciais de animação partem de invisível, cada página traz um bloco `<noscript>`
que os neutraliza: sem JavaScript, o conteúdo aparece por inteiro, os gráficos assumem os valores
finais e as respostas da FAQ ficam abertas. Ao criar um efeito novo cujo estado inicial esconda
conteúdo, acrescente a contrapartida nesse bloco.

### Menu lateral

Cada página tem um `<button data-drawer-toggle>` no cabeçalho e um painel `<div data-drawer>`
logo após o `</header>`. O painel lista as três áreas de atuação — com a página atual marcada
por `aria-current="page"` e o rótulo "Você está aqui" — seguidas dos atalhos de seção da própria
página e do contato.

`initDrawer()`, em `motion.js`, cuida do ciclo completo: abre e fecha por clique, por `Esc` ou
pelo véu de fundo; prende o foco dentro do painel enquanto aberto (`Tab` circula, sem escapar
para o conteúdo atrás); devolve o foco ao botão que abriu ao fechar; e fecha automaticamente ao
clicar num link de âncora (`#`) do próprio painel. É a navegação disponível no mobile, onde
`.navlinks` fica oculta — abrir uma quarta página sem repetir esse painel deixaria o site sem
nenhum menu abaixo de `720px`.

Para adicionar uma quarta área, edite as três instâncias do bloco "Áreas de atuação" (uma por
página) e ajuste `aria-current` conforme a página atual.

### Gráficos

Os gráficos são SVG inline, sem biblioteca. O valor de cada série vem de `--v` no markup e a
animação parte de `.is-charted`, aplicada por `initCharts()`:

- **Barras** — `--v` é a largura final em porcentagem; `--d` atrasa a entrada de cada barra.
- **Rosca** — cada `circle.donut__seg` usa `pathLength="100"`, de modo que `--v` é a fatia em
  porcentagem e `--start` é o ponto de início acumulado.
- **Curva** — cada `path.curve__line` usa `pathLength="1"`, e o traçado é desenhado animando
  `stroke-dashoffset` de 1 para 0.

Dentro de um SVG, comprimentos CSS valem em unidades do `viewBox`, não em pixels da página:
dimensione textos internos em unidades do próprio `viewBox`. Pelo mesmo motivo, a translucidez
de áreas preenchidas usa `fill-opacity` no markup — `opacity` fica reservado à transição.

## Estratégia de convencimento

`revisao-consignado.html` foi estruturada como uma sequência de ganchos, do reconhecimento à ação:

1. **Contraste** (herói) — o consignado é a linha de crédito mais barata do mercado; a pergunta
   é por que a do leitor não parece.
2. **Identificação** — três coisas que o contracheque não mostra: a taxa real, o que foi embutido
   e a dívida que não amortiza.
3. **Prova visual** — comparação animada entre a taxa do contrato e a média de mercado, que é o
   critério efetivamente adotado pelo STJ.
4. **Revelação** — composição da parcela em rosca: quanto de cada real vai para juros.
5. **Consequência** — curva do saldo devedor, mostrando o que continua devido cinco anos depois.
6. **Reciprocidade** — a calculadora entrega um resultado útil antes de pedir qualquer contato,
   e roda inteiramente no navegador.
7. **Fundamentação** — as quatro frentes de revisão, cada uma com seu precedente.
8. **Quebra de objeção** — as quatro dúvidas que travam a decisão, respondidas de frente.
9. **Ação** — percurso em quatro passos e chamada final.

O tom é de prova, não de promessa. A página afirma explicitamente que nem todo contrato comporta
revisão, e a calculadora diz quando o caso **não** aparenta ter fundamento — o que sustenta a
credibilidade e atende ao Provimento nº 205/2021 do CFOAB, que veda a captação de clientela e a
promessa de resultado.

## Fundamentos citados

As referências jurídicas da página de revisão foram conferidas em fontes primárias ou oficiais
antes da publicação:

| Referência | Conteúdo |
| --- | --- |
| REsp nº 1.061.530/RS | Abusividade dos juros apurada em confronto com a taxa média de mercado |
| Súmula 530 do STJ | Não sendo possível comprovar a taxa pactuada, aplica-se a média do Bacen |
| Súmula 539 do STJ | Capitalização infra-anual desde 31/03/2000, se expressamente pactuada |
| Súmula 541 do STJ | Taxa anual superior ao duodécuplo da mensal supre a pactuação expressa |
| Tema 972 do STJ (REsp nº 1.639.320/SP) | Venda casada de seguro prestamista é abusiva |
| Súmula 596 do STF | Lei de Usura não limita juros de instituições do Sistema Financeiro Nacional |
| MP nº 1.355/2026 | Teto de consignação no Executivo federal a partir de 19/05/2026 |

Ao atualizar percentuais de margem ou taxas de referência, confira a fonte oficial: as regras de
consignação mudaram em 2026 e seguem em redução programada.

## Conformidade

O conteúdo é informativo, sem promessa de resultado, em observância ao Código de Ética e
Disciplina da OAB e ao Provimento nº 205/2021 do Conselho Federal da OAB.

## Contato

Todos os CTAs apontam para o WhatsApp `5591987697554`. Ao trocar o número, atualize as duas
páginas por inteiro: os links `wa.me` do herói, da chamada final, do rodapé e do contato
flutuante, além da constante `TELEFONE` do script inline de cada página.
