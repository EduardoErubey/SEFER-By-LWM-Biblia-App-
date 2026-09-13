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
    perfil: isGlass ? '👤' : '🏆',
    nube: '☁️',
    full: '⛶',
    reset: '↺',
    dado: '🎲',
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

  const glassNote = isGlass
    ? `<div class="im-block"><div class="im-label">Apariencia Glass (activa)</div>
       <div class="im-text">
       Estás en un tema <strong>Glass</strong>: transparencias, desenfoque y capítulos en <strong>círculo</strong>.<br>
       Cada tema Glass guarda su color (Day, Night, México, Ucrania, Corea).<br>
       Los iconos de la barra pueden verse un poco distintos; la función es la misma.
       </div></div>`
    : `<div class="im-block"><div class="im-label">Temas Glass</div>
       <div class="im-text">
       Con el botón <strong>＋</strong> (arriba de los temas) abres el segundo grupo:<br>
       Day Glass, Night Glass, Mex Glass, Ukr Glass y Kor Glass.<br>
       Ahí verás efecto cristal y capítulos redondos, cada uno con su color.
       </div></div>`;

  const body = document.getElementById('im-body');
  if(!body) return;

  body.innerHTML = `
    <button type="button" class="btn primary tour-start-btn" id="start-sefer-tour-btn">${ic.tourBtn}</button>

    <div class="im-block"><div class="im-label">1. Bienvenida</div>
    <div class="im-text">
    <strong>SEFER</strong> (ספר = libro) es tu Biblia digital para <strong>leer</strong>, <strong>estudiar</strong> y <strong>proyectar</strong>.<br><br>
    Creada para <strong>Life Word Mission · Playa del Carmen</strong>.<br><br>
    Texto predeterminado: <strong>Reina-Valera 1960</strong>.<br>
    También puedes usar: RV1909, RVA2015, NVI, NTV y TLA.<br><br>
    Si es tu primera vez, pulsa el botón de arriba: <strong>Iniciar tour</strong>.<br>
    Es un paseo corto por cada parte de la pantalla.
    </div></div>

    <div class="im-block"><div class="im-label">2. Primeros pasos</div>
    <div class="im-text">
    <strong>Abrir un libro</strong><br>
    1. En la izquierda elige Antiguo o Nuevo Testamento.<br>
    2. Toca el nombre del libro.<br>
    3. Toca el número del capítulo.<br>
    Los versículos aparecen a la derecha.<br><br>

    <strong>Buscar un versículo</strong><br>
    En el buscador escribe por ejemplo:<br>
    <em>Juan 3:16</em><br><br>
    Más opciones:<br>
    • Rango: <em>Génesis 1:1-5</em><br>
    • Lista: <em>Génesis 1:1,3,6</em><br>
    • Rangos y listas: <em>Génesis 1:1-3,5-6</em><br>
    • Dos pasajes (proyección arriba y abajo):<br>
    &nbsp;&nbsp;<em>Juan 3:16 | Romanos 8:28</em><br><br>
    <strong>Tab</strong> completa el nombre del libro.<br>
    La <strong>✕</strong> borra la búsqueda de un toque.<br>
    El <strong>${ic.dado}</strong> abre un versículo al azar.
    </div></div>

    <div class="im-block"><div class="im-label">3. Barra lateral (izquierda)</div>
    <div class="im-text">
    • Lista de libros y capítulos.<br>
    • Botones de perfil, nube (sincronizar), pantalla completa y reiniciar (según tu versión).<br>
    • <strong>Temas</strong>: dos grupos de 5.<br>
    &nbsp;&nbsp;— Clásicos: Life Word Mission (predeterminado), Edén, Sándalo, Reino, Arena.<br>
    &nbsp;&nbsp;— Glass: Day Glass, Night Glass, Mex Glass, Ukr Glass, Kor Glass.<br>
    • El botón <strong>＋ / −</strong> (arriba de los temas) cambia de grupo.<br>
    • Buscador de referencias debajo de los temas.
    </div></div>

    ${glassNote}

    <div class="im-block"><div class="im-label">4. Área de lectura</div>
    <div class="im-text">
    • Un clic en un versículo: opciones (favorito, nota) y casilla de selección.<br>
    • Con casillas marcadas, en la <strong>última</strong> aparece <strong>📋 Copiar</strong>:<br>
    &nbsp;&nbsp;un versículo → <em>Libro Cap:V "texto"</em>; varios seguidos → <em>Libro Cap:inicio-fin</em> y cada texto.<br>
    • No se arrastra texto para copiar: usa las casillas y Copiar.<br>

    • Marca la casilla para elegir varios versículos (aparecen casillas en todos).<br>
    • Desmarca todas para ocultar las casillas otra vez.<br>
    • <strong>Doble clic</strong> en una palabra: significado (si está en el diccionario).<br>
    • <strong>Supr</strong> sobre un favorito: quita el favorito.<br>
    • Arriba queda fijo el nombre del libro y las indicaciones de uso.
    </div></div>

    <div class="im-block"><div class="im-label">5. Barra superior (toolkit)</div>
    <div class="im-text">
    De izquierda a derecha (resumen):<br><br>
    • <strong>Traducción</strong> (ej. RV60): cambia la versión del texto.<br>
    • <strong>A− / A+</strong>: tamaño de letra.<br>
    • <strong>Aa</strong> (fuentes): tipografías modernas de fácil lectura.<br>
    • <strong>${ic.destacar}</strong>: marca nombres, lugares y palabras de Jesús.<br>
    &nbsp;&nbsp;No colorea el versículo entero.<br>
    • <strong>${ic.sig}</strong> · <strong>${ic.notas}</strong> · <strong>${ic.fav}</strong><br>
    • <strong>${ic.glos}</strong> · <strong>${ic.bio}</strong> · <strong>${ic.apo}</strong><br>
    • <strong>${ic.plan}</strong> · <strong>${ic.yt}</strong> · <strong>${ic.proj}</strong><br>
    • <strong>${ic.help}</strong>: este panel (siempre al final).
    </div></div>

    <div class="im-block"><div class="im-label">6. Proyección</div>
    <div class="im-text">
    Ideal para el culto o la clase.<br><br>
    Puedes proyectar:<br>
    • El versículo actual.<br>
    • Varios versículos marcados con casilla.<br>
    • El capítulo completo.<br><br>
    Dentro de la proyección:<br>
    • Flechas o teclas para avanzar versículo a versículo.<br>
    • Auto-desplazamiento con cuenta regresiva y velocidades lentas.<br>
    • <strong>⇄ Comparar</strong>: otra traducción a la izquierda y derecha<br>
    &nbsp;&nbsp;(no en capítulo completo ni en búsqueda con dos libros).<br>
    • <strong>🖍️ Resaltar</strong>: subraya un trozo de texto solo en ese versículo.<br>
    &nbsp;&nbsp;1) Activa 🖍️ &nbsp;2) Selecciona el texto &nbsp;3) Se subraya y se apaga el botón.<br>
    &nbsp;&nbsp;Para quitar: activa 🖍️ y selecciona otra vez lo marcado.<br>
    &nbsp;&nbsp;No reemplaza a los favoritos ❤️.<br>
    • <strong>Esc</strong> cierra la proyección (sin salir de pantalla completa del sistema).
    </div></div>

    <div class="im-block"><div class="im-label">7. Estudio extra</div>
    <div class="im-text">
    • <strong>${ic.glos}</strong>: palabras difíciles y términos bíblicos.<br>
    • <strong>${ic.bio}</strong>: personas de la Biblia (lista; indica AT o NT).<br>
    • <strong>${ic.apo}</strong>: datos y curiosidades de libros apócrifos (sin el texto completo).<br>
    • <strong>${ic.plan}</strong>: lectura en 1 año (orden canónico, inverso, paralelo o cronológico;<br>
    &nbsp;&nbsp;desde el 1 de enero o empezando hoy).<br>
    • <strong>${ic.yt}</strong>: pega un enlace de YouTube para ver un sermón en la barra izquierda.<br>
    &nbsp;&nbsp;Solo ocupa espacio cuando hay un vídeo cargado. La ✕ lo cierra.
    </div></div>

    <div class="im-block"><div class="im-label">8. Cuenta, nube y logros</div>
    <div class="im-text">
    Si vinculas tu cuenta de Google (cuando está disponible):<br>
    • Puedes sincronizar notas, favoritos y preferencias.<br>
    • Ver perfil y progreso de logros (por ejemplo, al usar Destacar o proyectar).<br>
    La nube ☁️ guarda o recupera tus datos según la configuración activa.
    </div></div>

    <div class="im-block"><div class="im-label">9. Atajos de teclado</div>
    <div class="im-text">
    <strong>Con Ctrl</strong><br>
    • <strong>Ctrl+T</strong> — tema siguiente<br>
    • <strong>Ctrl+Shift+V</strong> — buscador de versículos<br>
    • <strong>Ctrl+Shift+T</strong> — menú de traducción<br>
    • <strong>Ctrl+Shift+F</strong> — pantalla completa<br>
    • <strong>Ctrl+−</strong> / <strong>Ctrl++</strong> — tamaño del texto<br>
    • <strong>Ctrl+D</strong> — Destacar<br>
    • <strong>Ctrl+G</strong> — Glosario<br>
    • <strong>Ctrl+Enter</strong> — Proyectar<br>
    • <strong>Ctrl+H</strong> — Ayuda<br><br>

    <strong>Letras (sin Ctrl)</strong><br>
    • <strong>S</strong> Significados · <strong>N</strong> Notas · <strong>F</strong> Favoritos<br>
    • <strong>B</strong> Biografía · <strong>A</strong> Apócrifos · <strong>P</strong> Plan · <strong>Y</strong> YouTube<br><br>

    <strong>Otros</strong><br>
    • <strong>Tab</strong> — completa el nombre del libro en el buscador<br>
    • <strong>Esc</strong> — cierra paneles, proyección o el tour<br>
    • <strong>← →</strong> en proyección — versículo anterior / siguiente<br>
    • <strong>Supr</strong> — quita favorito del versículo actual
    </div></div>

    <div class="im-block"><div class="im-label">10. Consejos rápidos</div>
    <div class="im-text">
    • Empieza por el <strong>tour</strong> si la pantalla se ve llena de botones.<br>
    • Usa <strong>Tab</strong> en el buscador: ahorra escribir nombres largos.<br>
    • <strong>Destacar</strong> ayuda a leer; <strong>Resaltar</strong> solo sirve dentro de proyección.<br>
    • Las casillas de versículos no mueven el texto: solo aparecen o se ocultan.<br>
    • Night Glass es un tema oscuro: si algo se ve blanco, recarga con Ctrl+Shift+R tras actualizar.
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
