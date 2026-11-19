'use client';

import { Container } from '@/components/common/Container';
import { useUiStore } from '@/stores/ui-store';

export function CTASection() {
  const openEnquiryModal = useUiStore((s) => s.openEnquiryModal);
  const openProfileModal = useUiStore((s) => s.openProfileModal);

  return (
    <section
      id="vendor-cta"
      className="hp-section hp-section-ivory"
      style={{ paddingTop: 0 }}
    >
      <Container>
        <div className="cta-banner">
          <div className="cta-gold-bar" />
          <div className="cta-banner-inner">
            <div style={{ maxWidth: '680px' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'rgba(255,255,255,0.10)',
                  marginBottom: 'var(--space-4)',
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontSize: '16px', color: 'var(--brand-gold)' }}
                >
                  storefront
                </span>
                <span
                  className="text-badge"
                  style={{ textTransform: 'uppercase', color: '#FFFFFF' }}
                >
                  For Hyderabad Event Professionals
                </span>
              </div>

              <h2
                className="text-display"
                style={{ color: '#FFFFFF', marginBottom: 'var(--space-3)' }}
              >
                Get More Visibility for Your Event Business
              </h2>

              <p
                className="text-body"
                style={{ color: 'rgba(247, 244, 237, 0.88)', lineHeight: 1.6 }}
              >
                Showcase your services, display your portfolio and connect with customers
                looking for event professionals across Hyderabad.
              </p>

              <div className="cta-metrics-row">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '18px' }}
                  >
                    photo_library
                  </span>
                  <span>Dedicated Portfolio Showcase</span>
                </div>
                <span style={{ opacity: 0.5 }}>·</span>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '18px' }}
                  >
                    category
                  </span>
                  <span>All Event Categories Supported</span>
                </div>
                <span style={{ opacity: 0.5 }}>·</span>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <span
                    className="material-symbols-outlined"
                    style={{ fontSize: '18px' }}
                  >
                    chat
                  </span>
                  <span>Direct Customer Enquiries</span>
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
                flexShrink: 0,
                minWidth: '250px',
              }}
            >
              <button
                type="button"
                className="btn btn-lg"
                style={{
                  backgroundColor: 'var(--brand-ivory)',
                  color: 'var(--brand-green)',
                }}
                onClick={() => openEnquiryModal('Vendor Business Registration Preview')}
              >
                List Your Business
              </button>
              <button
                type="button"
                className="btn btn-md"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.10)',
                  color: '#FFFFFF',
                  borderColor: 'rgba(255,255,255,0.20)',
                }}
                onClick={() =>
                  openProfileModal({
                    eyebrow: 'Vendor Onboarding Guide',
                    name: 'How Vendor Registration Works on AyojanSetu',
                    category: 'All Event Services',
                    area: 'Hyderabad Marketplace',
                    about:
                      '1. Submit your business details, service categories, and Hyderabad locality coverage. 2. Upload real event portfolio photos and starting price baselines. 3. Once verified, customers can discover your profile and contact you directly via WhatsApp or phone.',
                    price: 'Transparent Listing · Direct Customer Leads',
                    status:
                      'Ready to list your business? Click below to preview vendor onboarding.',
                  })
                }
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  help_outline
                </span>
                <span>How Vendor Registration Works</span>
              </button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
