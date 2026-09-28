import { getTranslations } from 'next-intl/server';

export default async function Inicio() {
  const t = await getTranslations('Metadatos');
  return <h1>{t('inicioTitulo')}</h1>;
}
