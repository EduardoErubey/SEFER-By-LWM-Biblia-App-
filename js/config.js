/* SEFER module: config.js — script clásico (sin import/export) */

/* --- SEFER config.js lines 1-35 --- */


/* → movido a data/ (ver script src) */



/* =========================================================
   DATOS
   BIBLE_DATA y BOOK_ORDER se cargan desde bible-data.js
   (debe estar en la misma carpeta que este archivo).
   ========================================================= */
let BIBLE = window.BIBLE_DATA || window.BIBLE || {};
try{ window.BIBLE = BIBLE; if(window.BIBLE_DATA) BIBLE = window.BIBLE_DATA; window.BIBLE = BIBLE; }catch(e){}
const BOOK_ORDER = window.BOOK_ORDER || [];
const BOOK_INFO = window.BOOK_INFO || { introduccion_testamentos: [], libros: [] };
if(!window.BIBLE_DATA || !BOOK_ORDER.length){
  console.error('[SEFER] No se cargó bible-data.js. Revisa la consola de red (F12 → Network).');
}

/* DOM refs tempranos (evita TDZ / ReferenceError) */
const reader = document.getElementById('reader');
const currentRef = document.getElementById('current-ref');
const selectionInfo = document.getElementById('selection-info');
const clearSelBtn = document.getElementById('clear-selection-btn');
const side = document.getElementById('side');
const stage = document.getElementById('stage');
const bookList = document.getElementById('book-list');

const BOOK_INFO_MAP = {};
(BOOK_INFO.libros || []).forEach(b => { BOOK_INFO_MAP[b.libro] = b; });
const TESTAMENT_INFO = {};
(BOOK_INFO.introduccion_testamentos || []).forEach(t => {
  if(t.seccion && t.seccion.indexOf('Antiguo') >= 0) TESTAMENT_INFO.AT = t;
  if(t.seccion && t.seccion.indexOf('Nuevo') >= 0) TESTAMENT_INFO.NT = t;
});

