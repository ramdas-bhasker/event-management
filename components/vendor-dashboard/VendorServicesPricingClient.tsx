'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  createBusinessProfile,
  readVendorBusinessProfileSession,
  saveVendorBusinessProfileSession,
} from '@/data/vendor-business-profile';
import type { PriceTypeSlug, VendorRecord } from '@/types/vendor';
import type { VendorBusinessProfile } from '@/types/vendor-business-profile';

type PackageItem = { id: string; name: string; description: string; price: string; services: string[] };
type Pricing = { startingPrice: string; priceType: PriceTypeSlug; packages: PackageItem[] };
const priceTypes: { id: PriceTypeSlug; label: string }[] = [
  { id: 'per-event', label: 'Per Event' },
  { id: 'per-plate', label: 'Per Plate / Guest' },
  { id: 'per-day', label: 'Per Day Rental' },
  { id: 'custom-quote', label: 'Custom Quote' },
];
const formatINR = (value: string) => Number(value) > 0
  ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(Number(value))
  : 'Custom Quote';

export function VendorServicesPricingClient({ vendor }: { vendor: VendorRecord }) {
  const storageKey = 'ayojansetu_pricing_' + vendor.slug;
  const base: Pricing = { startingPrice: vendor.startingPrice ? String(vendor.startingPrice) : '', priceType: vendor.priceType, packages: [] };
  const [profile, setProfile] = useState<VendorBusinessProfile>(() => createBusinessProfile(vendor));
  const [value, setValue] = useState<Pricing>(base);
  const [loaded, setLoaded] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [notice, setNotice] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [services, setServices] = useState<string[]>([]);

  useEffect(() => {
    const loadedProfile = readVendorBusinessProfileSession(vendor);
    setProfile(loadedProfile);
    const profileNumeric = String(loadedProfile.startingPrice || '').replace(/[^0-9]/g, '');
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        setValue({ ...base, ...JSON.parse(stored) as Partial<Pricing> });
      } else if (profileNumeric) {
        setValue((prev) => ({
          ...prev,
          startingPrice: profileNumeric,
          priceType: loadedProfile.contactForPrice || loadedProfile.pricingModel === 'Custom Quote' ? 'custom-quote' : prev.priceType,
        }));
      }
    } catch { /* Keep the listing defaults if session storage is unavailable. */ }
    setLoaded(true);
  // The base values are fixed by the current vendor record for this page visit.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, vendor]);

  function update(patch: Partial<Pricing>) {
    setValue((current) => ({ ...current, ...patch }));
    setDirty(true);
  }
  function save() {
    if (value.priceType !== 'custom-quote' && (!value.startingPrice || Number(value.startingPrice) <= 0)) {
      setNotice('Enter a starting price, or select Custom Quote.');
      return;
    }
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(value));
      const updatedProfile: VendorBusinessProfile = {
        ...profile,
        startingPrice: value.startingPrice ? Number(value.startingPrice).toLocaleString('en-IN') : '',
        contactForPrice: value.priceType === 'custom-quote',
        displayPricePublicly: value.priceType !== 'custom-quote',
        pricingModel: value.priceType === 'custom-quote' ? 'Custom Quote' : value.priceType === 'per-plate' ? 'Per Plate' : 'Per Event',
      };
      setProfile(updatedProfile);
      saveVendorBusinessProfileSession(updatedProfile, { commitSaved: true, keepDraft: false });
      setDirty(false);
      setNotice('Changes saved in this browser session only. No backend is connected.');
    } catch { setNotice('Browser storage could not save these changes.'); }
  }
  function addPackage() {
    if (!name.trim() || !price || Number(price) <= 0) {
      setNotice('Add a package name and a valid price.');
      return;
    }
    update({ packages: [...value.packages, { id: String(Date.now()), name: name.trim(), description: description.trim(), price, services }] });
    setName(''); setDescription(''); setPrice(''); setServices([]); setShowForm(false);
  }

  return <div className="space-y-6">
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="text-sm font-semibold uppercase tracking-wide text-brand-gold-dark">Live marketplace catalog · {vendor.location}</p><h2 className="mt-1 text-2xl font-bold text-brand-green sm:text-3xl">Services &amp; Pricing</h2><p className="mt-2 max-w-2xl text-sm text-text-secondary">Set your starting investment and create packages from the services already listed on your profile.</p></div>
      <div className="flex flex-wrap gap-2"><Link href={'/vendors/' + vendor.slug} className="btn btn-sm btn-outline inline-flex items-center gap-2"><span className="material-symbols-outlined text-[17px]">open_in_new</span>Preview Listing</Link><button type="button" onClick={() => setShowForm(true)} className="btn btn-sm btn-primary inline-flex items-center gap-2"><span className="material-symbols-outlined text-[17px]">add</span>Add Package</button></div>
    </section>
    <div className="flex items-start gap-3 rounded-xl border border-brand-gold-border bg-brand-gold-light px-4 py-3 text-xs leading-relaxed text-brand-gold-dark sm:text-sm"><span className="material-symbols-outlined">info</span><p><strong>Prototype only:</strong> edits stay in this browser session. No quote, booking, or payment is sent or created.</p></div>

    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(270px,0.8fr)]">
      <div className="space-y-6">
        <section className="rounded-xl border border-border-default bg-brand-white p-5 shadow-xs sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="text-base font-bold text-brand-green">Base Investment &amp; Pricing Structure</h3><p className="mt-1 text-xs text-text-secondary">Current listing value: {vendor.priceDisplay} · {vendor.priceTypeLabel}</p></div><span className="rounded-full bg-brand-ivory px-3 py-1 text-[10px] font-semibold text-text-secondary">Vendor managed</span></div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <label className="block text-sm font-semibold text-text-primary">Starting price (INR)<span className="mt-1.5 flex h-11 items-center rounded-lg border border-border-default bg-white focus-within:border-brand-green"><span className="px-3 text-text-secondary">₹</span><input type="number" min="0" value={value.startingPrice} disabled={value.priceType === 'custom-quote'} onChange={(event) => update({ startingPrice: event.target.value })} className="h-full min-w-0 flex-1 border-0 bg-transparent px-2 text-sm outline-none disabled:text-text-muted" /></span><span className="mt-1 block text-xs font-normal text-text-secondary">Preview: {value.priceType === 'custom-quote' ? 'Custom Quote' : 'Starting from ' + formatINR(value.startingPrice)}</span></label>
            <fieldset><legend className="text-sm font-semibold text-text-primary">Pricing metric</legend><div className="mt-2 grid grid-cols-2 gap-2">{priceTypes.map((option) => <button type="button" key={option.id} aria-pressed={value.priceType === option.id} onClick={() => update({ priceType: option.id })} className={'min-h-11 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ' + (value.priceType === option.id ? 'border-brand-green bg-brand-green-light text-brand-green' : 'border-border-default text-text-secondary hover:border-brand-green')}>{option.label}</button>)}</div></fieldset>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-end justify-between gap-4"><div><h3 className="text-base font-bold text-brand-green">Service Packages</h3><p className="mt-1 text-xs text-text-secondary">Choose from your existing specialities; package details are yours to provide.</p></div><span className="text-xs text-text-secondary">{value.packages.length} package{value.packages.length === 1 ? '' : 's'}</span></div>
          {value.packages.length === 0 && <div className="rounded-xl border border-dashed border-border-default bg-brand-white px-5 py-10 text-center"><span className="material-symbols-outlined text-3xl text-text-muted">sell</span><h4 className="mt-2 text-sm font-semibold text-brand-green">No packages added</h4><p className="mt-1 text-xs text-text-secondary">Create a package to display its price and included services.</p><button type="button" onClick={() => setShowForm(true)} className="btn btn-sm btn-outline mt-4">Add your first package</button></div>}
          {value.packages.map((item) => <article key={item.id} className="rounded-xl border border-border-default bg-brand-white p-5 shadow-xs"><div className="flex flex-wrap justify-between gap-3"><div><h4 className="font-semibold text-brand-green">{item.name}</h4><p className="mt-1 text-xs text-text-secondary">{item.description || 'No description added.'}</p></div><strong className="text-lg text-brand-green">{formatINR(item.price)}</strong></div><div className="mt-3 flex flex-wrap gap-2">{item.services.map((service) => <span key={service} className="rounded-full bg-brand-ivory px-2.5 py-1 text-[11px] text-text-secondary">{service}</span>)}</div><button type="button" onClick={() => update({ packages: value.packages.filter((record) => record.id !== item.id) })} className="mt-4 border-t border-border-default pt-3 text-xs font-semibold text-state-error">Remove package</button></article>)}
        </section>

        {showForm && <section className="rounded-xl border border-brand-green/20 bg-brand-white p-5 shadow-xs sm:p-6"><div className="flex items-start justify-between"><div><h3 className="font-bold text-brand-green">Add a service package</h3><p className="mt-1 text-xs text-text-secondary">Package details are saved only in this browser session.</p></div><button type="button" onClick={() => setShowForm(false)} aria-label="Close form" className="text-text-secondary"><span className="material-symbols-outlined">close</span></button></div><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-xs font-semibold">Package name<input value={name} onChange={(event) => setName(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-border-default px-3 text-sm font-normal" /></label><label className="text-xs font-semibold">Price (INR)<input type="number" min="1" value={price} onChange={(event) => setPrice(event.target.value)} className="mt-1.5 h-10 w-full rounded-lg border border-border-default px-3 text-sm font-normal" /></label></div><label className="mt-4 block text-xs font-semibold">Description<textarea rows={3} value={description} onChange={(event) => setDescription(event.target.value)} className="mt-1.5 w-full rounded-lg border border-border-default px-3 py-2 text-sm font-normal" /></label><fieldset className="mt-4"><legend className="text-xs font-semibold">Included services</legend><div className="mt-2 grid gap-2 sm:grid-cols-2">{profile.keySpecialties.map((service) => <label key={service} className="flex min-h-10 items-center gap-2 rounded-lg border border-border-default px-3 text-xs"><input type="checkbox" checked={services.includes(service)} onChange={() => setServices((current) => current.includes(service) ? current.filter((item) => item !== service) : [...current, service])} className="accent-[#173D32]" />{service}</label>)}</div></fieldset><div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setShowForm(false)} className="btn btn-sm btn-outline">Cancel</button><button type="button" onClick={addPackage} className="btn btn-sm btn-primary">Save Package</button></div></section>}

        <section className="rounded-xl border border-border-default bg-brand-white p-5 shadow-xs sm:p-6"><h3 className="text-base font-bold text-brand-green">Listed Services &amp; Specialities</h3><p className="mt-1 text-xs text-text-secondary">Read from your shared vendor business profile.</p><div className="mt-4 grid gap-2 sm:grid-cols-2">{profile.keySpecialties.map((service) => <div key={service} className="flex items-center gap-2 rounded-lg bg-brand-ivory px-3 py-2.5 text-xs text-text-primary"><span className="material-symbols-outlined text-[16px] text-brand-green">check_circle</span>{service}</div>)}</div><Link href="/vendor/dashboard/services-specialities" className="mt-4 inline-flex text-sm font-semibold text-brand-green hover:text-brand-gold-dark">Edit services &amp; specialities</Link></section>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-24"><section className="rounded-xl border border-border-default bg-brand-white p-5 shadow-xs"><h3 className="text-sm font-bold text-brand-green">Listing preview</h3><p className="mt-1 text-xs text-text-secondary">Preview from the current vendor data and edits.</p><div className="mt-4 rounded-lg bg-brand-ivory p-4"><p className="text-[10px] uppercase tracking-wide text-text-secondary">{vendor.categoryLabel}</p><p className="mt-1 font-semibold text-brand-green">{vendor.businessName}</p><p className="mt-2 text-sm font-bold">{value.priceType === 'custom-quote' ? 'Custom Quote' : 'From ' + formatINR(value.startingPrice)}</p><p className="mt-1 text-xs text-text-secondary">{vendor.location} · {priceTypes.find((item) => item.id === value.priceType)?.label}</p></div><Link href={'/vendors/' + vendor.slug} className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand-green">View public profile <span className="material-symbols-outlined text-[15px]">arrow_outward</span></Link></section>
        <section className="rounded-xl border border-border-default bg-brand-white p-5 shadow-xs"><h3 className="text-sm font-bold text-brand-green">Payment terms</h3><p className="mt-2 text-xs leading-relaxed text-text-secondary">No payment schedule is stored for this vendor. Add any terms you choose to a package description.</p></section>
        <section className="rounded-xl border border-border-default bg-brand-white p-4 shadow-xs"><p className="text-xs text-text-secondary">{dirty ? 'Unsaved edits' : loaded ? 'No unsaved edits' : 'Loading saved preview…'}</p><div className="mt-3 grid gap-2"><button type="button" disabled={!loaded} onClick={save} className="btn btn-sm btn-primary w-full disabled:opacity-50">Save Pricing Changes</button><button type="button" onClick={() => { setValue(base); try { sessionStorage.removeItem(storageKey); } catch { /* Keep current view usable. */ } setDirty(false); setNotice('Pricing preview reset to the listing defaults.'); }} className="btn btn-sm btn-outline w-full">Reset to Listing Defaults</button></div></section></aside>
    </div>
    {notice && <div role="status" className="fixed bottom-4 left-4 right-4 z-[70] mx-auto max-w-lg rounded-xl bg-brand-green px-4 py-3 text-xs text-white shadow-lg sm:left-auto sm:right-6">{notice}<button type="button" onClick={() => setNotice('')} className="ml-3 underline">Dismiss</button></div>}
  </div>;
}
