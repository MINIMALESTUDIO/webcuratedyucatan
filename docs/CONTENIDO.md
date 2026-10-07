# Guía de contenido

Para quien carga y edita el contenido del sitio en Sanity Studio. No hace falta saber programar.

## 1. Dónde se edita

- **Studio publicado:** `https://curatedyucatan.sanity.studio`. El enlace definitivo se confirma al publicar el Studio. Se entra con la cuenta de Sanity invitada al proyecto.
- **En local** (equipo de desarrollo): `npm run studio` y abrir http://localhost:3333.

El Studio tiene tres herramientas en la barra superior:

| Herramienta             | Para qué sirve                                                                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Contenido**           | Menú con todo lo editable, ordenado como el sitio.                                                                                          |
| **Editar en la página** | Abre el sitio dentro del Studio. Haces clic en un texto o una foto y se abre su campo al lado; los cambios se ven al momento como borrador. |
| **Consultas GROQ**      | Herramienta técnica para revisar datos. No es necesaria para editar.                                                                        |

El menú **Contenido** sigue el mapa del sitio:

| Menú                            | Qué es                                                                             |
| ------------------------------- | ---------------------------------------------------------------------------------- |
| Inicio y configuración          | Los siete bloques del inicio, las redes y el correo de contacto                    |
| Discover Yucatán                | La página del destino: Mérida, Haciendas, Culture, Gastronomy, Nature, Experiences |
| Venues · Colecciones · Regiones | La colección de venues, sus tres categorías y las ubicaciones del filtro           |
| Catering · Photography          | La selección curada de partners, de 3 a 5 por sección                              |
| Design & Production (Minimal)   | Minimal como partner de diseño y producción, con sus áreas                         |
| Curated Journal                 | Los artículos                                                                      |
| About · Privacy                 | Las páginas de texto                                                               |
| Contactos de leads (privado)    | Correos que reciben copia de las solicitudes; nunca se muestran en el sitio        |

## 2. Editar directo desde la página

1. Entra a **Editar en la página**. Se carga el inicio del sitio.
2. Pasa el cursor sobre la página: lo editable se marca con un recuadro (textos, fotos, datos clave, videos y notas).
3. Haz clic: a la derecha se abre el documento en el campo exacto. Escribe o cambia la foto.
4. La vista de la izquierda muestra el **borrador** con tus cambios. Los visitantes siguen viendo la versión publicada.
5. Cuando esté listo, pulsa **Publicar**. El sitio se actualiza solo en unos segundos gracias al webhook de revalidación.

Para ir a otra página, usa los enlaces del propio sitio o la barra de direcciones de la herramienta (por ejemplo `/venues/slug-del-venue` o `/es` para español).

## 3. Reglas de contenido

La dirección visual está en `docs/referencias/prompt-visual.md`: el sitio debe sentirse como una **extensión digital del libro**.

- **La fotografía es protagonista.** El sitio es blanco y negro; el color lo ponen las fotos. Prioriza haciendas, arquitectura, Mérida, naturaleza, gastronomía, interiores, montajes y momentos humanos seleccionados. Evita fotos que hagan ver la plataforma como una página genérica de bodas.
- **Fotos en alta resolución:** al menos 2000 px de ancho para las portadas. Las fotos del PDF del libro están comprimidas y no sirven: pide los originales.
- **Todo texto visible es bilingüe.** Cada campo tiene columna _English_ (obligatoria) y _Español_. Si falta el español, el sitio muestra el inglés.
- **Los nombres de venues y partners no se traducen:** son nombres propios.
- **Texto alternativo obligatorio** en cada imagen: describe lo que se ve, en ambos idiomas.
- **Punto de interés:** al subir una foto, usa el botón de recorte para marcar el punto importante. El sitio lo respeta al recortar en móvil.
- **Videos loop:** MP4 o WebM sin audio, de 2 MB como máximo en escritorio y 1 MB en móvil. El Studio avisa si el archivo pesa más.
- **Slug:** es la parte final de la URL y es igual en ambos idiomas. Si lo cambias después de publicar, agrega el anterior en _Slugs anteriores_ para que los enlaces viejos redirijan.
- **Datos de ejemplo:** todo lo marcado `[DEMO]` es de relleno y debe reemplazarse antes de publicar el sitio.

## 4. Cargar un venue

1. **Contenido → Venues → crear (+).**
2. Pestaña **General**:
   - _Nombre_ y _Slug_ (pulsa "Generate").
   - _Visible en el sitio_: encendido.
   - _Destacado en el inicio_: decisión editorial. El inicio muestra de 4 a 6.
   - _Colección_: una de las tres (Contemporary Sanctuaries, Organic Estates, Timeless Venues). Ordena el listado y el resultado de Find Your Yucatán.
   - _Ubicación_ (región) y _Localidad_ (municipio, por ejemplo "Chocholá").
   - _Resumen_ (para buscadores, máximo 200 caracteres) y _Descripción_ (el "About"), en ambos idiomas.
   - _Lo que lo distingue_: hasta 3 atributos (arquitectura, naturaleza, gastronomía, privacidad, ubicación). Find Your Yucatán los usa en "What matters most?".
3. Pestaña **Datos clave**: capacidad máxima, hospedaje (habitaciones y huéspedes) y distancia al centro de Mérida en minutos y km.
4. Pestaña **Espacios y notas**:
   - _Espacios_: cada uno con nombre, interior o exterior, capacidad e imagen. El dato "Indoor / Outdoor" del venue se calcula solo a partir de sus espacios.
   - _Curated Notes_: hasta 6 notas prácticas para wedding planners (accesos de proveedores, horarios, logística).
5. Pestaña **Fotos y video**: imagen principal (obligatoria), loops opcionales y galería amplia.
6. Pestaña **Película**: el video del venue en la serie "El Lugar de Tu Historia". Son los 11 caracteres después de `v=` en la URL de YouTube; los capítulos son opcionales, con título y segundo de inicio (1:35 = 95).
7. **Publicar.** El venue aparece en el listado y su ficha queda en `/venues/<slug>` y `/es/venues/<slug>`.

Un venue solo se muestra si tiene imagen principal, colección, región, localidad y capacidad máxima.

## 5. Catering, Photography y Minimal

- **Partner (Catering o Photography):** elige la _Sección_ y completa los datos del perfil:
  - nombre comercial;
  - especialidad y diferenciador breve;
  - descripción y principales servicios;
  - estilo;
  - experiencia en bodas destino;
  - ciudad base y zonas donde trabajan;
  - web e Instagram;
  - fotografía principal, galería y logotipo.

  En fotografía aparece además el _Enfoque_ (Editorial, Documentary, Fine Art, Cinematic). La fotografía pesa más que el logotipo en todo el sitio. El contacto comercial va en _Contactos de leads (privado)_, no en la ficha.

- **Design & Production (Minimal):** documento único con descripción, estilo, experiencia, cobertura y las áreas (Furniture, Tabletop, Floral Design, Décor, Production). Cada área lleva una o dos fotos de portafolio. No es un directorio: presenta a un solo partner.

## 6. Contenido editorial

- **Inicio y configuración:** lema del hero, imagen y video del hero, y los textos de "What is Curated?", "Discover Yucatán" (con sus siete temas), "Explore Curated" (cuatro áreas con foto) y "Plan your event". Cada tema de Discover lleva el _ancla_ de la sección a la que enlaza (merida, haciendas, cultura, gastronomia, naturaleza, experiencias). Los venues destacados y los artículos del inicio salen solos de los venues marcados como destacados y de los tres artículos más recientes.
- **Discover Yucatán:** título, entradilla, imagen principal y secciones. Cada sección tiene ancla, título, etiquetas opcionales ("City · Architecture · Gastronomy · Lifestyle"), texto y una o dos fotos.
- **Curated Journal:** título, slug, portada, extracto, cuerpo y fecha. El tiempo de lectura se calcula solo.
- **About y Privacy:** título, entradilla y secciones (texto, imagen, preguntas frecuentes o llamado a la acción). No se pueden borrar ni duplicar.
- **Colecciones:** nombre, lema, descripción, la palabra del resultado de Find Your Yucatán ("Timeless") e imagen. Cambiar de tres a dos colecciones, o renombrarlas, se hace aquí sin tocar código.

## 7. Si algo no aparece en el sitio

- ¿Está **publicado**? Los borradores solo se ven en "Editar en la página".
- ¿El venue tiene **Visible en el sitio** encendido y los campos obligatorios completos?
- ¿Pasaron unos segundos desde publicar? Si tras un minuto no cambia, avisa al equipo técnico: puede fallar el webhook de revalidación.
