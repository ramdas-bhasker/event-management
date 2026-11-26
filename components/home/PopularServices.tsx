'use client';

import Link from 'next/link';
import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { POPULAR_SERVICES } from '@/lib/constants';
import { useUiStore } from '@/stores/ui-store';

export function PopularServices() {
  const setSelectedService = useUiStore((s) => s.setSelectedService);
  const activateSearchPrototype = useUiStore((s) => s.activateSearchPrototype);

  return (
    <section id="vendor-categories" className="hp-section hp-section-white">
      <Container>
        <SectionHeading
          eyebrow="Event Service Directory"
          title="Browse Vendors by Service Category"
          subtitle="Connect with specialized event professionals across Hyderabad for every part of your celebration."
          align="center"
        />

        <div className="services-grid">
          {POPULAR_SERVICES.map((service) => (
            <Link
              key={service.id}
              href={service.href}
              className="ay-card ay-card-interactive service-card"
              onClick={() => {
                setSelectedService(service.serviceId);
                activateSearchPrototype();
              }}
            >
              <div className="service-icon-box">
                <span className="material-symbols-outlined">{service.icon}</span>
              </div>
              <div>
                <h3 className="text-h4" style={{ fontWeight: 600 }}>
                  {service.title}
                </h3>
                <p
                  className="text-small"
                  style={{ color: 'var(--text-secondary)', marginTop: '2px' }}
                >
                  {service.subtitle}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
