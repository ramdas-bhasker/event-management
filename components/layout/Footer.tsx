'use client';

import Link from 'next/link';
import { Container } from '@/components/common/Container';
import { useUiStore } from '@/stores/ui-store';

export function Footer() {
  const openEnquiryModal = useUiStore((s) => s.openEnquiryModal);

  return (
    <footer id="footer-contact" className="site-footer">
      <Container>
        <div className="footer-grid">
          {/* Col 1: Brand Info */}
          <div>
            <Link
              href="/"
              className="brand-logo"
              style={{ marginBottom: 'var(--space-3)' }}
            >
              <div className="brand-mark">अ</div>
              <div className="brand-text-group">
                <span className="brand-title">AyojanSetu</span>
                <span className="brand-tagline">
                  Every Event. Every Occasion. One Platform.
                </span>
              </div>
            </Link>
            <p className="text-body footer-description">
              An all-events marketplace uniting host families, corporate planners, venues,
              and event professionals across Hyderabad.
            </p>
            <div className="footer-concierge-box">
              <span className="text-label footer-concierge-title">
                Hyderabad Service Areas
              </span>
              <p className="text-small footer-concierge-sub">
                Banjara Hills · Jubilee Hills · Gachibowli · Madhapur · Secunderabad ·
                Kondapur
              </p>
            </div>
          </div>

          {/* Col 2: Explore Events */}
          <div>
            <h3 className="footer-heading">Explore Events</h3>
            <ul className="footer-links">
              <li>
                <Link href="/vendors?event=weddings-receptions&location=hyderabad">
                  Weddings &amp; Engagements
                </Link>
              </li>
              <li>
                <Link href="/vendors?event=birthdays-milestones&location=hyderabad">
                  Birthdays &amp; Milestones
                </Link>
              </li>
              <li>
                <Link href="/vendors?event=corporate-galas&location=hyderabad">
                  Corporate Events
                </Link>
              </li>
              <li>
                <Link href="/vendors?event=pooja-traditional&location=hyderabad">
                  Traditional Functions
                </Link>
              </li>
              <li>
                <Link href="/vendors?event=pooja-traditional&location=hyderabad">
                  Housewarming &amp; Poojas
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Find Vendors */}
          <div>
            <h3 className="footer-heading">Find Vendors</h3>
            <ul className="footer-links">
              <li>
                <Link href="/vendors?category=wedding-decorators&location=hyderabad">
                  Decorators &amp; Florists
                </Link>
              </li>
              <li>
                <Link href="/vendors?category=wedding-photographers&location=hyderabad">
                  Photographers &amp; Videographers
                </Link>
              </li>
              <li>
                <Link href="/vendors?category=caterers&location=hyderabad">
                  Caterers &amp; Venues
                </Link>
              </li>
              <li>
                <Link href="/#vendor-cta">List Your Business</Link>
              </li>
              <li>
                <Link href="/#how-it-works">How It Works</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Support */}
          <div>
            <h3 className="footer-heading">Contact &amp; Support</h3>
            <p className="text-small footer-address">
              AyojanSetu Hyderabad Desk
              <br />
              Road No. 10, Banjara Hills
              <br />
              Hyderabad, Telangana 500034
            </p>
            <button
              type="button"
              className="btn btn-sm btn-whatsapp-tint"
              onClick={() => openEnquiryModal('AyojanSetu Support Desk')}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--whatsapp-green)',
                }}
              />
              <span>Contact Support Desk</span>
            </button>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            Built for Hyderabad celebrations · Banjara Hills, Jubilee Hills, Gachibowli,
            Madhapur, Secunderabad
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <a href="#footer-contact">Privacy Policy</a>
            <a href="#footer-contact">Terms of Service</a>
            <span>© 2026 AyojanSetu. All rights reserved.</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
