# Guía de contenido

Para quien carga y edita contenido del sitio en Sanity Studio. No hace falta saber programar.

## 1. Dónde se edita

- **Studio publicado:** `https://curatedyucatan.sanity.studio` (el enlace definitivo se confirma al publicar el Studio). Se entra con la cuenta de Sanity invitada al proyecto.
- **En local** (equipo de desarrollo): `npm run studio` y abrir http://localhost:3333.

El Studio tiene tres herramientas en la barra superior:

| Herramienta             | Para qué sirve                                                                                                                              |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Contenido**           | Lista de documentos: configuración del sitio, venues, regiones, proveedores, historias, etc.                                                |
| **Editar en la página** | Abre el sitio dentro del Studio. Haces clic en un texto o una foto y se abre su campo al lado; los cambios se ven al momento como borrador. |
| **Consultas GROQ**      | Herramienta técnica para revisar datos. No es necesaria para editar.                                                                        |

## 2. Editar directo desde la página

1. Entra a **Editar en la página**. Se carga el inicio del sitio.
2. Pasa el cursor sobre la página: lo editable se marca con un recuadro. Funciona en textos, imágenes, la ficha técnica, los videos y las métricas.
3. Haz clic: a la derecha se abre el documento en el campo exacto. Escribe o cambia la imagen.
4. La vista de la izquierda muestra el **borrador** con tus cambios. Los visitantes siguen viendo la versión publicada.
5. Cuando esté listo, pulsa **Publicar**. El sitio se actualiza solo en unos segundos (webhook de revalidación).

Para navegar a otra página dentro de la vista, usa los enlaces del propio sitio o la barra de direcciones de la herramienta (por ejemplo `/venues/slug-del-venue` o `/es` para español).

## 3. Reglas de contenido

- **Todo texto visible es bilingüe.** Cada campo tiene columna _English_ (obligatoria) y _Español_. Si falta el español, el sitio muestra el inglés.
- **Los nombres de venues y proveedores no se traducen** (son nombres propios).
- **Texto alternativo obligatorio** en cada imagen: describe lo que se ve, en ambos idiomas.
- **Punto de interés:** al subir una foto, usa el botón de recorte para marcar el punto importante. El sitio lo respeta al recortar en móvil.
- **Videos loop:** MP4 o WebM sin audio, máximo 2 MB (escritorio) y 1 MB (móvil). El Studio avisa si el archivo pesa más.
- **Slug:** es la parte final de la URL e igual en ambos idiomas. Si lo cambias después de publicar, agrega el anterior en _Slugs anteriores_ para que los enlaces viejos redirijan.
- **Datos de ejemplo:** todo lo marcado `[DEMO]` es de relleno y debe reemplazarse antes de publicar el sitio.

## 4. Cargar un venue completo

1. **Contenido → Venues → crear (+).**
2. Pestaña **General**:
   - _Nombre_ y _Slug_ (pulsa "Generate").
   - _Visible en el sitio_: encendido.
   - _Destacado en el inicio_: decisión editorial.
   - _Nivel de listado_: Básico, Video o Destacado. Con "Básico" no se muestra la entrevista.
   - _Región_ y _Tipos_.
   - _Resumen_ (máximo 200 caracteres) y _Descripción_, ambos en inglés y español.
3. Pestaña **Ficha técnica**: capacidades (ceremonia, cóctel y banquete), hospedaje, catering, horario de música, traslados en minutos, inversión desde (USD, opcional), mejor temporada y ubicación (latitud y longitud).
4. Pestaña **Fotos y video**: imagen principal (obligatoria), loops opcionales y galería.
5. Pestaña **Entrevista**: ID del video de YouTube (los 11 caracteres después de `v=`), título opcional y capítulos. Cada capítulo lleva título y segundo de inicio (1:35 = 95).
6. Pestaña **Espacios y citas**: cada espacio con nombre, descripción, interior o exterior, capacidades por formato e imágenes; hasta 4 citas destacadas.
7. Pestaña **Proveedores**: hasta 6 proveedores recomendados.
8. Pestaña **SEO** (opcional): título, descripción e imagen para redes.
9. **Publicar.** El venue aparece en el listado y su ficha queda en `/venues/<slug>` y `/es/venues/<slug>`.

Un venue solo se muestra en el sitio cuando tiene imagen principal, región y ficha técnica con capacidad de banquete.

## 5. Documentos únicos

- **Configuración del sitio:** frase e imagen de portada, video de portada, secciones del inicio (Por qué Yucatán, sello y proceso, tradiciones), métricas, redes y correo. No se puede borrar ni duplicar.
- **Contactos de leads (privado):** correo que recibe copia de las solicitudes de cada venue o proveedor. **No se muestra en el sitio** y no es visible públicamente aunque el proyecto use el plan gratuito de Sanity (D-012). Solo el servidor lo lee para enviar las copias (Fase 4).

## 6. Si algo no aparece en el sitio

- ¿Está **publicado**? Los borradores solo se ven en "Editar en la página".
- ¿El venue tiene **Visible en el sitio** encendido y los campos obligatorios completos?
- ¿Pasaron unos segundos desde publicar? Si tras un minuto no cambia, avisa al equipo técnico (puede fallar el webhook de revalidación).
