/* SEFER module: help.js — script clásico (sin import/export) */

function openSeferHelp(){
  infoNavEnabled = false;
  const nav = document.getElementById('im-nav');
  if(nav) nav.style.display = 'none';
  const title = document.getElementById('im-title');
  if(title) title.textContent = 'Ayuda de SEFER';
  const sub = document.getElementById('im-sub');
  if(sub) sub.textContent = 'Life Word Mission · Playa del Carmen';

  const glassThemes = ['amoled','lwm-night','mexico','ucrania','corea'];
  const isGlass = (typeof currentTheme !== 'undefined' && glassThemes.indexOf(currentTheme) >= 0);
  const ic = {
    destacar: '✨ Destacar',
    sig: isGlass ? '📑 Significados' : '📚 Significados',
    notas: isGlass ? '✏️ Notas' : '📝 Notas',
    fav: '❤️ Favoritos',
    glos: '📖 Glosario',
    bio: isGlass ? '👥 Biografía' : '👤 Biografía',
    apo: isGlass ? '📄 Apócrifos' : '📜 Apócrifos',
    plan: '📅 Plan 1 año',
    yt: '▶️ YouTube',
    proj: isGlass ? '🖥️ Proyectar' : '🎬 Proyectar',
    help: isGlass ? 'ℹ️ Ayuda' : '❓ Ayuda',
    tourBtn: isGlass ? '✨ Iniciar tour interactivo' : '🎯 Iniciar tour interactivo'
  };

  const body = document.getElementById('im-body');
  if(!body) return;

  body.innerHTML = `
    <button type="button" class="btn primary tour-start-btn" id="start-sefer-tour-btn">${ic.tourBtn}</button>

    <div class="im-block"><div class="im-label">Mapa de SEFER (nombres de zonas)</div>
    <div class="im-text">
    • <strong>Branding</strong> — SEFER ספר y BY LWM PDC<br>
    • <strong>Acciones</strong> — perfil, nube, pantalla completa, reiniciar<br>
    • <strong>Temas</strong> — chips de color y botón de lotes ＋/−<br>
    • <strong>Dado</strong> — versículo al azar<br>
    • <strong>Buscador de versículos</strong> — referencias (Juan 3:16)<br>
    • <strong>Biblia</strong> — lista de libros y capítulos<br>
    • <strong>Toolkit</strong> — barra superior de herramientas<br>
    • <strong>Lector</strong> — zona donde se leen los versículos<br>
    • <strong>Panel de estudio</strong> — notas, favoritos y significados<br>
    • <strong>Proyección</strong> — pantalla grande para el culto<br>
    • <strong>Menú de proyección</strong> — opciones 1 / 2 / 3<br>
    • <strong>Reproductor</strong> — YouTube en la barra izquierda<br>
    • <strong>Spotlight</strong> — buscador de palabras (flotante)
    </div></div>

    <div class="im-block"><div class="im-label">1. Bienvenida</div>
    <div class="im-text">
    <strong>SEFER</strong> (ספר = libro) sirve para <strong>leer</strong>, <strong>estudiar</strong> y <strong>proyectar</strong> la Biblia.<br><br>
    Texto predeterminado: <strong>Reina-Valera 1960</strong>.<br>
    También puedes usar: <strong>RV1909, RV2015, NVI, NTV y TLA</strong>.<br><br>
    Si es tu primera vez, pulsa <strong>Iniciar tour</strong>.
    </div></div>

    <div class="im-block"><div class="im-label">2. Primeros pasos</div>
    <div class="im-text">
    <strong>En la Biblia (lista izquierda)</strong><br>
    Elige Antiguo o Nuevo Testamento → libro → número de capítulo.<br><br>
    <strong>Buscador de versículos</strong><br>
    Ejemplos:<br>
    • <em>Juan 3:16</em><br>
    • <em>Génesis 1:1-3,5-6</em><br>
    • Dos o tres pasajes (proyección): <em>Juan 3:16 | Romanos 8:28</em><br>
    • También con barra: <em>Juan 3:16 / Salmos 23:1</em><br>
    Máximo <strong>3 libros</strong> distintos. <strong>Tab</strong> completa el nombre del libro.<br><br>
    <strong>Spotlight (buscar palabra)</strong><br>
    Escribe letras en el teclado (fuera de un campo de texto) y se abre el buscador de palabras.<br>
    Encuentra versículos que contienen esa palabra. Clic en un resultado para ir ahí.
    </div></div>

    <div class="im-block"><div class="im-label">3. Toolkit y Lector</div>
    <div class="im-text">
    • <strong>Traducción</strong> (ej. <strong>RV1960</strong>): cambia la versión del texto.<br>
    • <strong>A− / A+</strong> y <strong>Aa</strong>: tamaño y tipografía.<br>
    • <strong>${ic.destacar}</strong>: nombres, lugares y palabras de Jesús.<br>
    • <strong>${ic.sig}</strong> · <strong>${ic.notas}</strong> · <strong>${ic.fav}</strong> → Panel de estudio.<br>
    • <strong>${ic.glos}</strong> · <strong>${ic.bio}</strong> · <strong>${ic.apo}</strong><br>
    • <strong>${ic.plan}</strong> · <strong>${ic.yt}</strong> · <strong>${ic.proj}</strong> · <strong>${ic.help}</strong><br><br>
    En el <strong>Lector</strong>: un clic en un versículo (favorito/nota/casilla).<br>
    Doble clic en una palabra: significado.<br>
    Casillas + <strong>📋 Copiar</strong> en la última marcada.
    </div></div>

    <div class="im-block"><div class="im-label">4. Proyección</div>
    <div class="im-text">
    Abre el <strong>Menú de proyección</strong> (botón Proyectar).<br>
    Con el menú abierto: teclas <strong>1</strong>, <strong>2</strong> o <strong>3</strong> según las opciones visibles.<br>
    <strong>Esc</strong> cierra menús y la proyección.<br>
    <strong>Comparar</strong>: un clic activa la segunda traducción en paralelo; el segundo clic la desactiva.<br><br>
    <strong>🖍️ Resaltar</strong> (solo dentro de Proyección):<br>
    1) Activa 🖍️<br>
    2) Selecciona el texto<br>
    3) Se subraya y se apaga el botón<br>
    Para quitar: activa 🖍️ y selecciona otra vez lo marcado.<br>
    No sustituye a los favoritos ❤️.
    </div></div>

    <div class="im-block"><div class="im-label">5. Atajos (todos con Ctrl)</div>
    <div class="im-text">
    <table class="help-shortcuts" style="width:100%;border-collapse:collapse;font-size:13px;">
      <thead><tr><th style="text-align:left;padding:4px 6px;border-bottom:1px solid var(--line);">Atajo</th><th style="text-align:left;padding:4px 6px;border-bottom:1px solid var(--line);">Acción</th></tr></thead>
      <tbody>
      <tr><td style="padding:3px 6px;"><strong>Ctrl+T</strong></td><td style="padding:3px 6px;">Tema siguiente</td></tr>
      <tr><td style="padding:3px 6px;"><strong>Ctrl+Shift+V</strong></td><td style="padding:3px 6px;">Buscador de versículos</td></tr>
      <tr><td style="padding:3px 6px;"><strong>Ctrl+Shift+T</strong></td><td style="padding:3px 6px;">Menú de traducción</td></tr>
      <tr><td style="padding:3px 6px;"><strong>Ctrl+Shift+F</strong></td><td style="padding:3px 6px;">Pantalla completa</td></tr>
      <tr><td style="padding:3px 6px;"><strong>Ctrl+− / Ctrl++</strong></td><td style="padding:3px 6px;">Tamaño del texto</td></tr>
      <tr><td style="padding:3px 6px;"><strong>Ctrl+D</strong></td><td style="padding:3px 6px;">Destacar</td></tr>
      <tr><td style="padding:3px 6px;"><strong>Ctrl+S</strong></td><td style="padding:3px 6px;">Significados</td></tr>
      <tr><td style="padding:3px 6px;"><strong>Ctrl+N</strong></td><td style="padding:3px 6px;">Notas</td></tr>
      <tr><td style="padding:3px 6px;"><strong>Ctrl+F</strong></td><td style="padding:3px 6px;">Favoritos</td></tr>
      <tr><td style="padding:3px 6px;"><strong>Ctrl+G</strong></td><td style="padding:3px 6px;">Glosario</td></tr>
      <tr><td style="padding:3px 6px;"><strong>Ctrl+B</strong></td><td style="padding:3px 6px;">Biografía</td></tr>
      <tr><td style="padding:3px 6px;"><strong>Ctrl+A</strong></td><td style="padding:3px 6px;">Apócrifos</td></tr>
      <tr><td style="padding:3px 6px;"><strong>Ctrl+P</strong></td><td style="padding:3px 6px;">Plan 1 año</td></tr>
      <tr><td style="padding:3px 6px;"><strong>Ctrl+Y</strong></td><td style="padding:3px 6px;">YouTube</td></tr>
      <tr><td style="padding:3px 6px;"><strong>Ctrl+H</strong></td><td style="padding:3px 6px;">Ayuda</td></tr>
      <tr><td style="padding:3px 6px;"><strong>Ctrl+Enter</strong></td><td style="padding:3px 6px;">Proyectar</td></tr>
      <tr><td style="padding:3px 6px;"><strong>Tab</strong></td><td style="padding:3px 6px;">Completar libro en el buscador</td></tr>
      <tr><td style="padding:3px 6px;"><strong>Esc</strong></td><td style="padding:3px 6px;">Cerrar paneles / proyección / tour</td></tr>
      </tbody>
    </table>
    </div></div>
  `;

  const modal = document.getElementById('info-modal');
  if(modal) modal.classList.add('open');
  try{ if(typeof focusInfoScroll === 'function') focusInfoScroll(); }catch(e){}
  document.getElementById('start-sefer-tour-btn')?.addEventListener('click', ()=>{
    try{ if(typeof startSeferTour === 'function') startSeferTour(); }catch(e){}
  });
}

const helpBtn = document.getElementById('help-btn');
if(helpBtn) helpBtn.onclick = openSeferHelp;
