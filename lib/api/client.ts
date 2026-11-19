/**
 * AyojanSetu – Cloudflare Workers / D1 / R2 API Service Layer Boundary
 *
 * NOTE: The Cloudflare Workers backend is NOT connected yet.
 * This service layer cleanly separates UI components from future Cloudflare API integration
 * without inventing fake API endpoints or pretending backend persistence exists.
 */

import type { EnquiryFormPayload } from '@/types';

export interface CloudflareApiStatus {
  isConfigured: boolean;
  baseUrl: string | null;
  r2PublicUrl: string | null;
  turnstileSiteKey: string | null;
}

export function getCloudflareConfig(): CloudflareApiStatus {
  const baseUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_API_URL || null;
  const r2PublicUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_PUBLIC_URL || null;
  const turnstileSiteKey = process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY || null;

  return {
    isConfigured: Boolean(baseUrl),
    baseUrl,
    r2PublicUrl,
    turnstileSiteKey,
  };
}

/**
 * Frontend-only placeholder for preparing an enquiry payload before Cloudflare Workers D1 integration.
 * Returns the validated payload with a clear `mode: 'frontend-placeholder'` flag.
 */
export function prepareVendorEnquiryPayload(
  payload: Omit<EnquiryFormPayload, 'submittedAt'>
): {
  mode: 'frontend-placeholder';
  payload: EnquiryFormPayload;
} {
  return {
    mode: 'frontend-placeholder',
    payload: {
      ...payload,
      submittedAt: new Date().toISOString(),
    },
  };
}
