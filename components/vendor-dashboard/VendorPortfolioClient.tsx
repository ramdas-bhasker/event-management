'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import type { VendorRecord } from '@/types/vendor';

type UploadedMedia = { id: string; src: string; name: string; type: 'image' | 'video'; caption: string };
const storagePrefix = 'ayojansetu_portfolio_';

export function VendorPortfolioClient({ vendor }: { vendor: VendorRecord }) {
  const storageKey = storagePrefix + vendor.slug;
  const [uploads, setUploads] = useState<UploadedMedia[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState(true);
  const [notice, setNotice] = useState('');
  const [filter, setFilter] = useState<'all' | 'images' | 'videos'>('all');

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(storageKey);
      if (raw) setUploads(JSON.parse(raw) as UploadedMedia[]);
    } catch { /* Existing listing media remains available without session storage. */ }
    setLoaded(true);
  }, [storageKey]);

  const listingMedia = useMemo(() => vendor.portfolioImages.map((src, index) => ({
    id: 'listing-' + index,
    src,
    name: 'Portfolio image ' + (index + 1),
    type: 'image' as const,
    caption: '',
    fromListing: true,
  })), [vendor.portfolioImages]);
  const userMedia = uploads.map((item) => ({ ...item, fromListing: false }));
  const allMedia = [...listingMedia, ...userMedia];
  const visibleMedia = allMedia.filter((item) => filter === 'all' || item.type === (filter === 'images' ? 'image' : 'video'));

  function save(next: UploadedMedia[]) {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify(next));
      setUploads(next);
      setSaved(true);
      setNotice('Portfolio updates saved to this browser session only.');
    } catch {
      setNotice('Browser storage is full. Remove a large upload and try again.');
    }
  }

  function handleFiles(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files || []);
    const accepted = files.filter((file) => file.type.startsWith('image/') || file.type.startsWith('video/'));
    const tooLarge = accepted.filter((file) => file.size > 1_500_000);
    if (tooLarge.length) setNotice('Each upload must be 1.5 MB or smaller for this browser-only preview.');
    const eligible = accepted.filter((file) => file.size <= 1_500_000);
    if (!eligible.length) { event.target.value = ''; return; }
    Promise.all(eligible.map((file) => new Promise<UploadedMedia>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ id: String(Date.now()) + Math.random().toString(16).slice(2), src: String(reader.result), name: file.name, type: file.type.startsWith('video/') ? 'video' : 'image', caption: '' });
      reader.onerror = () => reject(new Error('Could not read one of the selected files.'));
      reader.readAsDataURL(file);
    }))).then((newItems) => {
      setUploads((current) => {
        const next = [...current, ...newItems];
        try { sessionStorage.setItem(storageKey, JSON.stringify(next)); setSaved(true); }
        catch { setNotice('Browser storage is full. Remove a large upload and try again.'); return current; }
        return next;
      });
      if (!tooLarge.length) setNotice('Media added to this browser session. Save changes to confirm your portfolio preview.');
    }).catch(() => setNotice('Could not read the selected media.'));
    event.target.value = '';
  }

  function updateCaption(id: string, caption: string) {
    const next = uploads.map((item) => item.id === id ? { ...item, caption } : item);
    setUploads(next);
    setSaved(false);
  }

  return <div className="space-y-6">
    <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div><p className="text-sm font-semibold uppercase tracking-wide text-brand-gold-dark">Visual showcase &amp; asset vault</p><h2 className="mt-1 text-2xl font-bold text-brand-green sm:text-3xl">Portfolio</h2><p className="mt-2 max-w-2xl text-sm text-text-secondary">Manage the photos already listed for your business and add media for this browser-only preview.</p></div>
      <div className="flex flex-wrap gap-2"><Link href={'/vendors/' + vendor.slug} className="btn btn-sm btn-outline inline-flex items-center gap-2"><span className="material-symbols-outlined text-[17px]">open_in_new</span>Preview Public Profile</Link><label className="btn btn-sm btn-primary inline-flex cursor-pointer items-center gap-2"><span className="material-symbols-outlined text-[17px]">add_photo_alternate</span>Upload Photos / Videos<input type="file" accept="image/*,video/*" multiple onChange={handleFiles} className="sr-only" /></label></div>
    </section>
    <div className="flex items-start gap-3 rounded-xl border border-brand-gold-border bg-brand-gold-light px-4 py-3 text-xs leading-relaxed text-brand-gold-dark sm:text-sm"><span className="material-symbols-outlined">info</span><p><strong>Prototype portfolio:</strong> added uploads and captions stay in this browser session. They are not uploaded to a server or shown publicly.</p></div>

    <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(260px,0.8fr)]">
      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div><h3 className="text-base font-bold text-brand-green">Your media</h3><p className="mt-1 text-xs text-text-secondary">{allMedia.length} item{allMedia.length === 1 ? '' : 's'} · {vendor.portfolioImages.length} from the vendor listing · {uploads.length} added in this session</p></div><div className="flex gap-1 rounded-lg border border-border-default bg-brand-white p-1">{(['all', 'images', 'videos'] as const).map((option) => <button key={option} type="button" aria-pressed={filter === option} onClick={() => setFilter(option)} className={'rounded-md px-3 py-1.5 text-xs font-semibold capitalize ' + (filter === option ? 'bg-brand-green text-white' : 'text-text-secondary hover:bg-brand-ivory')}>{option}</button>)}</div></div>
        {visibleMedia.length === 0 ? <div className="rounded-xl border border-dashed border-border-default bg-brand-white px-5 py-12 text-center"><span className="material-symbols-outlined text-3xl text-text-muted">photo_library</span><h3 className="mt-2 text-sm font-semibold text-brand-green">No media in this filter</h3><p className="mt-1 text-xs text-text-secondary">Choose another filter or add a photo or video.</p></div> : <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">{visibleMedia.map((item) => <article key={item.id} className="overflow-hidden rounded-xl border border-border-default bg-brand-white shadow-xs"><div className="relative aspect-[4/3] bg-brand-ivory">{item.type === 'video' ? <video src={item.src} controls className="h-full w-full object-cover" aria-label={item.name} /> : <Image src={item.src} alt={item.caption || item.name} fill sizes="(max-width: 640px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" />}{item.fromListing && <span className="absolute left-3 top-3 rounded-full bg-black/65 px-2.5 py-1 text-[10px] font-semibold text-white">From listing</span>}</div><div className="space-y-3 p-4"><div className="flex items-start justify-between gap-3"><p className="min-w-0 flex-1 truncate text-sm font-semibold text-brand-green">{item.name}</p><span className="rounded-full bg-brand-ivory px-2 py-1 text-[10px] uppercase text-text-secondary">{item.type}</span></div>{!item.fromListing ? <label className="block text-[11px] font-semibold text-text-secondary">Caption<input value={item.caption} onChange={(event) => updateCaption(item.id, event.target.value)} placeholder="Add an optional caption" className="mt-1 h-9 w-full rounded-lg border border-border-default px-2.5 text-xs font-normal text-text-primary" /></label> : item.caption ? <p className="text-xs text-text-secondary">{item.caption}</p> : <p className="text-xs text-text-muted">No caption in listing data.</p>}{!item.fromListing && <button type="button" onClick={() => save(uploads.filter((record) => record.id !== item.id))} className="text-xs font-semibold text-state-error">Remove from session</button>}</div></article>)}</div>}
      </section>
      <aside className="space-y-4 xl:sticky xl:top-24">
        <section className="rounded-xl border border-border-default bg-brand-white p-5 shadow-xs"><h3 className="text-sm font-bold text-brand-green">Portfolio summary</h3><div className="mt-4 space-y-3 text-xs"><div className="flex justify-between gap-3"><span className="text-text-secondary">Total media</span><strong>{allMedia.length}</strong></div><div className="flex justify-between gap-3"><span className="text-text-secondary">Images</span><strong>{allMedia.filter((item) => item.type === 'image').length}</strong></div><div className="flex justify-between gap-3"><span className="text-text-secondary">Videos</span><strong>{allMedia.filter((item) => item.type === 'video').length}</strong></div></div><p className="mt-4 border-t border-border-default pt-3 text-[11px] leading-relaxed text-text-secondary">Counts reflect the listing images and media added in this browser session. No ratings or engagement metrics are available here.</p></section>
        <section className="rounded-xl border border-border-default bg-brand-white p-5 shadow-xs"><h3 className="text-sm font-bold text-brand-green">Upload guidance</h3><ul className="mt-3 space-y-2 text-xs leading-relaxed text-text-secondary"><li>Use original event photos or videos that you have permission to share.</li><li>Files over 1.5 MB are skipped in this browser-only preview.</li><li>Added media is not sent to AyojanSetu or made public.</li></ul></section>
        <section className="rounded-xl border border-border-default bg-brand-white p-4 shadow-xs"><p className="text-xs text-text-secondary">{saved ? loaded ? 'No unsaved edits' : 'Loading saved preview…' : 'Caption edits are not saved yet'}</p><button type="button" disabled={!loaded} onClick={() => save(uploads)} className="btn btn-sm btn-primary mt-3 w-full disabled:opacity-50">Save Portfolio Changes</button><Link href={'/vendors/' + vendor.slug} className="btn btn-sm btn-outline mt-2 w-full">Open Public Vendor Profile</Link></section>
      </aside>
    </div>
    {notice && <div role="status" className="fixed bottom-4 left-4 right-4 z-[70] mx-auto max-w-lg rounded-xl bg-brand-green px-4 py-3 text-xs text-white shadow-lg sm:left-auto sm:right-6">{notice}<button type="button" onClick={() => setNotice('')} className="ml-3 underline">Dismiss</button></div>}
  </div>;
}

