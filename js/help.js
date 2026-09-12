/* SEFER module: help.js — script clásico (sin import/export) */

/* --- SEFER help.js lines 3192-3321 --- */
function openSeferHelp(){
  infoNavEnabled = false;
  document.getElementById('im-nav').style.display = 'none';
  document.getElementById('im-title').textContent = 'Instrucciones de SEFER';
  document.getElementById('im-sub').textContent = 'BY LIFE WORD MISSION · Reina-Valera 1960';
  const isGlass = (typeof currentTheme !== 'undefined' && currentTheme === 'amoled');
  // Iconos según tema activo (Glass = estilo Apple)
  const ic = isGlass ? {
    perfil:'👤', nube:'☁️', full:'⛶', reset:'↺', dado:'✨',
    detalle:'🔎 Detalle', sig:'📑 Significados', notas:'✏️ Notas', fav:'❤️ Favoritos',
    glos:'📖 Glosario', bio:'👥 Biografía', apo:'📄 Apócrifos',
    plan:'📅 Plan 1 año', proj:'🖥️ Proyectar', help:'ℹ️ Ayuda',
    tourBtn:'✨ Iniciar tour interactivo'
  } : {
    perfil:'🏆', nube:'☁️', full:'⛶', reset:'↺', dado:'🎲',
    detalle:'✨ Destacar', sig:'📚 Significados', notas:'📝 Notas', fav:'❤️ Favoritos',
    glos:'📖 Glosario', bio:'👤 Biografía', apo:'📜 Apócrifos',
    plan:'📅 Plan 1 año', proj:'🎬 Proyectar', help:'❓ Ayuda',
    tourBtn:'🎯 Iniciar tour interactivo'
  };
  const glassBlock = isGlass ? `
    
    <div class="im-block"><div class="im-label">📘 Manual SEFER (fácil)</div>
    <div class="im-text">
    SEFER es tu Biblia digital para <strong>leer</strong>, <strong>estudiar</strong> y <strong>proyectar</strong> en la iglesia o en casa.<br><br>

    <strong>1. Abrir un libro</strong><br>
    En la barra de la izquierda elige Antiguo o Nuevo Testamento.<br>
    Toca un libro y luego el número del capítulo.<br><br>

    <strong>2. Buscar un versículo</strong><br>
    En el buscador escribe, por ejemplo:<br>
    <em>Juan 3:16</em><br>
    También puedes usar rangos y listas:<br>
    <em>Génesis 1:1-3,5-6</em><br>
    Dos pasajes a la vez (proyección arriba y abajo):<br>
    <em>Juan 3:16 | Romanos 8:28</em><br>
    <strong>Tab</strong> completa el nombre del libro.<br>
    La <strong>✕</strong> borra la búsqueda de un toque.<br><br>

    <strong>3. Temas de apariencia</strong><br>
    Hay dos grupos de 5 temas:<br>
    • <em>Clásicos:</em> Life Word Mission (predeterminado), Edén, Sándalo, Reino, Arena<br>
    • <em>Glass:</em> Day Glass, Night Glass, Mex Glass, Ukr Glass, Kor Glass<br>
    El botón <strong>＋ / −</strong> (arriba de los temas) cambia de grupo.<br><br>

    <strong>4. ✨ Destacar</strong><br>
    Marca solos nombres, lugares y palabras de Jesús para leer más fácil.<br>
    No pinta de color el versículo entero.<br><br>

    <strong>5. 🖍️ Resaltar (solo en proyección)</strong><br>
    1) Pulsa 🖍️<br>
    2) Selecciona el texto<br>
    3) Se subraya solo en ese versículo<br>
    Para quitar: activa 🖍️ y selecciona otra vez lo marcado.<br>
    No sustituye a los favoritos (❤️).<br><br>

    <strong>6. Proyectar</strong><br>
    Ideal para el culto. Puedes proyectar un versículo, varios o el capítulo.<br>
    En proyección: comparar traducciones, auto-desplazamiento y 🖍️ Resaltar.<br><br>

    <strong>7. Tour guiado</strong><br>
    Desde este mismo panel de Ayuda puedes iniciar el tour.<br>
    Es un paseo corto por cada parte de SEFER.
    </div></div>


    <div class="im-block"><div class="im-label">Tema Glass (activo ahora)</div>
    <div class="im-text">Si eliges un tema del grupo <strong>Glass</strong>, verás transparencias, desenfoque y capítulos en círculo, cada uno con su propia paleta de color (por ejemplo Mex Glass usa los colores de la bandera).
    <br>• Capítulos en <strong>círculos</strong> de vidrio.
    <br>• Toolkit en <strong>grupos redondeados</strong> (Texto, Estudio, Consulta, Herramientas).
    <br>• Iconos estilo Apple en la barra y en la navegación:
    <br>&nbsp;&nbsp;${ic.perfil} Perfil · ${ic.nube} Nube · ${ic.full} Pantalla completa · ${ic.reset} Reiniciar · ${ic.dado} Versículo al azar
    <br>&nbsp;&nbsp;${ic.detalle} · ${ic.sig} · ${ic.notas} · ${ic.fav}
    <br>&nbsp;&nbsp;${ic.glos} · ${ic.bio} · ${ic.apo}
    <br>&nbsp;&nbsp;${ic.plan} · YouTube · ${ic.proj} · ${ic.help}
    <br>Al cambiar a otro tema, los iconos vuelven al estilo general de SEFER.</div></div>` : `
    <div class="im-block"><div class="im-label">Tema Glass</div>
    <div class="im-text">En el segundo lote de temas (botón <strong>+</strong>) está <strong>🫧 Glass</strong>: liquid glass tipo macOS, capítulos en círculo, toolkit agrupada e <strong>iconos estilo Apple</strong> (ℹ️ ✏️ 📑 🖥️…). Actívalo para ver esa apariencia; la ayuda se adapta a los iconos del tema en uso.</div></div>`;

  document.getElementById('im-body').innerHTML = `
    <button type="button" class="btn primary tour-start-btn" id="start-sefer-tour-btn">${ic.tourBtn}</button>

    <div class="im-block"><div class="im-label">¿Qué es SEFER?</div>
    <div class="im-text">Biblia de estudio y proyección. Versión predeterminada: <strong>Reina-Valera 1960</strong>. También: RV1909, RVA2015, NVI, NTV y TLA (selector en la barra lateral) de <strong>Life Word Mission Playa del Carmen</strong>. Lee, anota, marca favoritos, consulta significados, sigue un plan de un año y proyecta versículos en pantalla grande.</div></div>

    <div class="im-block"><div class="im-label">Tour guiado (23 pasos)</div>
    <div class="im-text">Pulsa <strong>Iniciar tour interactivo</strong> para un recorrido completo de toda la interfaz. Lenguaje sencillo. <strong>Esc</strong> sale · <strong>Enter</strong> o → avanza · ← retrocede.</div></div>

    ${glassBlock}

    <div class="im-block"><div class="im-label">Barra lateral izquierda</div>
    <div class="im-text">• <strong>SEFER ספר / BY LWM PDC</strong>: marca de la app.<br>
    • <strong>${ic.perfil} Perfil</strong>: logros e insignias. <strong>${ic.nube} Nube</strong>: sincronizar con Google. <strong>${ic.full}</strong> pantalla completa. <strong>${ic.reset}</strong> reiniciar navegación.<br>
    • <strong>Temas</strong>: 10 paletas (México, Corea, Ucrania, Day, Night, Reino, Edén, Arena, Sándalo, Glass). Solo 5 visibles; <strong>+</strong> / <strong>−</strong> cambian el lote.<br>
    • <strong>${ic.dado}</strong>: versículo al azar${isGlass ? ' (en Glass el icono es ✨)' : ' en modo proyectar'}.<br>
    • <strong>Buscador de versículos</strong>: <code>Juan 3:16</code>, rangos (<code>1:1-5</code>) o varios (<code>1:1,3,6</code>). <strong>Tab</strong> completa el nombre del libro.<br>
    • <strong>Libros</strong>: Antiguo y Nuevo Testamento. 📚 ficha del libro (autor, fecha, idioma original, resumen).${isGlass ? ' En Glass los números de capítulo son <strong>círculos</strong>.' : ''}<br>
    • <strong>Scrollbar</strong> personalizada (▲ track ▼) con colores del tema.</div></div>

    <div class="im-block"><div class="im-label">Área de lectura</div>
    <div class="im-text">• Encabezado fijo: libro, capítulo e instrucciones de uso.<br>
    • A la <strong>derecha</strong> del encabezado aparecen «Has marcado…» y <strong>Quitar marcas</strong> cuando hay casillas marcadas.<br>
    • <strong>Un clic</strong> en un versículo: favorito, nota y casilla de selección.<br>
    • <strong>Doble clic</strong> en una palabra: significado (solo si existe en el diccionario).<br>
    • Las casillas no mueven el texto: solo se muestran u ocultan.</div></div>

    <div class="im-block"><div class="im-label">Barra superior (toolkit)</div>
    <div class="im-text">Agrupada en bloques${isGlass ? ' (cápsulas de vidrio más visibles en Glass)' : ''}:<br>
    • <strong>Texto</strong>: A− A+ · Aa tipografías · ${ic.detalle} (nombres, lugares, palabras de Jesús).<br>
    • <strong>Estudio</strong>: ${ic.sig} · ${ic.notas} · ${ic.fav}.<br>
    • <strong>Consulta</strong>: ${ic.glos} · ${ic.bio} · ${ic.apo}.<br>
    • <strong>Herramientas</strong>: ${ic.plan} · YouTube · ${ic.proj} · ${ic.help}.</div></div>

    <div class="im-block"><div class="im-label">Plan de lectura en 1 año</div>
    <div class="im-text">Órdenes: canónico (AT→NT), inverso (NT→AT), paralelo o cronológico. Inicio: 1 de enero o desde hoy (365 días). Marca lo leído. Ventana compacta para ver varias lecturas.</div></div>

    <div class="im-block"><div class="im-label">YouTube</div>
    <div class="im-text">Pega un enlace de sermón. Solo se ve el vídeo, <strong>debajo de los libros</strong> en la barra izquierda. Al borrar el enlace, los libros recuperan todo el espacio.</div></div>

    <div class="im-block"><div class="im-label">Proyección</div>
    <div class="im-text">• Versículo actual, capítulo completo o selección marcada.<br>
    • <strong>Esc</strong> o «Salir» cierran la proyección <em>sin</em> salir de pantalla completa.<br>
    • Auto-desplazamiento con cuenta regresiva y velocidades 0.03×–0.09×.<br>
    • Si entraste con el dado: botones ❤️ ${isGlass?'✏️':'📝'} ${isGlass?'✨':'🎲'} abajo a la derecha (no cierran la proyección).</div></div>

    <div class="im-block"><div class="im-label">Tipografías y scroll</div>
    <div class="im-text">• Botón <strong>Aa</strong>: tipografías legibles (Literata, Inter, Roboto, estilo Apple, etc.).<br>
    • Scrollbars personalizadas a ambos lados, con colores del tema activo.</div></div>

    <div class="im-block"><div class="im-label">Sincronización y logros</div>
    <div class="im-text">Con Google se guardan notas, favoritos, significados y progreso. El perfil muestra insignias (por libros leídos y otras metas). Historial de versiones: escribe <code>versionshistory</code> en el <strong>buscador de palabras</strong> (aparece un resultado tipo spotlight y el modal con fechas y cambios de cada versión, incluida la actual).</div></div>

    <div class="im-block"><div class="im-label">Traducciones</div>
    <div class="im-text">Selector a la <strong>izquierda de la toolkit</strong>. Predeterminada: <strong>Reina-Valera 1960</strong>. También RV1909, RVA2015, NVI (latino), NTV y TLA. Las demás se cargan al elegirlas.</div></div>

    <div class="im-block"><div class="im-label">Buscador con dos libros</div>
    <div class="im-text">Formato: <code>Juan 3:16 | Romanos 8:28</code> (un solo <code>|</code>, dos libros distintos; espacios opcionales). Entra a <strong>proyección</strong> con el primero <strong>arriba</strong> y el segundo <strong>abajo</strong>.</div></div>

    <div class="im-block"><div class="im-label">Comparar traducciones</div>
    <div class="im-text">Dentro de proyección, botón <strong>⇄ Comparar</strong>: misma cita a la <strong>izquierda y derecha</strong> en dos versiones.</div></div>

    
    <div class="im-block"><div class="im-label">Toolkit</div>
    <div class="im-text">• <strong>Traducción</strong> (izquierda, código corto RV60/RV09/NVI…): cambia la versión y recarga el capítulo.<br>
    • <strong>🧹 Limpiar</strong>: aparece al marcar versículos; quita todas las marcas (el espacio queda reservado).<br>
    • <strong>✨ Destacar</strong>: realza nombres, ciudades y palabras de Jesús.<br>
    • <strong>❓ Ayuda</strong>: siempre al final de la barra.<br>
    • Dado: <strong>🎲</strong> en la mayoría de temas; <strong>🔀</strong> en Glass.</div></div>

    
    <div class="im-block"><div class="im-label">Destacar y Resaltar</div>
    <div class="im-text">• <strong>✨ Destacar</strong>: nombres, ciudades y palabras de Jesús automáticamente.<br>
    • <strong>🖍️ Resaltar</strong> (proyección): como un subrayador. Pulsa 🖍️ (se activa), selecciona el texto y se resalta solo; el botón se apaga. Solo en ese versículo (no en toda la Biblia). Para quitar: activa 🖍️ y selecciona lo resaltado. No reemplaza a ❤️ Favoritos.<br>
    • <strong>🧹 Limpiar</strong>: quita marcas de versículos seleccionados.<br>
    • Dado: 🎲 normal · 🔀 en Glass.</div></div>

    <div class="im-block"><div class="im-label">Atajos de teclado (Ctrl)</div>
    <div class="im-text">
    • <strong>Ctrl+T</strong>: tema siguiente (10 temas en ciclo)<br>
    • <strong>Ctrl+Shift+V</strong>: buscador de versículos<br>
    • <strong>Ctrl+Shift+T</strong>: menú de traducción<br>
    • <strong>Ctrl+Shift+F</strong>: pantalla completa<br>
    • <strong>Ctrl+− / Ctrl++</strong>: tamaño del texto<br>
    • <strong>Ctrl+D</strong> Destacar<br>
    • <strong>S</strong> Significados · <strong>N</strong> Notas · <strong>F</strong> Favoritos<br>
    • <strong>Ctrl+G</strong> Glosario<br>
    • <strong>B</strong> Biografía · <strong>A</strong> Apócrifos · <strong>P</strong> Plan · <strong>Y</strong> YouTube<br>
    • <strong>Ctrl+Enter</strong> proyectar · <strong>Ctrl+H</strong> ayuda<br>
    • <strong>Tab</strong> en el buscador completa el libro · <strong>Esc</strong> cierra paneles/proyección/tour
    </div></div>

    <div class="im-block"><div class="im-label">Otros atajos</div>
    <div class="im-text">• <strong>← →</strong> en proyección: versículo anterior / siguiente.<br>
    • <strong>Supr</strong> sobre un versículo favorito: quita el favorito.</div></div>
  `;

  document.getElementById('info-modal').classList.add('open');
  focusInfoScroll();
  document.getElementById('start-sefer-tour-btn')?.addEventListener('click', ()=>{
    startSeferTour();
  });
}
document.getElementById('help-btn').onclick = openSeferHelp;

