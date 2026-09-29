import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { ProveedorResumen } from '@/lib/contenido/tipos';
import { localizar } from '@/lib/i18n/localizar';
import { ImagenContenido } from '@/components/ui/ImagenContenido';

/**
 * Vista general de un partner (documento de estructura, secciones 8 y 9): fotografía principal,
 * nombre comercial, especialidad y diferenciador. La foto pesa más que el logotipo.
 */
export function TarjetaProveedor({ proveedor }: { proveedor: ProveedorResumen }) {
  const t = useTranslations('Proveedores');
  const idioma = useLocale();
  const destino =
    proveedor.tipo === 'catering'
      ? ({ pathname: '/catering/[slug]', params: { slug: proveedor.slug } } as const)
      : ({ pathname: '/fotografia/[slug]', params: { slug: proveedor.slug } } as const);

  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-arena">
        <ImagenContenido
          imagen={proveedor.imagen}
          edicion={{ id: proveedor._id, tipo: 'proveedor', ruta: 'imagenPrincipal' }}
          sizes="(min-width: 1280px) 600px, (min-width: 768px) 45vw, 100vw"
          className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.03]"
        />
      </div>
      <div className="mt-6 flex flex-col gap-2">
        <p className="etiqueta text-tinta-suave">
          {proveedor.estilosFotografia.length > 0
            ? proveedor.estilosFotografia.map((estilo) => t(`estilos.${estilo}`)).join(' · ')
            : localizar(proveedor.especialidad, idioma)}
        </p>
        <h2 className="titulo-nombre text-titulo-2 leading-tight">
          <Link href={destino} className="after:absolute after:inset-0">
            {proveedor.nombre}
          </Link>
        </h2>
        {proveedor.estilosFotografia.length > 0 && (
          <p className="text-sm">{localizar(proveedor.especialidad, idioma)}</p>
        )}
        <p className="text-sm text-tinta-suave">{localizar(proveedor.resumen, idioma)}</p>
        <span aria-hidden="true" className="enlace-accion mt-1 self-start">
          {t('perfil.ver')}
        </span>
      </div>
    </article>
  );
}
