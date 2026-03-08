import type { Metadata } from 'next';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { getEnv } from '@compute-atlas/config';

import './globals.css';

const navItems = [
  { href: '/', label: 'Overview' },
  { href: '/instruments', label: 'Instruments' },
  { href: '/providers', label: 'Providers' },
  { href: '/methodology', label: 'Methodology' },
  { href: '/publications', label: 'Publications' },
  { href: '/admin', label: 'Admin' },
] as const;

export const metadata: Metadata = {
  title: 'Compute Atlas',
  description:
    'Open-source compute price oracle for transparent GPU market indexing and Solana devnet publication.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  const env = getEnv();

  return (
    <html lang="en">
      <body>
        <div className="shell">
          <header className="topbar">
            <div className="topbar-inner">
              <div className="brand-block">
                <Link className="brand" href="/">
                  {env.NEXT_PUBLIC_APP_NAME}
                </Link>
                <span className="status-dot">Open oracle core</span>
              </div>
              <nav aria-label="Primary" className="nav">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
          </header>
          <main>{children}</main>
          <footer className="footer-shell">
            <div className="footer surface">
              <div>
                <div className="eyebrow">Verifiable by default</div>
                <p className="footer-copy">
                  Methodology, publication logic, and provider normalization are
                  open in public. Paid services, if added later, should be
                  hosted layers on top of this codebase rather than a closed
                  replacement for it.
                </p>
              </div>
              <div className="footer-links">
                <a
                  href={env.NEXT_PUBLIC_REPOSITORY_URL}
                  rel="noreferrer"
                  target="_blank"
                >
                  GitHub
                </a>
                <Link href="/methodology">Methodology</Link>
                <Link href="/publications">Publications</Link>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
