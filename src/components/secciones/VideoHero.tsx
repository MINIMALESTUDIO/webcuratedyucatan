'use client';

// Cliente: decide si reproducir el loop del hero después de mostrar la imagen (sección 10).
// No reproduce con prefers-reduced-motion ni Save-Data, elige la versión móvil en pantallas
// pequeñas y ofrece un botón de pausa (WCAG 2.2.2).
import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { ArchivoVideo } from '@/lib/contenido/tipos';
import { Icono } from '@/components/ui/Icono';

interface ConexionConAhorro {
  saveData?: boolean;
}

export function VideoHero({
  escritorio,
  movil,
}: {
  escritorio?: ArchivoVideo;
  movil?: ArchivoVideo;
}) {
  const t = useTranslations('Inicio.hero');
  const video = useRef<HTMLVideoElement>(null);
  const [fuente, setFuente] = useState<ArchivoVideo | null>(null);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const conexion = (navigator as Navigator & { connection?: ConexionConAhorro }).connection;
    if (reducirMovimiento || conexion?.saveData) return;

    const esMovil = window.matchMedia('(max-width: 767px)').matches;
    const elegido = esMovil ? movil : (escritorio ?? movil);
    if (!elegido) return;

    // Espera a que el navegador esté libre para no competir con la imagen principal.
    const cargar = () => setFuente(elegido);
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(cargar, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(cargar, 1200);
    return () => clearTimeout(id);
  }, [escritorio, movil]);

  if (!fuente) return null;

  function alternar() {
    const elemento = video.current;
    if (!elemento) return;
    if (elemento.paused) {
      void elemento.play();
      setPausado(false);
    } else {
      elemento.pause();
      setPausado(true);
    }
  }

  return (
    <>
      <video
        ref={video}
        className="absolute inset-0 -z-10 size-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      >
        <source src={fuente.url} type={fuente.mimeType} />
      </video>
      <button
        type="button"
        onClick={alternar}
        className="absolute right-4 bottom-4 z-10 inline-flex size-11 items-center justify-center rounded-full bg-tinta/60 text-cal foco-claro"
      >
        <Icono nombre={pausado ? 'play' : 'pausa'} />
        <span className="sr-only">{pausado ? t('reproducirVideo') : t('pausarVideo')}</span>
      </button>
    </>
  );
}
