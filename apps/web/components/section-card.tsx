import React from 'react';
import type { ReactNode } from 'react';

export function SectionCard({
  title,
  eyebrow,
  children,
  aside,
  className,
}: {
  title: string;
  eyebrow?: string;
  children: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`card stack deferred-surface${className ? ` ${className}` : ''}`}
    >
      <div className="split">
        <div>
          {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
          <h2>{title}</h2>
        </div>
        {aside}
      </div>
      {children}
    </section>
  );
}
