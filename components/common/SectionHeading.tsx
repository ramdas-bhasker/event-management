import type { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow: string;
  eyebrowIcon?: string;
  title: string;
  subtitle?: string;
  align?: 'row' | 'center';
  actionLink?: {
    label: string;
    href: string;
    icon?: string;
  };
  subtitleSize?: 'body' | 'body-lg';
  children?: ReactNode;
}

export function SectionHeading({
  eyebrow,
  eyebrowIcon,
  title,
  subtitle,
  align = 'row',
  actionLink,
  subtitleSize = 'body',
}: SectionHeadingProps) {
  if (align === 'center') {
    return (
      <div className="section-header-center">
        <div className="section-eyebrow">
          {eyebrowIcon && (
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              {eyebrowIcon}
            </span>
          )}
          <span>{eyebrow}</span>
        </div>
        <h2 className="text-h1">{title}</h2>
        {subtitle && (
          <p
            className={subtitleSize === 'body-lg' ? 'text-body-lg' : 'text-body'}
            style={{ color: 'var(--text-secondary)', marginTop: '8px' }}
          >
            {subtitle}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="section-header-row">
      <div>
        <div className="section-eyebrow">
          {eyebrowIcon && (
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              {eyebrowIcon}
            </span>
          )}
          <span>{eyebrow}</span>
        </div>
        <h2 className="text-h1">{title}</h2>
        {subtitle && (
          <p
            className={subtitleSize === 'body-lg' ? 'text-body-lg' : 'text-body'}
            style={{ color: 'var(--text-secondary)', marginTop: '4px' }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {actionLink && (
        <a href={actionLink.href} className="section-link">
          <span>{actionLink.label}</span>
          <span className="material-symbols-outlined">
            {actionLink.icon || 'arrow_forward'}
          </span>
        </a>
      )}
    </div>
  );
}
