/* SEFER module: meanings.js — script clásico (sin import/export) */

/* --- SEFER meanings.js lines 2638-2808 --- */
/* =========================================================
   DICCIONARIO BÍBLICO DEL PREDICADOR
   Definiciones orientadas al sentido bíblico/teológico (RV1960),
   no a un diccionario general de nombres propios.
   ========================================================= */

/* → movido a data/ (ver script src) */


/** Diccionario general en español (API pública) */
async function fetchSpanishDictionary(word){
  const forms = [];
  const base = String(word||'').trim();
  if(!base) return null;
  forms.push(base);
  // probar lemas generados
  dictLookupKeys(base).forEach(k=>{
    if(k.length > 2) forms.push(k);
  });
  const tried = new Set();
  for(const form of forms){
    const q = form.toLowerCase();
    if(tried.has(q)) continue;
    tried.add(q);
    try{
      const url = 'https://api.dictionaryapi.dev/api/v2/entries/es/' + encodeURIComponent(q);
      const r = await fetch(url);
      if(!r.ok) continue;
      const data = await r.json();
      if(!Array.isArray(data) || !data[0]) continue;
      const entry = data[0];
      const meanings = entry.meanings || [];
      const parts = [];
      meanings.slice(0, 3).forEach(m=>{
        const defs = (m.definitions||[]).slice(0, 2).map(d=>d.definition).filter(Boolean);
        if(defs.length){
          const pos = m.partOfSpeech ? '('+m.partOfSpeech+') ' : '';
          parts.push(pos + defs.join(' · '));
        }
      });
      if(parts.length){
        return { text: parts.join(' | '), source: 'Diccionario (ES)' };
      }
    }catch(e){}
  }
  return null;
}

const wordPopup = document.getElementById('word-popup');
wordPopup.querySelector('.wp-close').onclick = ()=> wordPopup.classList.remove('open');

/** Busca resumen bíblico en Wikipedia ES (prioriza páginas con sentido religioso) */
async function fetchBiblicalWiki(word){
  const base = word.trim();
  const candidates = [
    base,
    base + ' (Biblia)',
    base + ' (personaje bíblico)',
    base + ' (pueblo)',
    'Israelitas', // fallback no usado genérico
  ];
  // Solo candidatos derivados de la palabra
  const titles = [
    base,
    `${base} (Biblia)`,
    `${base} (personaje bíblico)`,
    `${base} (Antiguo Testamento)`,
    `${base} (Nuevo Testamento)`,
  ];
  for(const title of titles){
    try{
      const url = `https://es.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
      const r = await fetch(url);
      if(!r.ok) continue;
      const data = await r.json();
      if(data.type === 'standard' && data.extract){
        let text = data.extract.trim();
        if(text.length > 500) text = text.slice(0,500) + '…';
        return { text, source: 'Wikipedia (contexto bíblico/histórico)' };
      }
    }catch(e){ /* siguiente candidato */ }
  }
  return null;
}

function openWordPopupAt(word, x, y, def, source){
  const termEl = wordPopup.querySelector('.wp-term');
  const defEl = wordPopup.querySelector('.wp-def');
  const srcEl = wordPopup.querySelector('.wp-source');
  const saveBtn = document.getElementById('wp-save-btn');
  termEl.textContent = word;
  defEl.textContent = def || '';
  srcEl.textContent = source || '';
  const left = Math.min(Math.max(x, 10), window.innerWidth - 320);
  const top = Math.min(Math.max(y + 14, 10), window.innerHeight - 220);
  wordPopup.style.left = left + 'px';
  wordPopup.style.top = top + 'px';
  wordPopup.classList.add('open');

  const key = (word||'').toLowerCase().trim();
  const markSaved = ()=>{
    if(!saveBtn) return;
    if(savedMeanings[key] || savedMeanings[word]){
      saveBtn.textContent = '✓ Guardado';
      saveBtn.classList.add('saved');
    } else {
      saveBtn.textContent = '💾 Guardar';
      saveBtn.classList.remove('saved');
    }
  };
  if(saveBtn){
    saveBtn.onclick = ()=>{
      const d = defEl.textContent || '';
      if(!d) return;
      savedMeanings[key] = { term: word, def: d, source: srcEl.textContent || '' };
      saveMeaningsStore();
      markSaved();
    };
  }
  markSaved();
}

function showWordPopup(word, x, y){
  if(!word || !String(word).trim()) return;
  const key = (word||'').toLowerCase().trim();

  // Guardado local → mostrar
  if(savedMeanings[key] || savedMeanings[word]){
    const sm = savedMeanings[key] || savedMeanings[word];
    openWordPopupAt(word, x, y, sm.def, sm.source || 'Guardado localmente');
    return;
  }

  // Diccionario local → mostrar
  const hit = lookupBiblical(word);
  if(hit){
    openWordPopupAt(word, x, y, hit.def, hit.source || 'Diccionario bíblico de SEFER');
    return;
  }

  // Sin entrada local: buscar en silencio; solo abrir ventana si hay resultado
  const reqId = (showWordPopup._req = (showWordPopup._req||0) + 1);
  (async ()=>{
    try{
      const dict = await fetchSpanishDictionary(word);
      if(reqId !== showWordPopup._req) return;
      if(dict){
        openWordPopupAt(word, x, y, dict.text, 'Fuente: ' + dict.source);
        return;
      }
      const res = await fetchBiblicalWiki(word);
      if(reqId !== showWordPopup._req) return;
      if(res){
        openWordPopupAt(word, x, y, res.text, 'Fuente: ' + res.source);
        return;
      }
      // Sin significado: no mostrar ventana
    }catch(e){
      // Sin significado usable: no mostrar ventana
    }
  })();
}

// Significado: solo con doble clic en una palabra (no con un clic ni con selección simple)

document.addEventListener('mousedown', (e)=>{
  if(wordPopup.classList.contains('open') && !wordPopup.contains(e.target)){
    wordPopup.classList.remove('open');
  }
});



/* Doble clic: sin menú nativo Edge/Chrome */
(function wireWordDblClickGuard(){
  function handler(e){
    try{ e.preventDefault(); }catch(_e){}
    const t = e.target;
    if(!t || !t.classList) return;
    if(!(t.classList.contains('w') || t.classList.contains('word'))) return;
    try{ e.stopPropagation(); }catch(_e){}
    try{ window.getSelection && window.getSelection().removeAllRanges(); }catch(_e){}
    if(typeof showWordPopup === 'function'){
      showWordPopup(t.textContent, e.clientX, e.clientY);
    }
  }
  function bind(){
    const roots = [document.getElementById('reader-verses'), document.getElementById('reader')].filter(Boolean);
    roots.forEach(root=>{
      root.addEventListener('dblclick', handler, true);
      root.addEventListener('contextmenu', function(e){
        const t = e.target;
        if(t && t.classList && (t.classList.contains('w') || t.classList.contains('word'))){
          e.preventDefault();
        }
      }, true);
    });
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind);
  else bind();
})();


/* SEFER dblclick capture v2 — bloquea menú Edge/Chrome */
document.addEventListener('dblclick', function(e){
  const t = e.target;
  if(!t || !t.closest) return;
  const root = t.closest('#reader, #reader-verses');
  if(!root) return;
  if(!(t.classList && (t.classList.contains('w') || t.classList.contains('word')))) return;
  e.preventDefault();
  e.stopImmediatePropagation();
  try{ window.getSelection && window.getSelection().removeAllRanges(); }catch(_e){}
  if(typeof showWordPopup === 'function'){
    showWordPopup(t.textContent, e.clientX, e.clientY);
  }
}, true);
document.addEventListener('contextmenu', function(e){
  const t = e.target;
  if(t && t.classList && (t.classList.contains('w') || t.classList.contains('word'))){
    if(t.closest && t.closest('#reader, #reader-verses')) e.preventDefault();
  }
}, true);
