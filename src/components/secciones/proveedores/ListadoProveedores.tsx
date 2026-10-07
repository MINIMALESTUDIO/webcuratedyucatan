import { getTranslations } from 'next-intl/server';
import type { ProveedorResumen, TipoProveedor } from '@/lib/contenido/tipos';
import { Contenedor } from '@/components/ui/Contenedor';
import { EncabezadoSeccion } from '../EncabezadoSeccion';
import { TarjetaProveedor } from '../TarjetaProveedor';

/** Vista general de Catering o Photography: una selección curada, no un directorio masivo. */
export async function ListadoProveedores({
  tipo,
  proveedores,
}: {
  tipo: TipoProveedor;
  proveedores: ProveedorResumen[];
}) {
  const t = await getTranslations(`Proveedores.${tipo}`);
  return (
    <>
      <Contenedor className="pt-16 pb-14 sm:pt-20">
        <EncabezadoSeccion nivel="h1" titulo={t('titulo')} entradilla={t('entradilla')} />
      </Contenedor>
      <Contenedor className="pb-seccion">
        <ul className="grid gap-x-10 gap-y-16 md:grid-cols-2">
          {proveedores.map((proveedor) => (
            <li key={proveedor._id} className="flex">
              <TarjetaProveedor proveedor={proveedor} />
            </li>
          ))}
        </ul>
      </Contenedor>
    </>
  );
}
