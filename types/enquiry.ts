export interface EnquiryDraft {
  vendorId: string;
  eventType: string;
  otherEventType: string;
  eventDate: string;
  dateNotFinalised: boolean;
  eventLocation: string;
  otherLocation: string;
  guestCount: string;
  budget: string;
  services: string[];
  message: string;
  fullName: string;
  mobileNumber: string;
  email: string;
}

export interface MockEnquiryRecord extends EnquiryDraft {
  id: string;
  submittedAt: string;
  status: 'Prototype only — validated and not sent to vendor';
}
