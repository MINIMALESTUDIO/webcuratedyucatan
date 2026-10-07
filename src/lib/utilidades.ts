/** Une clases CSS e ignora los valores vacíos. */
export function cx(...clases: Array<string | false | null | undefined>): string {
  return clases.filter(Boolean).join(' ');
}

/** Devuelve un objeto con solo las claves indicadas. */
export function elegir<T extends object, K extends keyof T>(
  objeto: T,
  claves: readonly K[],
): Pick<T, K> {
  const resultado = {} as Pick<T, K>;
  for (const clave of claves) {
    if (clave in objeto) resultado[clave] = objeto[clave];
  }
  return resultado;
}
