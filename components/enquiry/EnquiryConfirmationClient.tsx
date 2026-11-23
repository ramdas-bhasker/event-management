'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getLatestMockEnquiry } from '@/lib/mock-enquiry-service';
import { findEnquiryVendor } from '@/lib/enquiry-vendors';
import type { MockEnquiryRecord } from '@/types/enquiry';

function formatEventDate(date: string) {
  if (!date) return 'Date not finalised';
  const parsed = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? date : parsed.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function EnquiryConfirmationClient() {
  const [record, setRecord] = useState<MockEnquiryRecord | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setRecord(getLatestMockEnquiry());
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return <div className="rounded-2xl bg-brand-white p-8 text-sm text-text-secondary">Loading confirmation...</div>;

  const vendor = record ? findEnquiryVendor(record.vendorId) : undefined;

  if (!record || !vendor) {
    return (
      <section className="mx-auto max-w-2xl rounded-2xl bg-brand-white p-7 text-center shadow-sm sm:p-10">
        <h1 className="text-2xl font-bold text-brand-green">This prototype confirmation is unavailable</h1>
        <p className="mt-3 text-sm leading-relaxed text-text-secondary">Demo enquiries are kept only for the current browser session. Start a new enquiry or explore vendors.</p>
        <Link href="/vendors" className="btn btn-md btn-primary mt-6">Explore vendors</Link>
      </section>
    );
  }

  const eventType = record.eventType === 'Other' ? record.otherEventType : record.eventType;
  const eventLocation = record.eventLocation === 'Other location' ? record.otherLocation : record.eventLocation;

  return (
    <section className="mx-auto max-w-3xl overflow-hidden rounded-2xl bg-brand-white shadow-sm">
      <div className="bg-brand-green px-6 py-8 text-center text-white sm:px-10 sm:py-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/15 text-brand-gold">
          <span className="material-symbols-outlined text-3xl" aria-hidden="true">check_circle</span>
        </span>
        <h1 className="mt-4 text-2xl font-bold sm:text-3xl">Your Enquiry Is Ready!</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/80">This is a prototype confirmation. Your enquiry has been validated, but has not been sent to the vendor because the backend is not connected yet.</p>
      </div>

      <div className="p-6 sm:p-9">
        <div className="flex flex-col gap-4 border-b border-border-default pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Enquiry reference ID</p>
            <p className="mt-1 text-lg font-bold text-brand-green">{record.id}</p>
          </div>
          <span className="inline-flex w-fit items-center rounded-full bg-brand-ivory px-3 py-1.5 text-xs font-semibold text-brand-green">Prototype only · Not sent</span>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-[140px_1fr]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-brand-ivory sm:aspect-square">
            {vendor.portfolioImages[0] && <Image src={vendor.portfolioImages[0]} alt={`${vendor.businessName} portfolio`} fill sizes="140px" className="object-cover" />}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold-dark">Selected vendor</p>
            <h2 className="mt-1 text-xl font-bold text-brand-green">{vendor.businessName}</h2>
            <p className="mt-1 text-sm text-text-secondary">{vendor.categoryLabel} · {vendor.location}</p>
            <Link href={vendor.profileHref} className="mt-3 inline-block text-sm font-semibold text-brand-green underline underline-offset-4">View Vendor Profile</Link>
          </div>
        </div>

        <dl className="mt-7 grid gap-x-8 gap-y-5 border-y border-border-default py-6 sm:grid-cols-2">
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Customer name</dt><dd className="mt-1 text-sm font-medium text-text-primary">{record.fullName}</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Event type</dt><dd className="mt-1 text-sm font-medium text-text-primary">{eventType}</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Event date</dt><dd className="mt-1 text-sm font-medium text-text-primary">{record.dateNotFinalised ? 'Date not finalised' : formatEventDate(record.eventDate)}</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Event location</dt><dd className="mt-1 text-sm font-medium text-text-primary">{eventLocation}</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Budget</dt><dd className="mt-1 text-sm font-medium text-text-primary">{record.budget}</dd></div>
          <div><dt className="text-xs font-semibold uppercase tracking-wide text-text-secondary">Status</dt><dd className="mt-1 text-sm font-medium text-text-primary">{record.status}</dd></div>
        </dl>

        <p className="mt-5 rounded-lg border border-border-default bg-brand-ivory px-4 py-3 text-xs leading-relaxed text-text-secondary">This reference is temporary and available only in this browser session. It is not permanently saved, and the vendor has not been notified.</p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Link href={vendor.profileHref} className="btn btn-md btn-primary">View Vendor Profile</Link>
          <Link href="/vendors" className="btn btn-md btn-outline">Explore More Vendors</Link>
          <Link href="/" className="btn btn-md btn-outline">Go to Homepage</Link>
        </div>
      </div>
    </section>
  );
}
