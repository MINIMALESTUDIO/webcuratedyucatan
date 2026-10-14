'use client';

import { type FormEvent, useRef, useState } from 'react';
import type { z } from 'zod';
import { type CodigoError, erroresPorCampo } from '@/lib/validacion/errores';
import { useHidratado } from './useHidratado';

/** Estado del envío que muestra AvisoEnvio. "piloto": el correo aún no está configurado. */
export type EstadoEnvio = 'inicial' | 'enviando' | 'enviado' | 'piloto' | 'error' | 'limite';

/**
 * Estado común de los formularios (D-027, D-055): valida con zod en el cliente, enfoca el
 * primer campo con error y, si todo es válido, envía a /api/leads, que valida de nuevo.
 * Mientras el correo no esté configurado en el servidor (503 "no-configurado") se muestra el
 * aviso de piloto, como antes.
 * El esquema se carga con import() al enviar (D-031): zod no forma parte del JS inicial.
 * El prefijo "use" es obligatorio por convención de React para los hooks.
 */
export function useFormulario<T extends object>(
  tipo: 'solicitud' | 'seleccion',
  cargarEsquema: () => Promise<z.ZodType<T>>,
  leer: (datos: FormData) => Record<string, unknown>,
) {
  const [errores, setErrores] = useState<Record<string, CodigoError>>({});
  const [estado, setEstado] = useState<EstadoEnvio>('inicial');
  const aviso = useRef<HTMLDivElement>(null);
  const hidratado = useHidratado();

  async function alEnviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    // Un envío a la vez; tras el éxito el formulario ya no se reenvía (evita duplicados).
    if (estado === 'enviando' || estado === 'enviado') return;
    // currentTarget deja de existir cuando termina el evento: se guarda antes de esperar.
    const formulario = evento.currentTarget;
    const datosFormulario = new FormData(formulario);
    const datos = leer(datosFormulario);
    const esquema = await cargarEsquema();
    const resultado = esquema.safeParse(datos);

    if (!resultado.success) {
      const nuevos = erroresPorCampo(resultado.error);
      setErrores(nuevos);
      setEstado('inicial');
      const primero = Object.keys(nuevos)[0];
      // En los grupos de opciones namedItem devuelve un RadioNodeList: se enfoca la primera.
      const campo = primero ? formulario.elements.namedItem(primero) : null;
      const destino = campo instanceof RadioNodeList ? campo[0] : campo;
      if (destino instanceof HTMLElement) destino.focus();
      return;
    }

    setErrores({});
    setEstado('enviando');
    let siguiente: EstadoEnvio = 'error';
    try {
      const respuesta = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo,
          sitioWeb: textoDe(datosFormulario, 'sitioWeb') ?? '',
          ...resultado.data,
        }),
      });
      const cuerpo = (await respuesta.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (cuerpo.ok) siguiente = 'enviado';
      else if (cuerpo.error === 'no-configurado') siguiente = 'piloto';
      else if (respuesta.status === 429) siguiente = 'limite';
    } catch {
      siguiente = 'error';
    }
    setEstado(siguiente);
    // Lleva el foco al aviso para que los lectores de pantalla lo anuncien.
    requestAnimationFrame(() => aviso.current?.focus());
  }

  return { errores, estado, aviso, alEnviar, hidratado };
}

/** Lee un campo de texto de FormData (undefined si no existe). */
export function textoDe(datos: FormData, nombre: string): string | undefined {
  const valor = datos.get(nombre);
  return typeof valor === 'string' ? valor : undefined;
}
