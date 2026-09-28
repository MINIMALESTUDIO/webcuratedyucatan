import type {
  BloquesLocalizados,
  BloqueTexto,
  Idioma,
  TextoLocalizado,
} from '@/lib/contenido/tipos';

function avisarFalta(idioma: Idioma, muestra: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.warn(
      `[i18n] Falta la traducción "${idioma}"; se muestra el inglés: "${muestra.slice(0, 60)}"`,
    );
  }
}

/**
 * Devuelve el texto en el idioma pedido. Si falta, usa el inglés y lo avisa en consola
 * solo en desarrollo (sección 5 de docs/PROMPT.md).
 */
export function localizar(campo: TextoLocalizado | undefined, idioma: Idioma): string {
  if (!campo) return '';
  const valor = campo[idioma];
  if (valor) return valor;
  if (idioma !== 'en') avisarFalta(idioma, campo.en);
  return campo.en;
}

export function localizarBloques(
  campo: BloquesLocalizados | undefined,
  idioma: Idioma,
): BloqueTexto[] {
  if (!campo) return [];
  const valor = campo[idioma];
  if (valor && valor.length > 0) return valor;
  if (idioma !== 'en') avisarFalta(idioma, campo.en[0]?.children[0]?.text ?? '');
  return campo.en;
}
