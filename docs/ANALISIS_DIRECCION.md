# Análisis: el sitio actual frente a la dirección de Curated Yucatán

> 2026-09-29. Diagnóstico previo a la Fase R. El estado después de la implementación está en la sección 13.
>
> **Referencias** (transcritas en `docs/referencias/`): prompt visual, "Estructura y dirección web" y la estrategia LOVE MÉXICO 2026.
> **Comparado contra:** el código en `main` (commit `dba4716`), las capturas y Lighthouse de la Fase P, y `docs/PROMPT.md`, la especificación con la que se construyó el sitio.
> **Actualización del mismo día:** se agregó el libro impreso (volumen II, borrador), analizado en `docs/referencias/libro-volumen-2.md`. Lo que confirma y lo que contradice está en la sección 12.

## 1. Veredicto

La **base técnica sirve tal cual**: Next.js, Sanity con edición en la página, dos idiomas, rendimiento, accesibilidad, formularios validados y pruebas. Estamos **lejos en cuatro cosas**:

1. qué secciones tiene el sitio;
2. el modelo de proveedores;
3. la audiencia y el tono;
4. la capa visual (paleta, tipografía y composición).

**Causa raíz:** `PROMPT.md` y los documentos nuevos describen dos proyectos parecidos pero distintos.

|               | `PROMPT.md` (lo construido)                    | Documentos nuevos                                                                                             |
| ------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Qué es        | Portal de bodas de destino                     | Plataforma de descubrimiento del destino, "extensión digital del libro"                                       |
| Para quién    | Parejas y wedding planners de EE. UU. y Canadá | "Principalmente wedding planners y profesionales internacionales"                                             |
| Referencia    | neworleans.com/weddings                        | El libro impreso                                                                                              |
| Diferenciador | Entrevistas largas de YouTube                  | La curaduría: tres categorías del libro, Find Your Yucatán                                                    |
| Proveedores   | Directorio por categorías                      | Catering y Photography curados (3–5 cada uno) + Minimal como partner. "No debe percibirse como un directorio" |
| Imán de leads | Guía descargable                               | Find Your Yucatán (discovery) y Plan Your Event (conversion)                                                  |
| Eventos       | Bodas                                          | Bodas y eventos: welcome party, rehearsal dinner                                                              |

### Tablero

| Dimensión                                                                   | Distancia  | Resumen                                                                                                                                    |
| --------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Base técnica (stack, CMS, idiomas, rendimiento, accesibilidad)              | 🟢 Cerca   | Reutilizable sin cambios                                                                                                                   |
| Principios (móvil primero, crecimiento, foto protagonista, animación sutil) | 🟢 Cerca   | Ya aplicados                                                                                                                               |
| Perfil de venue                                                             | 🟡 Parcial | Tiene más de lo pedido; le faltan Style, Indoor/Outdoor y Curated Notes                                                                    |
| Listado de venues                                                           | 🟡 Parcial | 3 de 5 filtros coinciden; falta la taxonomía del libro, que además no está definida (2 estilos en el libro y 3 categorías en el documento) |
| Journal                                                                     | 🟡 Parcial | Existe como "Stories", sin páginas construidas                                                                                             |
| Inicio                                                                      | 🔴 Lejos   | 3 de 7 bloques coinciden; 5 secciones que el documento no pide                                                                             |
| Navegación y mapa del sitio                                                 | 🔴 Lejos   | Solo Venues coincide en el menú; faltan 6 secciones                                                                                        |
| Catering, Photography, Design & Production                                  | 🔴 Lejos   | Directorio genérico en vez de 3 secciones curadas                                                                                          |
| Audiencia y tono                                                            | 🔴 Lejos   | Textos para parejas                                                                                                                        |
| Paleta                                                                      | 🔴 Lejos   | El libro es negro sobre blanco, sin ningún color de interfaz; el sitio usa rojo, verde y fondos oscuros                                    |
| Tipografía                                                                  | 🔴 Lejos   | El libro confirma Montserrat, Cinzel y Century Gothic; ninguna coincide con las del sitio                                                  |
| Composición                                                                 | 🔴 Lejos   | El libro no usa arcos como máscara, patrones, tarjetas, iconos ni bandas de color; el sitio usa todo eso                                   |

## 2. Concepto, audiencia y tono

**Documentos:**

- "Plataforma digital de descubrimiento y consulta sobre Yucatán dirigida principalmente a wedding planners y profesionales internacionales".
- Lema: "Your insider guide to celebrating in Yucatán."
- Bodas y eventos.

**Hoy:** los textos hablan a una pareja.

- Menú: "Plan your wedding", "Wedding weekend", "Plan with us".
- Inicio: "Everything for your wedding weekend".
- Título del sitio: "Weddings in Yucatán, curated".
- El formulario de la ficha pide "Wedding date".

**Contradicción de fondo:** la categoría de proveedores "Wedding planners" (datos DEMO) presenta como proveedores a quienes el documento define como la audiencia.

**Costo:** bajo en contenido, porque todo es `[DEMO]`. Pero toca nombres de rutas, etiquetas de formularios, metadatos y SEO.

## 3. Navegación y mapa del sitio

| Documento                       | Hoy                                                                                            | Estado                             |
| ------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------- |
| Home                            | `/`                                                                                            | 🟡 Existe, con otra estructura     |
| Discover Yucatán                | No existe. Lo más cercano: regiones y tradiciones en el inicio, y `/wedding-weekend` pendiente | 🔴 Falta                           |
| Venues + 3 categorías del libro | `/venues`, por región y tipo                                                                   | 🟡 Existe con otra taxonomía       |
| Perfil de venue                 | `/venues/[slug]`                                                                               | 🟢 Existe                          |
| Catering                        | Categoría dentro de `/vendors` (pendiente)                                                     | 🔴 Falta como sección              |
| Photography                     | Categoría dentro de `/vendors` (pendiente)                                                     | 🔴 Falta como sección              |
| Design & Production → Minimal   | No existe                                                                                      | 🔴 Falta                           |
| Curated Journal                 | `/stories` (pendiente)                                                                         | 🟡 Otro nombre ("antes «Stories»") |
| About                           | No existe                                                                                      | 🔴 Falta                           |
| Find Your Yucatán               | No existe                                                                                      | 🔴 Falta                           |
| Plan Your Event                 | `/plan-your-wedding` (editorial) y `/planning-assistance` (formulario), ambos pendientes       | 🟡 Dividido en dos                 |
| No aparecen en los documentos   | `/venue-tours`, `/guide`, `/shortlist`, `/partners`, `/wedding-weekend`                        | Por decidir                        |

**Menú:**

- Hoy: Venues · Vendors · Wedding weekend · Plan your wedding · Venue tours · Guide, con el botón "Plan with us".
- Documento: Home · Discover Yucatán · Venues · Catering · Photography · Design & Production · Curated Journal · About, con el botón "Plan your event".
- Solo coincide Venues, además de la idea de un botón de conversión.

## 4. Inicio

| #   | Documento                                                                                                         | Hoy                                                                                                                                                     | Coincide                                           |
| --- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------- |
| 01  | **Hero:** video; "CURATED YUCATÁN / Your insider guide…"; un CTA "Explore Yucatán" que lleva a Discover           | Video con imagen de respaldo ✓, otra frase, 2 CTA ("Explore venues", "Get the guide")                                                                   | 🟡                                                 |
| 02  | **What is Curated?** Breve, con CTA "About Curated"                                                               | "El sello curated": sello y 4 pasos (visitamos, filmamos, seleccionamos, conectamos), sin CTA                                                           | 🟡 Misma intención                                 |
| 03  | **Discover Yucatán:** Architecture, Culture, Gastronomy, History, Nature, Haciendas, Experiences; con fotos y CTA | Repartido en tres secciones: "Por qué Yucatán" (3 puntos de texto), "Explora por paisaje" (regiones) y "Tradiciones"                                    | 🟡 Por temas en el documento, por región hoy       |
| 04  | **Explore Curated:** Venues, Catering, Photography y D&P, con fotografía                                          | 9 categorías de proveedores con iconos: Wedding planners, Photo & video, Flowers, Furniture & rentals, Music, Catering, Beauty, Transportation, Lodging | 🔴 Iconos en vez de fotos, y otras categorías      |
| 05  | **Featured venues:** 4–6, con foto, nombre, ubicación, estilo y capacidad; "Explore venue" y "View all venues"    | 3 venues con foto, nombre, región y tipo, banquete, hospedaje y botón de entrevista; "See all venues"                                                   | 🟢 Faltan el estilo, 1–3 venues y el CTA por venue |
| 06  | **Curated Journal:** 3 artículos, foto y título, "Explore the journal"                                            | "Recent stories": 3 con tipo, fecha y minutos de lectura                                                                                                | 🟢 Cambia el nombre                                |
| 07  | **Plan Your Event:** cierre y conversión                                                                          | No existe; el inicio termina con métricas                                                                                                               | 🔴 Falta                                           |
| —   | No aparecen en el documento                                                                                       | Último episodio (YouTube), guía descargable, métricas y separador de pasta                                                                              | Sobran                                             |

El documento pide un inicio "que no sature": 7 bloques. Hoy son 11, más el separador.

## 5. Venues

### Listado

|              | Documento                                                | Hoy                                                                                                                              |
| ------------ | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Filtros      | Style, Capacity, Accommodation, Location, Indoor/Outdoor | Región, tipo, rangos de capacidad, hospedaje, catering, rangos de inversión                                                      |
| Coinciden    |                                                          | Capacity, Accommodation, Location (región)                                                                                       |
| Faltan       |                                                          | **Style**: las 3 categorías del libro no existen en el modelo. **Indoor/Outdoor**: el dato existe por espacio, pero no se filtra |
| Sobran       |                                                          | Catering e inversión. El documento no habla de precios                                                                           |
| Presentación | "Limpios y progresivos"; "no un buscador comercial"      | Todos visibles en la barra lateral, con orden y contador                                                                         |
| Tarjeta      | Imagen, nombre, ubicación, capacidad, estilo             | Imagen, región y tipo, nombre, banquete, hospedaje                                                                               |

Las tres categorías (Contemporary Sanctuaries, Organic Estates, Timeless Venues) son la pieza central del sistema: ordenan el libro, el listado y el resultado de Find Your Yucatán. Hoy el campo equivalente es "tipo" (hacienda, ciudad colonial, playa, cenote y selva, boutique), que describe el lugar, no el estilo.

### Perfil

| Documento                                                             | Hoy                                                                                                                                           |
| --------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero + nombre + ubicación                                             | ✓, con 2 botones                                                                                                                              |
| Quick facts: Location, Capacity, Accommodation, Style, Indoor/Outdoor | "At a glance": capacidades, hospedaje, catering, horario de música, inversión, temporada, traslados y mapa. **Faltan Style e Indoor/Outdoor** |
| About                                                                 | ✓                                                                                                                                             |
| Spaces                                                                | ✓, con capacidades por formato                                                                                                                |
| **Curated Notes** (información para planners)                         | **Falta**                                                                                                                                     |
| Gallery                                                               | ✓, con visor                                                                                                                                  |
| Request information                                                   | ✓ Formulario de disponibilidad, pero con enfoque de pareja ("wedding date")                                                                   |
| —                                                                     | Extras: entrevista con capítulos, citas, proveedores recomendados, venues similares, favoritos                                                |

Es la parte más avanzada. El documento pide una estructura base consistente: habrá que decidir qué extras se quedan.

## 6. Catering, Photography y Design & Production

**Documento:**

- Tres secciones separadas, con 3–5 perfiles curados cada una.
- Cada perfil lleva 11 datos: nombre comercial, categoría y especialidad, descripción, servicios, estilo o diferenciador, ciudad base y cobertura, experiencia en bodas destino, web e Instagram, contacto comercial, logotipo y fotografías.
- La foto pesa más que el logotipo.
- En fotografía, el estilo puede ser Editorial, Documentary, Fine Art o Cinematic.
- Design & Production es solo Minimal, con sus áreas (Furniture, Tabletop, Floral Design, Décor, Production), y no es un directorio.

**Hoy:**

- Un único tipo `proveedor` con categoría (9 categorías en DEMO) y estos campos: nombre, categoría, resumen, descripción, imágenes, web, Instagram, regiones que cubre y destacado.
- Las páginas están pendientes.

**Faltan en el modelo:** especialidad, servicios, estilo o diferenciador (con la lista cerrada para fotografía), ciudad base, experiencia en bodas destino y logotipo. El contacto comercial ya tiene lugar privado (`contactosLeads`, D-012).

**Choque con el principio de marca:** las categorías "Flowers" y "Furniture & rentals" compiten con las áreas que cubre Minimal, el partner exclusivo de Design & Production. "Wedding planners", "Beauty", "Music", "Transportation" y "Lodging" no aparecen en los documentos.

## 7. Otras secciones

| Sección               | Documento                                                                                                                                                                                                   | Hoy                                                                                                                                                             | Distancia                                                                                         |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **Curated Journal**   | 5 títulos para el lanzamiento; "no un blog corporativo"                                                                                                                                                     | El tipo `historia` lo cubre (portada, cuerpo, tipo: artículo, boda real, lista)                                                                                 | 🟢 Nombre y rutas                                                                                 |
| **About**             | 5 preguntas; Minimal explicado con transparencia, sin ser el mensaje principal                                                                                                                              | Nada                                                                                                                                                            | 🔴 Cabe como página del constructor de la Fase C                                                  |
| **Discover Yucatán**  | Mérida, Haciendas, Culture, Gastronomy, Nature (cenotes, costa, vegetación), Experiences; cierra con "Explore venues"                                                                                       | Solo existen las 3 regiones                                                                                                                                     | 🔴 Cabe en el constructor de bloques                                                              |
| **Find Your Yucatán** | 6 preguntas, resultado con una de las 3 categorías, ~3 venues y guardado opcional (Name, Company, Email, Country). En el lanzamiento (Fase 01) y con su propio QR                                           | No existe                                                                                                                                                       | 🔴 **Contradicción:** `PROMPT.md` y `FASE_C.md` lo ponen fuera de alcance ("quiz de matchmaking") |
| **Plan Your Event**   | Tipo de evento, invitados por rangos, qué busca (Venue, Catering, Photography, D&P, Not sure yet), contacto (Name, Company, Country, Email, Phone opcional, fecha aproximada, mensaje) y confirmación clara | La asesoría de `PROMPT.md` (fecha, invitados, estilo, presupuesto, contacto) no está construida. El formulario de disponibilidad comparte los datos de contacto | 🟡 Faltan Company, tipo de evento y "qué busca"; el documento no pide presupuesto                 |

## 8. Capa visual

### Color

**Documento:** fondos blancos o blanco cálido, texto negro o carbón, y café, arena o taupe solo como acentos (líneas finas y divisores). La fotografía aporta el color. Evitar colores fuertes, degradados y fondos saturados.

| Token (D-006)    | Valor     | Encaja                   | Uso actual                                                         |
| ---------------- | --------- | ------------------------ | ------------------------------------------------------------------ |
| `cal`            | `#f7f3ec` | ✅ Blanco cálido         | Fondo general                                                      |
| `piedra`         | `#eae2d4` | ✅ Arena, con moderación | Bandas de fondo (16 usos)                                          |
| `tinta`          | `#221e1a` | ✅ Carbón                | Texto; fondo del hero, del episodio y del pie (16 usos como fondo) |
| `tinta-suave`    | `#5e564e` | ✅ Taupe oscuro          | Texto secundario                                                   |
| `almagre`        | `#a13f2b` | ❌ Rojo fuerte           | Marca, botones, enlaces y botón de reproducir (28 usos)            |
| `almagre-oscuro` | `#8c3524` | ❌                       | Hover de botones                                                   |
| `henequen`       | `#4a6650` | ❌ Como fondo            | Fondo de métricas y acentos (6 usos)                               |
| `cenote`         | `#106c74` | ❌                       | Sin uso en componentes                                             |

**Además:**

- Las imágenes `[DEMO]` son degradados saturados (turquesa, terracota, verde), que exageran el color de las capturas. Con fotos reales la sensación cambia, pero siguen siendo "degradados" a ojos del documento.
- Falta un token para las líneas finas arena o caqui que usa el documento de estrategia.

### Tipografía

| Rol                                                | Documento          | Hoy (D-005, opción B) |
| -------------------------------------------------- | ------------------ | --------------------- |
| Interfaz, cuerpo, navegación, botones, formularios | **Montserrat**     | Source Sans 3         |
| Títulos y momentos editoriales (uso selectivo)     | **Cinzel**         | Ibarra Real Nova      |
| Editorial secundaria                               | **Century Gothic** | —                     |

- Montserrat y Cinzel son de Google Fonts, con licencia libre: se autohospedan igual que hoy.
- **Century Gothic es comercial** (Monotype): en la web necesita licencia web o un sustituto libre. Además es geométrica como Montserrat, así que usar ambas roza el "no mezclar innecesariamente".
- Cinzel solo tiene mayúsculas: implica títulos en mayúsculas y con espaciado, como en el documento de estrategia. Hoy los títulos van en caja mixta, grandes y con interlineado apretado.
- El cambio está localizado: `src/estilos/tipografia.ts` (D-005) más ajustes de mayúsculas y espaciado en los componentes de título.

### Composición

**Documento:** mucho espacio negativo, títulos con aire, líneas discretas, fotos de gran formato, evitar cajas y tarjetas, y ningún elemento gráfico innecesario.

**A favor, hoy:**

- Espaciado amplio entre secciones.
- Listas de puntos y pasos con líneas finas.
- Fotos grandes en el hero y en la galería.

**En contra, hoy:**

- Máscaras de arco en la mayoría de las imágenes: paisajes, destacados, tradiciones, similares y página pendiente. Vienen de `PROMPT.md` §9. Los documentos no las mencionan; el arco solo aparece como elemento arquitectónico del stand.
- Separador con patrón de pasta (`PROMPT.md` §9).
- Sello circular decorativo.
- Iconos en las categorías.
- Bandas de fondo alternadas: piedra, tinta, henequén.
- Caja con fondo en "At a glance" y tarjetas con borde.

Si el arco se queda o no se decide con el libro a la vista.

### Interacción

**Documento:** fades suaves, zoom en hover, transiciones limpias y nada llamativo.

**Hoy:** zoom de 1.03 en 700 ms, transiciones de color, respeto a "reducir movimiento" y video del hero con pausa. **🟢 Cerca.** Lo único que desentona es el botón de reproducir: círculo rojo con sombra.

### Fotografía

La estructura está lista (hero, galería, espacios, portadas). Faltan las fotos del libro y sus derechos de uso; hoy todo es `[DEMO]`.

## 9. LOVE MÉXICO: lo que implica para la web

- **Alcance del lanzamiento (Fase 01):** Home, Discover Yucatán, Venues, Catering y Photography iniciales, Minimal, Journal, About, Plan Your Event, Find Your Yucatán, sistema de QR y captura de leads.
- **Tres QR con URL estable antes de imprimir:**
  - QR 01 → Home.
  - QR 02 → Find Your Yucatán.
  - QR 03 → "Continue exploring", desde el libro, hacia información actualizada y venues nuevos (el destino está por definir).
- La **captura de UTM** (`PROMPT.md` §11) permitiría medir cada QR. No está implementada.
- **Prioridad móvil** para Find Your Yucatán, Venues y Plan Your Event. La base ya es móvil primero.
- **El libro no se regala:** 40 ejemplares, no se trata como folletería. Si la "guía descargable gratis" de `PROMPT.md` es el libro, choca con esto.
- **Contenido del lanzamiento:** 3–5 artículos, venues verificados, 3–5 catering, 3–5 fotógrafos y el contenido de Minimal.
- **Fecha del evento:** no aparece en los documentos. Define el calendario.

## 10. Impacto en lo que está en curso

**Plan de la Fase C** (`docs/FASE_C.md`, pendiente de aprobación): se armó sobre la estructura de `PROMPT.md`.

- ❌ **Migración del inicio:** migrarlo "idéntico" con 4 bloques extra (Razones, Proceso, Regiones, Tarjetas) sobra si el inicio pasa a los 7 bloques del documento.
- ❌ **Fondos de color:** fondos almagre, henequén y tinta como opciones de bloque, cuando el documento pide evitar fondos saturados.
- ❌ **Páginas fijas:** planea tu boda, fin de semana, aliados y privacidad no coinciden con el mapa nuevo (Discover, About, D&P, Plan Your Event).
- ❌ **Quiz:** "fuera de alcance" choca con Find Your Yucatán en el lanzamiento.
- ⚠️ **Tipografías (C6):** la lista curada debería partir de Montserrat y Cinzel.
- ✅ **Lo que encaja:** el constructor de bloques ("crecer sin rediseñar"), las páginas editoriales, el Journal, la edición en la página, la biblioteca de medios y los créditos de foto.

**Decisiones y secciones que quedarían reemplazadas:**

- D-005 (tipografía) y D-006 (paleta).
- `PROMPT.md`: §1 (audiencia), §4 (rutas), §6 (modelo de venue y proveedor), §9 (arcos y pasta), §11 (inicio y páginas) y "fuera de alcance" (quiz).

**Lo que no cambia:** stack, Sanity y edición visual, MariaDB y leads, seguridad, presupuestos de rendimiento, accesibilidad, formularios validados y pruebas.

## 11. Preguntas abiertas

1. Donde chocan, ¿estos documentos reemplazan a `PROMPT.md`?
2. **Taxonomía de venues:** ¿2 estilos (Heritage Spaces y Distinctive Venues, como en el libro) o 3 categorías (Contemporary Sanctuaries, Organic Estates y Timeless Venues, como en el documento de estructura)? Define el listado y el resultado de Find Your Yucatán.
3. **Fotos originales** en alta resolución y confirmación de que la autorización "for editorial purposes" cubre la web.
4. **Century Gothic:** ¿hay licencia web o se busca un sustituto libre?
5. ¿Fecha de LOVE MÉXICO 2026?
6. ¿Se mantiene el español? Los documentos y el libro están en inglés.
7. **Video y guía:** el libro confirma la serie "El Lugar de Tu Historia" con su propio QR. ¿El sitio es su videoteca? ¿El "eBook exclusivo por venue" sustituye a la guía descargable como imán de leads?
8. ¿Desaparecen los proveedores que no son de catering ni de fotografía?
9. **MasQueAyer** (florería) aparece junto a Minimal en el libro. ¿Es parte de Design & Production o un partner aparte?
10. ¿A dónde llevan los QR: 03 "Continue exploring" y el de la videoteca del libro?
11. ¿El pie de marca "Curated Partner" sustituye al "At Minimal 4.0, we're happy to help you" del libro? En el libro, Minimal pesa más de lo que pide la nueva dirección.

## 12. Lo que muestra el libro

Detalle y mediciones en `docs/referencias/libro-volumen-2.md`.

### Lo que confirma

- **Tipografía:** Montserrat, Cinzel y Century Gothic, con roles claros.
  - Century Gothic es la voz de marca: portada, títulos de sección y aperturas, en mayúsculas muy espaciadas.
  - Cinzel se usa solo en los nombres de venues.
  - Montserrat va en cuerpo, etiquetas y subtítulos.
- **Color:** más estricto de lo que dice el prompt visual. Todo el texto es negro puro sobre blanco, y no hay taupe ni ningún otro color de interfaz. El color viene solo de las fotos: ocres, almagre, verdes y luz dorada.
- **Composición:**
  - Fotos rectangulares a sangre o a media página, y mosaicos con huecos blancos finos (alrededor del 1 % del ancho).
  - Títulos centrados con mucho aire.
  - Único adorno: ilustraciones botánicas a tinta.
  - Los arcos solo aparecen en la arquitectura fotografiada, nunca como forma gráfica.
- **Ficha de venue:** nombre; ubicación con tiempo desde el centro de Mérida en minutos, millas y km; capacidad y espacios; descripción; mosaico de fotos. Coincide con la base de nuestra ficha. El modelo ya tiene los minutos al centro, pero no millas ni km.
- **Contenido para Discover y el Journal:** "Why Yucatán", "Understanding Haciendas & Colonial Houses" y "Wedding Seasons" ya existen como texto editorial.
- **Crecimiento:** "The Collection Continues" y la lista de unos 50 venues próximos coinciden con "crecer sin rediseñar".

### Lo que contradice o agrega

- **2 estilos, no 3 categorías.** El libro organiza los venues en Heritage Spaces y Distinctive Venues. El documento de estructura dice que "el libro ya establece tres categorías" (Contemporary Sanctuaries, Organic Estates, Timeless Venues), y esas tres se usan en el stand y en Find Your Yucatán.
- **Es un borrador.** En 13 de 15 fichas, el nombre del venue no corresponde a su descripción. Además hay un texto repetido, el índice está sin llenar y queda una nota interna de trabajo. Sirve como referencia visual, **no como fuente de datos**.
- **Audiencia mixta.** "Guide for couples & wedding planners": el prólogo habla a parejas y "Why Yucatán" a planners.
- **Minimal pesa más que en la nueva dirección.** Aparece en el prólogo, en el contacto para pedir los eBooks y en la contraportada.
- **Nuevos elementos del ecosistema:**
  - la serie de video "El Lugar de Tu Historia", con QR a la videoteca;
  - un eBook exclusivo por venue que se pide por contacto;
  - MasQueAyer como partner floral.
- **Fotos:** comprimidas por Canva. La mediana es de 766 px de ancho y solo 5 de 97 llegan a 2000 px. Para la web hacen falta los originales.

### Qué cambia en este análisis

- **Composición:** pasa de "parcial-lejos" a **lejos**. Todo lo decorativo del sitio (arcos como máscara, patrón de pasta, sello, iconos, bandas de color y cajas) no existe en el libro.
- **Color:** el objetivo queda más claro: negro o carbón sobre blanco, y el color solo en las fotos.
- **Tipografía:** los tres nombres quedan confirmados, con sus roles. Sigue pendiente la licencia de Century Gothic. Como alternativas libres de estilo geométrico similar se pueden evaluar TeX Gyre Adventor, Didact Gothic y Questrial.
- **Venues:** la duda de la taxonomía (2 o 3) pasa a ser la decisión más importante, porque define el listado, las tarjetas y el resultado de Find Your Yucatán.
- **Entrevistas en video:** dejan de ser "lo que sobra". El libro las presenta como capítulo audiovisual de la colección.

## 13. Estado tras la Fase R (2026-09-29)

La implementación se alineó con los documentos. Detalle en la bitácora (Fase R) y en D-036 a D-046.

| Dimensión                                              | Antes   | Ahora | Qué falta                                                                       |
| ------------------------------------------------------ | ------- | ----- | ------------------------------------------------------------------------------- |
| Base técnica                                           | 🟢      | 🟢    | —                                                                               |
| Principios (móvil, crecimiento, foto, animación sutil) | 🟢      | 🟢    | —                                                                               |
| Inicio (7 bloques)                                     | 🔴      | 🟢    | Textos y fotos reales                                                           |
| Navegación y mapa del sitio                            | 🔴      | 🟢    | —                                                                               |
| Listado de venues (colecciones y 5 filtros)            | 🟡      | 🟢    | Confirmar 2 o 3 colecciones; rangos reales                                      |
| Perfil de venue (estructura base)                      | 🟡      | 🟢    | Fichas verificadas y Curated Notes reales                                       |
| Catering, Photography, Design & Production             | 🔴      | 🟢    | Selección real de 3–5 partners por sección y contenido de Minimal               |
| Curated Journal, About, Discover                       | 🔴 / 🟡 | 🟢    | Textos reales (el libro tiene "Why Yucatán", "Haciendas" y "Seasons")           |
| Find Your Yucatán                                      | 🔴      | 🟡    | Experiencia lista; el guardado no envía (Fase 4)                                |
| Plan Your Event                                        | 🟡      | 🟡    | Formulario con los campos exactos; el envío es de la Fase 4                     |
| Audiencia y tono                                       | 🔴      | 🟡    | La interfaz ya habla a planners y eventos; faltan los textos editoriales reales |
| Paleta · Tipografía · Composición                      | 🔴      | 🟢    | —                                                                               |
| Fotografía                                             | 🔴      | 🔴    | Originales en alta resolución y derechos para web                               |
| Rendimiento                                            | 🟡      | 🟡    | 88 en inicio y ficha frente a 90; LCP simulado 3.7 s                            |
| LOVE MÉXICO: URL de QR · UTM · backend                 | 🔴      | 🟡    | URL estables listas; faltan la captura de UTM y el backend                      |
