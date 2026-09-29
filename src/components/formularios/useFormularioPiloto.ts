'use client';

import { type FormEvent, useRef, useState } from 'react';
import type { z } from 'zod';
import { type CodigoError, erroresPorCampo } from '@/lib/validacion/errores';
import { useHidratado } from './useHidratado';

/**
 * Estado común de los formularios del piloto (D-027): valida con zod en el cliente,
 * enfoca el primer campo con error y, si todo es válido, muestra el aviso de envío
 * desactivado sin mandar nada.
 * El esquema se carga con import() al enviar (D-031): zod no forma parte del JS inicial.
 * El prefijo "use" es obligatorio por convención de React para los hooks.
 */
export function useFormularioPiloto<T>(
  cargarEsquema: () => Promise<z.ZodType<T>>,
  leer: (datos: FormData) => Record<string, unknown>,
) {
  const [errores, setErrores] = useState<Record<string, CodigoError>>({});
  const [validado, setValidado] = useState(false);
  const aviso = useRef<HTMLDivElement>(null);
  const hidratado = useHidratado();

  async function alEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    // currentTarget deja de existir cuando termina el evento: se guarda antes de esperar.
    const formulario = evento.currentTarget;
    const datos = leer(new FormData(formulario));
    const esquema = await cargarEsquema();
    const resultado = esquema.safeParse(datos);

    if (!resultado.success) {
      const nuevos = erroresPorCampo(resultado.error);
      setErrores(nuevos);
      setValidado(false);
      const primero = Object.keys(nuevos)[0];
      // En los grupos de opciones namedItem devuelve un RadioNodeList: se enfoca la primera.
      const campo = primero ? formulario.elements.namedItem(primero) : null;
      const destino = campo instanceof RadioNodeList ? campo[0] : campo;
      if (destino instanceof HTMLElement) destino.focus();
      return;
    }

    setErrores({});
    setValidado(true);
    // Lleva el foco al aviso para que los lectores de pantalla lo anuncien.
    requestAnimationFrame(() => aviso.current?.focus());
  }

  return { errores, validado, aviso, alEnviar, hidratado };
}

/** Lee un campo de texto de FormData (undefined si no existe). */
export function textoDe(datos: FormData, nombre: string): string | undefined {
  const valor = datos.get(nombre);
  return typeof valor === 'string' ? valor : undefined;
}
