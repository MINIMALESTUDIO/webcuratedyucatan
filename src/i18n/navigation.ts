import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Enlaces y navegación que conocen las rutas traducidas de cada idioma.
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
