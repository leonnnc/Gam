/* ============================================================
   NEXUS · Sopa de Letras Futurista
   app.js — generador de rejilla + interacción + HUD
   ============================================================ */
(() => {
  'use strict';

  /* ---------- Utilidades ---------- */
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const rnd = n => Math.floor(Math.random() * n);
  const pad = n => String(n).padStart(2, '0');

  function shuffle(list) {
    const a = list.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = rnd(i + 1);
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  const fmtTime = s => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;

  /* ---------- Audio sintético ---------- */
  const Sound = {
    ctx: null,
    on: true,
    init() {
      if (!this.ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (AC) this.ctx = new AC();
      }
      if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    },
    blip(freq = 440, dur = .09, type = 'sine', vol = .05) {
      if (!this.on) return;
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(vol, t + .012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(gain).connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + dur + .03);
    },
    click() { this.blip(520, .05, 'square', .03); },
    found() { [660, 880, 1240].forEach((f, i) => setTimeout(() => this.blip(f, .13, 'triangle', .05), i * 70)); },
    error() { this.blip(140, .18, 'sawtooth', .045); },
    win() { [523, 659, 784, 1047, 1319, 1568].forEach((f, i) => setTimeout(() => this.blip(f, .24, 'triangle', .055), i * 105)); }
  };

  /* ---------- Constantes ---------- */
  const DIRS_8 = [[0, 1], [1, 0], [1, 1], [1, -1], [0, -1], [-1, 0], [-1, -1], [-1, 1]];
  const DIRS_4 = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  const SIZES = [10, 12, 14, 16, 18, 20];
  const COLORS = ['#22e6ff', '#ff3fd8', '#b6ff5e', '#8b5cff', '#ffb547', '#4dffb8',
                  '#ff7a90', '#61a8ff', '#e2ff5e', '#ff6bd6', '#5ce1e6', '#c08bff'];
  const FILL = 'AAAABCDEEEEEFGHIIIIJKLLLMNNNNOOOPQRRRRSSSSTTTUUUVXYZ';

  const CATEGORIES = window.NEXUS_CATEGORIES || [];

  /* ---------- Estado ---------- */
  const S = {
    category: null,
    size: 12,
    wordGoal: 10,
    dirs: 8,
    grid: [],
    placements: [],
    found: new Set(),
    elapsed: 0,
    timerId: null,
    startTs: 0,
    hints: 0,
    busy: false,
    anchor: null,
    path: [],
    sound: true
  };

  const board = $('#board');
  let selEls = [];

  /* ---------- Navegación entre pantallas ---------- */
  function show(id) {
    $$('.screen').forEach(s => s.classList.toggle('is-active', s.id === id));
    if (id !== 'game') window.scrollTo(0, 0);
  }

  /* ---------- 1. Intro (3 s) ---------- */
  (function intro() {
    const INTRO_MS = 3000;
    const R = 88;
    const C = 2 * Math.PI * R;
    const pctEl = $('#loaderPct');
    const ring = $('#ringProgress');
    const log = $('#bootLog');
    const introEl = $('#intro');

    ring.style.strokeDasharray = String(C);
    ring.style.strokeDashoffset = String(C);

    /* Marcas del dial (decorativas) */
    const ticks = $('#coreTicks');
    const NS = 'http://www.w3.org/2000/svg';
    for (let i = 0; i < 72; i++) {
      const big = i % 6 === 0;
      const line = document.createElementNS(NS, 'line');
      line.setAttribute('x1', '100');
      line.setAttribute('x2', '100');
      line.setAttribute('y1', big ? '17' : '20');
      line.setAttribute('y2', big ? '26' : '24');
      line.setAttribute('transform', `rotate(${i * 5} 100 100)`);
      if (big) line.setAttribute('class', 'is-big');
      ticks.appendChild(line);
    }

    /* Partículas ascendentes */
    for (let i = 0; i < 26; i++) {
      const s = document.createElement('span');
      s.className = 'spark';
      s.style.setProperty('--x', (Math.random() * 100).toFixed(2) + '%');
      s.style.setProperty('--d', (Math.random() * 7).toFixed(2) + 's');
      s.style.setProperty('--t', (4 + Math.random() * 5).toFixed(2) + 's');
      s.style.setProperty('--o', (0.25 + Math.random() * 0.55).toFixed(2));
      introEl.appendChild(s);
    }

    /* Terminal de arranque */
    const lines = [
      ['NÚCLEO LÉXICO', 'OK'],
      ['20 MÓDULOS', 'CARGADOS'],
      ['MOTOR DE REJILLA', 'LISTO'],
      ['OPERADOR', 'EN LÍNEA']
    ];
    let li = 0;
    const addLine = () => {
      if (li >= lines.length) return;
      const [txt, status] = lines[li++];
      const el = document.createElement('span');
      el.className = 'log-line';
      el.innerHTML = `<i>&gt;_</i><span>${txt}</span><b>${status}</b>`;
      log.appendChild(el);
    };
    addLine();
    const logTimer = setInterval(() => {
      if (li < lines.length) addLine();
      else clearInterval(logTimer);
    }, 640);

    const t0 = performance.now();
    (function frame(now) {
      const p = Math.min(1, (now - t0) / INTRO_MS);
      pctEl.textContent = String(Math.round(p * 100));
      ring.style.strokeDashoffset = String(C * (1 - p));
      if (p < 1) {
        requestAnimationFrame(frame);
      } else {
        clearInterval(logTimer);
        introEl.classList.add('is-complete');
        setTimeout(() => show('setup'), 320);
      }
    })(t0);
  })();

  /* ---------- 2. Construcción del setup ---------- */
  function buildCategories() {
    const grid = $('#catGrid');
    if (!grid) return;
    const frag = document.createDocumentFragment();

    CATEGORIES.forEach((cat, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'cat';
      btn.dataset.id = cat.id;
      btn.setAttribute('role', 'radio');
      btn.setAttribute('aria-checked', 'false');
      btn.setAttribute('aria-label', `Categoría ${cat.name}`);
      btn.innerHTML =
        `<span class="cat__num">${pad(i + 1)}</span>` +
        `<span class="cat__code">${cat.code}</span>` +
        `<span class="cat__name">${cat.name}</span>`;
      btn.addEventListener('click', () => selectCategory(cat.id));
      frag.appendChild(btn);
    });

    grid.appendChild(frag);
    $('#catCounter').textContent = `0 / ${CATEGORIES.length}`;

    /* Foco luminoso que sigue al cursor sobre las tarjetas */
    grid.addEventListener('pointermove', e => {
      const card = e.target.closest('.cat');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
  }

  function buildSizes() {
    const group = $('#sizeGroup');
    SIZES.forEach(n => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'seg' + (n === S.size ? ' is-on' : '');
      b.dataset.size = String(n);
      b.textContent = `${n}×${n}`;
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', String(n === S.size));
      b.addEventListener('click', () => setSize(n));
      group.appendChild(b);
    });
  }

  function maxWordsForSize(n) {
    return Math.max(5, Math.min(18, Math.floor((n * n) / 10)));
  }

  function setSize(n) {
    S.size = n;
    $$('#sizeGroup .seg').forEach(b => {
      const on = Number(b.dataset.size) === n;
      b.classList.toggle('is-on', on);
      b.setAttribute('aria-checked', String(on));
    });
    if (S.wordGoal > maxWordsForSize(n)) S.wordGoal = maxWordsForSize(n);
    setWordGoal(S.wordGoal);
    updateMeta();
    Sound.click();
  }

  function setWordGoal(v) {
    const max = maxWordsForSize(S.size);
    S.wordGoal = Math.max(5, Math.min(max, v));
    $('#wordsOut').textContent = String(S.wordGoal);
    $('#wordsMinus').disabled = S.wordGoal <= 5;
    $('#wordsPlus').disabled = S.wordGoal >= max;
    updateMeta();
  }

  function updateMeta() {
    const cat = S.category ? S.category.name.toUpperCase() : 'SIN CATEGORÍA';
    $('#setupMeta').textContent = `${cat} · ${S.size} × ${S.size} · ${S.wordGoal} palabras · ${S.dirs} ejes`;
  }

  function selectCategory(id) {
    const cat = CATEGORIES.find(c => c.id === id);
    if (!cat) return;
    S.category = cat;

    $$('.cat').forEach(b => {
      const on = b.dataset.id === id;
      b.classList.toggle('is-selected', on);
      b.setAttribute('aria-checked', String(on));
    });

    $('#catCounter').textContent = `${CATEGORIES.findIndex(c => c.id === id) + 1} / ${CATEGORIES.length}`;
    updateMeta();
    $('#btnStart').disabled = false;
    const mobileCta = $('#btnStartMobile');
    if (mobileCta) mobileCta.disabled = false;
    Sound.click();
  }

  /* ---------- 3. Generador de sopa de letras ---------- */
  function fits(grid, word, r, c, dr, dc, size) {
    for (let i = 0; i < word.length; i++) {
      const rr = r + dr * i;
      const cc = c + dc * i;
      if (rr < 0 || rr >= size || cc < 0 || cc >= size) return false;
      const cur = grid[rr][cc];
      if (cur && cur !== word[i]) return false;
    }
    return true;
  }

  function writeWord(grid, word, spot) {
    const { r, c, dr, dc } = spot;
    for (let i = 0; i < word.length; i++) {
      grid[r + dr * i][c + dc * i] = word[i];
    }
  }

  function findSpot(grid, word, size, dirs) {
    const cellsCount = size * size;
    const order = shuffle(Array.from({ length: cellsCount }, (_, i) => i));

    for (const idx of order) {
      const r = Math.floor(idx / size);
      const c = idx % size;
      const ds = shuffle(dirs);
      for (const [dr, dc] of ds) {
        if (fits(grid, word, r, c, dr, dc, size)) return { r, c, dr, dc };
      }
    }
    return null;
  }

  function placeAll(words, size, dirs) {
    const grid = Array.from({ length: size }, () => new Array(size).fill(''));
    const placed = [];
    const ordered = words.slice().sort((a, b) => b.length - a.length);

    for (const word of ordered) {
      const spot = findSpot(grid, word, size, dirs);
      if (!spot) continue;
      writeWord(grid, word, spot);
      const cells = [];
      for (let i = 0; i < word.length; i++) {
        cells.push({ r: spot.r + spot.dr * i, c: spot.c + spot.dc * i });
      }
      placed.push({ word, ...spot, cells });
    }
    return { grid, placed };
  }

  function fillGrid(grid, placed) {
    const bagLetters = placed.map(p => p.word).join('') + FILL;
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        if (!grid[r][c]) grid[r][c] = bagLetters[rnd(bagLetters.length)];
      }
    }
    return grid;
  }

  function buildPuzzle(pool, size, target, dirs) {
    const usable = pool.filter(w => w.length >= 3 && w.length <= size);
    const goal = Math.min(target, usable.length);
    let best = null;

    for (let attempt = 0; attempt < 70; attempt++) {
      const picks = shuffle(usable).slice(0, goal);
      const built = placeAll(picks, size, dirs);
      if (!best || built.placed.length > best.placed.length) best = built;
      if (built.placed.length === picks.length) break;
    }

    return {
      grid: fillGrid(best.grid, best.placed),
      placements: best.placed
    };
  }

  /* ---------- 4. Render ---------- */
  function renderBoard() {
    board.style.setProperty('--n', String(S.size));
    board.innerHTML = '';
    const frag = document.createDocumentFragment();

    for (let r = 0; r < S.size; r++) {
      for (let c = 0; c < S.size; c++) {
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = 'cell';
        cell.dataset.r = String(r);
        cell.dataset.c = String(c);
        cell.style.setProperty('--i', String(r * S.size + c));
        cell.textContent = S.grid[r][c];
        cell.setAttribute('role', 'gridcell');
        cell.setAttribute('aria-label', `Letra ${S.grid[r][c]}, fila ${r + 1}, columna ${c + 1}`);
        frag.appendChild(cell);
      }
    }
    board.appendChild(frag);
  }

  function renderWords() {
    const list = $('#wordList');
    list.innerHTML = '';
    const words = shuffle(S.placements.map(p => p.word));
    const frag = document.createDocumentFragment();

    words.forEach((w, i) => {
      const li = document.createElement('li');
      li.dataset.word = w;
      li.innerHTML = `<span class="w-idx">${pad(i + 1)}</span><span>${w}</span>`;
      frag.appendChild(li);
    });
    list.appendChild(frag);
    $('#wordCounter').textContent = `0 / ${S.placements.length}`;
    $('#hudFound').textContent = `0/${S.placements.length}`;
    $('#progressFill').style.width = '0%';
  }

  function cellEl(r, c) {
    return board.children[r * S.size + c] || null;
  }

  function preview(path) {
    selEls.forEach(el => el.classList.remove('sel'));
    selEls = [];
    S.path = path || [];

    S.path.forEach(({ r, c }) => {
      const el = cellEl(r, c);
      if (el && !el.classList.contains('found')) {
        el.classList.add('sel');
        selEls.push(el);
      }
    });
  }

  function clearSelection() {
    preview([]);
    S.anchor = null;
    S.path = [];
  }

  /* ---------- 5. Selección ---------- */
  function lineBetween(a, b) {
    const dr = Math.sign(b.r - a.r);
    const dc = Math.sign(b.c - a.c);
    const adr = Math.abs(b.r - a.r);
    const adc = Math.abs(b.c - a.c);
    if (adr && adc && adr !== adc) return null;
    const len = Math.max(adr, adc) + 1;
    const path = [];
    for (let i = 0; i < len; i++) path.push({ r: a.r + dr * i, c: a.c + dc * i });
    return path;
  }

  function evaluate(path) {
    if (!path || path.length < 3 || S.busy) return;
    const letters = path.map(({ r, c }) => S.grid[r][c]).join('');
    const reverse = letters.split('').reverse().join('');

    const hit = S.placements.find(p =>
      !S.found.has(p.word) && (p.word === letters || p.word === reverse)
    );

    if (hit) {
      markFound(hit, path);
    } else {
      flashMiss(path);
      Sound.error();
    }
    clearSelection();
  }

  function markFound(placement, path) {
    const idx = S.placements.indexOf(placement);
    const color = COLORS[idx % COLORS.length];
    S.found.add(placement.word);

    path.forEach(({ r, c }) => {
      const el = cellEl(r, c);
      if (!el) return;
      el.classList.add('found');
      el.style.setProperty('--wc', color);
      el.classList.remove('hint');
    });

    const li = $(`#wordList li[data-word="${placement.word}"]`);
    if (li) li.classList.add('found');

    const total = S.placements.length;
    $('#hudFound').textContent = `${S.found.size}/${total}`;
    $('#wordCounter').textContent = `${S.found.size} / ${total}`;
    $('#progressFill').style.width = `${(S.found.size / total) * 100}%`;

    Sound.found();
    toast(`SECUENCIA VALIDADA · ${placement.word}`);

    if (S.found.size === total) finish();
  }

  function flashMiss(path) {
    path.forEach(({ r, c }) => {
      const el = cellEl(r, c);
      if (!el) return;
      el.classList.add('miss');
      setTimeout(() => el.classList.remove('miss'), 420);
    });
  }

  board.addEventListener('pointerdown', e => {
    if (S.busy) return;
    const cell = e.target.closest('.cell');
    if (!cell) return;
    e.preventDefault();
    Sound.init();

    const point = { r: Number(cell.dataset.r), c: Number(cell.dataset.c) };

    if (S.anchor && !(S.anchor.r === point.r && S.anchor.c === point.c)) {
      const path = lineBetween(S.anchor, point);
      if (path && path.length > 1) {
        evaluate(path);
        S.anchor = null;
        return;
      }
    }

    S.anchor = point;
    preview([point]);
    Sound.click();
  });

  board.addEventListener('pointermove', e => {
    if (!S.anchor || S.busy) return;
    const under = document.elementFromPoint(e.clientX, e.clientY);
    const cell = under && under.closest ? under.closest('.cell') : null;
    if (!cell) return;
    const point = { r: Number(cell.dataset.r), c: Number(cell.dataset.c) };
    const path = lineBetween(S.anchor, point);
    if (path) preview(path);
  });

  window.addEventListener('pointerup', () => {
    if (!S.anchor) return;
    if (S.path.length > 1) {
      evaluate(S.path);
    }
    // si fue un toque simple, el ancla queda armada para el segundo toque
  });

  window.addEventListener('pointercancel', () => clearSelection());

  /* ---------- 6. HUD / tiempo ---------- */
  function startTimer() {
    clearInterval(S.timerId);
    S.startTs = Date.now();
    S.elapsed = 0;
    $('#hudTime').textContent = '00:00';
    S.timerId = setInterval(() => {
      S.elapsed = Math.floor((Date.now() - S.startTs) / 1000);
      $('#hudTime').textContent = fmtTime(S.elapsed);
    }, 250);
  }

  function stopTimer() {
    clearInterval(S.timerId);
    S.timerId = null;
  }

  let toastTimer = null;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-on'), 1900);
  }

  /* ---------- 7. Partida ---------- */
  function startGame() {
    if (!S.category) return;
    const { grid, placements } = buildPuzzle(S.category.words, S.size, S.wordGoal, S.dirs === 8 ? DIRS_8 : DIRS_4);

    S.grid = grid;
    S.placements = placements;
    S.found.clear();
    S.hints = 0;
    S.busy = false;
    S.anchor = null;
    S.path = [];
    selEls = [];

    $('#hudCat').textContent = S.category.name.toUpperCase();
    $('#hudSub').textContent = `${S.size} × ${S.size} · ${placements.length} palabras · ${S.dirs} ejes`;
    $('#boardLock').hidden = true;
    $('#winModal').hidden = true;

    renderBoard();
    renderWords();
    startTimer();
    show('game');
  }

  function finish() {
    S.busy = true;
    stopTimer();
    Sound.win();

    const total = S.placements.length;
    $('#winCat').textContent = `${S.category.name.toUpperCase()} · ${S.size} × ${S.size}`;
    $('#winTime').textContent = fmtTime(S.elapsed);
    $('#winWords').textContent = String(total);
    $('#winHints').textContent = String(S.hints);

    let recordMsg = '';
    try {
      const key = `nexus.record.${S.category.id}.${S.size}.${total}`;
      const prev = Number(localStorage.getItem(key) || 0);
      if (!prev || S.elapsed < prev) {
        localStorage.setItem(key, String(S.elapsed));
        recordMsg = 'NUEVO RÉCORD PERSONAL';
      } else {
        recordMsg = `MEJOR TIEMPO · ${fmtTime(prev)}`;
      }
    } catch (err) { /* almacenamiento no disponible */ }
    $('#winRecord').textContent = recordMsg;

    setTimeout(() => { $('#winModal').hidden = false; }, 520);
  }

  function hint() {
    if (S.busy) return;
    const pending = S.placements.filter(p => !S.found.has(p.word));
    if (!pending.length) return;
    const target = pending[rnd(pending.length)];
    const head = target.cells[0];

    S.hints++;
    const el = cellEl(head.r, head.c);
    if (el) {
      el.classList.add('hint');
      setTimeout(() => el.classList.remove('hint'), 2400);
    }
    Sound.blip(880, .1, 'sine', .04);
    toast(`PISTA · "${target.word}" inicia en fila ${head.r + 1}, columna ${head.c + 1}`);
  }

  function revealAll() {
    if (S.busy) return;
    S.placements.forEach((p, i) => {
      if (S.found.has(p.word)) return;
      S.found.add(p.word);
      const color = COLORS[i % COLORS.length];
      p.cells.forEach(({ r, c }) => {
        const el = cellEl(r, c);
        if (el) {
          el.classList.add('found');
          el.style.setProperty('--wc', color);
        }
      });
      const li = $(`#wordList li[data-word="${p.word}"]`);
      if (li) li.classList.add('found');
    });

    const total = S.placements.length;
    $('#hudFound').textContent = `${total}/${total}`;
    $('#wordCounter').textContent = `${total} / ${total}`;
    $('#progressFill').style.width = '100%';
    stopTimer();
    S.busy = true;
    $('#boardLock').hidden = false;
    toast('TABLERO REVELADO · SIN RÉCORD');
  }

  /* ---------- 8. Eventos UI ---------- */
  $('#setupForm').addEventListener('submit', e => {
    e.preventDefault();
    startGame();
  });

  $('#wordsMinus').addEventListener('click', () => setWordGoal(S.wordGoal - 1));
  $('#wordsPlus').addEventListener('click', () => setWordGoal(S.wordGoal + 1));

  $('#btnStartMobile').addEventListener('click', () => {
    if (!S.category) {
      toast('SELECCIONA UNA CATEGORÍA');
      return;
    }
    startGame();
  });

  $$('#dirGroup .seg').forEach(btn => {
    btn.addEventListener('click', () => {
      S.dirs = Number(btn.dataset.dirs);
      $$('#dirGroup .seg').forEach(b => b.classList.toggle('is-on', b === btn));
      updateMeta();
      Sound.click();
    });
  });

  $('#btnRestart').addEventListener('click', () => {
    startGame();
    toast('NUEVA REJILLA GENERADA');
  });

  $('#btnExit').addEventListener('click', () => {
    stopTimer();
    S.busy = false;
    show('setup');
  });

  $('#btnHint').addEventListener('click', hint);
  $('#btnReveal').addEventListener('click', revealAll);

  $('#btnSound').addEventListener('click', e => {
    const btn = e.currentTarget;
    Sound.on = !Sound.on;
    S.sound = Sound.on;
    btn.setAttribute('aria-pressed', String(Sound.on));
    if (Sound.on) Sound.click();
  });

  $('#btnAgain').addEventListener('click', () => {
    $('#winModal').hidden = true;
    startGame();
  });

  $$('#winModal [data-close]').forEach(el => {
    el.addEventListener('click', () => {
      $('#winModal').hidden = true;
      show('setup');
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (!$('#winModal').hidden) {
        $('#winModal').hidden = true;
        show('setup');
      } else if ($('#game').classList.contains('is-active')) {
        clearSelection();
      }
    }
  });

  /* ---------- 9. Init ---------- */
  buildCategories();
  buildSizes();
  setSize(S.size);
  setWordGoal(S.wordGoal);
  updateMeta();
})();
