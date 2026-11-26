'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { OCCASION_CATEGORIES } from '@/lib/constants';
import { useUiStore } from '@/stores/ui-store';

export function CategorySection() {
  const setSelectedEventType = useUiStore((s) => s.setSelectedEventType);
  const activateSearchPrototype = useUiStore((s) => s.activateSearchPrototype);

  return (
    <section id="event-categories" className="hp-section hp-section-ivory">
      <Container>
        <SectionHeading
          eyebrow="Occasions & Milestones"
          eyebrowIcon="celebration"
          title="Celebrate Every Moment"
          subtitle="Explore event specialists tailored for traditional ceremonies, family milestones, and corporate gatherings."
          subtitleSize="body-lg"
          align="row"
          actionLink={{
            label: 'Explore All Events',
            href: '/vendors?location=hyderabad',
            icon: 'arrow_forward',
          }}
        />

        {/* 8-Card All-Events Occasions Grid */}
        <div className="categories-grid">
          {OCCASION_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="ay-card ay-card-interactive category-card"
              onClick={() => {
                setSelectedEventType(category.eventFilter);
                activateSearchPrototype();
              }}
            >
              <div className="category-card-media">
                <Image
                  src={category.imageUrl}
                  alt={category.imageAlt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 540px) 100vw, (max-width: 1100px) 50vw, 25vw"
                  style={{ objectFit: 'cover' }}
                />
                <span className="category-count-pill">{category.pillLabel}</span>
              </div>
              <div className="category-card-body">
                <div>
                  <h3 className="category-card-title">{category.title}</h3>
                  <p
                    className="text-small"
                    style={{ color: 'var(--text-secondary)', marginTop: '6px' }}
                  >
                    {category.description}
                  </p>
                </div>
                <div className="category-card-footer">
                  <span>{category.ctaLabel}</span>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    chevron_right
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
