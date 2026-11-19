'use client';

import { useCallback, useRef, useState, type FormEvent } from 'react';
import { useOutsideClickAndEscape } from '@/hooks/useOutsideClickAndEscape';
import {
  EVENT_TYPE_FILTER_PILLS,
  MICRO_MARKET_OPTIONS,
  SERVICE_TYPE_OPTIONS,
  TRENDING_SEARCH_TAGS,
} from '@/lib/constants';
import {
  cn,
  formatIsoDate,
  MONTH_NAMES,
  SHORT_MONTHS,
  WEEKDAYS,
} from '@/lib/utils';
import { useUiStore } from '@/stores/ui-store';
import type { ServiceId } from '@/types';

type ActiveSearchDropdown = 'service' | 'location' | 'date' | null;

export function HeroSearchWidget() {
  const selectedEventType = useUiStore((s) => s.selectedEventType);
  const selectedService = useUiStore((s) => s.selectedService);
  const selectedLocation = useUiStore((s) => s.selectedLocation);
  const selectedDate = useUiStore((s) => s.selectedDate);
  const selectedDateLabel = useUiStore((s) => s.selectedDateLabel);
  const setSelectedEventType = useUiStore((s) => s.setSelectedEventType);
  const setSelectedService = useUiStore((s) => s.setSelectedService);
  const setSelectedLocation = useUiStore((s) => s.setSelectedLocation);
  const setSelectedDate = useUiStore((s) => s.setSelectedDate);
  const activateSearchPrototype = useUiStore((s) => s.activateSearchPrototype);

  const [openDropdown, setOpenDropdown] = useState<ActiveSearchDropdown>(null);
  const [activePreset, setActivePreset] = useState<'flexible' | 'weekend' | 'next-month' | null>('flexible');
  const [calYear, setCalYear] = useState(() => new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(() => new Date().getMonth());

  const widgetRef = useRef<HTMLDivElement>(null);

  const activeServiceOption =
    SERVICE_TYPE_OPTIONS.find((opt) => opt.value === selectedService) ||
    SERVICE_TYPE_OPTIONS[0];

  const activeLocationOption =
    MICRO_MARKET_OPTIONS.find((opt) => opt.value === selectedLocation) ||
    MICRO_MARKET_OPTIONS[0];

  const handleCloseDropdown = useCallback(() => {
    setOpenDropdown(null);
  }, []);

  useOutsideClickAndEscape(widgetRef, handleCloseDropdown, openDropdown !== null);

  function toggleDropdown(target: 'service' | 'location' | 'date') {
    setOpenDropdown((prev) => (prev === target ? null : target));
  }

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
    setSelectedDate(iso, label);
    setOpenDropdown(null);
  }

  function handlePresetClick(preset: 'flexible' | 'weekend' | 'next-month') {
    setActivePreset(preset);
    const now = new Date();

    if (preset === 'flexible') {
      setSelectedDate('flexible', 'Flexible Dates');
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
      setSelectedDate(iso, label);
    } else if (preset === 'next-month') {
      const nextM = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const y = nextM.getFullYear();
      const m = nextM.getMonth();
      setCalYear(y);
      setCalMonth(m);
      const iso = `${y}-${String(m + 1).padStart(2, '0')}`;
      const label = `${MONTH_NAMES[m]} ${y}`;
      setSelectedDate(iso, label);
    }
    setOpenDropdown(null);
  }

  function handleTrendingTagClick(serviceId: ServiceId) {
    setSelectedService(serviceId);
    activateSearchPrototype();
    const vendorsSection = document.getElementById('featured-vendors');
    vendorsSection?.scrollIntoView({ behavior: 'smooth' });
  }

  function handleSearchSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setOpenDropdown(null);
    activateSearchPrototype();
    const vendorsSection = document.getElementById('featured-vendors');
    vendorsSection?.scrollIntoView({ behavior: 'smooth' });
  }

  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  return (
    <div ref={widgetRef}>
      {/* Search Widget Component */}
      <div className="search-widget-card">
        <form id="heroSearchForm" onSubmit={handleSearchSubmit}>
          <input
            type="hidden"
            name="eventType"
            id="heroEventTypeInput"
            value={selectedEventType}
          />

          {/* Event-Type Filter Pill Bar */}
          <div
            className="event-type-filter-bar"
            role="group"
            aria-label="Filter by event occasion"
          >
            <span className="event-type-filter-label">Occasion:</span>
            {EVENT_TYPE_FILTER_PILLS.map((pill) => (
              <button
                key={pill}
                type="button"
                className={cn(
                  'event-type-pill',
                  selectedEventType === pill && 'is-active'
                )}
                onClick={() => setSelectedEventType(pill)}
              >
                {pill}
              </button>
            ))}
          </div>

          <div className="search-widget-grid">
            {/* Field 1: What are you looking for? (All Services by default) */}
            <div
              className={cn('ay-dropdown', openDropdown === 'service' && 'is-open')}
              id="serviceDropdown"
              data-dropdown="service"
            >
              <input
                type="hidden"
                name="service"
                id="heroServiceInput"
                value={selectedService}
              />
              <button
                type="button"
                className="ay-dropdown-trigger"
                aria-haspopup="listbox"
                aria-expanded={openDropdown === 'service'}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown('service');
                }}
              >
                <div className="ay-dropdown-trigger-left">
                  <div className="ay-dropdown-icon-box">
                    <span
                      className="material-symbols-outlined"
                      id="serviceTriggerIcon"
                      style={{ fontSize: '19px' }}
                    >
                      {activeServiceOption.icon}
                    </span>
                  </div>
                  <div className="ay-dropdown-text">
                    <span className="ay-dropdown-label">What are you looking for?</span>
                    <span className="ay-dropdown-value" id="serviceTriggerValue">
                      {activeServiceOption.label}
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined ay-dropdown-chevron">
                  expand_more
                </span>
              </button>

              {/* Clean Icon + Name Flyout Menu */}
              <div
                className="ay-dropdown-menu"
                role="listbox"
                aria-label="What are you looking for?"
              >
                <div className="ay-dropdown-list">
                  {SERVICE_TYPE_OPTIONS.map((option) => {
                    const isSelected = option.value === selectedService;
                    return (
                      <div
                        key={option.value}
                        className={cn('ay-dropdown-item', isSelected && 'is-selected')}
                        role="option"
                        aria-selected={isSelected}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedService(option.value);
                          setOpenDropdown(null);
                        }}
                      >
                        <span className="material-symbols-outlined ay-dropdown-item-icon">
                          {option.icon}
                        </span>
                        <span className="ay-dropdown-item-title">{option.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Field 2: Where is your event? (All Hyderabad by default) */}
            <div
              className={cn('ay-dropdown', openDropdown === 'location' && 'is-open')}
              id="locationDropdown"
              data-dropdown="location"
            >
              <input
                type="hidden"
                name="location"
                id="heroLocationInput"
                value={selectedLocation}
              />
              <button
                type="button"
                className="ay-dropdown-trigger"
                aria-haspopup="listbox"
                aria-expanded={openDropdown === 'location'}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown('location');
                }}
              >
                <div className="ay-dropdown-trigger-left">
                  <div className="ay-dropdown-icon-box is-gold">
                    <span
                      className="material-symbols-outlined"
                      id="locationTriggerIcon"
                      style={{ fontSize: '19px' }}
                    >
                      {activeLocationOption.value === 'all'
                        ? 'location_on'
                        : activeLocationOption.icon}
                    </span>
                  </div>
                  <div className="ay-dropdown-text">
                    <span className="ay-dropdown-label">Where is your event?</span>
                    <span className="ay-dropdown-value" id="locationTriggerValue">
                      {activeLocationOption.label}
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined ay-dropdown-chevron">
                  expand_more
                </span>
              </button>

              {/* Clean Icon + Name Flyout Menu */}
              <div
                className="ay-dropdown-menu"
                role="listbox"
                aria-label="Where is your event?"
              >
                <div className="ay-dropdown-list">
                  {MICRO_MARKET_OPTIONS.map((option) => {
                    const isSelected = option.value === selectedLocation;
                    return (
                      <div
                        key={option.value}
                        className={cn('ay-dropdown-item', isSelected && 'is-selected')}
                        role="option"
                        aria-selected={isSelected}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLocation(option.value);
                          setOpenDropdown(null);
                        }}
                      >
                        <span className="material-symbols-outlined ay-dropdown-item-icon">
                          {option.icon}
                        </span>
                        <span className="ay-dropdown-item-title">{option.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Field 3: When is your event? (Flexible by default) */}
            <div
              className={cn('ay-dropdown', openDropdown === 'date' && 'is-open')}
              id="dateDropdown"
              data-dropdown="date"
            >
              <input
                type="hidden"
                name="date"
                id="heroDateInput"
                value={selectedDate}
              />
              <button
                type="button"
                className="ay-dropdown-trigger"
                aria-haspopup="dialog"
                aria-expanded={openDropdown === 'date'}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDropdown('date');
                }}
              >
                <div className="ay-dropdown-trigger-left">
                  <div className="ay-dropdown-icon-box">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontSize: '19px' }}
                    >
                      calendar_month
                    </span>
                  </div>
                  <div className="ay-dropdown-text">
                    <span className="ay-dropdown-label">When is your event?</span>
                    <span className="ay-dropdown-value" id="dateTriggerValue">
                      {selectedDateLabel}
                    </span>
                  </div>
                </div>
                <span className="material-symbols-outlined ay-dropdown-chevron">
                  expand_more
                </span>
              </button>

              {/* Dynamic Calendar Popover (No invented Muhurtham data) */}
              <div
                className="ay-dropdown-menu ay-calendar-menu align-right"
                role="dialog"
                aria-label="Choose Event Date"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="ay-dropdown-header">
                  <span className="ay-dropdown-header-title">Select Event Date</span>
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
                    id="calPrevMonth"
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
                  <span className="ay-calendar-month-label" id="calMonthYearLabel">
                    {MONTH_NAMES[calMonth]} {calYear}
                  </span>
                  <button
                    type="button"
                    className="ay-calendar-nav-btn"
                    id="calNextMonth"
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
                <div className="ay-calendar-grid" id="calDaysGrid">
                  {WEEKDAYS.map((wd) => (
                    <div key={wd} className="ay-calendar-weekday">
                      {wd}
                    </div>
                  ))}

                  {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="ay-calendar-day is-muted" />
                  ))}

                  {Array.from({ length: daysInMonth }).map((_, idx) => {
                    const day = idx + 1;
                    const iso = formatIsoDate(calYear, calMonth, day);
                    const isSelected = iso === selectedDate;

                    return (
                      <button
                        key={iso}
                        type="button"
                        className={cn('ay-calendar-day', isSelected && 'is-selected')}
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
                    id="calFlexibleBtn"
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

          {/* Primary Search CTA Button */}
          <button type="submit" className="btn btn-lg btn-primary btn-block">
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              search
            </span>
            <span>Find Event Professionals</span>
          </button>
        </form>
      </div>

      {/* Quick Trending Tags */}
      <div className="trending-tags-row">
        <span
          className="text-small"
          style={{ color: 'var(--text-secondary)', fontWeight: 500 }}
        >
          Popular searches:
        </span>
        {TRENDING_SEARCH_TAGS.map((tag) => (
          <a
            key={tag.label}
            href={tag.href}
            className="trending-tag"
            onClick={(e) => {
              e.preventDefault();
              handleTrendingTagClick(tag.serviceId);
            }}
          >
            {tag.label}
          </a>
        ))}
      </div>
    </div>
  );
}
