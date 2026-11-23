'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';

interface VendorPortfolioGalleryProps {
  images: string[];
  name: string;
}

export function VendorPortfolioGallery({ images, name }: VendorPortfolioGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const visibleImages = images.slice(0, 5);
  const supportingCount = Math.max(visibleImages.length - 1, 0);
  const activeImage = activeIndex === null ? null : images[activeIndex];

  const openAt = useCallback((index: number) => {
    setActiveIndex(index);
  }, []);

  const showPrevious = useCallback(() => {
    setActiveIndex((index) => index === null ? null : (index - 1 + images.length) % images.length);
  }, [images.length]);

  const showNext = useCallback(() => {
    setActiveIndex((index) => index === null ? null : (index + 1) % images.length);
  }, [images.length]);

  const closeGallery = useCallback(() => {
    setActiveIndex(null);
  }, []);

  useEffect(() => {
    if (activeIndex === null) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') closeGallery();
      if (event.key === 'ArrowRight') showNext();
      if (event.key === 'ArrowLeft') showPrevious();
    }

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [activeIndex, closeGallery, showNext, showPrevious]);

  if (images.length === 0) {
    return (
      <div className="flex aspect-[16/7] w-full items-center justify-center rounded-2xl bg-brand-white text-sm text-text-secondary">
        Portfolio photos are not available yet.
      </div>
    );
  }

  function imageTile(src: string, index: number, className: string, isLastVisible = false) {
    const hiddenPhotoCount = images.length - visibleImages.length;

    return (
      <button
        key={`${src}-${index}`}
        type="button"
        className={`group min-h-0 min-w-0 overflow-hidden bg-brand-ivory ${className}`}
        onClick={() => openAt(index)}
        aria-label={`View ${name} portfolio photo ${index + 1}${isLastVisible && hiddenPhotoCount > 0 ? `, plus ${hiddenPhotoCount} more photos` : ''}`}
      >
        <Image
          src={src}
          alt={`${name} portfolio photo ${index + 1}`}
          fill
          priority={index === 0}
          sizes={index === 0 ? '(max-width: 639px) 100vw, 50vw' : '(max-width: 639px) 100vw, 25vw'}
          className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
        />
        {isLastVisible && hiddenPhotoCount > 0 && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-center text-base font-semibold text-white sm:text-xl">
            +{hiddenPhotoCount} Photos
          </span>
        )}
      </button>
    );
  }

  const supportingTileClass = (index: number) => {
    if (supportingCount === 1) return 'relative col-span-2 row-span-2';
    if (supportingCount === 2) return 'relative col-span-2 row-span-1';
    if (supportingCount === 3 && index === 3) return 'relative col-span-2 row-span-1';
    return 'relative col-span-1 row-span-1';
  };

  const viewAllButton = (
    <button
      type="button"
      onClick={() => openAt(0)}
      className="absolute bottom-3 right-3 z-10 rounded-lg border border-white/70 bg-brand-green/90 px-3 py-2 text-xs font-semibold text-white shadow-sm backdrop-blur-sm transition-colors hover:bg-brand-green sm:bottom-4 sm:right-4 sm:px-4 sm:text-sm"
    >
      View All Photos
    </button>
  );

  return (
    <>
      <div className="relative w-full">
        {visibleImages.length === 1 ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-brand-ivory sm:aspect-[16/7] sm:max-h-[560px]">
            {imageTile(visibleImages[0], 0, 'absolute inset-0 h-full w-full')}
          </div>
        ) : (
          <>
            {/* Featured photo plus four supporting photos when available. */}
            <div className="relative hidden h-[420px] w-full grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl md:grid xl:h-[500px]">
              {imageTile(visibleImages[0], 0, 'relative col-span-2 row-span-2 rounded-l-2xl')}
              {visibleImages.slice(1).map((src, index) =>
                imageTile(
                  src,
                  index + 1,
                  `${supportingTileClass(index + 1)} ${index === visibleImages.length - 2 ? 'rounded-r-2xl' : ''}`,
                  index === visibleImages.length - 2
                )
              )}
            </div>

            {/* Small screens: full-width swipeable photos. */}
            <div className="relative flex snap-x snap-mandatory gap-2 overflow-x-auto rounded-2xl md:hidden">
              {visibleImages.map((src, index) => (
                <div key={`${src}-mobile-${index}`} className="relative aspect-[4/3] min-w-full snap-center overflow-hidden rounded-2xl bg-brand-ivory">
                  {imageTile(src, index, 'absolute inset-0 h-full w-full', index === visibleImages.length - 1)}
                </div>
              ))}
            </div>
          </>
        )}
        {viewAllButton}
      </div>

      {activeImage && activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${name} portfolio gallery`}
          className="fixed inset-0 z-[100] flex flex-col bg-black/95 px-3 pb-3 pt-16 sm:px-6 sm:pb-5 sm:pt-16"
          onClick={closeGallery}
        >
          <button
            type="button"
            aria-label="Close gallery"
            className="absolute right-3 top-3 z-20 flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/25 sm:right-5 sm:top-5"
            onClick={closeGallery}
          >
            Close
          </button>

          <div className="relative flex min-h-0 flex-1 items-center justify-center" onClick={(event) => event.stopPropagation()}>
            {images.length > 1 && (
              <button
                type="button"
                aria-label="Previous photo"
                className="absolute left-0 z-10 flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 sm:left-2 sm:min-h-12 sm:min-w-12"
                onClick={showPrevious}
              >
                <span className="material-symbols-outlined" aria-hidden="true">chevron_left</span>
              </button>
            )}
            <div className="relative h-full max-h-full w-full max-w-6xl">
              <Image
                src={activeImage}
                alt={`${name} portfolio photo ${activeIndex + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded bg-black/60 px-3 py-1 text-sm text-white">
                {activeIndex + 1} of {images.length}
              </span>
            </div>
            {images.length > 1 && (
              <button
                type="button"
                aria-label="Next photo"
                className="absolute right-0 z-10 flex min-h-11 min-w-11 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 sm:right-2 sm:min-h-12 sm:min-w-12"
                onClick={showNext}
              >
                <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
              </button>
            )}
          </div>

          {images.length > 1 && (
            <div className="mx-auto mt-3 w-full max-w-6xl shrink-0" onClick={(event) => event.stopPropagation()}>
              <div className="flex snap-x gap-2 overflow-x-auto pb-1" aria-label="Gallery thumbnails">
                {images.map((src, index) => (
                  <button
                    key={`${src}-thumbnail-${index}`}
                    type="button"
                    aria-label={`Show photo ${index + 1}`}
                    aria-current={activeIndex === index ? 'true' : undefined}
                    onClick={() => openAt(index)}
                    className={`relative h-14 w-20 shrink-0 snap-start overflow-hidden rounded-md border-2 sm:h-16 sm:w-24 ${activeIndex === index ? 'border-brand-gold opacity-100' : 'border-transparent opacity-65 hover:opacity-100'}`}
                  >
                    <Image src={src} alt="" fill sizes="96px" className="object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
