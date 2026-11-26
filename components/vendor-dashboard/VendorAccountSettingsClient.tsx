'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { VendorRecord } from '@/types/vendor';
import { createBusinessProfile, readVendorBusinessProfileSession } from '@/data/vendor-business-profile';
import type { VendorBusinessProfile } from '@/types/vendor-business-profile';

type Preferences = {
  enquiryAlerts: boolean;
  emailDigest: boolean;
  serviceUpdates: boolean;
  showPublicProfile: boolean;
};
const defaultPreferences: Preferences = { enquiryAlerts: true, emailDigest: false, serviceUpdates: true, showPublicProfile: true };

export function VendorAccountSettingsClient({ vendor }: { vendor: VendorRecord }) {
  const preferenceKey = 'ayojansetu_account_preferences_' + vendor.slug;
  const [prefs, setPrefs] = useState(defaultPreferences);
  const [savedPrefs, setSavedPrefs] = useState(defaultPreferences);
  const [profile, setProfile] = useState<VendorBusinessProfile>(() => createBusinessProfile(vendor));
  const [loaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    try {
      const prefValue = sessionStorage.getItem(preferenceKey);
      const nextPrefs = prefValue ? { ...defaultPreferences, ...JSON.parse(prefValue) as Partial<Preferences> } : defaultPreferences;
      setPrefs(nextPrefs);
      setSavedPrefs(nextPrefs);
    } catch { /* Continue with the existing mock vendor values. */ }
    setProfile(readVendorBusinessProfileSession(vendor));
    setLoaded(true);
  }, [preferenceKey, vendor]);

  function save() {
    try {
      sessionStorage.setItem(preferenceKey, JSON.stringify(prefs));
      setSavedPrefs(prefs);
      setNotice('Settings saved in this browser session only. No server account was changed.');
    } catch { setNotice('Browser storage could not save these settings.'); }
  }
  function cancel() {
    setPrefs(savedPrefs);
    setNotice('Unsaved preference changes were discarded.');
  }
  function toggle(key: keyof Preferences, checked: boolean) {
    setPrefs((current) => ({ ...current, [key]: checked }));
  }
  function row(title: string, description: string, key: keyof Preferences) {
    return <label key={key} className="flex cursor-pointer items-start justify-between gap-4 border-t border-border-default py-4 first:border-0"><span><span className="block text-sm font-semibold text-text-primary">{title}</span><span className="mt-1 block max-w-2xl text-xs leading-relaxed text-text-secondary">{description}</span></span><input type="checkbox" checked={prefs[key]} onChange={(event) => toggle(key, event.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-[#173D32]" /></label>;
  }

  return <div className="space-y-6">
    <section><p className="text-sm font-semibold uppercase tracking-wide text-brand-gold-dark">Vendor workspace</p><h2 className="mt-1 text-2xl font-bold text-brand-green sm:text-3xl">Account Settings</h2><p className="mt-2 max-w-2xl text-sm text-text-secondary">Review account contact details and choose how this prototype should display preferences.</p></section>
    <div className="flex items-start gap-3 rounded-xl border border-brand-gold-border bg-brand-gold-light px-4 py-3 text-xs leading-relaxed text-brand-gold-dark sm:text-sm"><span className="material-symbols-outlined">info</span><p><strong>Mock vendor account:</strong> authentication, email or mobile verification, notifications, and payout integrations are not connected. These controls only save display preferences in this browser session.</p></div>
    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(260px,0.8fr)]">
      <div className="space-y-6">
        <section className="rounded-xl border border-border-default bg-brand-white p-5 shadow-xs sm:p-6">
          <div className="flex items-center justify-between gap-3 border-b border-border-default pb-4"><div><p className="text-[10px] font-semibold uppercase tracking-wide text-brand-gold-dark">01 · Account contact</p><h3 className="mt-1 text-base font-bold text-brand-green">Login &amp; Contact Details</h3></div><span className="material-symbols-outlined text-brand-green">lock</span></div>
          <div className="divide-y divide-border-default">
            <div className="flex flex-wrap items-center justify-between gap-3 py-4"><div><p className="text-sm font-semibold text-text-primary">Business email</p><p className="mt-1 text-xs text-text-secondary">{profile.businessEmail || 'Not provided in the mock profile'}</p></div><Link href="/vendor/dashboard/business-profile" className="btn btn-sm btn-outline">Edit Profile</Link></div>
            <div className="flex flex-wrap items-center justify-between gap-3 py-4"><div><p className="text-sm font-semibold text-text-primary">Business phone</p><p className="mt-1 text-xs text-text-secondary">{profile.businessPhone || 'Not provided in the mock profile'}</p></div><Link href="/vendor/dashboard/business-profile" className="btn btn-sm btn-outline">Edit Profile</Link></div>
            <div className="flex flex-wrap items-center justify-between gap-3 py-4"><div><p className="text-sm font-semibold text-text-primary">Password &amp; sign-in</p><p className="mt-1 text-xs text-text-secondary">Real sign-in and password management are not implemented.</p></div><button type="button" onClick={() => setNotice('Authentication is not connected in this prototype.')} className="btn btn-sm btn-outline">Unavailable</button></div>
            <div className="flex flex-wrap items-center justify-between gap-3 py-4"><div><p className="text-sm font-semibold text-text-primary">Two-factor authentication</p><p className="mt-1 text-xs text-text-secondary">No OTP or two-factor verification is active.</p></div><span className="rounded-full bg-brand-ivory px-3 py-1 text-[10px] font-semibold text-text-secondary">Not connected</span></div>
          </div>
        </section>

        <section className="rounded-xl border border-border-default bg-brand-white p-5 shadow-xs sm:p-6">
          <div className="border-b border-border-default pb-4"><p className="text-[10px] font-semibold uppercase tracking-wide text-brand-gold-dark">02 · Communications</p><h3 className="mt-1 text-base font-bold text-brand-green">Notification Preferences</h3><p className="mt-1 text-xs text-text-secondary">These settings are local visual preferences; no messages will be sent.</p></div>
          <div className="pt-1">
            {row('Enquiry alerts', 'Show the preference to receive enquiry alerts when notifications are connected.', 'enquiryAlerts')}
            {row('Email digest', 'Show the preference for an email summary. Email delivery is not connected.', 'emailDigest')}
            {row('Service and product updates', 'Choose whether you would like to see marketplace update preferences.', 'serviceUpdates')}
          </div>
        </section>

        <section className="rounded-xl border border-border-default bg-brand-white p-5 shadow-xs sm:p-6">
          <div className="border-b border-border-default pb-4"><p className="text-[10px] font-semibold uppercase tracking-wide text-brand-gold-dark">03 · Public visibility</p><h3 className="mt-1 text-base font-bold text-brand-green">Listing Preferences</h3><p className="mt-1 text-xs text-text-secondary">Visibility is a preview control and does not publish changes to the marketplace.</p></div>
          <div className="pt-1">{row('Show public listing', 'Keep the public vendor profile visible in this prototype preview.', 'showPublicProfile')}</div>
          <Link href={'/vendors/' + vendor.slug} className="btn btn-sm btn-outline mt-2 inline-flex items-center gap-2"><span className="material-symbols-outlined text-[16px]">open_in_new</span>Preview Public Profile</Link>
        </section>

        <section className="rounded-xl border border-border-default bg-brand-white p-5 shadow-xs sm:p-6"><p className="text-[10px] font-semibold uppercase tracking-wide text-brand-gold-dark">04 · Payments</p><h3 className="mt-1 text-base font-bold text-brand-green">Payout Information</h3><p className="mt-2 text-xs leading-relaxed text-text-secondary">No bank, GSTIN, or UPI details are stored for this mock vendor. Payout setup is not available in this frontend prototype.</p></section>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"><button type="button" onClick={cancel} className="btn btn-sm btn-outline">Cancel</button><button type="button" disabled={!loaded} onClick={save} className="btn btn-sm btn-primary disabled:opacity-50">Save Settings</button></div>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-24">
        <section className="rounded-xl border border-border-default bg-brand-white p-5 shadow-xs"><h3 className="text-sm font-bold text-brand-green">Account status</h3><div className="mt-4 space-y-3 text-xs"><div className="flex justify-between gap-3"><span className="text-text-secondary">Account type</span><strong>Mock vendor</strong></div><div className="flex justify-between gap-3"><span className="text-text-secondary">Business</span><strong className="max-w-40 truncate text-right">{vendor.businessName}</strong></div><div className="flex justify-between gap-3"><span className="text-text-secondary">Primary market</span><strong>{vendor.location}</strong></div></div><p className="mt-4 border-t border-border-default pt-3 text-[11px] leading-relaxed text-text-secondary">No real verification, membership, or account security status is available.</p></section>
        <section className="rounded-xl border border-border-default bg-brand-white p-5 shadow-xs"><h3 className="text-sm font-bold text-brand-green">Need to update business details?</h3><p className="mt-2 text-xs leading-relaxed text-text-secondary">Your business email and phone are managed with the profile information.</p><Link href="/vendor/dashboard/business-profile" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-green">Open Business Profile <span className="material-symbols-outlined text-[15px]">arrow_outward</span></Link></section>
      </aside>
    </div>
    {notice && <div role="status" className="fixed bottom-4 left-4 right-4 z-[70] mx-auto max-w-lg rounded-xl bg-brand-green px-4 py-3 text-xs text-white shadow-lg sm:left-auto sm:right-6">{notice}<button type="button" onClick={() => setNotice('')} className="ml-3 underline">Dismiss</button></div>}
  </div>;
}
