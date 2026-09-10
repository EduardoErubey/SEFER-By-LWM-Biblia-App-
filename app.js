// SEFER — app.js
(function() {
  'use strict';

  // ==================== ESTADO ====================
  const state = {
    theme: 'mexico',
    themeBatch: 0,
    version: 'rv1960',
    currentBook: null,
    currentChapter: null,
    selectedVerses: new Set(),
    checkboxesVisible: false,
    fontSize: 18,
    fontFamily: 'serif',
    highlightMode: false,
    projectionMode: null,
    projectionIndex: 0,
    projectionData: [],
    autoScroll: false,
    autoScrollSpeed: 0.03,
    autoScrollTimer: null,
    countdownTimer: null,
    countdownValue: 10,
    diceMode: false,
    currentDiceVerse: null,
    notes: {},
    favorites: [],
    readBooks: new Set(),
    tourStep: 0,
    tourActive: false
  };

  // ==================== TEMAS ====================
  const THEME_BATCHES = [
    [
      { id: 'mexico',   name: 'México',   flag: '🇲🇽', colors: ['#c8102e','#006847','#fff'] },
      { id: 'corea',    name: 'Corea',    flag: '🇰🇷', colors: ['#0047a0','#c60c30','#fff'] },
      { id: 'ucrania',  name: 'Ucrania',  flag: '🇺🇦', colors: ['#0057b7','#ffd700'] },
      { id: 'reino',    name: 'Reino',    flag: '👑', colors: ['#7a1f2b','#c9a961'] },
      { id: 'eden',     name: 'Edén',     flag: '🌿', colors: ['#2e7d32','#8bc34a'] }
    ],
    [
      { id: 'day',        name: 'Day',      flag: '☀️', colors: ['#2563eb','#7c3aed'] },
      { id: 'night',      name: 'Night',    flag: '🌙', colors: ['#60a5fa','#a78bfa'] },
      { id: 'arena',      name: 'Arena',    flag: '🏜️', colors: ['#b87333','#d4a574'] },
      { id: 'sandalwood', name: 'Sándalo',  flag: '🪵', colors: ['#a0522d','#cd853f'] },
      { id: 'glass',      name: 'Glass',    flag: '✨', colors: ['#007aff','#af52de'] }
    ]
  ];

  // ==================== VERSIONES ====================
  const VERSIONS = {
    rv1960:  { id: 'rv1960',  label: 'RV60', name: 'Reina-Valera 1960',          available: true },
    rv1909:  { id: 'rv1909',  label: 'RV09', name: 'Reina-Valera 1909',          available: true },
    rva2015: { id: 'rva2015', label: 'RVA',  name: 'Reina Valera Actualizada',   available: false },
    nvi:     { id: 'nvi',     label: 'NVI',  name: 'Nueva Versión Internacional',available: false },
    ntv:     { id: 'ntv',     label: 'NTV',  name: 'Nueva Traducción Viviente',  available: false },
    tla:     { id: 'tla',     label: 'TLA',  name: 'Traducción Lenguaje Actual', available: false }
  };

  // ==================== LIBROS ====================
  let BOOKS_FULL = [];

  function buildBooksList() {
    // Reconstruir desde BIBLE_DATA_RV1960 (ambas versiones tienen la misma lista)
    const data = window.BIBLE_DATA_RV1960 || window.BIBLE_DATA_RV1909;
    if (!data || !data.books) {
      console.error('No se encontró BIBLE_DATA_RV1960 ni BIBLE_DATA_RV1909');
      return;
    }
    BOOKS_FULL = data.books.map(b => ({
      name: b.name,
      testament: b.testament,
      chapters: Object.keys(b.chapters || {}).length || countChapters(b)
    }));
  }

  function countChapters(book) {
    // Fallback: contar capítulos desde la data
    const data = window.BIBLE_DATA_RV1960 || window.BIBLE_DATA_RV1909;
    if (!data || !data.books) return 0;
    const b = data.books.find(x => x.name === book.name);
    if (!b) return 0;
    return Object.keys(b).filter(k => !isNaN(parseInt(k))).length ||
           Object.keys(b.chapters || {}).length;
  }

  function getBookByName(name) {
    return BOOKS_FULL.find(b => b.name.toLowerCase() === name.toLowerCase());
  }

  function getBookByAbbrev(query) {
    const q = query.trim().toLowerCase();
    const ABBREVS = {
      'gen':'Génesis','gn':'Génesis','ex':'Éxodo','exo':'Éxodo',
      'lv':'Levítico','lev':'Levítico','nm':'Números','num':'Números',
      'dt':'Deuteronomio','deu':'Deuteronomio','jos':'Josué',
      'jue':'Jueces','jdg':'Jueces','rt':'Rut','rut':'Rut',
      '1s':'1 Samuel','1sa':'1 Samuel','2s':'2 Samuel','2sa':'2 Samuel',
      '1r':'1 Reyes','1re':'1 Reyes','2r':'2 Reyes','2re':'2 Reyes',
      '1cr':'1 Crónicas','2cr':'2 Crónicas','esd':'Esdras',
      'neh':'Nehemías','ne':'Nehemías','et':'Ester','est':'Ester',
      'jb':'Job','job':'Job','sal':'Salmos','sl':'Salmos','salmos':'Salmos',
      'pr':'Proverbios','pro':'Proverbios','ec':'Eclesiastés',
      'ecl':'Eclesiastés','ecle':'Eclesiastés','cnt':'Cantares','cant':'Cantares',
      'is':'Isaías','isa':'Isaías','jer':'Jeremías','jr':'Jeremías',
      'lm':'Lamentaciones','lam':'Lamentaciones','ez':'Ezequiel','eze':'Ezequiel',
      'dn':'Daniel','dan':'Daniel','os':'Oseas','jl':'Joel',
      'am':'Amós','amo':'Amós','abd':'Abdías','jon':'Jonás',
      'mi':'Miqueas','mic':'Miqueas','nah':'Nahúm','na':'Nahúm',
      'hab':'Habacuc','sof':'Sofonías','zep':'Sofonías',
      'hg':'Hageo','hag':'Hageo','zac':'Zacarías','ml':'Malaquías','mal':'Malaquías',
      'mt':'Mateo','mat':'Mateo','mr':'Marcos','mrk':'Marcos',
      'lc':'Lucas','luk':'Lucas','jn':'Juan','jhn':'Juan',
      'hch':'Hechos','act':'Hechos','ro':'Romanos','rom':'Romanos',
      '1co':'1 Corintios','2co':'2 Corintios','ga':'Gálatas','gal':'Gálatas',
      'ef':'Efesios','efe':'Efesios','fil':'Filipenses','php':'Filipenses',
      'col':'Colosenses','1ts':'1 Tesalonicenses','2ts':'2 Tesalonicenses',
      '1ti':'1 Timoteo','2ti':'2 Timoteo','tit':'Tito','flm':'Filemón','filem':'Filemón',
      'he':'Hebreos','heb':'Hebreos','st':'Santiago','stg':'Santiago','sant':'Santiago',
      '1p':'1 Pedro','1pe':'1 Pedro','2p':'2 Pedro','2pe':'2 Pedro',
      '1jn':'1 Juan','2jn':'2 Juan','3jn':'3 Juan','jud':'Judas',
      'ap':'Apocalipsis','rev':'Apocalipsis'
    };
    const fullName = ABBREVS[q];
    if (fullName) return getBookByName(fullName);
    return getBookByName(q);
  }

  function getChapterData(bookName, chapter) {
    const data = window.SEFER_GET_BIBLE
      ? SEFER_GET_BIBLE(state.version)
      : window.BIBLE_DATA_RV1960;
    if (!data || !data.books) return null;
    const book = data.books.find(b => b.name === bookName);
    if (!book) return null;
    // La estructura: book[chapterNumber] = { verseNum: text, ... }
    const chData = book[chapter];
    if (!chData) return null;
    // Convertir a array ordenado
    const verses = [];
    const keys = Object.keys(chData).map(Number).sort((a,b) => a-b);
    keys.forEach(k => verses.push({ num: k, text: chData[k] }));
    return verses;
  }

  function getVerseData(bookName, chapter, verse) {
    const ch = getChapterData(bookName, chapter);
    if (!ch) return null;
    const v = ch.find(x => x.num === verse);
    return v ? v.text : null;
  }

  // ==================== INIT ====================
  function init() {
    buildBooksList();
    loadState();
    renderThemeSelector();
    renderBookList();
    bindEvents();
    initVersionDropdown();
    applyTheme(state.theme);
    updateToolbarIcons();
    if (state.version && VERSIONS[state.version]) {
      document.getElementById('versionLabel').textContent = VERSIONS[state.version].label;
      document.querySelectorAll('.version-option').forEach(o => {
        o.classList.toggle('active', o.dataset.version === state.version);
      });
    }
    showWelcome();
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem('sefer-state') || '{}');
      Object.assign(state, saved);
      if (saved.readBooks) state.readBooks = new Set(saved.readBooks);
      if (saved.selectedVerses) state.selectedVerses = new Set(saved.selectedVerses);
    } catch (e) { console.warn('State load error', e); }
  }

  function saveState() {
    try {
      const toSave = {
        ...state,
        readBooks: Array.from(state.readBooks),
        selectedVerses: Array.from(state.selectedVerses)
      };
      delete toSave.autoScrollTimer;
      delete toSave.countdownTimer;
      localStorage.setItem('sefer-state', JSON.stringify(toSave));
    } catch (e) { console.warn('State save error', e); }
  }

  // ==================== TEMAS ====================
  function renderThemeSelector() {
    const row = document.getElementById('themeRow');
    row.innerHTML = '';
    const batch = THEME_BATCHES[state.themeBatch];
    batch.forEach(t => {
      const btn = document.createElement('button');
      btn.className = 'theme-btn' + (state.theme === t.id ? ' active' : '');
      btn.title = t.name;
      btn.dataset.theme = t.id;
      btn.style.background = `linear-gradient(135deg, ${t.colors.join(', ')})`;
      if (['mexico','corea','ucrania'].includes(t.id)) {
        btn.innerHTML = `<span class="flag">${t.flag}</span>`;
      }
      btn.addEventListener('click', () => {
        state.theme = t.id;
        applyTheme(t.id);
        renderThemeSelector();
        updateToolbarIcons();
        saveState();
      });
      row.appendChild(btn);
    });
  }

  function applyTheme(theme) {
    document.body.dataset.theme = theme;
  }

  function updateToolbarIcons() {
    const isGlass = state.theme === 'glass';
    const icons = {
      'font-dec':    'A−',
      'font-inc':    'A+',
      'font-family': 'Aa',
      'highlight':   '✨',
      'meanings':    '📖',
      'notes':       '✏️',
      'favorites':   '❤️',
      'glossary':    '📑',
      'biographies': '👥',
      'apocrypha':   isGlass ? '📄' : '📜',
      'plan':        '📅',
      'youtube':     '▶️',
      'project':     '🖥️',
      'help':        'ℹ️'
    };
    document.querySelectorAll('.tool-btn').forEach(btn => {
      const action = btn.dataset.action;
      if (action === 'version') return; // no tocar el botón de versión
      if (icons[action]) {
        // Reemplazar solo el texto, preservar hijos (como .version-label)
        if (!btn.querySelector('.version-label')) {
          btn.textContent = icons[action];
        }
      }
    });

    // 🔀 Dado en Glass, 🎲 en los demás
    const diceBtn = document.getElementById('btn-dice');
    if (diceBtn) {
      diceBtn.textContent = isGlass ? '🔀' : '🎲';
      diceBtn.title = isGlass ? 'Versículo aleatorio (barajar)' : 'Versículo aleatorio';
    }

    // Botones de acción del dado en proyección
    const diceNextBtn = document.querySelector('.dice-action[data-action="next-random"]');
    if (diceNextBtn) {
      diceNextBtn.textContent = isGlass ? '🔀' : '🎲';
    }
  }

  // ==================== LISTA DE LIBROS ====================
  function renderBookList() {
    const atContainer = document.getElementById('atBooks');
    const ntContainer = document.getElementById('ntBooks');
    atContainer.innerHTML = '';
    ntContainer.innerHTML = '';

    BOOKS_FULL.forEach((book, idx) => {
      const item = document.createElement('div');
      item.className = 'book-item';
      item.dataset.bookName = book.name;
      item.dataset.bookIdx = idx;
      item.innerHTML = `
        <span class="book-name">${book.name}</span>
        <button class="info-btn" title="Ficha del libro">📚</button>
      `;
      item.addEventListener('click', (e) => {
        if (e.target.classList.contains('info-btn')) return;
        expandBook(book.name, item);
      });
      item.querySelector('.info-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        showBookInfo(book.name);
      });
      (book.testament === 'AT' ? atContainer : ntContainer).appendChild(item);
    });

    document.querySelectorAll('.testament-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const container = btn.nextElementSibling;
        container.classList.toggle('collapsed');
        btn.textContent = (container.classList.contains('collapsed') ? '▶ ' : '▼ ') +
                          btn.textContent.replace(/^[▼▶]\s*/, '');
      });
    });
  }

  function expandBook(bookName, itemEl) {
    const book = getBookByName(bookName);
    if (!book) return;

    document.querySelectorAll('.book-item').forEach(el => el.classList.remove('active'));
    itemEl.classList.add('active');

    document.querySelectorAll('.chapters-grid').forEach(el => el.remove());

    const grid = document.createElement('div');
    grid.className = 'chapters-grid fade-in';
    for (let i = 1; i <= book.chapters; i++) {
      const circle = document.createElement('div');
      circle.className = 'chapter-circle';
      circle.textContent = i;
      circle.addEventListener('click', () => loadChapter(bookName, i));
      grid.appendChild(circle);
    }
    itemEl.after(grid);
  }

  // ==================== CARGAR CAPÍTULO ====================
  function loadChapter(bookName, chapter) {
    const book = getBookByName(bookName);
    const verses = getChapterData(bookName, chapter);

    state.currentBook = bookName;
    state.currentChapter = chapter;
    state.selectedVerses.clear();
    state.checkboxesVisible = false;
    state.diceMode = false;

    document.querySelectorAll('.chapter-circle').forEach(el => el.classList.remove('active'));
    document.querySelectorAll('.chapter-circle').forEach(c => {
      if (parseInt(c.textContent) === chapter) c.classList.add('active');
    });

    document.getElementById('welcomeScreen').style.display = 'none';

    const testament = book.testament === 'AT' ? 'Antiguo Testamento' : 'Nuevo Testamento';
    const bookIdx = BOOKS_FULL.filter(b => b.testament === book.testament).findIndex(b => b.name === bookName) + 1;
    document.getElementById('chapterTestament').textContent = `${testament}: Libro ${bookIdx}`;
    document.getElementById('chapterBook').textContent = `[${bookName}:${chapter}]`;
    document.getElementById('chapterNumber').textContent = `Capítulo ${chapter}`;
    updateSelectionUI();

    const container = document.getElementById('versesContainer');
    container.innerHTML = '';

    if (!verses || verses.length === 0) {
      container.innerHTML = `
        <div class="fade-in" style="text-align:center; padding:40px; color:var(--text-muted); font-family:var(--font-body)">
          <p style="font-size:20px; margin-bottom:12px">📖</p>
          <p>Este capítulo no está disponible en la versión ${VERSIONS[state.version].name}.</p>
        </div>
      `;
      return;
    }

    verses.forEach((v, idx) => {
      const verseEl = document.createElement('div');
      verseEl.className = 'verse fade-in';
      verseEl.dataset.verse = v.num;
      verseEl.style.animationDelay = `${Math.min(idx * 20, 400)}ms`;

      const checkbox = document.createElement('div');
      checkbox.className = 'verse-checkbox';
      checkbox.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleVerseSelection(v.num);
      });

      const number = document.createElement('div');
      number.className = 'verse-number';
      number.textContent = v.num;

      const textEl = document.createElement('div');
      textEl.className = 'verse-text';
      textEl.innerHTML = wrapWords(v.text);

      verseEl.appendChild(checkbox);
      verseEl.appendChild(number);
      verseEl.appendChild(textEl);

      verseEl.addEventListener('click', (e) => {
        if (e.target.classList.contains('word')) return;
        showVerseActions(v.num);
      });

      container.appendChild(verseEl);
    });

    state.readBooks.add(bookName);
    saveState();
  }

  function wrapWords(text) {
    return text.split(/(\s+)/).map(part => {
      if (/^\s+$/.test(part)) return part;
      const clean = part.replace(/[.,;:!?()"«»¿¡]/g, '');
      const hasMeaning = typeof lookupWord === 'function' && lookupWord(clean) !== null;
      const cls = 'word' + (hasMeaning ? ' has-meaning' : '');
      return `<span class="${cls}" data-word="${clean}">${part}</span>`;
    }).join('');
  }

  function showVerseActions(verseNum) {
    if (!state.checkboxesVisible) {
      state.checkboxesVisible = true;
      document.querySelectorAll('.verse-checkbox').forEach(cb => cb.classList.add('visible'));
    }
    toggleVerseSelection(verseNum);
  }

  function toggleVerseSelection(verseNum) {
    const key = `${state.currentBook}:${state.currentChapter}:${verseNum}`;
    if (state.selectedVerses.has(key)) state.selectedVerses.delete(key);
    else state.selectedVerses.add(key);
    updateVerseUI(verseNum);
    updateSelectionUI();
    saveState();
  }

  function updateVerseUI(verseNum) {
    const key = `${state.currentBook}:${state.currentChapter}:${verseNum}`;
    const verseEl = document.querySelector(`.verse[data-verse="${verseNum}"]`);
    if (!verseEl) return;
    const cb = verseEl.querySelector('.verse-checkbox');
    if (state.selectedVerses.has(key)) {
      verseEl.classList.add('selected');
      cb.classList.add('checked');
    } else {
      verseEl.classList.remove('selected');
      cb.classList.remove('checked');
    }
    if (state.selectedVerses.size === 0) {
      state.checkboxesVisible = false;
      document.querySelectorAll('.verse-checkbox').forEach(c => c.classList.remove('visible'));
    }
  }

  function updateSelectionUI() {
    const right = document.getElementById('chapterHeaderRight');
    const count = document.getElementById('selectionCount');
    const clearGroup = document.getElementById('clearGroup');

    if (state.selectedVerses.size > 0) {
      right.style.display = 'flex';
      count.textContent = state.selectedVerses.size;
      clearGroup.classList.remove('hidden');
    } else {
      right.style.display = 'none';
      clearGroup.classList.add('hidden');
    }
  }

  // ==================== BÚSQUEDA ====================
  function bindSearch() {
    const input = document.getElementById('verseSearch');
    const placeholders = [
      'Buscador de versículos', 'Génesis 1:1', 'Juan 3:16',
      'Salmo 23:1-6', 'Apocalipsis 1:1', 'Eclesiastés 3:1'
    ];
    let phIdx = 0;
    setInterval(() => {
      if (document.activeElement !== input && !input.value) {
        phIdx = (phIdx + 1) % placeholders.length;
        input.placeholder = placeholders[phIdx];
      }
    }, 3000);

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        autocompleteBook(input);
      } else if (e.key === 'Enter') {
        parseAndLoad(input.value);
      }
    });

    input.addEventListener('input', () => {
      if (input.value.toLowerCase() === 'versionshistory') {
        showVersionsHistory();
        input.value = '';
      }
    });
  }

  function autocompleteBook(input) {
    const val = input.value.trim();
    if (!val) return;
    const match = BOOKS_FULL.find(b =>
      b.name.toLowerCase().startsWith(val.toLowerCase())
    );
    if (match) {
      input.value = match.name + ' ';
      input.focus();
    }
  }

  function parseAndLoad(query) {
    const q = query.trim();
    const match = q.match(/^(.+?)\s+(\d+)(?::(\d+(?:[-,]\s*\d+)*))?$/);
    if (!match) {
      alert('Formato no reconocido. Ejemplos:\n• Génesis 1:1\n• Juan 3:16\n• Salmo 23:1-6');
      return;
    }
    const [, bookName, chapterStr, versesStr] = match;
    const book = getBookByAbbrev(bookName);
    if (!book) { alert('Libro no encontrado: ' + bookName); return; }
    const chapter = parseInt(chapterStr);
    loadChapter(book.name, chapter);

    if (versesStr) {
      setTimeout(() => {
        const verses = parseVerses(versesStr);
        verses.forEach(v => {
          const key = `${book.name}:${chapter}:${v}`;
          state.selectedVerses.add(key);
          updateVerseUI(v);
        });
        state.checkboxesVisible = true;
        document.querySelectorAll('.verse-checkbox').forEach(cb => cb.classList.add('visible'));
        updateSelectionUI();
        saveState();
      }, 100);
    }
  }

  function parseVerses(str) {
    const verses = [];
    str.split(',').forEach(part => {
      part = part.trim();
      if (part.includes('-')) {
        const [a, b] = part.split('-').map(s => parseInt(s.trim()));
        for (let i = a; i <= b; i++) verses.push(i);
      } else {
        verses.push(parseInt(part));
      }
    });
    return verses;
  }

  // ==================== EVENTOS ====================
  function bindEvents() {
    document.getElementById('btn-dice').addEventListener('click', rollRandomVerse);

    document.querySelectorAll('.tool-btn').forEach(btn => {
      btn.addEventListener('click', () => handleToolAction(btn.dataset.action));
    });

    bindSearch();

    document.getElementById('themePlus').addEventListener('click', () => {
      state.themeBatch = (state.themeBatch + 1) % THEME_BATCHES.length;
      renderThemeSelector();
    });
    document.getElementById('themeMinus').addEventListener('click', () => {
      state.themeBatch = (state.themeBatch - 1 + THEME_BATCHES.length) % THEME_BATCHES.length;
      renderThemeSelector();
    });

    document.getElementById('btn-fullscreen').addEventListener('click', toggleFullscreen);

    document.getElementById('btn-reset-nav').addEventListener('click', () => {
      state.currentBook = null;
      state.currentChapter = null;
      state.selectedVerses.clear();
      document.getElementById('versesContainer').innerHTML = '';
      document.getElementById('welcomeScreen').style.display = 'flex';
      updateSelectionUI();
      saveState();
    });

    document.getElementById('btnClearMarks').addEventListener('click', clearAllMarks);
    document.querySelector('[data-action="clear-marks"]').addEventListener('click', clearAllMarks);

    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('modalOverlay').addEventListener('click', (e) => {
      if (e.target.id === 'modalOverlay') closeModal();
    });

    document.getElementById('versesContainer').addEventListener('dblclick', (e) => {
      if (e.target.classList.contains('word') && e.target.classList.contains('has-meaning')) {
        showWordMeaning(e.target.dataset.word);
      }
    });

    document.getElementById('ytLoad').addEventListener('click', loadYouTube);
    document.getElementById('ytClear').addEventListener('click', clearYouTube);
    document.getElementById('ytInput').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') loadYouTube();
    });

    document.querySelectorAll('.proj-btn').forEach(btn => {
      btn.addEventListener('click', () => handleProjectionAction(btn.dataset.proj));
    });
    document.querySelectorAll('.dice-action').forEach(btn => {
      btn.addEventListener('click', () => handleDiceAction(btn.dataset.action));
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (state.tourActive) endTour();
        else if (document.getElementById('projection').style.display !== 'none') closeProjection();
        else if (document.getElementById('modalOverlay').style.display !== 'none') closeModal();
      }
    });

    document.getElementById('btn-sync').addEventListener('click', () => {
      openModal(`
        <h2>Sincronización con Google Drive</h2>
        <p>Para habilitar la sincronización con Google Drive:</p>
        <ol style="margin-left:20px; line-height:2">
          <li>Configura las credenciales OAuth en Google Cloud Console</li>
          <li>Añade el client_id en <code>app.js</code></li>
          <li>Los datos sincronizados: notas, favoritos, tema, progreso del plan</li>
        </ol>
        <p style="margin-top:12px; color:var(--text-muted); font-size:13px">Por ahora, tus datos se guardan localmente en este navegador.</p>
      `);
    });

    document.getElementById('btn-profile').addEventListener('click', showProfile);
  }

  // ==================== TOOLBAR ACTIONS ====================
  function handleToolAction(action) {
    switch(action) {
      case 'version':
        // Lo maneja el dropdown
        break;
      case 'clear-marks':
        clearAllMarks();
        break;
      case 'font-dec':
        state.fontSize = Math.max(12, state.fontSize - 2);
        document.getElementById('versesContainer').style.fontSize = state.fontSize + 'px';
        saveState();
        break;
      case 'font-inc':
        state.fontSize = Math.min(36, state.fontSize + 2);
        document.getElementById('versesContainer').style.fontSize = state.fontSize + 'px';
        saveState();
        break;
      case 'font-family':
        const fonts = ['serif', 'sans', 'display'];
        const idx = fonts.indexOf(state.fontFamily);
        state.fontFamily = fonts[(idx + 1) % fonts.length];
        const container = document.getElementById('versesContainer');
        container.style.fontFamily = state.fontFamily === 'serif' ? 'var(--font-serif)' :
                                      state.fontFamily === 'sans' ? 'var(--font-body)' :
                                      'var(--font-display)';
        saveState();
        break;
      case 'highlight':
        state.highlightMode = !state.highlightMode;
        document.getElementById('versesContainer').classList.toggle('highlight-mode', state.highlightMode);
        saveState();
        break;
      case 'meanings': showMeaningsPanel(); break;
      case 'notes': showNotesPanel(); break;
      case 'favorites': showFavoritesPanel(); break;
      case 'glossary': showGlossary(); break;
      case 'biographies': showBiographies(); break;
      case 'apocrypha': showApocrypha(); break;
      case 'plan': showPlan(); break;
      case 'youtube': toggleYouTubePanel(); break;
      case 'project': openProjection(); break;
      case 'help': showHelp(); break;
    }
  }

  function clearAllMarks() {
    state.selectedVerses.clear();
    state.checkboxesVisible = false;
    document.querySelectorAll('.verse').forEach(v => {
      v.classList.remove('selected');
      const cb = v.querySelector('.verse-checkbox');
      if (cb) { cb.classList.remove('visible','checked'); }
    });
    updateSelectionUI();
    saveState();
  }

  // ==================== VERSION DROPDOWN ====================
  function initVersionDropdown() {
    const btn = document.getElementById('btnVersion');
    const dropdown = document.getElementById('versionDropdown');
    if (!btn || !dropdown) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle('open');
      btn.classList.toggle('open', isOpen);
    });

    dropdown.querySelectorAll('.version-option').forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        const ver = opt.dataset.version;
        const vObj = VERSIONS[ver];
        if (!vObj || !vObj.available) return;
        switchVersion(ver);
        dropdown.classList.remove('open');
        btn.classList.remove('open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!btn.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
        btn.classList.remove('open');
      }
    });
  }

  function switchVersion(ver) {
    state.version = ver;
    const vObj = VERSIONS[ver];
    document.getElementById('versionLabel').textContent = vObj.label;
    document.querySelectorAll('.version-option').forEach(o => {
      o.classList.toggle('active', o.dataset.version === ver);
    });
    if (state.currentBook && state.currentChapter) {
      loadChapter(state.currentBook, state.currentChapter);
    }
    saveState();
  }

  // ==================== VERSÍCULO ALEATORIO ====================
  function rollRandomVerse() {
    const data = window.SEFER_GET_BIBLE ? SEFER_GET_BIBLE(state.version) : window.BIBLE_DATA_RV1960;
    if (!data || !data.books) { alert('No hay datos bíblicos cargados.'); return; }

    const booksWithData = data.books.filter(b => {
      return Object.keys(b).some(k => !isNaN(parseInt(k)) && typeof b[k] === 'object');
    });
    if (booksWithData.length === 0) { alert('No hay versículos disponibles.'); return; }

    const book = booksWithData[Math.floor(Math.random() * booksWithData.length)];
    const chapters = Object.keys(book).filter(k => !isNaN(parseInt(k)));
    const chapter = chapters[Math.floor(Math.random() * chapters.length)];
    const verses = Object.keys(book[chapter]).map(Number).sort((a,b) => a-b);
    const verseNum = verses[Math.floor(Math.random() * verses.length)];
    const text = book[chapter][verseNum];

    state.diceMode = true;
    state.currentDiceVerse = { bookName: book.name, chapter: parseInt(chapter), verse: verseNum, text };

    openProjection();
    state.projectionMode = 'dice';
    state.projectionData = [{ ref: `${book.name} ${chapter}:${verseNum}`, text }];
    state.projectionIndex = 0;
    renderProjection();
    document.getElementById('projectionDiceActions').style.display = 'flex';
  }

  // ==================== PROYECCIÓN ====================
  function openProjection() {
    if (!state.currentBook && state.projectionMode !== 'dice') {
      alert('Primero selecciona un libro y capítulo.');
      return;
    }
    const proj = document.getElementById('projection');
    proj.style.display = 'flex';

    if (state.projectionMode !== 'dice') {
      if (state.selectedVerses.size === 0) {
        state.projectionMode = 'chapter';
        const verses = getChapterData(state.currentBook, state.currentChapter);
        if (!verses) return;
        state.projectionData = verses.map(v => ({
          ref: `${state.currentBook} ${state.currentChapter}:${v.num}`,
          text: v.text
        }));
      } else {
        state.projectionMode = 'selection';
        state.projectionData = [];
        state.selectedVerses.forEach(key => {
          const [bookName, ch, v] = key.split(':');
          const text = getVerseData(bookName, parseInt(ch), parseInt(v));
          if (text) state.projectionData.push({ ref: `${bookName} ${ch}:${v}`, text });
        });
      }
      state.projectionIndex = 0;
    }
    renderProjection();
  }

  function renderProjection() {
    const content = document.getElementById('projectionContent');
    const data = state.projectionData[state.projectionIndex];
    if (!data) return;
    content.innerHTML = `
      <div class="proj-ref">${data.ref}</div>
      <div class="proj-text">${data.text}</div>
    `;
    const isChapter = state.projectionMode === 'chapter';
    const prev = document.querySelector('[data-proj="prev"]');
    const next = document.querySelector('[data-proj="next"]');
    prev.style.display = isChapter ? 'none' : 'inline-flex';
    next.style.display = isChapter ? 'none' : 'inline-flex';
  }

  function handleProjectionAction(action) {
    switch(action) {
      case 'prev':
        if (state.projectionIndex > 0) {
          state.projectionIndex--;
          renderProjection();
        }
        break;
      case 'next':
        if (state.projectionIndex < state.projectionData.length - 1) {
          state.projectionIndex++;
          renderProjection();
        }
        break;
      case 'auto':
        toggleAutoScroll();
        break;
      case 'close':
        closeProjection();
        break;
    }
  }

  function toggleAutoScroll() {
    const btn = document.getElementById('btnAutoScroll');
    if (state.autoScroll) {
      state.autoScroll = false;
      btn.classList.remove('active');
      btn.textContent = '▶ Auto';
      clearInterval(state.autoScrollTimer);
      document.getElementById('projectionCountdown').style.display = 'none';
    } else {
      state.countdownValue = 10;
      const cd = document.getElementById('projectionCountdown');
      cd.style.display = 'block';
      document.getElementById('countdownText').textContent = state.countdownValue;
      state.countdownTimer = setInterval(() => {
        state.countdownValue--;
        document.getElementById('countdownText').textContent = state.countdownValue;
        if (state.countdownValue <= 0) {
          clearInterval(state.countdownTimer);
          startAutoScroll();
        }
      }, 1000);
    }
  }

  function startAutoScroll() {
    state.autoScroll = true;
    const btn = document.getElementById('btnAutoScroll');
    btn.classList.add('active');
    btn.textContent = `⏸ ${state.autoScrollSpeed.toFixed(2)}x`;
    document.getElementById('projectionCountdown').style.display = 'none';

    const content = document.getElementById('projectionContent');
    state.autoScrollTimer = setInterval(() => {
      if (content.scrollHeight > content.clientHeight) {
        content.scrollTop += state.autoScrollSpeed * content.clientHeight * 0.1;
        if (content.scrollTop + content.clientHeight >= content.scrollHeight - 2) {
          if (state.projectionIndex < state.projectionData.length - 1) {
            state.projectionIndex++;
            renderProjection();
            content.scrollTop = 0;
          } else {
            toggleAutoScroll();
          }
        }
      }
    }, 50);

    btn.onclick = () => {
      const speeds = [0.03, 0.05, 0.07, 0.09];
      const idx = speeds.indexOf(state.autoScrollSpeed);
      state.autoScrollSpeed = speeds[(idx + 1) % speeds.length];
      btn.textContent = `⏸ ${state.autoScrollSpeed.toFixed(2)}x`;
    };
  }

  function closeProjection() {
    document.getElementById('projection').style.display = 'none';
    state.autoScroll = false;
    clearInterval(state.autoScrollTimer);
    clearInterval(state.countdownTimer);
    document.getElementById('projectionDiceActions').style.display = 'none';
    document.getElementById('projectionCountdown').style.display = 'none';
  }

  function handleDiceAction(action) {
    switch(action) {
      case 'fav':
        if (state.currentDiceVerse) {
          const key = `${state.currentDiceVerse.bookName}:${state.currentDiceVerse.chapter}:${state.currentDiceVerse.verse}`;
          if (!state.favorites.includes(key)) {
            state.favorites.push(key);
            saveState();
            alert('❤️ Favorito guardado');
          }
        }
        break;
      case 'note':
        if (state.currentDiceVerse) {
          const key = `${state.currentDiceVerse.bookName}:${state.currentDiceVerse.chapter}:${state.currentDiceVerse.verse}`;
          const note = prompt(`Nota para ${state.currentDiceVerse.bookName} ${state.currentDiceVerse.chapter}:${state.currentDiceVerse.verse}:`, state.notes[key] || '');
          if (note !== null) {
            state.notes[key] = note;
            saveState();
          }
        }
        break;
      case 'next-random':
        rollRandomVerse();
        break;
    }
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => console.warn(e));
    } else {
      document.exitFullscreen();
    }
  }

  // ==================== MODALES ====================
  function openModal(html, large = false) {
    document.getElementById('modalContent').innerHTML = html;
    document.getElementById('modal').classList.toggle('large', large);
    document.getElementById('modalOverlay').style.display = 'flex';
  }
  function closeModal() {
    document.getElementById('modalOverlay').style.display = 'none';
  }

  function showBookInfo(bookName) {
    const info = typeof getBookInfo === 'function' ? getBookInfo(bookName) : null;
    const book = getBookByName(bookName);
    if (!info) {
      openModal(`<h2>${bookName}</h2><p>Información pendiente de completar.</p>`);
      return;
    }
    openModal(`
      <h2>${bookName}</h2>
      <div class="meta-row"><span class="meta-label">Autor:</span><span>${info.author || '—'}</span></div>
      <div class="meta-row"><span class="meta-label">Fecha:</span><span>${info.date || '—'}</span></div>
      <div class="meta-row"><span class="meta-label">Idioma original:</span><span>${info.originalLanguage || '—'}</span></div>
      <div class="meta-row"><span class="meta-label">Significado del nombre:</span><span>${info.nameMeaning || '—'}</span></div>
      <h3>Resumen</h3>
      <p>${info.summary || '—'}</p>
      ${info.themes && info.themes.length > 0 ? `<h3>Temas principales</h3><p>${info.themes.join(' · ')}</p>` : ''}
    `);
  }

  function showWordMeaning(word) {
    if (typeof lookupWord !== 'function') return;
    const entry = lookupWord(word);
    if (!entry) return;
    openModal(`
      <h2>${entry.term}</h2>
      <p>${entry.meaning}</p>
      ${entry.references && entry.references.length > 0 ? `<h3>Referencias</h3><p>${entry.references.join(' · ')}</p>` : ''}
    `);
  }

  function showMeaningsPanel() {
    if (!state.currentBook) { alert('Selecciona un capítulo primero'); return; }
    const words = new Set();
    document.querySelectorAll('.word.has-meaning').forEach(w => words.add(w.dataset.word));
    const list = Array.from(words).map(w => {
      const e = lookupWord(w);
      return `<div style="margin-bottom:12px"><strong style="color:var(--accent)">${e.term}</strong><br><span style="font-size:13px">${e.meaning}</span></div>`;
    }).join('');
    openModal(`<h2>Significados del capítulo</h2>${list || '<p>No hay términos con significado en este capítulo.</p>'}`, true);
  }

  function showNotesPanel() {
    const notes = Object.entries(state.notes);
    const list = notes.length === 0
      ? '<p>Aún no tienes notas. Haz clic en un versículo y escribe una nota.</p>'
      : notes.map(([k, v]) => `<div style="margin-bottom:12px"><strong>${k}</strong><br>${v}</div>`).join('');
    openModal(`<h2>Mis notas</h2>${list}`, true);
  }

  function showFavoritesPanel() {
    const list = state.favorites.length === 0
      ? '<p>Aún no tienes favoritos.</p>'
      : state.favorites.map(k => {
          const [bookName, ch, v] = k.split(':');
          const text = getVerseData(bookName, parseInt(ch), parseInt(v));
          return `<div style="margin-bottom:12px"><strong>${bookName} ${ch}:${v}</strong><br>${text || ''}</div>`;
        }).join('');
    openModal(`<h2>Mis favoritos</h2>${list}`, true);
  }

  function showGlossary() {
    const html = `
      <h2>Glosario RV1960</h2>
      <input type="text" id="glossarySearch" placeholder="Buscar término..." style="width:100%; padding:10px; border:1px solid var(--border); border-radius:8px; margin-bottom:16px; background:var(--surface); color:var(--text)"/>
      <div id="glossaryResults"></div>
    `;
    openModal(html, true);
    const input = document.getElementById('glossarySearch');
    const results = document.getElementById('glossaryResults');
    const render = (q) => {
      const items = typeof searchDictionary === 'function' ? searchDictionary(q) : [];
      results.innerHTML = items.length === 0
        ? '<p>Sin resultados.</p>'
        : items.map(e => `<div style="margin-bottom:12px"><strong style="color:var(--accent)">${e.term}</strong><br><span style="font-size:13px">${e.meaning}</span></div>`).join('');
    };
    render('');
    input.addEventListener('input', () => render(input.value));
    input.focus();
  }

  function showBiographies() {
    const at = ['Abraham','Moisés','David','Daniel','Isaías','Jeremías','Ester','Rut','Job','José','Josué','Samuel','Elías','Eliseo','Jonás'];
    const nt = ['Jesús','María','Pedro','Juan','Pablo','María Magdalena','Esteban','Bernabé','Timoteo','Lucas','Mateo','Santiago','Andrés','Felipe','Tomás'];
    const html = `
      <h2>Biografías bíblicas</h2>
      <div style="display:flex; gap:24px">
        <div style="flex:1">
          <h3>Antiguo Testamento</h3>
          ${at.map(n => `<button class="bio-btn" data-name="${n}" style="display:block; padding:6px 0; text-align:left; color:var(--text); cursor:pointer; background:none; border:none; border-bottom:1px solid var(--border); width:100%">${n}</button>`).join('')}
        </div>
        <div style="flex:1">
          <h3>Nuevo Testamento</h3>
          ${nt.map(n => `<button class="bio-btn" data-name="${n}" style="display:block; padding:6px 0; text-align:left; color:var(--text); cursor:pointer; background:none; border:none; border-bottom:1px solid var(--border); width:100%">${n}</button>`).join('')}
        </div>
      </div>
    `;
    openModal(html, true);
    document.querySelectorAll('.bio-btn').forEach(btn => {
      btn.addEventListener('click', () => showBiography(btn.dataset.name));
    });
  }

  function showBiography(name) {
    const bios = {
      'Abraham': 'Padre de la fe. Llamado por Dios desde Ur de los Caldeos. Recibió la promesa de ser padre de muchas naciones.',
      'Moisés': 'Libertador de Israel. Recibió la Ley en el Sinaí.',
      'David': 'Pastor, músico, guerrero y rey. Autor de muchos Salmos. Antepasado del Mesías.',
      'Daniel': 'Profeta en Babilonia. Fiel a Dios en tierra pagana. Sobrevivió al foso de los leones.',
      'Jesús': 'Hijo de Dios, el Mesías prometido. Nació de la virgen María. Murió en la cruz y resucitó.',
      'Pablo': 'Perseguidor convertido en apóstol. Misionero de los gentiles. Escribió 13 epístolas.',
      'Pedro': 'Pescador, uno de los 12. Predicó en Pentecostés. Líder de la iglesia primitiva.'
    };
    const text = bios[name] || `Información detallada de ${name} pendiente de completar.`;
    openModal(`<h2>${name}</h2><p>${text}</p><button onclick="document.getElementById('modalOverlay').style.display='none'" style="margin-top:16px; padding:8px 16px; background:var(--accent); color:white; border-radius:6px">← Atrás</button>`);
  }

  function showApocrypha() {
    openModal(`
      <h2>Libros Apócrifos</h2>
      <p><strong>¿Qué son?</strong> Libros escritos entre el AT y el NT (período intertestamentario) o textos no incluidos en el canon protestante.</p>
      <h3>¿Por qué no están en la Biblia protestante?</h3>
      <p>El canon protestante sigue el canon hebreo de 39 libros del AT. Los apócrifos (Tobías, Judit, 1-2 Macabeos, Sabiduría, Eclesiástico, Baruc) fueron incluidos en la Septuaginta y la Vulgata, pero Lutero los separó por no considerarlos inspirados.</p>
      <h3>Valor histórico</h3>
      <p>Aportan contexto histórico y cultural del período intertestamentario, pero no se consideran inspirados para doctrina.</p>
      <p style="margin-top:16px; color:var(--text-muted); font-size:13px">SEFER no incluye el texto completo de estos libros, solo información de contexto.</p>
    `, true);
  }

  function showPlan() {
    const orders = ['canónico','inverso','paralelo','cronológico'];
    const modes = ['fecha-fija','desde-hoy'];
    const html = `
      <h2>Plan de lectura — 1 año</h2>
      <div style="display:flex; gap:12px; margin-bottom:16px">
        <select id="planOrder" style="padding:8px; border:1px solid var(--border); border-radius:6px; background:var(--surface); color:var(--text)">
          ${orders.map(o => `<option value="${o}">${o.charAt(0).toUpperCase()+o.slice(1)}</option>`).join('')}
        </select>
        <select id="planMode" style="padding:8px; border:1px solid var(--border); border-radius:6px; background:var(--surface); color:var(--text)">
          <option value="fecha-fija">1 ene – 31 dic</option>
          <option value="desde-hoy">Desde hoy (365 días)</option>
        </select>
      </div>
      <div id="planContent" style="height:60vh; overflow-y:auto; border:1px solid var(--border); border-radius:8px; padding:12px"></div>
    `;
    openModal(html, true);
    const render = () => {
      const order = document.getElementById('planOrder').value;
      const mode = document.getElementById('planMode').value;
      const plan = generatePlan(order, mode);
      const today = new Date();
      const todayKey = today.toISOString().slice(0,10);
      document.getElementById('planContent').innerHTML = plan.map((p, i) => `
        <div style="padding:8px; border-bottom:1px solid var(--border); display:flex; justify-content:space-between; ${p.date === todayKey ? 'background:var(--verse-selected); font-weight:600' : ''}">
          <span>Día ${i+1} · ${p.date}</span>
          <span>${p.reading}</span>
        </div>
      `).join('');
    };
    render();
    document.getElementById('planOrder').addEventListener('change', render);
    document.getElementById('planMode').addEventListener('change', render);
  }

  function generatePlan(order, mode) {
    const plan = [];
    const start = mode === 'fecha-fija' ? new Date(new Date().getFullYear(), 0, 1) : new Date();
    const totalChapters = BOOKS_FULL.reduce((s,b) => s + b.chapters, 0);
    const perDay = Math.ceil(totalChapters / 365);

    let books = order === 'canónico' ? [...BOOKS_FULL] :
                order === 'inverso' ? [...BOOKS_FULL].reverse() :
                order === 'paralelo' ? interleaveATNT() :
                [...BOOKS_FULL];

    let day = 0;
    let bookIdx = 0;
    let chapterIdx = 1;
    while (day < 365) {
      const readings = [];
      let count = 0;
      while (count < perDay && bookIdx < books.length) {
        const b = books[bookIdx];
        readings.push(`${b.name} ${chapterIdx}`);
        count++;
        if (chapterIdx >= b.chapters) { bookIdx++; chapterIdx = 1; }
        else chapterIdx++;
      }
      const d = new Date(start);
      d.setDate(d.getDate() + day);
      plan.push({ date: d.toISOString().slice(0,10), reading: readings.join(' · ') });
      day++;
    }
    return plan;
  }

  function interleaveATNT() {
    const at = BOOKS_FULL.filter(b => b.testament === 'AT');
    const nt = BOOKS_FULL.filter(b => b.testament === 'NT');
    const result = [];
    const max = Math.max(at.length, nt.length);
    for (let i = 0; i < max; i++) {
      if (at[i]) result.push(at[i]);
      if (nt[i]) result.push(nt[i]);
    }
    return result;
  }

  function toggleYouTubePanel() {
    const panel = document.getElementById('youtubePanel');
    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
  }

  function loadYouTube() {
    const input = document.getElementById('ytInput');
    const url = input.value.trim();
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (!match) { alert('Link inválido'); return; }
    document.getElementById('ytFrame').innerHTML = `<iframe src="https://www.youtube.com/embed/${match[1]}" allowfullscreen></iframe>`;
  }

  function clearYouTube() {
    document.getElementById('ytInput').value = '';
    document.getElementById('ytFrame').innerHTML = '';
  }

  function showVersionsHistory() {
    openModal(`
      <h2>Historial de versiones</h2>
      <ul style="margin-left:20px; line-height:2">
        <li><strong>2024-11-15</strong> — Lanzamiento inicial</li>
        <li><strong>2024-12-01</strong> — Añadidos 10 temas, tema Glass</li>
        <li><strong>2024-12-10</strong> — Proyección con auto-scroll</li>
        <li><strong>2025-01-05</strong> — Plan de lectura 1 año</li>
        <li><strong>2025-01-20</strong> — Glosario RV1960</li>
        <li><strong>2025-02-01</strong> — Sincronización con Google Drive</li>
        <li><strong>2025-09-10</strong> — Toolbar reorganizada, RV1909, ✨ Resaltar, 🧹 Limpiar</li>
      </ul>
    `);
  }

  function showWelcome() {
    if (!state.currentBook) {
      document.getElementById('welcomeScreen').style.display = 'flex';
    }
  }

  function showHelp() {
    startTour();
  }

  // ==================== TOUR (23 pasos actualizados) ====================
  const TOUR_STEPS = [
    { target: '.brand', text: '¡Bienvenido a SEFER! ספר significa "libro" en hebreo. Te guiaré por la app en 23 pasos sencillos.' },
    { target: '.sidebar-nav', text: 'Aquí tienes accesos rápidos: tu perfil, sincronización en la nube, pantalla completa y reiniciar navegación.' },
    { target: '.theme-selector', text: 'Cambia el aspecto con 10 temas. Todos tienen las mismas medidas; solo cambia la apariencia. Usa + y − para ver más.' },
    { target: '.dice-btn', text: 'Toca el dado (🎲 o 🔀 en Glass) y recibe un versículo aleatorio para meditar.' },
    { target: '.search-box', text: 'Busca cualquier versículo. Ejemplos: "Juan 3:16" o "Salmo 23:1-6". Pulsa Tab para autocompletar el libro.' },
    { target: '.testament-group[data-testament="AT"]', text: 'Los 39 libros del Antiguo Testamento. Toca uno para ver sus capítulos.' },
    { target: '.testament-group[data-testament="NT"]', text: 'Y los 27 libros del Nuevo Testamento.' },
    { target: '.book-item', text: 'Cada libro tiene un botón 📚 con información: autor, fecha, significado del nombre y resumen.' },
    { target: '.tool-group-left', text: 'A la izquierda, el botón de TRADUCCIÓN. Tócalo para cambiar entre RV1960, RV1909 y más.' },
    { target: '#clearGroup', text: 'Cuando marques versículos, aparece aquí "🧹 Limpiar" para quitar todas las marcas de golpe.' },
    { target: '[data-group="texto"]', text: 'Controles de texto: A− A+ para tamaño, Aa para tipografía, y ✨ para Resaltar.' },
    { target: '[data-action="highlight"]', text: '✨ Resaltar destaca visualmente los versículos. Ideal para marcar pasajes importantes.' },
    { target: '[data-group="estudio"]', text: 'Herramientas de estudio: 📖 Significados, ✏️ Notas y ❤️ Favoritos.' },
    { target: '[data-group="consulta"]', text: 'Consulta: 📑 Glosario de términos difíciles, 👥 Biografías y 📜 Apócrifos.' },
    { target: '[data-group="herramientas"]', text: 'Herramientas: 📅 Plan anual, ▶️ YouTube, 🖥️ Proyectar y ℹ️ Ayuda (siempre al final).' },
    { target: '.chapter-header', text: 'Este encabezado muestra el libro y capítulo actual. Siempre está fijo al hacer scroll.' },
    { target: '.verses-container', text: 'Aquí se muestran los versículos. Un clic marca; doble clic en una palabra con significado abre su definición.' },
    { target: '.verse', text: 'Al marcar un versículo aparecen casillas en todos. Puedes seleccionar varios para proyectarlos juntos.' },
    { target: '.word.has-meaning', text: 'Las palabras subrayadas tienen significado en el glosario. ¡Doble clic para verlo!' },
    { target: '[data-action="project"]', text: '🖥️ Proyectar abre el texto en pantalla grande para el culto. Incluye auto-scroll con cuenta regresiva.' },
    { target: '.dice-btn', text: 'El dado 🎲 (o 🔀 en Glass) abre un versículo aleatorio. Desde ahí puedes guardarlo ❤️ o anotar 📝.' },
    { target: '.sidebar', text: 'El tema Glass tiene estilo de cristal líquido. Los capítulos son círculos y el dado cambia a 🔀.' },
    { target: '.brand', text: '¡Eso es todo! SEFER está listo para acompañarte. Presiona ℹ️ Ayuda cuando quieras volver a ver este tour.' }
  ];

  function startTour() {
    state.tourActive = true;
    state.tourStep = 0;
    document.getElementById('tourOverlay').style.display = 'block';
    document.getElementById('clearGroup').classList.remove('hidden');
    setTimeout(() => {
      if (state.selectedVerses.size === 0) {
        document.getElementById('clearGroup').classList.add('hidden');
      }
      showTourStep();
    }, 400);
  }

  function showTourStep() {
    const step = TOUR_STEPS[state.tourStep];
    if (!step) { endTour(); return; }
    const target = document.querySelector(step.target);
    if (!target) { nextTourStep(); return; }
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      const rect = target.getBoundingClientRect();
      const spotlight = document.getElementById('tourSpotlight');
      spotlight.style.top = (rect.top - 4) + 'px';
      spotlight.style.left = (rect.left - 4) + 'px';
      spotlight.style.width = (rect.width + 8) + 'px';
      spotlight.style.height = (rect.height + 8) + 'px';
      document.getElementById('tourText').textContent = step.text;
      document.getElementById('tourProgress').textContent = `${state.tourStep + 1}/${TOUR_STEPS.length}`;
      const tooltip = document.getElementById('tourTooltip');
      tooltip.style.top = Math.min(rect.bottom + 12, window.innerHeight - 180) + 'px';
      tooltip.style.left = Math.max(16, Math.min(rect.left, window.innerWidth - 380)) + 'px';
    }, 300);
  }

  function nextTourStep() {
    state.tourStep++;
    if (state.tourStep >= TOUR_STEPS.length) endTour();
    else showTourStep();
  }
  function prevTourStep() {
    if (state.tourStep > 0) { state.tourStep--; showTourStep(); }
  }
  function endTour() {
    state.tourActive = false;
    document.getElementById('tourOverlay').style.display = 'none';
  }

  document.addEventListener('click', (e) => {
    if (e.target.id === 'tourNext') nextTourStep();
    if (e.target.id === 'tourPrev') prevTourStep();
    if (e.target.id === 'tourSkip') endTour();
  });

  // ==================== PROFILE ====================
  function showProfile() {
    const readCount = state.readBooks.size;
    const totalBooks = BOOKS_FULL.length;
    const pct = Math.round((readCount / totalBooks) * 100);
    openModal(`
      <h2>Mi perfil</h2>
      <div style="text-align:center; margin:20px 0">
        <div style="font-size:48px">👤</div>
        <p style="color:var(--text-muted)">Usuario local</p>
      </div>
      <h3>Progreso</h3>
      <div style="background:var(--surface-2); border-radius:8px; padding:12px; margin:8px 0">
        <div style="display:flex; justify-content:space-between; margin-bottom:6px">
          <span>Libros leídos</span>
          <strong>${readCount} / ${totalBooks}</strong>
        </div>
        <div style="height:8px; background:var(--border); border-radius:4px; overflow:hidden">
          <div style="height:100%; width:${pct}%; background:var(--accent); transition:width .3s"></div>
        </div>
      </div>
      <h3>Logros</h3>
      <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(120px, 1fr)); gap:8px; margin-top:8px">
        ${generateAchievements()}
      </div>
    `);
  }

  function generateAchievements() {
    const achievements = [
      { name: 'En el principio', req: () => state.readBooks.has('Génesis'), icon: '🌍' },
      { name: 'Salterista', req: () => state.readBooks.has('Salmos'), icon: '🎵' },
      { name: 'Evangelista', req: () => ['Mateo','Marcos','Lucas','Juan'].every(b => state.readBooks.has(b)), icon: '✝️' },
      { name: 'Revelado', req: () => state.readBooks.has('Apocalipsis'), icon: '🔥' },
      { name: 'Ley de Moisés', req: () => ['Génesis','Éxodo','Levítico','Números','Deuteronomio'].every(b => state.readBooks.has(b)), icon: '📜' },
      { name: 'Discípulo de Pablo', req: () => ['Romanos','1 Corintios','2 Corintios','Gálatas','Efesios','Filipenses','Colosenses'].every(b => state.readBooks.has(b)), icon: '✉️' }
    ];
    return achievements.map(a => `
      <div style="padding:12px; background:var(--surface-2); border-radius:8px; text-align:center; ${a.req() ? '' : 'opacity:.4'}">
        <div style="font-size:28px">${a.icon}</div>
        <div style="font-size:11px; margin-top:4px">${a.name}</div>
      </div>
    `).join('');
  }

  // ==================== INICIO ====================
  document.addEventListener('DOMContentLoaded', init);
})();