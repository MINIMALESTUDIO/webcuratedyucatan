'use client';

// Cliente: se carga solo en modo borrador a través de EdicionVisual (next/dynamic).
import { VisualEditing } from 'next-sanity/visual-editing';
import { BotonSalirVistaPrevia } from './BotonSalirVistaPrevia';

export default function EdicionVisualCompleta() {
  return (
    <>
      <VisualEditing />
      <BotonSalirVistaPrevia />
    </>
  );
}
