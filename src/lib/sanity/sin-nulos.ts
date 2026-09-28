/**
 * GROQ devuelve `null` en campos vacíos y en referencias rotas; los tipos del sitio usan
 * campos opcionales. Esta función quita las propiedades null y los elementos null de los
 * arreglos, sin tocar los textos (que en modo borrador llevan stega).
 */
export function sinNulos<T>(valor: T): T {
  if (Array.isArray(valor)) {
    return valor.filter((elemento) => elemento !== null).map((elemento) => sinNulos(elemento)) as T;
  }
  if (valor !== null && typeof valor === 'object') {
    const resultado: Record<string, unknown> = {};
    for (const [clave, interno] of Object.entries(valor)) {
      if (interno !== null) resultado[clave] = sinNulos(interno);
    }
    return resultado as T;
  }
  return valor;
}
