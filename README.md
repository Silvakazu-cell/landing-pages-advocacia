# Kazunari Advocacia — Landing pages

Páginas institucionais estáticas do escritório, construídas sobre um design system próprio,
sem dependências de build ou frameworks externos.

## Páginas

| Arquivo | Tema |
| --- | --- |
| `index.html` | Isenção de IRPF e restituição retroativa para portadores de doenças graves |
| `superendividamento.html` | Repactuação de dívidas e limitação de consignados de servidores públicos |

## Estrutura

```
index.html                     página de isenção de IRPF (inclui o simulador)
superendividamento.html        página de superendividamento (inclui a triagem de sinais)
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
`select`, `range`, `result`, `check`, `accordion`, `note`, `scroll-cue`, `footer`, `dock`.

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
| `data-spy` | Destaca o link da seção visível |
| `data-year` | Ano corrente |

A entrada do herói é puramente CSS (`.hero-in` e `.line-mask`), para não depender do
carregamento do script. Todo o movimento é suprimido sob `prefers-reduced-motion: reduce`.

## Conformidade

O conteúdo é informativo, sem promessa de resultado, em observância ao Código de Ética e
Disciplina da OAB e ao Provimento nº 205/2021 do Conselho Federal da OAB.

## Contato

Todos os CTAs apontam para o WhatsApp `5591987697554`. Ao trocar o número, atualize as duas
páginas por inteiro: os links `wa.me` do herói, da chamada final, do rodapé e do contato
flutuante, além da constante `TELEFONE` do script inline de cada página.
