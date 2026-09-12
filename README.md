# SEFER ספר

**SEFER** (ספר = “libro” en hebreo) es una aplicación web de estudio y proyección bíblica  
desarrollada para **Life Word Mission · Playa del Carmen**.

Lee, busca, anota, proyecta y estudia la Biblia desde el navegador — sin instalar nada.

---

## Usar la app

Abre el sitio publicado en GitHub Pages (la URL de tu repositorio) o abre `index.html` en un navegador moderno:

- Chrome  
- Firefox  
- Edge  

---

## Características principales

- **Varias traducciones** (selector en la barra superior):  
  Reina-Valera 1960 (predeterminada), 1909, RVA 2015, NVI, NTV, TLA  
- **Búsqueda de referencias** con autocompletado (Tab):  
  `Juan 3:16` · `Génesis 1:1-3,5-6` · `Juan 3:16 | Romanos 8:28`  
- **✨ Destacar** — nombres, lugares y palabras de Jesús  
- **🖍️ Resaltar** — subrayado manual en modo proyección (por versículo)  
- **Notas, favoritos y significados** (doble clic en una palabra)  
- **Glosario, biografías y apócrifos** (información, sin texto completo de apócrifos)  
- **Plan de lectura en 1 año** (varios órdenes e inicio)  
- **Proyección** para culto (versículo, selección o capítulo; comparar traducciones)  
- **YouTube** en la barra lateral (sermón junto a la lectura)  
- **10 temas** en 2 lotes:  
  - Clásicos: Life Word Mission, Edén, Sándalo, Reino, Arena  
  - Glass: Day Glass, Night Glass, Mex Glass, Ukr Glass, Kor Glass  
- **Tour guiado** e **Ayuda** integrados  
- **Atajos de teclado** (ver Ayuda dentro de la app)  
- Sincronización opcional con cuenta Google (si está configurada)

---

## Estructura del repositorio

```text
├── index.html          # Página principal
├── bible/              # Textos bíblicos y metadatos
│   ├── bible-data.js
│   ├── bible-versions.js
│   ├── book-info.js
│   └── bible-data-*.js # Otras traducciones
├── styles/             # Hojas de estilo
├── js/                 # Lógica de la aplicación
└── data/               # Diccionario, plan, genealogía, etc.
