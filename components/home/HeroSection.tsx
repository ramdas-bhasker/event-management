import Image from 'next/image';
import { Container } from '@/components/common/Container';
import { HeroSearchWidget } from '@/components/home/HeroSearchWidget';

export function HeroSection() {
  return (
    <section id="hero" className="hero-section">
      <Container>
        <div className="hero-grid">
          {/* Left Column: Copy & All-Events Multi-Filter Search Widget */}
          <div>
            <div className="hero-pill">
              <span
                className="material-symbols-outlined"
                style={{ fontSize: '16px', color: 'var(--brand-gold-dark)' }}
              >
                celebration
              </span>
              <span
                className="text-badge"
                style={{ color: 'var(--brand-green)', textTransform: 'uppercase' }}
              >
                Hyderabad’s All-Events Marketplace
              </span>
            </div>

            <h1 className="hero-title">
              Make Every Occasion <br />
              <span className="hero-title-accent">Unforgettable.</span>
            </h1>

            <p className="hero-subtitle">
              Discover event professionals for weddings, birthdays, corporate events,
              traditional family functions, housewarmings, and private celebrations across
              Hyderabad.
            </p>

            {/* Interactive Multi-Field Search Widget & Popular Tags */}
            <HeroSearchWidget />
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div>
            <div className="hero-visual-frame">
              <Image
                src="/images/luxury_wedding_decor.png"
                alt="Grand Indian celebration setup in Hyderabad featuring warm ambient lighting and floral stage decor"
                fill
                priority
                sizes="(max-width: 1100px) 100vw, 42vw"
                style={{ objectFit: 'cover' }}
              />
              <div className="hero-visual-overlay" />

              {/* Floating Pill 1 */}
              <div className="hero-float-top">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '4px',
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '18px', color: 'var(--brand-gold-dark)' }}
                  >
                    verified_user
                  </span>
                  <span
                    className="text-badge"
                    style={{ color: 'var(--brand-green)', textTransform: 'uppercase' }}
                  >
                    Curated Directory
                  </span>
                </div>
                <p
                  className="text-small"
                  style={{ color: 'var(--text-secondary)', lineHeight: 1.35 }}
                >
                  Compare service portfolios, clear starting prices, and direct vendor
                  contacts.
                </p>
              </div>

              {/* Floating Pill 2 */}
              <div className="hero-float-bottom">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--brand-gold)',
                      }}
                    />
                    <span
                      className="text-label"
                      style={{ color: 'var(--brand-green)', fontWeight: 600 }}
                    >
                      Every Celebration Covered
                    </span>
                  </div>
                  <span className="badge badge-gold">Hyderabad</span>
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span className="text-small" style={{ color: 'var(--text-secondary)' }}>
                    Weddings · Birthdays · Corporate · Poojas
                  </span>
                  <span
                    className="text-label"
                    style={{ fontWeight: 600, color: 'var(--brand-green)' }}
                  >
                    Direct Enquiry
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
