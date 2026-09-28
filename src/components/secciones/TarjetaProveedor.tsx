import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { ProveedorResumen } from '@/lib/contenido/tipos';
import { localizar } from '@/lib/i18n/localizar';
import { Icono } from '@/components/ui/Icono';
import { ImagenContenido } from '@/components/ui/ImagenContenido';

export function TarjetaProveedor({ proveedor }: { proveedor: ProveedorResumen }) {
  const idioma = useLocale();
  return (
    <article className="group relative flex flex-col bg-cal">
      <div className="relative aspect-[4/3] overflow-hidden bg-piedra">
        <ImagenContenido
          imagen={proveedor.imagen}
          edicion={{ id: proveedor._id, tipo: 'proveedor', ruta: 'imagenes:0' }}
          sizes="(min-width: 1024px) 380px, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="flex flex-col gap-2 p-5">
        <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.14em] text-henequen uppercase">
          <Icono nombre={proveedor.categoria.icono} className="size-4" />
          {localizar(proveedor.categoria.nombre, idioma)}
        </p>
        <h3 className="text-titulo-3">
          <Link
            href={{ pathname: '/proveedores/[slug]', params: { slug: proveedor.slug } }}
            className="after:absolute after:inset-0 group-hover:text-almagre"
          >
            {proveedor.nombre}
          </Link>
        </h3>
        <p className="text-sm text-tinta-suave">{localizar(proveedor.resumen, idioma)}</p>
      </div>
    </article>
  );
}
