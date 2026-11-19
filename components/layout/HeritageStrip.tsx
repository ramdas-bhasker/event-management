import { Container } from '@/components/common/Container';

export function HeritageStrip() {
  return (
    <div className="heritage-strip">
      <Container className="heritage-strip-inner">
        <div className="heritage-strip-left">
          <span
            className="badge badge-gold"
            style={{
              background: 'rgba(185,154,98,0.22)',
              color: '#FFDEA6',
              borderColor: 'rgba(185,154,98,0.4)',
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
              celebration
            </span>
            Hyderabad All-Events Marketplace
          </span>
          <p className="text-small" style={{ color: 'rgba(255,255,255,0.88)' }}>
            Connecting families &amp; event hosts across{' '}
            <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>
              Hyderabad &amp; Secunderabad
            </strong>
          </p>
        </div>
        <div className="heritage-strip-right">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: 'var(--fs-badge)',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#FFDEA6',
            }}
          >
            <span className="pulse-dot" />
            <span>Direct Vendor Discovery · Transparent Quotations</span>
          </div>
          <a
            href="#footer-contact"
            className="text-small"
            style={{
              color: '#FFFFFF',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span>Support Desk</span>
            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
              arrow_outward
            </span>
          </a>
        </div>
      </Container>
    </div>
  );
}
