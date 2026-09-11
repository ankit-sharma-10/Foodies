'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import classes from './nav-link.module.css';

export default function NavLink({ href, children }) {
  const path = usePathname();
  const isActive = href === '/' ? path === '/' : path.startsWith(href);

  return (
    <Link
      href={href}
      className={isActive ? `${classes.link} ${classes.active}` : classes.link}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  );
}
