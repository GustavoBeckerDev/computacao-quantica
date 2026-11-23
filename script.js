/* ==========================================================================
   DO BIT AO QUBIT — Motor Interativo de Apresentação & Simulação Física
   1. Navegação de Slides + Modo Scroll (AOS / GSAP)
   2. Duelo ao Vivo: Hardware Clássico (O(N)) vs Processador Quântico (O(√N))
   3. Calculadora de Escala Exponencial 2^n (até 53 qubits — Google Sycamore)
   4. Laboratório Interativo dos 4 Princípios Quânticos em Canvas 60fps
   5. Roteiro de Fala (Notas) distribuído para o Grupo 1
   ========================================================================== */

(function () {
  'use strict';

  const slides = Array.from(document.querySelectorAll('.slide'));
  const totalSlides = slides.length;
  let currentIndex = 0;
  let isScrollMode = false;

  // Roteiro de fala simples e natural, com divisão oficial para os 5 integrantes do Grupo 1
  const speakerNotes = [
    {
      name: 'Hamós',
      speaker: 'Hamós • Capa (Abertura)',
      text: 'Diga assim: "Hoje vamos sair do bit tradicional que a gente conhece na disciplina para entender o qubit. Nosso objetivo é explicar de forma simples o que é computação quântica, como ela funciona por dentro, onde já existe na prática e o que ainda falta para ela chegar mais perto da gente."'
    },
    {
      name: 'Hamós',
      speaker: 'Hamós • Etapa 1 (O Problema & Sycamore)',
      text: 'Explique direto: "O computador quântico não veio substituir o seu notebook. Ele existe porque problemas com milhões de combinações travam os chips comuns. Em 2019, o Google provou isso na prática com esse chip real na foto, o Sycamore: ele resolveu em ~3 minutos um cálculo que levaria um tempo absurdo em supercomputadores comuns." (Passa a fala para o Gustavo.)'
    },
    {
      name: 'Gustavo Becker',
      speaker: 'Gustavo Becker • Etapa 2 (Os 4 Segredos)',
      text: 'Use analogias clicando em cada botão: (1) Superposição = moeda girando (0 e 1 ao mesmo tempo até você parar); (2) Emaranhamento = duas moedas conectadas à distância; (3) Interferência = ondas que reforçam a resposta certa e cancelam as erradas; (4) Decoerência = calor ou vibração estragando o cálculo. (Segue no próximo slide para mostrar isso na prática.)'
    },
    {
      name: 'Gustavo Becker',
      speaker: 'Gustavo Becker • Etapa 3 (Duelo ao Vivo + 2ⁿ)',
      text: 'CLIQUE EM "INICIAR CORRIDA"! Enquanto anima, explique: "Na esquerda, o computador comum testa uma opção por vez até achar a resposta. Na direita, o chip quântico coloca todas as opções juntas (superposição), reforça a certa e apaga as erradas (interferência) — terminando em muito menos passos. Depois arraste a barra até 53 qubits para mostrar que cada novo qubit dobra a capacidade." (Passa a fala para o Franklin.)'
    },
    {
      name: 'Franklin',
      speaker: 'Franklin • Etapa 4 (Circuito & 4 Tipos de Chips)',
      text: 'Aponte a barra escura no topo: "Todo cálculo quântico segue 5 passos: zera os qubits, mistura as opções, conecta os pares, filtra a resposta certa e lê 0 ou 1." Depois compare os 4 jeitos de construir um qubit: supercondutor (muito rápido), íons (estável), pontos quânticos (parecido com chip de silício) e fótons (luz para redes). (Segue no próximo slide.)'
    },
    {
      name: 'Franklin',
      speaker: 'Franklin • Etapa 5 (Brasil: Unicamp & Aplicações)',
      text: 'Comece pelo quadro escuro: "Isso não é só lá fora! Na Unicamp em Campinas, junto com o CBPF, já fabricaram chip quântico supercondutor nacional a -273 °C, além de projetos no Instituto Eldorado e estudos na região de Sorocaba." Depois passe pelos 6 exemplos reais: remédios, Hyundai/Delta, senhas (PQC/QKD), HSBC, clima e IA. (Passa a fala para o Jackson.)'
    },
    {
      name: 'Jackson',
      speaker: 'Jackson • Etapa 6 (Desafios & Criogenia)',
      text: 'Mostre a foto dourada do refrigerador: "Por que ninguém tem um notebook quântico? Porque o chip precisa ficar a -273 °C — mais frio que o espaço! Além disso, qualquer ruído gera erro, o que obriga a usar códigos especiais de correção (Shor, Steane e Superfície), ainda não há um único modelo padrão e o custo é altíssimo." (Passa a fala para o Erik.)'
    },
    {
      name: 'Erik',
      speaker: 'Erik • Etapa 7 (Futuro: Híbrida, NISQ → FTQC)',
      text: 'Feche em 4 etapas simples: "Primeiro veremos computação híbrida (PC clássico + chip quântico juntos); depois a ciência acelerando; nas próximas décadas chips que corrigem os próprios erros (NISQ para FTQC); e a troca obrigatória das senhas do mundo (PQC) junto com os primeiros passos da Internet Quântica." (Segue para o encerramento.)'
    },
    {
      name: 'Erik',
      speaker: 'Erik + Grupo 1 • Encerramento & Referências',
      text: 'Mostre as fontes consultadas (IBM Think, Plain Concepts, Exame e o destaque nacional da Unicamp/CBPF), agradeça ao Prof. Fabiano e à turma e abra para perguntas com todo o Grupo 1.'
    }
  ];

  // Elementos HUD
  const progressFill = document.getElementById('progress-fill');
  const slideLabel = document.getElementById('slide-label');
  const slideCounter = document.getElementById('slide-counter');
  const navDots = document.getElementById('nav-dots');
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const btnMode = document.getElementById('btn-mode');
  const btnNotes = document.getElementById('btn-notes');
  const btnIndex = document.getElementById('btn-index');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const notesPanel = document.getElementById('notes-panel');
  const notesSpeaker = document.getElementById('notes-speaker');
  const notesText = document.getElementById('notes-text');
  const indexModal = document.getElementById('index-modal');
  const indexGrid = document.getElementById('index-grid');
  const presenterPill = document.getElementById('presenter-pill');
  const presenterNameEl = document.getElementById('presenter-name');

  const pad2 = (n) => String(n).padStart(2, '0');

  /* ------------------------------------------------------------------------
     1. CONSTRUÇÃO DOS DOTS, ÍNDICE E CONTROLE DE SLIDES / SCROLL
     ------------------------------------------------------------------------ */
  function buildNavigation() {
    navDots.innerHTML = '';
    indexGrid.innerHTML = '';

    slides.forEach((slide, i) => {
      const title = slide.dataset.title || `Slide ${i + 1}`;
      const memberName = speakerNotes[i] ? speakerNotes[i].name : 'Grupo 1';

      // Etiqueta discreta no canto superior de cada seção (útil no Modo Slide e Modo Scroll)
      const metaRow = slide.querySelector('.section-meta');
      if (metaRow && !metaRow.querySelector('.slide-speaker-tag')) {
        const tag = document.createElement('span');
        tag.className = 'slide-speaker-tag';
        tag.innerHTML = `Fala: <strong>${memberName}</strong>`;
        metaRow.appendChild(tag);
      }

      const dot = document.createElement('button');
      dot.className = 'nav-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Ir para slide ${i + 1}: ${title}`);
      dot.addEventListener('click', () => goToSlide(i));
      navDots.appendChild(dot);

      const item = document.createElement('button');
      item.className = 'index-item' + (i === 0 ? ' current' : '');
      item.innerHTML = `<span class="tabular">${pad2(i + 1)} / ${pad2(totalSlides)}</span><strong>${title}</strong><span class="index-speaker">Fala: ${memberName}</span>`;
      item.addEventListener('click', () => {
        indexModal.classList.remove('open');
        goToSlide(i);
      });
      indexGrid.appendChild(item);
    });
  }

  function updateHUD() {
    const title = slides[currentIndex].dataset.title || '';
    const pct = ((currentIndex + 1) / totalSlides) * 100;
    progressFill.style.width = `${pct}%`;
    slideLabel.textContent = `${pad2(currentIndex + 1)} — ${title}`;
    slideCounter.textContent = `${pad2(currentIndex + 1)} / ${pad2(totalSlides)}`;

    btnPrev.disabled = currentIndex === 0;
    btnNext.disabled = currentIndex === totalSlides - 1;

    Array.from(navDots.children).forEach((d, idx) => {
      d.classList.toggle('active', idx === currentIndex);
    });
    Array.from(indexGrid.children).forEach((item, idx) => {
      item.classList.toggle('current', idx === currentIndex);
    });

    const note = speakerNotes[currentIndex];
    presenterNameEl.textContent = note.name;
    notesSpeaker.textContent = `Roteiro • ${note.speaker}`;
    notesText.textContent = note.text;
  }

  function goToSlide(index) {
    const clamped = Math.max(0, Math.min(totalSlides - 1, index));
    currentIndex = clamped;

    if (isScrollMode) {
      slides[currentIndex].scrollIntoView({ behavior: 'smooth', block: 'start' });
      updateHUD();
      return;
    }

    slides.forEach((s, i) => {
      s.classList.toggle('active', i === currentIndex);
    });

    // Motion funcional com GSAP na transição da entrada de dados
    if (window.gsap) {
      const targets = slides[currentIndex].querySelectorAll('.panel, .panel-lab, .arch-card, .horizon-card');
      if (targets.length) {
        window.gsap.fromTo(
          targets,
          { y: 12, opacity: 0.7 },
          { y: 0, opacity: 1, duration: 0.45, stagger: 0.05, ease: 'power3.out', clearProps: 'transform,opacity' }
        );
      }
    }

    updateHUD();
  }

  function toggleMode() {
    isScrollMode = !isScrollMode;
    document.body.classList.toggle('mode-scroll', isScrollMode);
    document.body.classList.toggle('mode-slide', !isScrollMode);
    btnMode.classList.toggle('is-active', isScrollMode);
    btnMode.textContent = isScrollMode ? 'Voltar ao Modo Slide' : 'Modo Scroll (AOS)';

    if (isScrollMode) {
      if (window.AOS) {
        window.AOS.init({ duration: 550, easing: 'ease-out-cubic', once: false, offset: 60 });
        window.AOS.refreshHard();
      }
      setTimeout(() => slides[currentIndex].scrollIntoView({ behavior: 'smooth' }), 60);
    } else {
      window.scrollTo(0, 0);
      goToSlide(currentIndex);
    }
  }

  // Atualiza índice durante rolagem no Modo Scroll
  window.addEventListener('scroll', () => {
    if (!isScrollMode) return;
    const mid = window.scrollY + window.innerHeight * 0.45;
    slides.forEach((slide, idx) => {
      const top = slide.offsetTop;
      const bottom = top + slide.offsetHeight;
      if (mid >= top && mid < bottom && idx !== currentIndex) {
        currentIndex = idx;
        updateHUD();
      }
    });
  }, { passive: true });

  // Eventos de Botões e Teclado
  btnPrev.addEventListener('click', () => goToSlide(currentIndex - 1));
  btnNext.addEventListener('click', () => goToSlide(currentIndex + 1));
  btnMode.addEventListener('click', toggleMode);
  btnNotes.addEventListener('click', () => {
    notesPanel.classList.toggle('open');
    btnNotes.classList.toggle('is-active', notesPanel.classList.contains('open'));
  });
  presenterPill.addEventListener('click', () => {
    notesPanel.classList.toggle('open');
    btnNotes.classList.toggle('is-active', notesPanel.classList.contains('open'));
  });
  document.getElementById('btn-close-notes').addEventListener('click', () => {
    notesPanel.classList.remove('open');
    btnNotes.classList.remove('is-active');
  });
  btnIndex.addEventListener('click', () => indexModal.classList.toggle('open'));
  document.getElementById('btn-close-index').addEventListener('click', () => indexModal.classList.remove('open'));
  indexModal.addEventListener('click', (e) => {
    if (e.target === indexModal) indexModal.classList.remove('open');
  });

  btnFullscreen.addEventListener('click', () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  });

  document.getElementById('btn-restart').addEventListener('click', () => goToSlide(0));
  document.getElementById('btn-jump-demo').addEventListener('click', () => goToSlide(3));

  document.addEventListener('keydown', (e) => {
    if (e.target && (['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName) || e.target.closest('.lab-dropdown'))) return;

    if (e.key === 'Escape') {
      indexModal.classList.remove('open');
      notesPanel.classList.remove('open');
      btnNotes.classList.remove('is-active');
      closeRaceDropdown();
      return;
    }
    if (e.key.toLowerCase() === 'n') {
      notesPanel.classList.toggle('open');
      btnNotes.classList.toggle('is-active', notesPanel.classList.contains('open'));
      return;
    }
    if (e.key.toLowerCase() === 'g') {
      indexModal.classList.toggle('open');
      return;
    }
    if (e.key.toLowerCase() === 'f') {
      btnFullscreen.click();
      return;
    }

    if (!isScrollMode) {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        goToSlide(currentIndex + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        goToSlide(currentIndex - 1);
      } else if (e.key === 'Home') {
        goToSlide(0);
      } else if (e.key === 'End') {
        goToSlide(totalSlides - 1);
      }
    }
  });

  /* ------------------------------------------------------------------------
     2. DUELO AO VIVO: HARDWARE CLÁSSICO vs PROCESSADOR QUÂNTICO (SLIDE 03)
     ------------------------------------------------------------------------ */
  const clCanvas = document.getElementById('canvas-classical');
  const qtCanvas = document.getElementById('canvas-quantum');
  const clCtx = clCanvas.getContext('2d');
  const qtCtx = qtCanvas.getContext('2d');

  const clOpsEl = document.getElementById('cl-ops');
  const clTimeEl = document.getElementById('cl-time');
  const clStatusEl = document.getElementById('cl-status');
  const qtOpsEl = document.getElementById('qt-ops');
  const qtTimeEl = document.getElementById('qt-time');
  const qtStatusEl = document.getElementById('qt-status');
  const raceDropdown = document.getElementById('race-size-dropdown');
  const raceDropdownTrigger = document.getElementById('race-size-trigger');
  const raceSizeLabel = document.getElementById('race-size-label');
  const raceSizePill = document.getElementById('race-size-pill');
  const raceDropdownItems = Array.from(document.querySelectorAll('#race-size-menu .lab-dropdown-item'));
  const btnStartRace = document.getElementById('btn-start-race');
  const btnResetRace = document.getElementById('btn-reset-race');

  const scenarioLabels = {
    routes: { targetLabel: 'ROTA ÓTIMA', desc: 'Hyundai / Delta' },
    crypto: { targetLabel: 'CHAVE ALVO', desc: 'Criptografia' },
    molecule: { targetLabel: 'ESTADO MÍNIMO', desc: 'Energia Molecular' }
  };

  const race = {
    scenario: 'routes',
    total: 144,
    cols: 16,
    rows: 9,
    targetIdx: 118,
    running: false,
    startTime: 0,
    clIndex: 0,
    clDone: false,
    clFinishTime: 0,
    qtCycle: 0,
    qtMaxCycles: 10,
    qtDone: false,
    qtFinishTime: 0,
    qtPhase: 0,
    rafId: null,
    lastClTick: 0,
    lastQtTick: 0
  };

  function setupRaceGrid() {
    race.total = parseInt(raceDropdown.dataset.value, 10) || 144;
    if (race.total === 64) {
      race.cols = 16; race.rows = 4;
    } else if (race.total === 144) {
      race.cols = 18; race.rows = 8;
    } else {
      race.cols = 32; race.rows = 8;
    }
    // Alvo sempre no último terço para demonstrar claramente o custo de varredura clássica
    race.targetIdx = Math.floor(race.total * (0.72 + Math.random() * 0.22));
    race.qtMaxCycles = Math.max(4, Math.round(Math.PI / 4 * Math.sqrt(race.total)));
    race.clIndex = 0;
    race.clDone = false;
    race.clFinishTime = 0;
    race.qtCycle = 0;
    race.qtDone = false;
    race.qtFinishTime = 0;
    race.running = false;

    clOpsEl.textContent = `0 / ${race.total}`;
    clTimeEl.textContent = '0.00 s';
    clStatusEl.textContent = 'Pronto';
    qtOpsEl.textContent = `0 / ${race.qtMaxCycles} ciclos`;
    qtTimeEl.textContent = '0.00 s';
    qtStatusEl.textContent = 'Pronto';
    btnStartRace.textContent = 'Iniciar Corrida';

    drawClassicalBoard();
    drawQuantumBoard(0);
  }

  function drawClassicalBoard() {
    const w = clCanvas.width;
    const h = clCanvas.height;
    clCtx.clearRect(0, 0, w, h);

    const pad = 16;
    const cellW = (w - pad * 2) / race.cols;
    const cellH = (h - pad * 2) / race.rows;
    const gap = 3;

    for (let i = 0; i < race.total; i++) {
      const col = i % race.cols;
      const row = Math.floor(i / race.cols);
      const x = pad + col * cellW;
      const y = pad + row * cellH;

      let fill = '#181D27';
      let stroke = '#283042';

      if (i < race.clIndex) {
        fill = '#25211E';
        stroke = 'rgba(214, 135, 64, 0.32)';
      }
      if (i === race.clIndex && race.running && !race.clDone) {
        fill = '#D68740';
        stroke = '#F5C48F';
      }
      if (race.clDone && i === race.targetIdx) {
        fill = '#1FC198';
        stroke = '#9EF2D9';
      }

      clCtx.fillStyle = fill;
      clCtx.strokeStyle = stroke;
      clCtx.lineWidth = 1;
      clCtx.fillRect(x + gap / 2, y + gap / 2, cellW - gap, cellH - gap);
      clCtx.strokeRect(x + gap / 2, y + gap / 2, cellW - gap, cellH - gap);
    }

    // Legenda sutil no canto
    clCtx.fillStyle = 'rgba(148, 160, 184, 0.8)';
    clCtx.font = '11px "JetBrains Mono", monospace';
    const caption = race.clDone
      ? `ENCONTRADO APÓS ${race.targetIdx + 1} VERIFICAÇÕES SEQUENCIAIS`
      : `CENÁRIO: ${scenarioLabels[race.scenario].desc.toUpperCase()} • TESTE 1 A 1`;
    clCtx.fillText(caption, 16, h - 4);
  }

  function drawQuantumBoard(t) {
    const w = qtCanvas.width;
    const h = qtCanvas.height;
    qtCtx.clearRect(0, 0, w, h);

    const pad = 16;
    const cellW = (w - pad * 2) / race.cols;
    const cellH = (h - pad * 2) / race.rows;
    const gap = 3;

    const progress = race.qtMaxCycles > 0 ? Math.min(1, race.qtCycle / race.qtMaxCycles) : 0;

    for (let i = 0; i < race.total; i++) {
      const col = i % race.cols;
      const row = Math.floor(i / race.cols);
      const x = pad + col * cellW;
      const y = pad + row * cellH;
      const isTarget = i === race.targetIdx;

      if (!race.running && !race.qtDone) {
        qtCtx.fillStyle = '#181D27';
        qtCtx.strokeStyle = '#283042';
      } else if (race.qtDone) {
        if (isTarget) {
          qtCtx.fillStyle = '#1FC198';
          qtCtx.strokeStyle = '#B2F7E4';
        } else {
          qtCtx.fillStyle = '#10141C';
          qtCtx.strokeStyle = '#1C2230';
        }
      } else {
        // Superposição ativa: todas as células oscilam juntas; interferência amplifica o alvo e anula ruído
        const wave = 0.5 + 0.5 * Math.sin(t * 0.012 + col * 0.45 + row * 0.65);
        if (isTarget) {
          const alpha = 0.35 + 0.65 * progress;
          qtCtx.fillStyle = `rgba(31, 193, 152, ${alpha.toFixed(2)})`;
          qtCtx.strokeStyle = '#9EF2D9';
        } else {
          const fade = Math.max(0.06, (1 - progress * 0.88) * (0.28 + 0.32 * wave));
          qtCtx.fillStyle = `rgba(79, 123, 255, ${fade.toFixed(2)})`;
          qtCtx.strokeStyle = `rgba(79, 123, 255, ${(fade * 0.9).toFixed(2)})`;
        }
      }

      qtCtx.lineWidth = 1;
      qtCtx.fillRect(x + gap / 2, y + gap / 2, cellW - gap, cellH - gap);
      qtCtx.strokeRect(x + gap / 2, y + gap / 2, cellW - gap, cellH - gap);
    }

    qtCtx.fillStyle = 'rgba(148, 160, 184, 0.85)';
    qtCtx.font = '11px "JetBrains Mono", monospace';
    const qCaption = race.qtDone
      ? `${scenarioLabels[race.scenario].targetLabel} AMPLIFICADA EM ${race.qtMaxCycles} CICLOS SIMULTÂNEOS`
      : (race.running ? 'SUPERPOSIÇÃO ATIVA: TODOS OS ESTADOS EM PARALELO' : 'PRONTO PARA INTERFERÊNCIA QUÂNTICA');
    qtCtx.fillText(qCaption, 16, h - 4);
  }

  function stepRace(now) {
    if (!race.running) return;

    const elapsedSec = (now - race.startTime) / 1000;

    // Passo clássico: 1 estado a cada ~32ms (visível em sala de aula)
    const clInterval = race.total === 256 ? 20 : 32;
    if (!race.clDone && now - race.lastClTick >= clInterval) {
      race.lastClTick = now;
      if (race.clIndex >= race.targetIdx) {
        race.clDone = true;
        race.clFinishTime = elapsedSec;
        clOpsEl.textContent = `${race.targetIdx + 1} / ${race.total}`;
        clTimeEl.textContent = `${race.clFinishTime.toFixed(2)} s`;
        clStatusEl.textContent = 'Concluído';
      } else {
        race.clIndex += 1;
        clOpsEl.textContent = `${race.clIndex} / ${race.total}`;
        clTimeEl.textContent = `${elapsedSec.toFixed(2)} s`;
        clStatusEl.textContent = 'Varrendo...';
      }
    }

    // Passo quântico: cada ciclo de interferência (~110ms) amplifica o alvo simultaneamente
    if (!race.qtDone && now - race.lastQtTick >= 115) {
      race.lastQtTick = now;
      race.qtCycle += 1;
      if (race.qtCycle >= race.qtMaxCycles) {
        race.qtDone = true;
        race.qtFinishTime = elapsedSec;
        qtOpsEl.textContent = `${race.qtMaxCycles} ciclos`;
        qtTimeEl.textContent = `${race.qtFinishTime.toFixed(2)} s`;
        const speedup = ((race.targetIdx + 1) / race.qtMaxCycles).toFixed(1);
        qtStatusEl.textContent = `${speedup}× menos passos`;
      } else {
        qtOpsEl.textContent = `${race.qtCycle} / ${race.qtMaxCycles} ciclos`;
        qtTimeEl.textContent = `${elapsedSec.toFixed(2)} s`;
        qtStatusEl.textContent = 'Amplificando...';
      }
    }

    drawClassicalBoard();
    drawQuantumBoard(now);

    if (race.clDone && race.qtDone) {
      race.running = false;
      btnStartRace.textContent = 'Rodar Novamente';
      return;
    }

    race.rafId = requestAnimationFrame(stepRace);
  }

  btnStartRace.addEventListener('click', () => {
    if (race.rafId) cancelAnimationFrame(race.rafId);
    setupRaceGrid();
    race.running = true;
    race.startTime = performance.now();
    race.lastClTick = race.startTime;
    race.lastQtTick = race.startTime;
    btnStartRace.textContent = 'Simulando...';
    race.rafId = requestAnimationFrame(stepRace);
  });

  btnResetRace.addEventListener('click', () => {
    if (race.rafId) cancelAnimationFrame(race.rafId);
    setupRaceGrid();
  });

  function closeRaceDropdown() {
    raceDropdown.classList.remove('open');
    raceDropdownTrigger.setAttribute('aria-expanded', 'false');
  }

  function openRaceDropdown() {
    raceDropdown.classList.add('open');
    raceDropdownTrigger.setAttribute('aria-expanded', 'true');
  }

  function selectRaceSize(item) {
    raceDropdown.dataset.value = item.dataset.value;
    raceSizeLabel.textContent = item.dataset.label;
    raceSizePill.textContent = item.dataset.pill;

    raceDropdownItems.forEach((opt) => {
      const selected = opt === item;
      opt.classList.toggle('is-selected', selected);
      opt.setAttribute('aria-selected', selected ? 'true' : 'false');
    });

    closeRaceDropdown();
    if (race.rafId) cancelAnimationFrame(race.rafId);
    setupRaceGrid();
  }

  raceDropdownTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (raceDropdown.classList.contains('open')) {
      closeRaceDropdown();
    } else {
      openRaceDropdown();
    }
  });

  raceDropdownItems.forEach((item) => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      selectRaceSize(item);
    });
    item.addEventListener('keydown', (e) => {
      const idx = raceDropdownItems.indexOf(item);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        raceDropdownItems[(idx + 1) % raceDropdownItems.length].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        raceDropdownItems[(idx - 1 + raceDropdownItems.length) % raceDropdownItems.length].focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectRaceSize(item);
        raceDropdownTrigger.focus();
      } else if (e.key === 'Escape') {
        closeRaceDropdown();
        raceDropdownTrigger.focus();
      }
    });
  });

  raceDropdownTrigger.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openRaceDropdown();
      const active = raceDropdownItems.find((i) => i.classList.contains('is-selected')) || raceDropdownItems[0];
      if (active) active.focus();
    } else if (e.key === 'Escape') {
      closeRaceDropdown();
    }
  });

  document.addEventListener('click', (e) => {
    if (!raceDropdown.contains(e.target)) {
      closeRaceDropdown();
    }
  });

  document.querySelectorAll('.scenario-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.scenario-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      race.scenario = btn.dataset.scenario;
      if (race.rafId) cancelAnimationFrame(race.rafId);
      setupRaceGrid();
    });
  });

  /* ------------------------------------------------------------------------
     3. CALCULADORA EXPONENCIAL 2^N (SLIDE 03)
     ------------------------------------------------------------------------ */
  const qubitSlider = document.getElementById('qubit-slider');
  const qubitCountLabel = document.getElementById('qubit-count-label');
  const classicalCapEl = document.getElementById('classical-cap');
  const quantumCapEl = document.getElementById('quantum-cap');

  function updateExponentialScale() {
    const n = parseInt(qubitSlider.value, 10);
    const states = Math.pow(2, n);
    qubitCountLabel.textContent = n === 53 ? '53 qubits (Sycamore)' : `${n} ${n === 1 ? 'qubit' : 'qubits'}`;
    classicalCapEl.textContent = `1 por vez (${n} ${n === 1 ? 'bit' : 'bits'})`;
    quantumCapEl.textContent = states.toLocaleString('pt-BR');
  }

  qubitSlider.addEventListener('input', updateExponentialScale);

  /* ------------------------------------------------------------------------
     4. LABORATÓRIO INTERATIVO DOS 4 PRINCÍPIOS (SLIDE 04)
     ------------------------------------------------------------------------ */
  const physCanvas = document.getElementById('physics-canvas');
  const physCtx = physCanvas.getContext('2d');
  const physTitle = document.getElementById('phys-title');
  const physBadge = document.getElementById('phys-badge');
  const physReadout = document.getElementById('phys-readout');
  const physNote = document.getElementById('phys-note');
  const btnPhysAction = document.getElementById('btn-phys-action');

  const physState = {
    mode: 'superposition',
    collapsed: null, // null | 0 | 1
    entangledSpin: null, // null | '↑' | '↓'
    constructive: true,
    noiseLevel: 0.12
  };

  const principleMeta = {
    superposition: {
      title: '1. Superposição (Moeda Girando)',
      badge: 'Girando entre 0 e 1',
      btn: 'Medir Qubit (Parar a moeda)',
      note: '<strong>Pense numa moeda girando no ar:</strong> enquanto gira, não é só cara (0) nem só coroa (1). Na hora em que você mede, ela "cai" em um valor comum: <code>0</code> ou <code>1</code>.'
    },
    entanglement: {
      title: '2. Emaranhamento (Par Conectado)',
      badge: 'Qubits ligados entre si',
      btn: 'Medir Qubit A (Ver Qubit B)',
      note: '<strong>Como duas moedas ligadas magicamente:</strong> mesmo longe uma da outra, ao abrir a mão e ver o resultado do Qubit A, você descobre na hora qual é o estado do Qubit B.'
    },
    interference: {
      title: '3. Interferência (Filtro de Ondas)',
      badge: 'Reforça o certo / Apaga o errado',
      btn: 'Alternar: Somar ondas / Anular ondas',
      note: '<strong>Igual a ondas na água:</strong> o chip combina ondas para <em>aumentar</em> a força da resposta correta (construtiva) e fazer as respostas erradas se anularem (destrutiva).'
    },
    decoherence: {
      title: '4. Decoerência (O Vilão do Ruído)',
      badge: 'Sensível a calor e vibração',
      btn: 'Simular Calor vs. Frio (-273 °C)',
      note: '<strong>Por que precisa ficar tão frio?</strong> Qualquer calor ou sinal externo "esbarra" no qubit e quebra o estado quântico antes do fim da conta — por isso usamos refrigeração perto de <code>-273 °C</code>.'
    }
  };

  function selectPrinciple(mode) {
    physState.mode = mode;
    physState.collapsed = null;
    physState.entangledSpin = null;
    physState.constructive = true;
    physState.noiseLevel = mode === 'decoherence' ? 0.65 : 0.1;

    const meta = principleMeta[mode];
    physTitle.textContent = meta.title;
    physBadge.textContent = meta.badge;
    btnPhysAction.textContent = meta.btn;
    physNote.innerHTML = meta.note;

    document.querySelectorAll('.principle-btn').forEach((b) => {
      b.classList.toggle('active', b.dataset.principle === mode);
    });
  }

  document.querySelectorAll('.principle-btn').forEach((btn) => {
    btn.addEventListener('click', () => selectPrinciple(btn.dataset.principle));
  });

  btnPhysAction.addEventListener('click', () => {
    if (physState.mode === 'superposition') {
      if (physState.collapsed === null) {
        physState.collapsed = Math.random() < 0.5 ? 0 : 1;
        btnPhysAction.textContent = 'Girar moeda novamente';
        physBadge.textContent = `Resultado medido: ${physState.collapsed}`;
      } else {
        physState.collapsed = null;
        btnPhysAction.textContent = 'Medir Qubit (Parar a moeda)';
        physBadge.textContent = 'Girando entre 0 e 1';
      }
    } else if (physState.mode === 'entanglement') {
      if (physState.entangledSpin === null) {
        physState.entangledSpin = Math.random() < 0.5 ? 0 : 1;
        btnPhysAction.textContent = 'Reconectar os dois qubits';
        physBadge.textContent = `A deu ${physState.entangledSpin} → B também é ${physState.entangledSpin}`;
      } else {
        physState.entangledSpin = null;
        btnPhysAction.textContent = 'Medir Qubit A (Ver Qubit B)';
        physBadge.textContent = 'Qubits ligados entre si';
      }
    } else if (physState.mode === 'interference') {
      physState.constructive = !physState.constructive;
      physBadge.textContent = physState.constructive ? 'Somando (Reforça certa)' : 'Anulando (Apaga errada)';
    } else if (physState.mode === 'decoherence') {
      physState.noiseLevel = physState.noiseLevel > 0.3 ? 0.06 : 0.85;
      physBadge.textContent = physState.noiseLevel > 0.3 ? 'Com calor (Gerando erro)' : 'A -273 °C (Estável)';
    }
  });

  function renderPhysicsCanvas(t) {
    const w = physCanvas.width;
    const h = physCanvas.height;
    const cx = w / 2;
    const cy = h / 2;
    physCtx.clearRect(0, 0, w, h);

    // Grade sutil de osciloscópio
    physCtx.strokeStyle = 'rgba(148, 160, 184, 0.08)';
    physCtx.lineWidth = 1;
    for (let x = 0; x < w; x += 36) {
      physCtx.beginPath(); physCtx.moveTo(x, 0); physCtx.lineTo(x, h); physCtx.stroke();
    }
    for (let y = 0; y < h; y += 36) {
      physCtx.beginPath(); physCtx.moveTo(0, y); physCtx.lineTo(w, y); physCtx.stroke();
    }

    if (physState.mode === 'superposition') {
      const r = 74;
      // Esfera de Bloch simplificada (estética técnica de instrumento)
      physCtx.strokeStyle = 'rgba(148, 160, 184, 0.35)';
      physCtx.lineWidth = 1.5;
      physCtx.beginPath(); physCtx.arc(cx, cy, r, 0, Math.PI * 2); physCtx.stroke();

      // Equador elíptico
      physCtx.strokeStyle = 'rgba(214, 135, 64, 0.45)';
      physCtx.beginPath(); physCtx.ellipse(cx, cy, r, 22, 0, 0, Math.PI * 2); physCtx.stroke();

      // Eixo vertical |0> e |1>
      physCtx.fillStyle = '#F2F4F8';
      physCtx.font = '600 13px "JetBrains Mono", monospace';
      physCtx.fillText('|0⟩', cx - 12, cy - r - 10);
      physCtx.fillText('|1⟩', cx - 12, cy + r + 20);

      let vx, vy;
      if (physState.collapsed === null) {
        const ang = t * 0.0022;
        const tilt = Math.sin(t * 0.0011) * 0.35;
        vx = cx + Math.cos(ang) * r * 0.88;
        vy = cy + Math.sin(ang) * 20 + tilt * r * 0.5;
        physReadout.textContent = 'Superposição ativa: chance de 0 = 50% • chance de 1 = 50%';
      } else {
        vx = cx;
        vy = physState.collapsed === 0 ? cy - r : cy + r;
        physReadout.textContent = `Medição feita → o qubit parou no valor binário ${physState.collapsed}`;
      }

      // Vetor de estado
      physCtx.strokeStyle = physState.collapsed === null ? '#1FC198' : '#D68740';
      physCtx.lineWidth = 3;
      physCtx.beginPath(); physCtx.moveTo(cx, cy); physCtx.lineTo(vx, vy); physCtx.stroke();

      physCtx.fillStyle = physState.collapsed === null ? '#1FC198' : '#D68740';
      physCtx.beginPath(); physCtx.arc(vx, vy, 7, 0, Math.PI * 2); physCtx.fill();
    } else if (physState.mode === 'entanglement') {
      const ax = w * 0.28;
      const bx = w * 0.72;

      // Ponte de correlação ondulatória
      physCtx.strokeStyle = physState.entangledSpin === null ? '#4F7BFF' : '#1FC198';
      physCtx.lineWidth = 2;
      physCtx.beginPath();
      for (let x = ax + 46; x <= bx - 46; x += 4) {
        const ratio = (x - (ax + 46)) / (bx - ax - 92);
        const amp = physState.entangledSpin === null ? 16 * Math.sin(ratio * Math.PI) : 3;
        const y = cy + Math.sin(x * 0.08 - t * 0.008) * amp;
        if (x === ax + 46) physCtx.moveTo(x, y);
        else physCtx.lineTo(x, y);
      }
      physCtx.stroke();

      // Desenha Qubit A e Qubit B sincronizados
      const angle = physState.entangledSpin === null
        ? t * 0.004
        : (physState.entangledSpin === 0 ? -Math.PI / 2 : Math.PI / 2);

      [
        { x: ax, label: 'QUBIT A' },
        { x: bx, label: 'QUBIT B' }
      ].forEach((q) => {
        physCtx.strokeStyle = 'rgba(148, 160, 184, 0.45)';
        physCtx.lineWidth = 1.5;
        physCtx.beginPath(); physCtx.arc(q.x, cy, 44, 0, Math.PI * 2); physCtx.stroke();

        const ex = q.x + Math.cos(angle) * 36;
        const ey = cy + Math.sin(angle) * 36;
        physCtx.strokeStyle = '#1FC198';
        physCtx.lineWidth = 3;
        physCtx.beginPath(); physCtx.moveTo(q.x, cy); physCtx.lineTo(ex, ey); physCtx.stroke();
        physCtx.fillStyle = '#1FC198';
        physCtx.beginPath(); physCtx.arc(ex, ey, 6, 0, Math.PI * 2); physCtx.fill();

        physCtx.fillStyle = '#F2F4F8';
        physCtx.font = '600 12px "JetBrains Mono", monospace';
        physCtx.fillText(q.label, q.x - 26, cy + 68);
      });

      physReadout.textContent = physState.entangledSpin === null
        ? 'Os dois qubits giram sincronizados, mesmo longe um do outro'
        : `Ao medir A = ${physState.entangledSpin}, sabemos na hora que B também é ${physState.entangledSpin}`;
    } else if (physState.mode === 'interference') {
      const phaseShift = physState.constructive ? 0 : Math.PI;
      const drawWave = (color, lineW, fn) => {
        physCtx.strokeStyle = color;
        physCtx.lineWidth = lineW;
        physCtx.beginPath();
        for (let x = 24; x < w - 24; x += 3) {
          const y = cy + fn(x);
          if (x === 24) physCtx.moveTo(x, y);
          else physCtx.lineTo(x, y);
        }
        physCtx.stroke();
      };

      // Onda 1 e Onda 2
      drawWave('rgba(79, 123, 255, 0.55)', 1.5, (x) => Math.sin(x * 0.032 - t * 0.004) * 34);
      drawWave('rgba(214, 135, 64, 0.55)', 1.5, (x) => Math.sin(x * 0.032 - t * 0.004 + phaseShift) * 34);

      // Soma resultante
      drawWave(physState.constructive ? '#1FC198' : '#E05A47', 3, (x) => {
        const y1 = Math.sin(x * 0.032 - t * 0.004) * 34;
        const y2 = Math.sin(x * 0.032 - t * 0.004 + phaseShift) * 34;
        return y1 + y2;
      });

      physReadout.textContent = physState.constructive
        ? 'Ondas juntas (CONSTRUTIVA): a resposta certa fica 2× mais forte'
        : 'Ondas opostas (DESTRUTIVA): respostas erradas se anulam (0×)';
    } else if (physState.mode === 'decoherence') {
      const noise = physState.noiseLevel;
      physCtx.strokeStyle = noise > 0.3 ? '#E05A47' : '#1FC198';
      physCtx.lineWidth = 2.4;
      physCtx.beginPath();

      for (let x = 24; x < w - 24; x += 3) {
        const progress = (x - 24) / (w - 48);
        const decay = Math.exp(-progress * (noise > 0.3 ? 3.2 : 0.35));
        const jitter = (Math.sin(x * 0.9 + t * 0.05) + Math.cos(x * 1.7 - t * 0.08)) * 12 * noise;
        const y = cy + Math.sin(x * 0.045 - t * 0.005) * 58 * decay + jitter * progress;
        if (x === 24) physCtx.moveTo(x, y);
        else physCtx.lineTo(x, y);
      }
      physCtx.stroke();

      physReadout.textContent = noise > 0.3
        ? 'Com calor ou ruído: o sinal quântico se perde rápido e vira erro'
        : 'Isolado a -273 °C: o qubit continua estável até o fim do cálculo';
    }

    requestAnimationFrame(renderPhysicsCanvas);
  }

  /* ------------------------------------------------------------------------
     INICIALIZAÇÃO
     ------------------------------------------------------------------------ */
  buildNavigation();
  goToSlide(0);
  setupRaceGrid();
  updateExponentialScale();
  selectPrinciple('superposition');
  requestAnimationFrame(renderPhysicsCanvas);
})();
