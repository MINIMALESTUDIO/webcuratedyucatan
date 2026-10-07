import { getTranslations } from 'next-intl/server';
import { BotonEnlace } from '@/components/ui/Boton';
import { Contenedor } from '@/components/ui/Contenedor';
import { Sobretitulo } from '@/components/ui/Sobretitulo';

// 404 en el idioma de la URL. El diseño definitivo llega en la Fase 5.
export default async function NoEncontrado() {
  const t = await getTranslations('NoEncontrado');
  return (
    <section className="py-seccion">
      <Contenedor>
        <Sobretitulo>404</Sobretitulo>
        <h1 className="mt-4 text-titulo-1">{t('titulo')}</h1>
        <p className="mt-5 max-w-xl text-destacado text-tinta-suave">{t('texto')}</p>
        <BotonEnlace href="/" variante="primario" className="mt-8">
          {t('volver')}
        </BotonEnlace>
      </Contenedor>
    </section>
  );
}
