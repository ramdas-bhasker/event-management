import { Container } from '@/components/common/Container';
import { WHY_FEATURE_ITEMS, WHY_PLEDGE_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export function WhyChooseUs() {
  return (
    <section className="hp-section hp-section-ivory">
      <Container>
        <div className="why-grid">
          {/* Left Highlight Panel */}
          <div className="why-highlight-panel">
            <span className="section-eyebrow">Why Choose AyojanSetu</span>
            <h2 className="text-h2" style={{ marginBottom: 'var(--space-4)' }}>
              Designed Around How Hyderabad Celebrates
            </h2>
            <p
              className="text-body"
              style={{
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-6)',
              }}
            >
              Whether you are planning an intimate Griha Pravesh at home, a milestone
              birthday party, a corporate town hall, or a grand wedding celebration,
              AyojanSetu brings every event service into one clear marketplace.
            </p>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
              }}
            >
              {WHY_PLEDGE_ITEMS.map((item) => (
                <div key={item.title} className="why-pledge-item">
                  <span
                    className="material-symbols-outlined"
                    style={{ color: 'var(--brand-gold-dark)', fontSize: '24px' }}
                  >
                    {item.icon}
                  </span>
                  <div>
                    <h4 className="text-label" style={{ fontWeight: 700 }}>
                      {item.title}
                    </h4>
                    <p className="text-small" style={{ color: 'var(--text-secondary)' }}>
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right 5 Benefit Blocks */}
          <div className="why-features-grid">
            {WHY_FEATURE_ITEMS.map((feature) =>
              feature.spanTwo ? (
                <div
                  key={feature.title}
                  className="ay-card why-feature-card span-2"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-4)',
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{
                      color: 'var(--brand-green)',
                      fontSize: '32px',
                      flexShrink: 0,
                    }}
                  >
                    {feature.icon}
                  </span>
                  <div>
                    <h3
                      className="text-h4"
                      style={{ fontWeight: 600, marginBottom: '2px' }}
                    >
                      {feature.title}
                    </h3>
                    <p className="text-small" style={{ color: 'var(--text-secondary)' }}>
                      {feature.description}
                    </p>
                  </div>
                </div>
              ) : (
                <div key={feature.title} className={cn('ay-card why-feature-card')}>
                  <span
                    className="material-symbols-outlined"
                    style={{
                      color: 'var(--brand-green)',
                      fontSize: '28px',
                      marginBottom: 'var(--space-3)',
                    }}
                  >
                    {feature.icon}
                  </span>
                  <h3
                    className="text-h4"
                    style={{ fontWeight: 600, marginBottom: '6px' }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-small"
                    style={{ color: 'var(--text-secondary)', lineHeight: 1.55 }}
                  >
                    {feature.description}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
