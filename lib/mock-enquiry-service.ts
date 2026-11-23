import type { EnquiryDraft, MockEnquiryRecord } from '@/types/enquiry';

const STORAGE_KEY = 'ayojansetu_demo_enquiries';
const LATEST_ENQUIRY_KEY = 'ayojansetu_latest_demo_enquiry';

function readRecords(): MockEnquiryRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const value: unknown = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(value) ? (value as MockEnquiryRecord[]) : [];
  } catch {
    return [];
  }
}

export function submitMockEnquiry(draft: EnquiryDraft): MockEnquiryRecord {
  if (typeof window === 'undefined') {
    throw new Error('Mock enquiries can only be submitted in the browser.');
  }

  const id = `AS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
  const record: MockEnquiryRecord = {
    ...draft,
    id,
    submittedAt: new Date().toISOString(),
    status: 'Prototype only — validated and not sent to vendor',
  };
  const records = readRecords();
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify([...records, record]));
  sessionStorage.setItem(LATEST_ENQUIRY_KEY, record.id);
  return record;
}

export function getMockEnquiry(enquiryId: string): MockEnquiryRecord | null {
  return readRecords().find((record) => record.id === enquiryId) ?? null;
}

export function getMockEnquiries(): MockEnquiryRecord[] {
  return readRecords();
}

export function getLatestMockEnquiry(): MockEnquiryRecord | null {
  if (typeof window === 'undefined') return null;
  try {
    const latestId = sessionStorage.getItem(LATEST_ENQUIRY_KEY);
    const records = readRecords();
    return records.find((record) => record.id === latestId) ?? records.at(-1) ?? null;
  } catch {
    return null;
  }
}
