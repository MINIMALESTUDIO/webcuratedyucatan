import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { BloqueTexto } from '@/lib/contenido/tipos';
import { cx } from '@/lib/utilidades';

/** Estilos del texto enriquecido de Sanity: párrafos, subtítulos, citas, listas y enlaces. */
const componentes: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h2: ({ children }) => <h2 className="mt-6 text-titulo-3">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-4 text-titulo-3">{children}</h3>,
    blockquote: ({ children }) => (
      <blockquote className="border-l border-tinta pl-6 italic">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc space-y-2 pl-6">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal space-y-2 pl-6">{children}</ol>,
  },
  marks: {
    link: ({ value, children }) => {
      const href = typeof value?.href === 'string' ? value.href : '#';
      const externo = href.startsWith('http');
      return (
        <a
          href={href}
          className="underline underline-offset-4 hover:decoration-2"
          {...(externo ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {children}
        </a>
      );
    },
  },
};

/** Texto enriquecido con medida de lectura cómoda. */
export function TextoEnriquecido({
  valor,
  className,
}: {
  valor: BloqueTexto[];
  className?: string;
}) {
  return (
    <div className={cx('flex max-w-lectura flex-col gap-5', className)}>
      <PortableText value={valor} components={componentes} />
    </div>
  );
}
