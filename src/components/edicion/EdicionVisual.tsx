'use client';

// Cliente: carga diferida de la edición visual. Aunque solo se dibuja en modo borrador, si sus
// módulos se importaran de forma estática Next incluiría ~180 KB comprimidos en todas las
// páginas. Con next/dynamic solo los descarga quien entra en vista previa (D-034).
import dynamic from 'next/dynamic';

export const EdicionVisual = dynamic(() => import('./EdicionVisualCompleta'), { ssr: false });
