import Link from 'next/link';

export default function VendorNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-ivory px-5 py-16 text-center">
      <div className="max-w-lg rounded-2xl bg-brand-white p-8 shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-wider text-brand-gold-dark">Vendor unavailable</p>
        <h1 className="mt-3 text-3xl font-bold text-brand-green">We couldn’t find this vendor</h1>
        <p className="mt-4 text-text-secondary">The vendor may have been removed or the link may be incorrect.</p>
        <Link href="/vendors" className="btn btn-md btn-primary mt-7">Back to vendor search</Link>
      </div>
    </main>
  );
}
