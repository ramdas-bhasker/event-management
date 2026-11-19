import { Container } from '@/components/common/Container';
import { SectionHeading } from '@/components/common/SectionHeading';
import { HOW_IT_WORKS_STEPS } from '@/lib/constants';

export function HowItWorks() {
  return (
    <section id="how-it-works" className="hp-section hp-section-white">
      <Container>
        <SectionHeading
          eyebrow="Simplicity & Transparency"
          title="How AyojanSetu Works"
          subtitle="Explore local event services, compare options side by side, and connect directly with vendors."
          align="center"
        />

        <div className="steps-grid">
          {HOW_IT_WORKS_STEPS.map((step) => (
            <div key={step.number} className="ay-card step-card">
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 'var(--space-6)',
                  }}
                >
                  <span className="step-number">{step.number}</span>
                  <div className="step-icon-box">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: '26px' }}
                    >
                      {step.icon}
                    </span>
                  </div>
                </div>
                <h3 className="text-h3" style={{ marginBottom: 'var(--space-2)' }}>
                  {step.title}
                </h3>
                <p className="text-body" style={{ color: 'var(--text-secondary)' }}>
                  {step.description}
                </p>
              </div>
              <div
                style={{
                  marginTop: 'var(--space-6)',
                  paddingTop: 'var(--space-4)',
                  borderTop: '1px solid var(--border-default)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--brand-green)',
                }}
                className="text-label"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '16px', color: 'var(--state-success)' }}
                >
                  check_circle
                </span>
                <span>{step.trustBadge}</span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
