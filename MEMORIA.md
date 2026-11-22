# MEMÓRIA DO PROJETO — Do Bit ao Qubit (Computação Quântica)

## 1. Contexto Acadêmico
- **Instituição:** Universidade do Oeste de Santa Catarina – Unoesc Videira
- **Curso:** Ciência da Computação
- **Disciplina:** Arquitetura de Computadores
- **Professor:** Prof. Fabiano de Oliveira Wonzoski
- **Título:** DO BIT AO QUBIT
- **Grupo 1:** Gustavo Becker, Franklin, Hamós, Erik, Jackson
- **Palavras-chave:** Computação quântica • Mecânica quântica • Qubits • Superposição e emaranhamento • Informação quântica

## 2. Diretrizes de Design & Diferenciais (Solicitações do Usuário)
- **Proibido "tema neon básico de IA":** nada de fundo preto clichê com blobs roxo/ciano brilhantes e cartões idênticos.
- **Direção Criativa (*Swiss Technical Monograph / Hardware Architecture Lab*):**
  - Base editorial clara de papel técnico / alabastro (`#F5F3EE`) combinada com superfícies de grafite profundo (`#111318`) apenas em painéis de instrumentação/simulação para criar contraste cirúrgico.
  - Acentos reais inspirados na engenharia física de computadores quânticos: **Cobre/Ouro Criogênico** (`#B86B2B` / `#C98A3E` — dos refrigeradores de diluição) e **Azul Cobalto Técnico** (`#1D4ED8` — IBM Quantum / diagramas de arquitetura).
  - Rigor da metodologia **Unslop (`heydamir/unslop`)**:
    - Ritmo espacial estrito em múltiplos de 4px/8px.
    - Hierarquia tipográfica por escala (display editorial `Instrument Serif` / `Space Grotesk` + corpo `Inter` + dados em `JetBrains Mono` com `font-variant-numeric: tabular-nums`).
    - Grids assimétricos intencionais (evitar fileiras monótonas de cards iguais).
    - Motion funcional: cada animação explica um conceito físico ou arquitetural (não mera decoração).
- **Motion Graphics & Bibliotecas Integradas:**
  - **GSAP + ScrollTrigger** e **AOS (Animate On Scroll)** via CDN (com fallback limpo offline para garantir funcionamento mesmo sem internet na sala de aula!).
  - Referências baixadas em `skills-ref/`: `heydamir/unslop` e `LottieFiles/motion-design-skill`.
- **Exemplos e Fotos Reais:**
  - Fotos reais de hardware quântico salvas localmente em `assets/` (Wikimedia Commons):
    - `google-sycamore-chip.jpg` (Processador Google Sycamore)
    - `ibm-quantum-system-one.jpg` (IBM Quantum System One)
    - `dilution-refrigerator.jpg` (Refrigerador de diluição criogênico)
  - Casos reais citados no trabalho: **Google Sycamore (2019)**, **Hyundai** (trânsito urbano), **Delta Airlines** (alocação de aeronaves), **HSBC** (derivativos e risco financeiro), **QKD / PQC**, **Códigos de Shor, Steane e Superfície**.
  - **Destaque Brasileiro (solicitado pelo usuário):** **Unicamp (Campinas — Instituto de Física Gleb Wataghin / IFGW) + CBPF**: desenvolvimento de chips quânticos supercondutores nacionais (qubits Transmon 2D/3D em nióbio/alumínio operando a ~20 mK / -273,13 °C), dispositivos nanofotônicos para redes quânticas (com ETH Zurich/TU Delft), softwares de decomposição de circuitos no IC-Unicamp, parceria do **Instituto Eldorado** (polo de Campinas) com a IQM Quantum Computers e conexão acadêmica regional na região de **Sorocaba** (ex.: estudos de arquitetura na Uniso).
- **Linguagem Didática e Passo a Passo (ajuste solicitado):**
  - Todos os slides e as notas de fala (`tecla N`) foram reescritos em português claro e direto, explicando cada etapa do funcionamento com analogias do dia a dia (ex.: bit = interruptor vs. qubit = moeda girando; emaranhamento = par conectado; interferência = ondas na água; circuito quântico em 5 etapas simples; NISQ/FTQC explicados sem jargão solto), preservando os termos técnicos corretos para a matéria de Arquitetura de Computadores.

## 3. Demonstração Principal (Destaque da Apresentação)
- **Duelo de Arquiteturas em Tempo Real — Clássico vs. Quântico:**
  - Animação interativa lado a lado mostrando a diferença prática entre processamento sequencial/booleano de hardware clássico e paralelismo por superposição + interferência quântica.
  - Três cenários selecionáveis:
    1. **Otimização de Rotas (Hyundai / Delta)** — exploração de caminhos combinatórios.
    2. **Simulação Molecular (Fármacos)** — espaço de configurações quânticas ($2^n$).
    3. **Busca em Espaço de Chaves (Criptografia)** — varredura sequencial vs amplificação de amplitude (estilo Grover).
  - Controles interativos: seletor de complexidade ($N$ qubits), botão **Iniciar Corrida**, **Pausar/Reiniciar**, contadores em `tabular-nums` de passos, operações e ganho exponencial ($2^n$).

## 4. Estrutura da Apresentação & Divisão de Falas (Grupo 1)

| Integrante | Slides | Etapas | Foco da Apresentação |
| :--- | :--- | :--- | :--- |
| **Hamós** | 01 e 02 | Capa + **Etapa 1** | Abertura do trabalho, problema dos chips clássicos e marco do **Google Sycamore (2019)** |
| **Gustavo Becker** | 03 e 04 | **Etapa 2** + **Etapa 3** | **Duelo ao Vivo** (Comum vs. Quântico) + Calculadora $2^n$ e **Os 4 Segredos** no laboratório interativo |
| **Franklin** | 05 e 06 | **Etapa 4** + **Etapa 5** | 5 passos do circuito + 4 tipos de chips e **Destaque Brasil (Unicamp/Campinas & Sorocaba)** + 6 casos reais |
| **Jackson** | 07 | **Etapa 6** | Desafios e criogenia (-273 °C / códigos de Shor, Steane e Superfície, infraestrutura e custos) |
| **Erik** | 08 e 09 | **Etapa 7** + Encerramento | Tendências Futuras (Híbrida, NISQ → FTQC, PQC, Internet Quântica) e Referências com o Grupo 1 |

*(Todos os nomes e roteiros de fala estão sincronizados nas Notas do Apresentador — tecla `N` — em `script.js`.)*

## 5. Modo de Uso na Sala de Aula
- Funciona tanto como **Apresentação de Slides** (setas `←` / `→`, `Espaço`, tela cheia `F`, índice `G`, notas do apresentador para os 5 integrantes `N`) quanto como **Página Editorial Interativa com Scroll (AOS/GSAP)** — basta alternar no botão superior **"Modo Slide / Modo Scroll"**.

## 6. Arquivos do Projeto
- `MEMORIA.md` — este documento de memória e decisões do projeto.
- `index.html` — estrutura semântica da apresentação e componentes interativos.
- `styles.css` — design system editorial técnico (sem neon clichê, seguindo Unslop).
- `script.js` — motor de simulação (Corrida Clássico vs Quântico, visualizador dos 4 princípios, calculadora $2^n$, controle de slides/scroll e notas).
- `assets/` — fotografias reais de hardware quântico (offline-ready).
- `skills-ref/` — repositórios de referência (`unslop` e `motion-design-skill`).
