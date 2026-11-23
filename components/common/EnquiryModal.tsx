'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ENQUIRY_OCCASION_OPTIONS } from '@/lib/constants';
import { prepareVendorEnquiryPayload } from '@/lib/api/client';
import { useUiStore } from '@/stores/ui-store';
import {
  cn,
  formatIsoDate,
  MONTH_NAMES,
  SHORT_MONTHS,
  WEEKDAYS,
} from '@/lib/utils';

type ActiveModalDropdown = 'occasion' | 'date' | null;

export function EnquiryModal() {
  const router = useRouter();
  const isEnquiryModalOpen = useUiStore((s) => s.isEnquiryModalOpen);
  const enquiryVendorName = useUiStore((s) => s.enquiryVendorName);
  const closeEnquiryModal = useUiStore((s) => s.closeEnquiryModal);

  const isAuthModalOpen = useUiStore((s) => s.isAuthModalOpen);
  const closeAuthModal = useUiStore((s) => s.closeAuthModal);

  const isProfileModalOpen = useUiStore((s) => s.isProfileModalOpen);
  const profileModalData = useUiStore((s) => s.profileModalData);
  const closeProfileModal = useUiStore((s) => s.closeProfileModal);

  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [eventOccasion, setEventOccasion] = useState<string>(
    ENQUIRY_OCCASION_OPTIONS[0].value
  );
  const [eventDate, setEventDate] = useState<string>('flexible');
  const [eventDateLabel, setEventDateLabel] = useState<string>('Flexible Dates');
  const [activePreset, setActivePreset] = useState<
    'flexible' | 'weekend' | 'next-month' | null
  >('flexible');
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());

  const [notes, setNotes] = useState('');
  const [openModalDropdown, setOpenModalDropdown] =
    useState<ActiveModalDropdown>(null);

  const [nameError, setNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [demoSummaryText, setDemoSummaryText] = useState('');

  const [authPhone, setAuthPhone] = useState('');
  const [authPhoneError, setAuthPhoneError] = useState(false);
  const [authDemoShown, setAuthDemoShown] = useState(false);

  const activeOccasionOption =
    ENQUIRY_OCCASION_OPTIONS.find((o) => o.value === eventOccasion) ||
    ENQUIRY_OCCASION_OPTIONS[0];

  // Reset enquiry form view whenever the modal opens
  useEffect(() => {
    if (isEnquiryModalOpen) {
      setIsSubmitted(false);
      setNameError(false);
      setPhoneError(false);
      setOpenModalDropdown(null);
    }
  }, [isEnquiryModalOpen, enquiryVendorName]);

  useEffect(() => {
    if (isAuthModalOpen) {
      setAuthPhoneError(false);
      setAuthDemoShown(false);
    }
  }, [isAuthModalOpen]);

  // Close active modal on Escape key
  useEffect(() => {
    if (!isEnquiryModalOpen && !isAuthModalOpen && !isProfileModalOpen) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (openModalDropdown) {
          setOpenModalDropdown(null);
          return;
        }
        closeEnquiryModal();
        closeAuthModal();
        closeProfileModal();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [
    isEnquiryModalOpen,
    isAuthModalOpen,
    isProfileModalOpen,
    openModalDropdown,
    closeEnquiryModal,
    closeAuthModal,
    closeProfileModal,
  ]);

  function handlePrevMonth() {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear((y) => y - 1);
    } else {
      setCalMonth((m) => m - 1);
    }
  }

  function handleNextMonth() {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear((y) => y + 1);
    } else {
      setCalMonth((m) => m + 1);
    }
  }

  function handleSelectCalendarDay(day: number) {
    const iso = formatIsoDate(calYear, calMonth, day);
    const ddFormatted = String(day).padStart(2, '0');
    const label = `${ddFormatted} ${SHORT_MONTHS[calMonth]} ${calYear}`;
    setActivePreset(null);
    setEventDate(iso);
    setEventDateLabel(label);
    setOpenModalDropdown(null);
  }

  function handlePresetClick(preset: 'flexible' | 'weekend' | 'next-month') {
    setActivePreset(preset);
    const now = new Date();

    if (preset === 'flexible') {
      setEventDate('flexible');
      setEventDateLabel('Flexible Dates');
    } else if (preset === 'weekend') {
      const upcoming = new Date();
      const dayOfWeek = upcoming.getDay();
      const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
      upcoming.setDate(upcoming.getDate() + daysUntilSaturday);
      const y = upcoming.getFullYear();
      const m = upcoming.getMonth();
      const satDay = upcoming.getDate();
      setCalYear(y);
      setCalMonth(m);
      const iso = formatIsoDate(y, m, satDay);
      const label = `Weekend · ${String(satDay).padStart(2, '0')} ${SHORT_MONTHS[m]} ${y}`;
      setEventDate(iso);
      setEventDateLabel(label);
    } else if (preset === 'next-month') {
      const nextM = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const y = nextM.getFullYear();
      const m = nextM.getMonth();
      setCalYear(y);
      setCalMonth(m);
      const iso = `${y}-${String(m + 1).padStart(2, '0')}`;
      const label = `${MONTH_NAMES[m]} ${y}`;
      setEventDate(iso);
      setEventDateLabel(label);
    }
    setOpenModalDropdown(null);
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOpenModalDropdown(null);

    const trimmedName = fullName.trim();
    const cleanedPhone = mobileNumber.replace(/\s+/g, '');
    const isNameValid = trimmedName.length >= 2;
    const isPhoneValid = /^[6-9]\d{9}$/.test(cleanedPhone);

    setNameError(!isNameValid);
    setPhoneError(!isPhoneValid);

    if (!isNameValid || !isPhoneValid) {
      return;
    }

    prepareVendorEnquiryPayload({
      vendorName: enquiryVendorName,
      fullName: trimmedName,
      mobileNumber: `+91 ${cleanedPhone}`,
      eventOccasion,
      eventDate: eventDateLabel,
      notes: notes.trim(),
    });

    setDemoSummaryText(
      `Demo summary for ${enquiryVendorName}: ${trimmedName} (+91 ${cleanedPhone}) · ${eventOccasion} · ${eventDateLabel}. No backend submission performed.`
    );
    setIsSubmitted(true);
    setFullName('');
    setMobileNumber('');
    setNotes('');
  }

  function handleAuthSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const cleanedPhone = authPhone.replace(/\s+/g, '');
    const isPhoneValid = /^[6-9]\d{9}$/.test(cleanedPhone);
    setAuthPhoneError(!isPhoneValid);
    if (!isPhoneValid) return;
    setAuthDemoShown(true);
  }

  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  return (
    <>
      {/* MODAL 1: VENDOR ENQUIRY / QUOTATION MODAL (With Custom Dropdown & Dynamic Calendar) */}
      <div
        id="enquiryModal"
        className={cn('modal-backdrop', isEnquiryModalOpen && 'is-open')}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modalTitle"
        aria-hidden={!isEnquiryModalOpen}
        onClick={(e) => {
          setOpenModalDropdown(null);
          if (e.target === e.currentTarget) {
            closeEnquiryModal();
          }
        }}
      >
        <div
          className="modal-dialog"
          onClick={() => {
            if (openModalDropdown) setOpenModalDropdown(null);
          }}
        >
          <div className="modal-header">
            <div>
              <span
                className="text-badge"
                style={{ color: 'var(--brand-gold)', textTransform: 'uppercase' }}
              >
                Vendor Enquiry Prototype
              </span>
              <h3
                id="modalTitle"
                className="text-h4"
                style={{ color: '#FFFFFF', fontWeight: 600 }}
              >
                Request Quotation · <span id="modalVendorName">{enquiryVendorName}</span>
              </h3>
            </div>
            <button
              type="button"
              className="btn-icon"
              style={{
                background: 'rgba(255,255,255,0.12)',
                borderColor: 'transparent',
                color: '#FFFFFF',
              }}
              onClick={closeEnquiryModal}
              aria-label="Close enquiry modal"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {!isSubmitted ? (
            <form id="quickEnquiryForm" onSubmit={handleSubmit} noValidate>
              <div className="modal-body">
                {/* Full Name Input */}
                <div className="form-group">
                  <label className="form-label" htmlFor="eqName">
                    Full Name <span className="required">*</span>
                  </label>
                  <input
                    id="eqName"
                    type="text"
                    className={cn('form-input', nameError && 'is-error')}
                    placeholder="e.g. Ramesh Varma"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (nameError) setNameError(false);
                    }}
                    required
                  />
                  {nameError && (
                    <span className="form-helper is-error">
                      Please enter your full name (at least 2 characters).
                    </span>
                  )}
                </div>

                {/* Indian Mobile Number (+91 Prefix) Component */}
                <div className="form-group">
                  <label className="form-label" htmlFor="eqPhone">
                    Mobile Number <span className="required">*</span>
                  </label>
                  <div className={cn('input-prefix-group', phoneError && 'is-error')}>
                    <span className="input-prefix-addon">🇮🇳 +91</span>
                    <input
                      id="eqPhone"
                      type="tel"
                      placeholder="98765 43210"
                      value={mobileNumber}
                      onChange={(e) => {
                        setMobileNumber(e.target.value);
                        if (phoneError) setPhoneError(false);
                      }}
                      required
                    />
                  </div>
                  {phoneError ? (
                    <span className="form-helper is-error">
                      Please enter a valid 10-digit Indian mobile number.
                    </span>
                  ) : (
                    <span className="form-helper">
                      Used for sharing quotation details via WhatsApp or phone
                    </span>
                  )}
                </div>

                {/* Two-Column Row: Custom Event Type Dropdown & Custom Calendar Date Picker */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'var(--space-3)',
                  }}
                >
                  {/* Custom Event Type Dropdown */}
                  <div className="form-group">
                    <label className="form-label">Event Type</label>
                    <div
                      className={cn(
                        'ay-dropdown',
                        openModalDropdown === 'occasion' && 'is-open'
                      )}
                      id="eqCategoryDropdown"
                    >
                      <input type="hidden" id="eqCategory" value={eventOccasion} />
                      <button
                        type="button"
                        className="ay-dropdown-trigger is-form-control"
                        aria-haspopup="listbox"
                        aria-expanded={openModalDropdown === 'occasion'}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenModalDropdown((prev) =>
                            prev === 'occasion' ? null : 'occasion'
                          );
                        }}
                      >
                        <div className="ay-dropdown-trigger-left">
                          <span className="material-symbols-outlined ay-dropdown-form-icon">
                            {activeOccasionOption.icon}
                          </span>
                          <span
                            className="ay-dropdown-value"
                            style={{ marginTop: 0 }}
                          >
                            {activeOccasionOption.label}
                          </span>
                        </div>
                        <span className="material-symbols-outlined ay-dropdown-chevron">
                          expand_more
                        </span>
                      </button>

                      <div
                        className="ay-dropdown-menu"
                        role="listbox"
                        aria-label="Select Event Type"
                      >
                        <div className="ay-dropdown-list">
                          {ENQUIRY_OCCASION_OPTIONS.map((option) => {
                            const isSelected = option.value === eventOccasion;
                            return (
                              <div
                                key={option.value}
                                className={cn(
                                  'ay-dropdown-item',
                                  isSelected && 'is-selected'
                                )}
                                role="option"
                                aria-selected={isSelected}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEventOccasion(option.value);
                                  setOpenModalDropdown(null);
                                }}
                              >
                                <span className="material-symbols-outlined ay-dropdown-item-icon">
                                  {option.icon}
                                </span>
                                <span className="ay-dropdown-item-title">
                                  {option.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Custom Preferred Date Dynamic Calendar Picker (Same as Hero Section) */}
                  <div className="form-group">
                    <label className="form-label">Preferred Date</label>
                    <div
                      className={cn(
                        'ay-dropdown',
                        openModalDropdown === 'date' && 'is-open'
                      )}
                      id="eqDateDropdown"
                    >
                      <input type="hidden" id="eqDate" value={eventDateLabel} />
                      <button
                        type="button"
                        className="ay-dropdown-trigger is-form-control"
                        aria-haspopup="dialog"
                        aria-expanded={openModalDropdown === 'date'}
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenModalDropdown((prev) =>
                            prev === 'date' ? null : 'date'
                          );
                        }}
                      >
                        <div className="ay-dropdown-trigger-left">
                          <span className="material-symbols-outlined ay-dropdown-form-icon">
                            calendar_month
                          </span>
                          <span
                            className="ay-dropdown-value"
                            id="eqDateTriggerValue"
                            style={{ marginTop: 0 }}
                          >
                            {eventDateLabel}
                          </span>
                        </div>
                        <span className="material-symbols-outlined ay-dropdown-chevron">
                          expand_more
                        </span>
                      </button>

                      {/* Dynamic Calendar Popover */}
                      <div
                        className="ay-dropdown-menu ay-calendar-menu align-right"
                        role="dialog"
                        aria-label="Choose Preferred Date"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="ay-dropdown-header">
                          <span className="ay-dropdown-header-title">
                            Select Preferred Date
                          </span>
                          <span
                            className="badge badge-gold"
                            style={{ padding: '1px 6px', fontSize: '10px' }}
                          >
                            Dynamic Calendar
                          </span>
                        </div>

                        {/* Quick Dynamic Preset Chips */}
                        <div className="ay-calendar-presets">
                          <button
                            type="button"
                            className={cn(
                              'ay-calendar-preset-btn',
                              activePreset === 'flexible' && 'is-active'
                            )}
                            onClick={() => handlePresetClick('flexible')}
                          >
                            Flexible Dates
                          </button>
                          <button
                            type="button"
                            className={cn(
                              'ay-calendar-preset-btn',
                              activePreset === 'weekend' && 'is-active'
                            )}
                            onClick={() => handlePresetClick('weekend')}
                          >
                            This Weekend
                          </button>
                          <button
                            type="button"
                            className={cn(
                              'ay-calendar-preset-btn',
                              activePreset === 'next-month' && 'is-active'
                            )}
                            onClick={() => handlePresetClick('next-month')}
                          >
                            Next Month
                          </button>
                        </div>

                        {/* Calendar Month Nav */}
                        <div className="ay-calendar-nav">
                          <button
                            type="button"
                            className="ay-calendar-nav-btn"
                            aria-label="Previous Month"
                            onClick={handlePrevMonth}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: '16px' }}
                            >
                              chevron_left
                            </span>
                          </button>
                          <span className="ay-calendar-month-label">
                            {MONTH_NAMES[calMonth]} {calYear}
                          </span>
                          <button
                            type="button"
                            className="ay-calendar-nav-btn"
                            aria-label="Next Month"
                            onClick={handleNextMonth}
                          >
                            <span
                              className="material-symbols-outlined"
                              style={{ fontSize: '16px' }}
                            >
                              chevron_right
                            </span>
                          </button>
                        </div>

                        {/* Calendar Grid */}
                        <div className="ay-calendar-grid">
                          {WEEKDAYS.map((wd) => (
                            <div key={wd} className="ay-calendar-weekday">
                              {wd}
                            </div>
                          ))}

                          {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                            <div
                              key={`eq-empty-${idx}`}
                              className="ay-calendar-day is-muted"
                            />
                          ))}

                          {Array.from({ length: daysInMonth }).map((_, idx) => {
                            const day = idx + 1;
                            const iso = formatIsoDate(calYear, calMonth, day);
                            const isSelected = iso === eventDate;

                            return (
                              <button
                                key={iso}
                                type="button"
                                className={cn(
                                  'ay-calendar-day',
                                  isSelected && 'is-selected'
                                )}
                                onClick={() => handleSelectCalendarDay(day)}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>

                        <div className="ay-calendar-footer">
                          <span>Choose an exact date or stay flexible</span>
                          <button
                            type="button"
                            style={{
                              border: 'none',
                              background: 'transparent',
                              color: 'var(--brand-green)',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                            onClick={() => handlePresetClick('flexible')}
                          >
                            Reset to Flexible
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Custom Requirements Textarea */}
                <div className="form-group">
                  <label className="form-label" htmlFor="eqNotes">
                    Event Details &amp; Custom Requirements
                  </label>
                  <textarea
                    id="eqNotes"
                    rows={3}
                    className="form-textarea"
                    placeholder="Mention guest count, Hyderabad locality, or specific service requirements..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-md btn-outline"
                  onClick={closeEnquiryModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-md btn-primary">
                  <span>Preview Enquiry</span>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    arrow_forward
                  </span>
                </button>
              </div>
            </form>
          ) : (
            /* Honest Demo Validation State (Does not pretend backend submission occurred) */
            <div
              id="enquirySuccessBanner"
              style={{
                padding: 'var(--space-8) var(--space-6)',
                textAlign: 'center',
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: 'var(--brand-gold-light)',
                  color: 'var(--brand-gold-dark)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto var(--space-4)',
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
                  fact_check
                </span>
              </div>
              <h4 className="text-h3" style={{ marginBottom: 'var(--space-2)' }}>
                Demo Preview: Enquiry Form Validated
              </h4>
              <p
                className="text-body"
                style={{
                  color: 'var(--text-secondary)',
                  marginBottom: 'var(--space-4)',
                }}
              >
                Your enquiry fields passed validation. Because this is a frontend
                prototype without a connected backend yet,{' '}
                <strong>no live enquiry has been sent or saved</strong>.
              </p>
              <div
                className="demo-notice-banner"
                style={{ marginBottom: 'var(--space-6)' }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: '18px',
                    color: 'var(--brand-gold-dark)',
                    flexShrink: 0,
                  }}
                >
                  info
                </span>
                <span>{demoSummaryText}</span>
              </div>
              <button
                type="button"
                className="btn btn-md btn-primary"
                onClick={closeEnquiryModal}
              >
                Close Preview
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL 2: CUSTOMER LOGIN / SIGN UP PROTOTYPE MODAL */}
      <div
        id="authModal"
        className={cn('modal-backdrop', isAuthModalOpen && 'is-open')}
        role="dialog"
        aria-modal="true"
        aria-labelledby="authModalTitle"
        aria-hidden={!isAuthModalOpen}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            closeAuthModal();
          }
        }}
      >
        <div className="modal-dialog" style={{ maxWidth: '440px' }}>
          <div className="modal-header">
            <div>
              <span
                className="text-badge"
                style={{ color: 'var(--brand-gold)', textTransform: 'uppercase' }}
              >
                Customer Account
              </span>
              <h3
                id="authModalTitle"
                className="text-h4"
                style={{ color: '#FFFFFF', fontWeight: 600 }}
              >
                Login / Sign Up to AyojanSetu
              </h3>
            </div>
            <button
              type="button"
              className="btn-icon"
              style={{
                background: 'rgba(255,255,255,0.12)',
                borderColor: 'transparent',
                color: '#FFFFFF',
              }}
              onClick={closeAuthModal}
              aria-label="Close login modal"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} noValidate>
            <div className="modal-body">
              <p className="text-small" style={{ color: 'var(--text-secondary)' }}>
                Save shortlisted Hyderabad vendors, compare quotations, and manage your
                event enquiries.
              </p>

              <div className="form-group">
                <label className="form-label" htmlFor="authPhone">
                  Mobile Number <span className="required">*</span>
                </label>
                <div className={cn('input-prefix-group', authPhoneError && 'is-error')}>
                  <span className="input-prefix-addon">🇮🇳 +91</span>
                  <input
                    id="authPhone"
                    type="tel"
                    placeholder="98765 43210"
                    value={authPhone}
                    onChange={(e) => {
                      setAuthPhone(e.target.value);
                      if (authPhoneError) setAuthPhoneError(false);
                    }}
                    required
                  />
                </div>
                {authPhoneError && (
                  <span className="form-helper is-error">
                    Please enter a valid 10-digit mobile number.
                  </span>
                )}
              </div>

              {authDemoShown && (
                <div className="demo-notice-banner">
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: '18px',
                      color: 'var(--brand-gold-dark)',
                      flexShrink: 0,
                    }}
                  >
                    info
                  </span>
                  <span>
                    <strong>Frontend Auth Prototype:</strong> OTP &amp; account
                    authentication will be connected when the backend API is enabled.
                  </span>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-md btn-outline"
                onClick={closeAuthModal}
              >
                Close
              </button>
              <button type="submit" className="btn btn-md btn-primary">
                Continue with Mobile
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* MODAL 3: VENDOR PROFILE DETAILS PREVIEW & REGISTRATION GUIDE MODAL */}
      <div
        id="profileModal"
        className={cn('modal-backdrop', isProfileModalOpen && 'is-open')}
        role="dialog"
        aria-modal="true"
        aria-labelledby="profileModalTitle"
        aria-hidden={!isProfileModalOpen}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            closeProfileModal();
          }
        }}
      >
        <div className="modal-dialog" style={{ maxWidth: '540px' }}>
          <div className="modal-header">
            <div>
              <span
                className="text-badge"
                style={{ color: 'var(--brand-gold)', textTransform: 'uppercase' }}
              >
                {profileModalData?.eyebrow || 'Sample Vendor Profile'}
              </span>
              <h3
                id="profileModalTitle"
                className="text-h4"
                style={{ color: '#FFFFFF', fontWeight: 600 }}
              >
                {profileModalData?.name || 'Sample Vendor'}
              </h3>
            </div>
            <button
              type="button"
              className="btn-icon"
              style={{
                background: 'rgba(255,255,255,0.12)',
                borderColor: 'transparent',
                color: '#FFFFFF',
              }}
              onClick={closeProfileModal}
              aria-label="Close profile preview"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <div className="modal-body">
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <span className="badge badge-green">
                {profileModalData?.category || 'Event Service'}
              </span>
              <span className="badge badge-gold">
                {profileModalData?.area || 'Hyderabad'}
              </span>
            </div>

            <p
              className="text-body"
              style={{ color: 'var(--text-primary)', lineHeight: 1.6 }}
            >
              {profileModalData?.about}
            </p>

            <div className="vendor-price-box" style={{ marginTop: 0 }}>
              <span
                className="text-badge"
                style={{
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  display: 'block',
                }}
              >
                Starting Price / Package Baseline
              </span>
              <span
                className="text-label"
                style={{ color: 'var(--brand-green)', fontWeight: 700 }}
              >
                {profileModalData?.price}
              </span>
            </div>

            <div className="demo-notice-banner">
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: '18px',
                  color: 'var(--brand-gold-dark)',
                  flexShrink: 0,
                }}
              >
                verified_user
              </span>
              <span>{profileModalData?.status}</span>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-md btn-outline"
              onClick={closeProfileModal}
            >
              Close
            </button>
            {profileModalData?.vendorId && (
              <button
                type="button"
                className="btn btn-md btn-primary"
                onClick={() => {
                  const vendorId = profileModalData?.vendorId;
                  if (!vendorId) return;
                  closeProfileModal();
                  router.push(`/enquiry?vendorId=${encodeURIComponent(vendorId)}`);
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  chat
                </span>
                <span>Enquire With Vendor</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
