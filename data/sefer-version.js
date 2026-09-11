/* SEFER data — sefer-version.js (extraído de index.html, sin cambios de lógica) */
/* SEFER version control (local entre Grok y usuario) */
const SEFER_VERSION = "2.5.1-stable";
const SEFER_VERSION_NAME = "Proyección y buscador dual; toolkit en una línea";


const SEFER_VERSION_HISTORY = [
  {
    id: "2.5.1-stable",
    name: "Proyección y buscador dual; toolkit en una línea",
    date: "2026-09-10",
    current: true,
    changes: [
      "Comparar traducción oculto en proyección desde buscador (|) y en capítulo completo",
      "Autocompletado del segundo libro después de | en el buscador de versículos",
      "Botones ❤️ 📝 🎲 en proyección visibles salvo buscador multi-libro; 🎲 solo desde el dado",
      "Tema Glass: lista de libros sin márgenes extra (solo apariencia)",
      "Toolkit en una sola línea; selector de traducción compacto a la izquierda",
      "Historial también vía buscador de palabras (versionshistory) con spotlight + modal actualizado"
    ]
  },
  {
    id: "2.5.0-stable",
    name: "Multi-traducción, atajos Ctrl, proyección dual",
    date: "2026-09-10",
    current: false,
    changes: [
      "Selector de traducción en la toolkit (izquierda): RV1909 / RV1960 (predeterminada) / RVA2015 / NVI / NTV / TLA",
      "Carga bajo demanda de bible-data-*.js al cambiar de versión",
      "Atajos Ctrl: tamaño, detalle, significados, notas, favoritos, glosario, biografía, apócrifos, plan, YouTube, proyectar, ayuda",
      "Ctrl+T tema siguiente (ciclo 10 temas y cambio de lote)",
      "Ctrl+Shift+V buscador · Ctrl+Shift+T traducción · Ctrl+Shift+F pantalla completa",
      "Buscador con | : dos libros → proyección arriba/abajo",
      "Proyección: Comparar traducción izquierda/derecha",
      "Glass: buscador mate; menos cambios de tamaño; tooltips por encima",
      "Ayuda, tour e historial actualizados"
    ]
  },
  {
    id: "2.4.6-stable",
    name: "Proyección: favorito/nota/dado; fuentes reales; scroll rails",
    date: "2026-08-29",
    current: false,
    changes: [
      "Botones de proyección (❤️ 📝 🎲) abajo a la derecha, solo si vino del dado",
      "❤️ guarda/quita favorito del versículo actual sin salir de proyección",
      "📝 abre panel para escribir nota del versículo actual sin salir",
      "🎲 otro versículo aleatorio manteniendo proyección",
      "Eliminado botón de significados en proyección",
      "Tipografías aplican de verdad a los versículos (--verse-font)",
      "Flechas de scroll sutiles arriba/abajo del rail (lector y lista de libros)",
      "Ventana Plan 1 año reducida (~80%) para ver más lecturas"
    ]
  },
  {
    id: "2.4.5-stable",
    name: "Proyección Esc/fullscreen, scroll estable, fuentes y toolkit agrupada",
    date: "2026-08-29",
    current: false,
    changes: [
      "Esc cierra proyección sin salir de pantalla completa",
      "Salir de proyección ya no fuerza salida de fullscreen",
      "Scroll del lector no salta arriba al seleccionar versículo",
      "Al cerrar proyección se restaura la posición del versículo",
      "Botones discretos en proyección si vino del dado",
      "Selector de tipografías y toolkit agrupada"
    ]
  },
  {
    id: "2.4.4-stable",
    name: "Sidebar compacta + bienvenida centrada + ventanas pequeñas",
    date: "2026-08-29",
    current: false,
    changes: [
      "Barra lateral compacta en 1280×720/768, 1024×768 y 800×600",
      "Botones reiniciar, dado y + en una sola fila sin saltos rotos",
      "Bienvenida centrada en el área de lectura",
      "Mejor uso del espacio en modo ventana (no solo pantalla completa)"
    ]
  },
  {
    id: "2.4.3-stable",
    name: "Dado→proyectar, tooltips toolkit, sin franja negra",
    date: "2026-08-29",
    current: false,
    changes: [
      "Botón dado abre el versículo aleatorio en modo proyectar",
      "Tooltips de la toolkit debajo de los botones y sobre el área de lectura",
      "Corregida franja negra al usar el dado (scroll del documento bloqueado)"
    ]
  },
  {
    id: "2.4.2-stable",
    name: "Historial de versiones completo + base estable",
    date: "2026-08-29",
    current: false,
    changes: [
      "Historial completo visible con versionshistory",
      "Todas las versiones con fecha YYYY-MM-DD",
      "Registro de v1.0.0 a v2.5.0-broken y restauración 2.4.x",
      "Misma base estable usable (sin sefer-data.js)"
    ]
  },
  {
    id: "2.4.1-stable",
    name: "Pre-minificación + toolkit contenida",
    date: "2026-08-29",
    current: false,
    changes: [
      "Restauración estable tras el PLACEHOLDER y el minificado roto",
      "index.html autónomo (sin depender de sefer-data.js)",
      "Toolkit alineada a la derecha, sin salirse de los márgenes",
      "YouTube en la barra izquierda, debajo de la lista de libros"
    ]
  },
  {
    id: "2.5.0-broken",
    name: "Minificado + sefer-data (NO USAR)",
    date: "2026-08-29",
    current: false,
    changes: [
      "Minificación agresiva del HTML/JS",
      "Genealogía y diccionario movidos a sefer-data.js",
      "La app dejó de funcionar — revertido a 2.4.1-stable"
    ]
  },
  {
    id: "2.4.0",
    name: "Pulido toolkit y resoluciones",
    date: "2026-08-28",
    current: false,
    changes: [
      "Ajustes de toolkit para resoluciones como 1366×768",
      "Ayuda como referencia de margen derecho",
      "YouTube bajo los libros (~70% lista / ~30% vídeo)"
    ]
  },
  {
    id: "2.3.1",
    name: "Biografías, glosario y apócrifos",
    date: "2026-08-27",
    current: false,
    changes: [
      "Biografías en modo lista + época AT/NT + botón Atrás",
      "Más nombres (Judas Iscariote, Ester, Sansón, etc.)",
      "Sección Apócrifos (curiosidades, sin el texto de esos libros)",
      "Glosario ampliado (contumaz, dura cerviz, etc.)",
      "Significados con doble clic en una palabra",
      "Plan de lectura con altura fija de ventana"
    ]
  },
  {
    id: "2.3.0",
    name: "YouTube en lateral y bienvenida",
    date: "2026-08-27",
    current: false,
    changes: [
      "Vídeo de YouTube integrado en el panel de libros",
      "Mensaje de bienvenida centrado",
      "Ayuda actualizada",
      "Corrección de tooltips de la barra de herramientas"
    ]
  },
  {
    id: "2.2.0",
    name: "Lectura, proyección y casillas",
    date: "2026-08-26",
    current: false,
    changes: [
      "Encabezado fijo del capítulo al hacer scroll",
      "Casillas de selección de versículos sin mover el texto",
      "Proyectar: versículo actual, selección o capítulo",
      "Auto-desplazamiento con cuenta regresiva y velocidades 0.03×–0.09×",
      "Parser de referencias: libro cap:versículo, rangos y listas"
    ]
  },
  {
    id: "2.1.0",
    name: "Logros, perfil y tour",
    date: "2026-08-20",
    current: false,
    changes: [
      "Sistema de logros e insignias por libro leído",
      "Perfil con cuenta Google (foto, email, progreso)",
      "Tour interactivo para usuarios nuevos",
      "Pantalla completa (como F11)",
      "Botón de versículo aleatorio (dado)"
    ]
  },
  {
    id: "2.0.0",
    name: "Temas y sincronización",
    date: "2026-08-15",
    current: false,
    changes: [
      "Temas: México, Corea, Ucrania, Day, Night, Reino, Edén, Arena, Sándalo, Glass (liquid glass)",
      "Lotes de 5 temas con botón +/−",
      "Tema por defecto México",
      "Sincronización notas/favoritos/significados con Google Drive",
      "Marca SEFER ספר / BY LWM PDC"
    ]
  },
  {
    id: "1.5.0",
    name: "Estudio",
    date: "2026-08-05",
    current: false,
    changes: [
      "Plan de lectura de la Biblia en 1 año",
      "Órdenes: canónico, inverso, paralelo, cronológico",
      "Inicio: 1 ene–31 dic o desde hoy (365 días)",
      "Glosario de términos bíblicos",
      "Notas por versículo y favoritos",
      "Panel de significados guardados"
    ]
  },
  {
    id: "1.0.0",
    name: "Base",
    date: "2026-07-27",
    current: false,
    changes: [
      "Lectura Reina-Valera 1960",
      "Navegación Antiguo / Nuevo Testamento, libros y capítulos",
      "Buscador de referencias",
      "Resaltar (nombres, ciudades, palabras de Jesús)",
      "Primera versión de temas visuales"
    ]
  }
];
window.SEFER_VERSION = SEFER_VERSION;
window.SEFER_VERSION_NAME = SEFER_VERSION_NAME;
window.SEFER_VERSION_HISTORY = SEFER_VERSION_HISTORY;
