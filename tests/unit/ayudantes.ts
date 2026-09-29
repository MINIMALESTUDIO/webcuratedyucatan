import type { VenueTarjeta } from '@/lib/contenido/tipos';

/** Tarjeta de venue mínima para las pruebas; los valores dados reemplazan a los de base. */
export function tarjeta(parcial: Partial<VenueTarjeta> & Pick<VenueTarjeta, 'slug'>): VenueTarjeta {
  return {
    _id: parcial.slug,
    nombre: parcial.slug,
    destacado: false,
    coleccion: {
      nombre: { en: 'Timeless Venues' },
      slug: 'timeless',
      resultado: { en: 'Timeless' },
    },
    region: { nombre: { en: 'Region' }, slug: 'alrededores-de-merida' },
    localidad: 'Localidad',
    minutosCentroMerida: 30,
    imagen: { url: '/x.jpg', ancho: 10, alto: 10, alt: { en: 'x' } },
    capacidadMax: 150,
    tieneHospedaje: false,
    entorno: 'exterior',
    atributos: [],
    ...parcial,
  };
}
