# Fase C — CMS flexible (instrucciones para Claude Code)

> Pega este documento completo en Claude Code, o guárdalo como `docs/FASE_C.md` y pídele que lo lea. Sigue aplicando todo lo de `docs/PROMPT.md`: reglas de trabajo (sección 0), formato de reporte (sección 14), commits en español y registro en `docs/DECISIONES.md` y `docs/BITACORA.md`.

---

## Objetivo

Que el equipo de Curated Yucatán pueda componer y personalizar el sitio desde Sanity sin tocar código: crear páginas con secciones reordenables, cambiar colores y tipografía dentro de opciones seguras, editar menú y pie, y escribir textos con formato completo.

**Principio rector: flexibilidad controlada.** Quien edita elige entre opciones diseñadas; no escribe valores libres que puedan romper contraste, rendimiento o coherencia de marca. Si una personalización pone en riesgo accesibilidad (WCAG 2.1 AA) o los presupuestos de rendimiento (sección 10 de PROMPT.md), el Studio debe impedirla o advertirla.

## Reglas de esta fase

1. Trabaja por subfases (C1 a C6). Al terminar cada una entrega el reporte de la sección 14 de PROMPT.md y **espera mi aprobación** antes de seguir.
2. Antes de C1, entrega un **plan de migración**: cómo pasar el inicio actual (composición fija en `src/app/[locale]/page.tsx` y campos de `configuracionSitio`) al nuevo modelo sin perder contenido ni romper la edición visual. Incluye un script de migración idempotente para los datos existentes en Sanity y cómo revertirlo.
3. Reutiliza los componentes existentes de `src/components/secciones/inicio/` como renderizadores de bloques; no los reescribas desde cero salvo que lo justifiques en DECISIONES.
4. La fuente DEMO (`src/lib/contenido/fuente-demo.ts`) debe seguir funcionando con el nuevo modelo, para poder trabajar sin Sanity.
5. Todo bloque nuevo debe funcionar con la edición visual ("Editar en la página"): cada campo editable es clicable desde la vista previa.
6. Respeta D-013 (dónde vive el Studio) y el resto de decisiones vigentes. Si algo de esta fase contradice una decisión anterior, dímelo antes de actuar.
7. No agregues dependencias sin registrarlas y justificarlas.

---

## C1 — Constructor de páginas por bloques

### Modelo
- Nuevo documento `pagina` (bilingüe, slug único, SEO) con campo `secciones`: arreglo reordenable de bloques.
- El inicio se convierte en una `pagina` marcada como página de inicio (singleton o referencia desde `configuracionSitio`; propón la opción y justifícala).
- `paginaEditorial` se integra en `pagina` o se migra; propón cuál y documenta la migración.
- Conectar a `pagina` las rutas que hoy muestran `PaginaPendiente` y son editoriales: planea tu boda, fin de semana, aliados, privacidad. Las rutas de catálogo (venues, proveedores, historias, guía) siguen con su lógica actual.

### Ajustes comunes a todos los bloques (objeto `ajustesBloque`)
- `fondo`: opción de la paleta (cal, piedra, almagre, tinta, henequén) o imagen. El color del texto se decide automáticamente según el fondo para garantizar contraste AA.
- `espaciado`: compacto, normal, amplio.
- `ancho`: lectura, contenido, completo.
- `ancla`: id opcional para enlazar a la sección (validado: minúsculas, sin espacios, único en la página).
- `visible`: interruptor para ocultar sin borrar.

### Bloques (mínimo)
| Bloque | Notas |
|---|---|
| Portada | Imagen (con versión móvil opcional), video opcional, sobretítulo, frase, subtítulo y hasta 2 botones |
| Texto | Sobretítulo, título y texto enriquecido (C4) |
| Texto con imagen | Variantes: imagen izquierda o derecha, forma arco o rectángulo, proporción 50/50 o 40/60 |
| Galería | Cuadrícula o carrusel; visor a pantalla completa |
| Mosaico de fotos | Composición editorial de 3 a 5 imágenes |
| Imagen a sangre | Con pie de foto y crédito |
| Venues destacados | Automático (los marcados como destacados) o selección manual; número a mostrar |
| Video / episodio | Referencia a `episodio` o ID de YouTube, con capítulos |
| Guía | Usa la guía activa |
| Historias | Automático (recientes) o selección manual |
| Categorías de proveedores | |
| Cita destacada | Texto, autor y cargo |
| Métricas | Hasta 4 cifras con etiqueta |
| Preguntas frecuentes | Con datos estructurados FAQ para SEO |
| Llamado a la acción | Título, texto y botón con destino interno por referencia |
| Formulario | Elegir: asesoría, disponibilidad o guía |
| Separador | Patrón de pasta, línea o espacio |

- Los títulos de sección que hoy viven en `src/i18n/mensajes/*.json` (sobretítulos del inicio) pasan a ser campos de cada bloque. Los textos de interfaz (formularios, errores, navegación accesible, ARIA) **se quedan** en los JSON.
- Límite razonable de bloques por página (propón uno) para proteger rendimiento.
- En el selector de bloques del Studio, mostrar miniaturas o descripciones claras de cada bloque (usa la opción de menú de inserción con vista en cuadrícula si la versión de Sanity lo soporta).

### Aceptación C1
- El inicio migrado se ve idéntico al actual (capturas antes/después en 360, 768 y 1440 px).
- Puedo reordenar, ocultar, duplicar y agregar bloques desde el Studio y verlo en la vista previa.
- Una página de prueba `[DEMO] Todos los bloques` en ambos idiomas, con Lighthouse móvil y axe sin violaciones serias.
- La fuente DEMO renderiza todos los bloques.

---

## C2 — Navegación, pie y barra de avisos

- Documento único `navegacion`:
  - Enlaces del menú principal (referencia a `pagina`, venue, historia o ruta interna fija; URL externa solo como opción marcada), con orden y submenú opcional de un nivel.
  - Botón destacado del encabezado (texto y destino).
  - Columnas del pie con enlaces, redes sociales y textos legales.
- Barra de avisos: texto bilingüe, enlace opcional, fecha de inicio y fin, estilo (de la paleta). Solo se muestra dentro del rango de fechas.
- El menú móvil existente sigue siendo accesible (foco, Escape, bloqueo de scroll).

### Aceptación C2
- Cambiar el menú, el pie y la barra desde el Studio se refleja tras publicar.
- Pruebas e2e del menú en móvil y escritorio con los datos del CMS.

---

## C3 — Tema editable con validación

- Documento único `tema` con:
  - **Paleta**: los 7 tokens actuales (`cal`, `piedra`, `almagre`, `almagre-oscuro`, `henequen`, `cenote`, `tinta`, `tinta-suave`) editables.
  - **Validación de contraste en el Studio**: calcula la relación de contraste de cada combinación de uso real (texto sobre fondo, botón, enlaces) y **bloquea la publicación** si alguna baja de 4.5:1 (o 3:1 donde aplique texto grande). Mensaje claro que diga qué combinación falla y por cuánto.
  - **Temas predefinidos**: al menos el tema actual ("Original") y la opción de restaurarlo con un clic.
  - **Estilo**: redondeo (recto, suave, redondeado) y estilo de botón (sólido, contorno), de una lista cerrada.
  - **Logo y favicon** editables.
- El sitio inyecta los valores del tema como variables CSS en el servidor; `tokens.css` queda como respaldo si el tema falta.
- Prueba unitaria de la función de contraste con casos conocidos.

### Aceptación C3
- Cambiar un color válido se refleja en todo el sitio sin recompilar.
- Un color que rompe contraste no se puede publicar (evidencia en el reporte).
- Restaurar "Original" devuelve exactamente la paleta de D-006.

---

## C4 — Texto enriquecido completo

- Estilos: párrafo, subtítulo nivel 2 y nivel 3, texto destacado, texto pequeño, cita.
- Listas con viñetas y numeradas.
- Marcas: negrita, cursiva, enlace interno (**referencia** a página, venue, proveedor o historia; se resuelve a la URL correcta en cada idioma y sobrevive a cambios de slug), enlace externo (se abre en pestaña nueva con `rel` adecuado).
- Objetos dentro del texto: imagen con pie, crédito y ancho (texto, contenido, completo); galería breve; video de YouTube; botón; nota o aviso; tabla sencilla; separador.
- Sin colores ni tamaños libres.
- Aplicar en: `pagina` (bloque Texto y Texto con imagen), `historia`, `venue.descripcion`, `proveedor.descripcion`.

### Aceptación C4
- Una historia `[DEMO]` que use todos los elementos, en ambos idiomas, con axe limpio.
- Un enlace interno sigue funcionando después de cambiar el slug del destino.

---

## C5 — Imágenes y medios

- Evaluar e integrar una biblioteca de medios con etiquetas y búsqueda para reutilizar fotos (por ejemplo `sanity-plugin-media`); registra la decisión.
- En `imagenConAlt`: agregar `credito` (fotógrafo) y `pie` bilingüe opcionales; mostrar el crédito donde el diseño lo permita.
- Versión móvil opcional para imágenes de portada (dirección de arte por tamaño de pantalla).
- Advertencia en el Studio si se sube una imagen de menos de 2000 px de ancho para portadas.

### Aceptación C5
- Subir una foto una vez y usarla en un venue y en una página.
- La portada muestra la versión móvil en 360 px cuando existe.

---

## C6 — Tipografía seleccionable

- Investigar y **medir** dos enfoques antes de implementar, y presentarme la comparación (peso, LCP, CLS, complejidad):
  1. Lista curada de 3 a 5 combinaciones de fuentes (incluidas las opciones A y B de D-005) seleccionable desde `tema`.
  2. Lo anterior más la opción avanzada de subir una fuente propia (woff2) con límite de peso y aviso de licencia.
- Escala tipográfica seleccionable de una lista cerrada (estándar, amplia).
- No implementes hasta que apruebe el enfoque.

### Aceptación C6
- Cambiar de combinación desde el Studio sin recompilar, sin CLS perceptible y dentro del presupuesto de rendimiento.

---

## Correcciones que van en esta fase

- **Accesibilidad**: los botones de capítulos del reproductor tienen `aria-label` que no contiene su texto visible (falla `label-content-name-mismatch` en `docs/lighthouse/fase-p/ficha-movil.html`). Corrígelo en C1.
- **Rendimiento**: el Lighthouse de la ficha en móvil marcó LCP de 3.2 s (presupuesto: 2.5 s). Analiza la causa y propón la corrección en el reporte de C1.

## Documentación obligatoria

- Actualizar `docs/CONTENIDO.md` con una guía para personas no técnicas: cómo crear una página, agregar y reordenar bloques, cambiar el menú, cambiar colores, subir fotos con crédito, publicar y revertir. Con capturas del Studio.
- Registrar cada decisión nueva en `docs/DECISIONES.md` continuando la numeración.

## Fuera de alcance

Quiz, comparador, mapa interactivo, visualizador 3D, portal de aliados, roles y permisos avanzados del Studio. No los implementes.

## Primera acción

Lee este documento y responde con: dudas o contradicciones, el plan de migración del inicio, y el plan de C1. No escribas código hasta que lo apruebe.
