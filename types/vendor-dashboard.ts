export type VendorEnquiryStatus =
  | 'New'
  | 'Contacted'
  | 'Quotation Sent'
  | 'Booked'
  | 'Not Converted';

export interface VendorDashboardEnquiry {
  id: string;
  vendorId: string;
  customerName: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  budget: string;
  receivedAt: string;
  status: VendorEnquiryStatus;
  guestCount: string;
  services: string[];
  message: string;
  mobileNumber: string;
  email: string;
  sampleRecord?: boolean;
}
