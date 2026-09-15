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
    proj: isGlass ? '🖥️ Proyectar' : '🎬 Proyectar',
    help: isGlass ? 'ℹ️ Ayuda' : '❓ Ayuda',
    tourBtn: isGlass ? '✨ Iniciar tour interactivo' : '🎯 Iniciar tour interactivo'
  };
  const ytSvg = '<svg class="yt-logo" viewBox="0 0 28 20" width="16" height="12" aria-hidden="true" style="vertical-align:-1px;margin-right:3px"><rect width="28" height="20" rx="4" fill="#FF0000"/><path d="M11 5.5v9l7.5-4.5L11 5.5z" fill="#fff"/></svg>';

  const body = document.getElementById('im-body');
  if(!body) return;

  body.innerHTML = `
    <button type="button" class="btn primary tour-start-btn" id="start-sefer-tour-btn">${ic.tourBtn}</button>

    <div class="im-block"><div class="im-label">1. Bienvenida + tour</div>
    <div class="im-text">
    <strong>SEFER</strong> (ספר = libro) es tu herramienta para <strong>leer</strong>, <strong>estudiar</strong> y <strong>proyectar</strong> la Biblia.<br><br>
    Texto predeterminado: <strong>Reina-Valera 1960</strong>. También: RV1909, RV2015, NVI, NTV y TLA.<br><br>
    Si es tu primera vez, pulsa <strong>Iniciar tour interactivo</strong> para conocer las zonas de la app.
    </div></div>

    <div class="im-block"><div class="im-label">2. Mapa de SEFER</div>
    <div class="im-text">
    • <strong>SEFER</strong> — marca y título<br>
    • <strong>Barra de acciones</strong> — perfil, nube, pantalla completa, reiniciar<br>
    • <strong>Cabecera principal</strong> — SEFER + firma + acciones<br>
    • <strong>Lotes de temas</strong> — ＋/− y los cinco temas del lote<br>
    • <strong>Aleatorio</strong> — dado (versículo al azar)<br>
    • <strong>Buscador de versículos</strong> — referencias (ej. Juan 3:16)<br>
    • <strong>Biblia</strong> — lista de libros y capítulos<br>
    • <strong>Reproductor</strong> — YouTube bajo la Biblia (si hay enlace)<br>
    • <strong>Toolkit</strong> — barra superior de herramientas<br>
    • <strong>Cabecera del lector</strong> — libro, capítulo e indicaciones<br>
    • <strong>Lector</strong> — texto de los versículos<br>
    • <strong>Panel de estudio</strong> — significados, notas y favoritos<br>
    • <strong>Menú de proyección</strong> — opciones al proyectar<br>
    • <strong>Proyección</strong> — pantalla grande<br>
    • <strong>Spotlight</strong> — búsqueda de palabras<br>
    • <strong>Ayuda</strong> · <strong>Tour</strong> · <strong>Historial de versiones</strong>
    </div></div>

    <div class="im-block"><div class="im-label">3. Primeros pasos</div>
    <div class="im-text">
    <strong>En la Biblia (lista izquierda)</strong><br>
    Elige Antiguo o Nuevo Testamento → libro → número de capítulo.<br><br>
    <strong>Buscador de versículos</strong><br>
    • <em>Juan 3:16</em><br>
    • <em>Génesis 1:1-3,5-6</em><br>
    • Dos o tres pasajes: <em>Juan 3:16 | Romanos 8:28</em> (también con /)<br>
    Máximo <strong>3 libros</strong>. <strong>Tab</strong> completa el nombre del libro.<br><br>
    <strong>Spotlight</strong><br>
    Escribe fuera de un campo de texto para buscar palabras en toda la Biblia.
    </div></div>

    <div class="im-block"><div class="im-label">4. Toolkit y Lector</div>
    <div class="im-text">
    <strong>Toolkit — cada botón</strong><br>
    • <strong>A− / A+</strong> — reduce o aumenta el tamaño del texto del Lector<br>
    • <strong>Aa</strong> — cambia la tipografía de lectura<br>
    • <strong>RV1960</strong> (u otra sigla) — abre el menú de traducción y cambia la versión del texto<br>
    • <strong>${ic.destacar}</strong> — resalta nombres, lugares y palabras de Jesús<br>
    • <strong>${ic.plan}</strong> — plan de lectura de la Biblia en un año<br>
    • <strong>${ic.sig}</strong> — abre el <strong>Panel de estudio</strong> con significados guardados<br>
    • <strong>${ic.notas}</strong> — Panel de estudio de notas por versículo<br>
    • <strong>${ic.fav}</strong> — Panel de estudio de versículos favoritos<br>
    • <strong>${ic.glos}</strong> — consulta de términos bíblicos<br>
    • <strong>${ic.bio}</strong> — biografías de personas de la Biblia<br>
    • <strong>${ic.apo}</strong> — información sobre libros apócrifos<br>
    • <strong>${ytSvg}YouTube</strong> — pega un sermón; el reproductor aparece junto a la Biblia<br>
    • <strong>${ic.proj}</strong> — abre el menú de proyección<br>
    • <strong>${ic.help}</strong> — este manual y el tour<br><br>
    <strong>Lector</strong><br>
    • Un clic en un versículo: favorito, nota o casilla<br>
    • Casillas: en la <strong>última marcada</strong> aparecen Favorito, Nota y <strong>📋 Copiar</strong><br>
    • Doble clic en una palabra: significado (WORD POPUP)
    </div></div>

    <div class="im-block"><div class="im-label">5. Proyección</div>
    <div class="im-text">
    Abre el <strong>Menú de proyección</strong> (botón Proyectar).<br>
    Con el menú abierto: teclas <strong>1</strong>, <strong>2</strong> o <strong>3</strong> según las opciones.<br>
    <strong>Esc</strong> cierra menús y la proyección.<br>
    <strong>Comparar</strong>: 1.er clic activa la segunda traducción en paralelo; 2.º clic la desactiva.<br><br>
    <strong>🖍️ Resaltar</strong> (solo en Proyección):<br>
    1) Activa 🖍️ &nbsp; 2) Selecciona el texto &nbsp; 3) Se subraya y se apaga el botón.<br>
    Para quitar: activa 🖍️ y selecciona otra vez lo marcado. No sustituye a los favoritos ❤️.
    </div></div>

    <div class="im-block"><div class="im-label">6. Atajos</div>
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
