import { getLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { CategoriaDescubreResumen } from '@/lib/contenido/tipos';
import { localizar } from '@/lib/i18n/localizar';
import { ImagenContenido } from '@/components/ui/ImagenContenido';

/**
 * Categoría de Discover Yucatán en "Continue exploring": imagen → categoría → enlace. La
 * tarjeta completa es clickeable (el enlace del nombre cubre todo el bloque).
 */
export async function TarjetaCategoria({ categoria }: { categoria: CategoriaDescubreResumen }) {
  const idioma = await getLocale();
  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden bg-arena">
        <ImagenContenido
          imagen={categoria.imagenPrincipal}
          edicion={{ id: categoria._id, tipo: 'categoriaDescubre', ruta: 'imagenPrincipal' }}
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <h3 className="mt-6 text-center font-marca text-sm tracking-[0.24em] uppercase">
        <Link
          href={{
            pathname: '/descubre-yucatan/[categoria]',
            params: { categoria: categoria.slug },
          }}
          className="after:absolute after:inset-0"
        >
          {localizar(categoria.titulo, idioma)}
        </Link>
      </h3>
    </article>
  );
}
