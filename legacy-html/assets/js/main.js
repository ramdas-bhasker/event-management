/**
 * AyojanSetu – All-Events Marketplace Homepage Interactive Logic
 * Includes:
 * 1. Top Nav Mega-Dropdowns (Find Vendors & Explore Events) + Mobile Nav Drawer
 * 2. Hero Search Custom Dropdowns (All Services, All Hyderabad, Dynamic Calendar) & Event-Type Pills
 * 3. Search Filter Prototype Banner & Sample Vendor Directory Filtering
 * 4. Accessible Bookmark Toggle (aria-pressed)
 * 5. Separated Modals:
 *    - Customer Login / Sign Up Prototype Modal
 *    - Vendor Profile Details Preview / Registration Guide Modal
 *    - Vendor Enquiry Modal with required field validation & clear Demo Preview state
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================
     1. HEADER MEGA-DROPDOWNS & MOBILE NAVIGATION DRAWER
     ========================================== */
  const navDropdowns = document.querySelectorAll('[data-nav-dropdown]');
  const allSearchDropdowns = document.querySelectorAll('.ay-dropdown');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenuIcon = document.getElementById('mobileMenuIcon');
  const mobileNavDrawer = document.getElementById('mobileNavDrawer');
  const mobileNavCloseLinks = document.querySelectorAll('[data-mobile-nav-close]');

  function closeAllNavDropdowns(exceptNav = null) {
    navDropdowns.forEach((nd) => {
      if (nd !== exceptNav) {
        nd.classList.remove('is-open');
        const btn = nd.querySelector('.nav-dropdown-trigger');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function closeAllSearchDropdowns(exceptDropdown = null) {
    allSearchDropdowns.forEach((dd) => {
      if (dd !== exceptDropdown) {
        dd.classList.remove('is-open');
        const trigger = dd.querySelector('.ay-dropdown-trigger');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function closeMobileMenu() {
    if (mobileNavDrawer) mobileNavDrawer.classList.remove('is-open');
    if (mobileMenuBtn) mobileMenuBtn.setAttribute('aria-expanded', 'false');
    if (mobileMenuIcon) mobileMenuIcon.textContent = 'menu';
  }

  if (mobileMenuBtn && mobileNavDrawer) {
    mobileMenuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileNavDrawer.classList.toggle('is-open');
      mobileMenuBtn.setAttribute('aria-expanded', String(isOpen));
      if (mobileMenuIcon) mobileMenuIcon.textContent = isOpen ? 'close' : 'menu';
    });
  }

  mobileNavCloseLinks.forEach((link) => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  navDropdowns.forEach((navDd) => {
    const trigger = navDd.querySelector('.nav-dropdown-trigger');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = navDd.classList.contains('is-open');
        closeAllNavDropdowns(navDd);
        closeAllSearchDropdowns();
        navDd.classList.toggle('is-open', !isOpen);
        trigger.setAttribute('aria-expanded', String(!isOpen));
      });
    }
  });

  /* ==========================================
     2. HERO EVENT-TYPE FILTER PILLS & SEARCH CUSTOM DROPDOWNS
     ========================================== */
  const heroEventTypeInput = document.getElementById('heroEventTypeInput');
  const eventTypePills = document.querySelectorAll('[data-event-pill]');

  function selectEventTypePill(eventName) {
    if (heroEventTypeInput) heroEventTypeInput.value = eventName;
    eventTypePills.forEach((pill) => {
      const isMatch = pill.getAttribute('data-event-pill') === eventName;
      pill.classList.toggle('is-active', isMatch);
    });
  }

  eventTypePills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const val = pill.getAttribute('data-event-pill') || 'All Events';
      selectEventTypePill(val);
    });
  });

  function selectDropdownValue(dropdownId, targetValue) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;
    const item = dropdown.querySelector(`.ay-dropdown-item[data-value="${targetValue}"]`);
    if (item) item.click();
  }

  allSearchDropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector('.ay-dropdown-trigger');
    const items = dropdown.querySelectorAll('.ay-dropdown-item');
    const hiddenInput = dropdown.querySelector('input[type="hidden"]');
    const valueDisplay = dropdown.querySelector('.ay-dropdown-value');
    const iconDisplay =
      dropdown.querySelector('.ay-dropdown-icon-box .material-symbols-outlined') ||
      dropdown.querySelector('.ay-dropdown-form-icon');

    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.classList.contains('is-open');
        closeAllSearchDropdowns(dropdown);
        closeAllNavDropdowns();
        dropdown.classList.toggle('is-open', !isOpen);
        trigger.setAttribute('aria-expanded', String(!isOpen));
      });
    }

    items.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        items.forEach((i) => i.classList.remove('is-selected'));
        item.classList.add('is-selected');

        const val = item.getAttribute('data-value');
        const label = item.getAttribute('data-label');
        const icon = item.getAttribute('data-icon');

        if (hiddenInput && val) hiddenInput.value = val;
        if (valueDisplay && label) valueDisplay.textContent = label;
        if (iconDisplay && icon) iconDisplay.textContent = icon;

        closeAllSearchDropdowns();
      });
    });
  });

  /* ==========================================
     3. DYNAMIC REAL-TIME CALENDAR PICKER (No invented Muhurtham data)
     ========================================== */
  const dateDropdown = document.getElementById('dateDropdown');
  const calDaysGrid = document.getElementById('calDaysGrid');
  const calMonthYearLabel = document.getElementById('calMonthYearLabel');
  const calPrevMonth = document.getElementById('calPrevMonth');
  const calNextMonth = document.getElementById('calNextMonth');
  const dateTriggerValue = document.getElementById('dateTriggerValue');
  const heroDateInput = document.getElementById('heroDateInput');
  const presetBtns = document.querySelectorAll('[data-date-preset]');
  const calFlexibleBtn = document.getElementById('calFlexibleBtn');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const shortMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const now = new Date();
  let currentCalYear = now.getFullYear();
  let currentCalMonth = now.getMonth();
  let selectedDateStr = 'flexible';

  function formatDateString(year, monthIndex, day) {
    const mm = String(monthIndex + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  }

  function renderCalendar() {
    if (!calDaysGrid || !calMonthYearLabel) return;
    calMonthYearLabel.textContent = `${monthNames[currentCalMonth]} ${currentCalYear}`;
    calDaysGrid.innerHTML = '';

    weekdays.forEach((wd) => {
      const wdEl = document.createElement('div');
      wdEl.className = 'ay-calendar-weekday';
      wdEl.textContent = wd;
      calDaysGrid.appendChild(wdEl);
    });

    const firstDayOfWeek = new Date(currentCalYear, currentCalMonth, 1).getDay();
    const daysInMonth = new Date(currentCalYear, currentCalMonth + 1, 0).getDate();

    for (let i = 0; i < firstDayOfWeek; i++) {
      const emptyEl = document.createElement('div');
      emptyEl.className = 'ay-calendar-day is-muted';
      calDaysGrid.appendChild(emptyEl);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDateString(currentCalYear, currentCalMonth, day);
      const isSelected = dateStr === selectedDateStr;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ay-calendar-day';
      if (isSelected) btn.classList.add('is-selected');
      btn.textContent = String(day);

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedDateStr = dateStr;
        const ddFormatted = String(day).padStart(2, '0');
        const label = `${ddFormatted} ${shortMonths[currentCalMonth]} ${currentCalYear}`;

        if (heroDateInput) heroDateInput.value = dateStr;
        if (dateTriggerValue) dateTriggerValue.textContent = label;

        presetBtns.forEach((p) => p.classList.remove('is-active'));
        renderCalendar();
        closeAllSearchDropdowns();
      });

      calDaysGrid.appendChild(btn);
    }
  }

  if (calPrevMonth) {
    calPrevMonth.addEventListener('click', (e) => {
      e.stopPropagation();
      currentCalMonth--;
      if (currentCalMonth < 0) {
        currentCalMonth = 11;
        currentCalYear--;
      }
      renderCalendar();
    });
  }

  if (calNextMonth) {
    calNextMonth.addEventListener('click', (e) => {
      e.stopPropagation();
      currentCalMonth++;
      if (currentCalMonth > 11) {
        currentCalMonth = 0;
        currentCalYear++;
      }
      renderCalendar();
    });
  }

  presetBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const presetType = btn.getAttribute('data-date-preset');
      presetBtns.forEach((p) => p.classList.remove('is-active'));
      btn.classList.add('is-active');

      if (presetType === 'flexible') {
        selectedDateStr = 'flexible';
        if (heroDateInput) heroDateInput.value = 'flexible';
        if (dateTriggerValue) dateTriggerValue.textContent = 'Flexible Dates';
      } else if (presetType === 'weekend') {
        const upcoming = new Date();
        const dayOfWeek = upcoming.getDay();
        const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
        upcoming.setDate(upcoming.getDate() + daysUntilSaturday);
        currentCalYear = upcoming.getFullYear();
        currentCalMonth = upcoming.getMonth();
        const satDay = upcoming.getDate();
        selectedDateStr = formatDateString(currentCalYear, currentCalMonth, satDay);
        const label = `Weekend · ${String(satDay).padStart(2, '0')} ${shortMonths[currentCalMonth]} ${currentCalYear}`;
        if (heroDateInput) heroDateInput.value = selectedDateStr;
        if (dateTriggerValue) dateTriggerValue.textContent = label;
      } else if (presetType === 'next-month') {
        const nextM = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        currentCalYear = nextM.getFullYear();
        currentCalMonth = nextM.getMonth();
        selectedDateStr = `${currentCalYear}-${String(currentCalMonth + 1).padStart(2, '0')}`;
        const label = `${monthNames[currentCalMonth]} ${currentCalYear}`;
        if (heroDateInput) heroDateInput.value = selectedDateStr;
        if (dateTriggerValue) dateTriggerValue.textContent = label;
      }

      renderCalendar();
      closeAllSearchDropdowns();
    });
  });

  if (calFlexibleBtn) {
    calFlexibleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      selectedDateStr = 'flexible';
      if (heroDateInput) heroDateInput.value = 'flexible';
      if (dateTriggerValue) dateTriggerValue.textContent = 'Flexible Dates';
      presetBtns.forEach((p) => {
        p.classList.toggle('is-active', p.getAttribute('data-date-preset') === 'flexible');
      });
      renderCalendar();
      closeAllSearchDropdowns();
    });
  }

  if (dateDropdown) {
    const calendarMenu = dateDropdown.querySelector('.ay-dropdown-menu');
    if (calendarMenu) {
      calendarMenu.addEventListener('click', (e) => e.stopPropagation());
    }
  }

  renderCalendar();

  /* ==========================================
     3B. ENQUIRY MODAL PREFERRED DATE CALENDAR PICKER
     ========================================== */
  const eqDateDropdown = document.getElementById('eqDateDropdown');
  const eqCalDaysGrid = document.getElementById('eqCalDaysGrid');
  const eqCalMonthYearLabel = document.getElementById('eqCalMonthYearLabel');
  const eqCalPrevMonth = document.getElementById('eqCalPrevMonth');
  const eqCalNextMonth = document.getElementById('eqCalNextMonth');
  const eqDateTriggerValue = document.getElementById('eqDateTriggerValue');
  const eqDateInput = document.getElementById('eqDate');
  const eqPresetBtns = document.querySelectorAll('[data-eq-date-preset]');
  const eqCalFlexibleBtn = document.getElementById('eqCalFlexibleBtn');

  let eqCalYear = now.getFullYear();
  let eqCalMonth = now.getMonth();
  let eqSelectedDateStr = 'flexible';

  function renderEnquiryCalendar() {
    if (!eqCalDaysGrid || !eqCalMonthYearLabel) return;
    eqCalMonthYearLabel.textContent = `${monthNames[eqCalMonth]} ${eqCalYear}`;
    eqCalDaysGrid.innerHTML = '';

    weekdays.forEach((wd) => {
      const wdEl = document.createElement('div');
      wdEl.className = 'ay-calendar-weekday';
      wdEl.textContent = wd;
      eqCalDaysGrid.appendChild(wdEl);
    });

    const firstDayOfWeek = new Date(eqCalYear, eqCalMonth, 1).getDay();
    const daysInMonth = new Date(eqCalYear, eqCalMonth + 1, 0).getDate();

    for (let i = 0; i < firstDayOfWeek; i++) {
      const emptyEl = document.createElement('div');
      emptyEl.className = 'ay-calendar-day is-muted';
      eqCalDaysGrid.appendChild(emptyEl);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDateString(eqCalYear, eqCalMonth, day);
      const isSelected = dateStr === eqSelectedDateStr;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ay-calendar-day';
      if (isSelected) btn.classList.add('is-selected');
      btn.textContent = String(day);

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        eqSelectedDateStr = dateStr;
        const ddFormatted = String(day).padStart(2, '0');
        const label = `${ddFormatted} ${shortMonths[eqCalMonth]} ${eqCalYear}`;

        if (eqDateInput) eqDateInput.value = label;
        if (eqDateTriggerValue) eqDateTriggerValue.textContent = label;

        eqPresetBtns.forEach((p) => p.classList.remove('is-active'));
        renderEnquiryCalendar();
        closeAllSearchDropdowns();
      });

      eqCalDaysGrid.appendChild(btn);
    }
  }

  if (eqCalPrevMonth) {
    eqCalPrevMonth.addEventListener('click', (e) => {
      e.stopPropagation();
      eqCalMonth--;
      if (eqCalMonth < 0) {
        eqCalMonth = 11;
        eqCalYear--;
      }
      renderEnquiryCalendar();
    });
  }

  if (eqCalNextMonth) {
    eqCalNextMonth.addEventListener('click', (e) => {
      e.stopPropagation();
      eqCalMonth++;
      if (eqCalMonth > 11) {
        eqCalMonth = 0;
        eqCalYear++;
      }
      renderEnquiryCalendar();
    });
  }

  eqPresetBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const presetType = btn.getAttribute('data-eq-date-preset');
      eqPresetBtns.forEach((p) => p.classList.remove('is-active'));
      btn.classList.add('is-active');

      if (presetType === 'flexible') {
        eqSelectedDateStr = 'flexible';
        if (eqDateInput) eqDateInput.value = 'Flexible Dates';
        if (eqDateTriggerValue) eqDateTriggerValue.textContent = 'Flexible Dates';
      } else if (presetType === 'weekend') {
        const upcoming = new Date();
        const dayOfWeek = upcoming.getDay();
        const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
        upcoming.setDate(upcoming.getDate() + daysUntilSaturday);
        eqCalYear = upcoming.getFullYear();
        eqCalMonth = upcoming.getMonth();
        const satDay = upcoming.getDate();
        eqSelectedDateStr = formatDateString(eqCalYear, eqCalMonth, satDay);
        const label = `Weekend · ${String(satDay).padStart(2, '0')} ${shortMonths[eqCalMonth]} ${eqCalYear}`;
        if (eqDateInput) eqDateInput.value = label;
        if (eqDateTriggerValue) eqDateTriggerValue.textContent = label;
      } else if (presetType === 'next-month') {
        const nextM = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        eqCalYear = nextM.getFullYear();
        eqCalMonth = nextM.getMonth();
        eqSelectedDateStr = `${eqCalYear}-${String(eqCalMonth + 1).padStart(2, '0')}`;
        const label = `${monthNames[eqCalMonth]} ${eqCalYear}`;
        if (eqDateInput) eqDateInput.value = label;
        if (eqDateTriggerValue) eqDateTriggerValue.textContent = label;
      }

      renderEnquiryCalendar();
      closeAllSearchDropdowns();
    });
  });

  if (eqCalFlexibleBtn) {
    eqCalFlexibleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      eqSelectedDateStr = 'flexible';
      if (eqDateInput) eqDateInput.value = 'Flexible Dates';
      if (eqDateTriggerValue) eqDateTriggerValue.textContent = 'Flexible Dates';
      eqPresetBtns.forEach((p) => {
        p.classList.toggle('is-active', p.getAttribute('data-eq-date-preset') === 'flexible');
      });
      renderEnquiryCalendar();
      closeAllSearchDropdowns();
    });
  }

  if (eqDateDropdown) {
    const eqCalendarMenu = eqDateDropdown.querySelector('.ay-dropdown-menu');
    if (eqCalendarMenu) {
      eqCalendarMenu.addEventListener('click', (e) => e.stopPropagation());
    }
  }

  renderEnquiryCalendar();

  /* ==========================================
     4. SEARCH PROTOTYPE FILTERING & NAVIGATION LINKS
     ========================================== */
  const heroSearchForm = document.getElementById('heroSearchForm');
  const heroServiceInput = document.getElementById('heroServiceInput');
  const heroLocationInput = document.getElementById('heroLocationInput');
  const serviceTriggerValue = document.getElementById('serviceTriggerValue');
  const locationTriggerValue = document.getElementById('locationTriggerValue');
  const searchPrototypeBanner = document.getElementById('searchPrototypeBanner');
  const searchPrototypeSummary = document.getElementById('searchPrototypeSummary');
  const clearSearchPrototypeBtn = document.getElementById('clearSearchPrototypeBtn');
  const resetVendorFilterLink = document.getElementById('resetVendorFilterLink');
  const vendorCards = document.querySelectorAll('[data-vendor-card]');

  function applyMarketplaceSearchFilter(scrollToResults = true) {
    const serviceVal = heroServiceInput ? heroServiceInput.value : 'all';
    const serviceLabel = serviceTriggerValue ? serviceTriggerValue.textContent : 'All Services';
    const locationVal = heroLocationInput ? heroLocationInput.value : 'all';
    const locationLabel = locationTriggerValue ? locationTriggerValue.textContent : 'All Hyderabad';
    const dateLabel = dateTriggerValue ? dateTriggerValue.textContent : 'Flexible Dates';
    const eventLabel = heroEventTypeInput ? heroEventTypeInput.value : 'All Events';

    let matchCount = 0;
    vendorCards.forEach((card) => {
      const cardService = card.getAttribute('data-vendor-service');
      const cardLocation = card.getAttribute('data-vendor-location');
      const serviceMatches = serviceVal === 'all' || cardService === serviceVal;
      const locationMatches = locationVal === 'all' || cardLocation === locationVal;

      if (serviceMatches && locationMatches) {
        card.style.display = 'flex';
        matchCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // If no sample card matches exact filter combo, keep all 4 sample cards visible with a clear note
    let summaryNote = `Filters: ${eventLabel} · ${serviceLabel} · ${locationLabel} · ${dateLabel}`;
    if (matchCount === 0) {
      vendorCards.forEach((card) => {
        card.style.display = 'flex';
      });
      summaryNote += ' (Showing all 4 sample listings in this prototype)';
    }

    if (searchPrototypeSummary) searchPrototypeSummary.textContent = summaryNote;
    if (searchPrototypeBanner) searchPrototypeBanner.classList.add('is-visible');

    if (scrollToResults) {
      const vendorsSection = document.getElementById('featured-vendors');
      if (vendorsSection) {
        vendorsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  function resetMarketplaceFilters() {
    selectEventTypePill('All Events');
    selectDropdownValue('serviceDropdown', 'all');
    selectDropdownValue('locationDropdown', 'all');
    if (calFlexibleBtn) calFlexibleBtn.click();
    vendorCards.forEach((card) => {
      card.style.display = 'flex';
    });
    if (searchPrototypeBanner) searchPrototypeBanner.classList.remove('is-visible');
  }

  if (heroSearchForm) {
    heroSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      applyMarketplaceSearchFilter(true);
    });
  }

  if (clearSearchPrototypeBtn) {
    clearSearchPrototypeBtn.addEventListener('click', () => {
      resetMarketplaceFilters();
    });
  }

  if (resetVendorFilterLink) {
    resetVendorFilterLink.addEventListener('click', (e) => {
      e.preventDefault();
      resetMarketplaceFilters();
    });
  }

  // Wire Mega-Menu service links, Trending Tags, and Section 3 Service Cards
  document.querySelectorAll('[data-select-service], [data-trending-service], [data-service-card]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const targetService =
        el.getAttribute('data-select-service') ||
        el.getAttribute('data-trending-service') ||
        el.getAttribute('data-service-card');

      if (targetService) {
        e.preventDefault();
        selectDropdownValue('serviceDropdown', targetService);
        closeAllNavDropdowns();
        closeMobileMenu();
        applyMarketplaceSearchFilter(true);
      }
    });
  });

  // Wire Event Category cards & Explore Events links
  document.querySelectorAll('[data-category-card], [data-select-event]').forEach((el) => {
    el.addEventListener('click', (e) => {
      const eventFilter = el.getAttribute('data-event-filter') || el.getAttribute('data-select-event');
      if (eventFilter) {
        selectEventTypePill(eventFilter);
      }
      if (el.hasAttribute('data-category-card')) {
        e.preventDefault();
        applyMarketplaceSearchFilter(true);
      } else {
        closeAllNavDropdowns();
        closeMobileMenu();
      }
    });
  });

  /* ==========================================
     5. ACCESSIBLE BOOKMARK TOGGLE ON VENDOR CARDS
     ========================================== */
  const bookmarkBtns = document.querySelectorAll('.vendor-bookmark-btn');
  bookmarkBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isActive = btn.classList.toggle('is-active');
      btn.setAttribute('aria-pressed', String(isActive));
      const icon = btn.querySelector('.material-symbols-outlined');
      if (icon) {
        icon.style.fontVariationSettings = isActive ? "'FILL' 1" : "'FILL' 0";
      }
    });
  });

  /* ==========================================
     6. MODALS: ENQUIRY, LOGIN/AUTH, AND VENDOR PROFILE / GUIDE
     ========================================== */
  const enquiryModal = document.getElementById('enquiryModal');
  const modalVendorName = document.getElementById('modalVendorName');
  const enquiryForm = document.getElementById('quickEnquiryForm');
  const enquiryFeedback = document.getElementById('enquirySuccessBanner');
  const enquiryDemoPayloadSummary = document.getElementById('enquiryDemoPayloadSummary');
  const eqName = document.getElementById('eqName');
  const eqNameError = document.getElementById('eqNameError');
  const eqPhone = document.getElementById('eqPhone');
  const eqPhoneGroup = document.getElementById('eqPhoneGroup');
  const eqPhoneError = document.getElementById('eqPhoneError');
  const eqCategory = document.getElementById('eqCategory');

  const authModal = document.getElementById('authModal');
  const authPrototypeForm = document.getElementById('authPrototypeForm');
  const authPhone = document.getElementById('authPhone');
  const authPhoneGroup = document.getElementById('authPhoneGroup');
  const authPhoneError = document.getElementById('authPhoneError');
  const authDemoMessage = document.getElementById('authDemoMessage');

  const profileModal = document.getElementById('profileModal');
  const profileModalEyebrow = document.getElementById('profileModalEyebrow');
  const profileModalTitle = document.getElementById('profileModalTitle');
  const profileModalCategory = document.getElementById('profileModalCategory');
  const profileModalArea = document.getElementById('profileModalArea');
  const profileModalAbout = document.getElementById('profileModalAbout');
  const profileModalPrice = document.getElementById('profileModalPrice');
  const profileModalStatus = document.getElementById('profileModalStatus');
  const profileModalEnquireBtn = document.getElementById('profileModalEnquireBtn');

  function openEnquiryModalForVendor(vendorName) {
    if (modalVendorName) modalVendorName.textContent = vendorName || 'Sample Hyderabad Vendor';
    if (enquiryFeedback) enquiryFeedback.style.display = 'none';
    if (enquiryForm) enquiryForm.style.display = 'block';
    if (eqName) eqName.classList.remove('is-error');
    if (eqNameError) eqNameError.style.display = 'none';
    if (eqPhoneGroup) eqPhoneGroup.classList.remove('is-error');
    if (eqPhoneError) eqPhoneError.style.display = 'none';
    if (enquiryModal) {
      enquiryModal.classList.add('is-open');
      enquiryModal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeEnquiryModal() {
    if (enquiryModal) {
      enquiryModal.classList.remove('is-open');
      enquiryModal.setAttribute('aria-hidden', 'true');
    }
  }

  function openAuthModal() {
    if (authPhoneGroup) authPhoneGroup.classList.remove('is-error');
    if (authPhoneError) authPhoneError.style.display = 'none';
    if (authDemoMessage) authDemoMessage.style.display = 'none';
    if (authModal) {
      authModal.classList.add('is-open');
      authModal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeAuthModal() {
    if (authModal) {
      authModal.classList.remove('is-open');
      authModal.setAttribute('aria-hidden', 'true');
    }
  }

  function openProfileModal(data) {
    if (profileModalEyebrow) profileModalEyebrow.textContent = data.eyebrow || 'Sample Vendor Profile';
    if (profileModalTitle) profileModalTitle.textContent = data.name;
    if (profileModalCategory) profileModalCategory.textContent = data.category;
    if (profileModalArea) profileModalArea.textContent = data.area;
    if (profileModalAbout) profileModalAbout.textContent = data.about;
    if (profileModalPrice) profileModalPrice.textContent = data.price;
    if (profileModalStatus) profileModalStatus.textContent = data.status;
    if (profileModalEnquireBtn) {
      profileModalEnquireBtn.onclick = () => {
        closeProfileModal();
        openEnquiryModalForVendor(data.name);
      };
    }
    if (profileModal) {
      profileModal.classList.add('is-open');
      profileModal.setAttribute('aria-hidden', 'false');
    }
  }

  function closeProfileModal() {
    if (profileModal) {
      profileModal.classList.remove('is-open');
      profileModal.setAttribute('aria-hidden', 'true');
    }
  }

  // Open Enquiry triggers
  document.querySelectorAll('[data-open-enquiry]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const vendor = btn.getAttribute('data-vendor') || 'Sample Hyderabad Vendor';
      openEnquiryModalForVendor(vendor);
    });
  });

  // Vendor CTA Banner buttons
  document.querySelectorAll('[data-open-vendor-onboarding]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openEnquiryModalForVendor('Vendor Business Registration Preview');
    });
  });

  document.querySelectorAll('[data-open-vendor-guide]').forEach((btn) => {
    btn.addEventListener('click', () => {
      openProfileModal({
        eyebrow: 'Vendor Onboarding Guide',
        name: 'How Vendor Registration Works on AyojanSetu',
        category: 'All Event Services',
        area: 'Hyderabad Marketplace',
        about:
          '1. Submit your business details, service categories, and Hyderabad locality coverage. 2. Upload real event portfolio photos and starting price baselines. 3. Once verified, customers can discover your profile and contact you directly via WhatsApp or phone.',
        price: 'Transparent Listing · Direct Customer Leads',
        status: 'Ready to list your business? Click below to preview vendor onboarding.',
      });
    });
  });

  // Make Vendor Cards & View Profile buttons open the Vendor Profile Preview Modal
  vendorCards.forEach((card) => {
    function handleOpenCardProfile() {
      openProfileModal({
        eyebrow: 'Sample Vendor Profile',
        name: card.getAttribute('data-vendor-name') || 'Sample Vendor',
        category: card.getAttribute('data-vendor-category') || 'Event Service',
        area: card.getAttribute('data-vendor-area') || 'Hyderabad',
        about: card.getAttribute('data-vendor-about') || '',
        price: card.getAttribute('data-vendor-price') || '',
        status: card.getAttribute('data-vendor-status') || 'Sample Profile',
      });
    }

    card.addEventListener('click', (e) => {
      if (e.target.closest('[data-open-enquiry]') || e.target.closest('.vendor-bookmark-btn')) {
        return;
      }
      handleOpenCardProfile();
    });

    const profileBtn = card.querySelector('[data-open-profile]');
    if (profileBtn) {
      profileBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleOpenCardProfile();
      });
    }
  });

  // Open Auth Modal triggers (Login / Sign Up)
  document.querySelectorAll('[data-open-auth]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openAuthModal();
    });
  });

  // Close buttons & backdrop clicks
  document.querySelectorAll('[data-close-enquiry]').forEach((btn) => {
    btn.addEventListener('click', closeEnquiryModal);
  });
  document.querySelectorAll('[data-close-auth]').forEach((btn) => {
    btn.addEventListener('click', closeAuthModal);
  });
  document.querySelectorAll('[data-close-profile]').forEach((btn) => {
    btn.addEventListener('click', closeProfileModal);
  });

  [enquiryModal, authModal, profileModal].forEach((m) => {
    if (m) {
      m.addEventListener('click', (e) => {
        if (e.target === m) {
          m.classList.remove('is-open');
          m.setAttribute('aria-hidden', 'true');
        }
      });
    }
  });

  // Validate Enquiry Form & Show Honest Demo Preview State
  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameVal = eqName ? eqName.value.trim() : '';
      const phoneVal = eqPhone ? eqPhone.value.replace(/\s+/g, '') : '';
      const isNameValid = nameVal.length >= 2;
      const isPhoneValid = /^[6-9]\d{9}$/.test(phoneVal);

      if (eqName) eqName.classList.toggle('is-error', !isNameValid);
      if (eqNameError) eqNameError.style.display = isNameValid ? 'none' : 'block';
      if (eqPhoneGroup) eqPhoneGroup.classList.toggle('is-error', !isPhoneValid);
      if (eqPhoneError) eqPhoneError.style.display = isPhoneValid ? 'none' : 'block';

      if (!isNameValid || !isPhoneValid) return;

      const selectedOccasion = eqCategory ? eqCategory.value : 'Event';
      const targetVendor = modalVendorName ? modalVendorName.textContent : 'Vendor';
      if (enquiryDemoPayloadSummary) {
        enquiryDemoPayloadSummary.textContent = `Demo summary for ${targetVendor}: ${nameVal} (+91 ${phoneVal}) · ${selectedOccasion}. No backend submission performed.`;
      }

      enquiryForm.style.display = 'none';
      if (enquiryFeedback) enquiryFeedback.style.display = 'block';
    });
  }

  // Validate Auth Prototype Form
  if (authPrototypeForm) {
    authPrototypeForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const phoneVal = authPhone ? authPhone.value.replace(/\s+/g, '') : '';
      const isPhoneValid = /^[6-9]\d{9}$/.test(phoneVal);

      if (authPhoneGroup) authPhoneGroup.classList.toggle('is-error', !isPhoneValid);
      if (authPhoneError) authPhoneError.style.display = isPhoneValid ? 'none' : 'block';

      if (!isPhoneValid) return;
      if (authDemoMessage) authDemoMessage.style.display = 'flex';
    });
  }

  // Global outside click & Escape handler
  document.addEventListener('click', () => {
    closeAllSearchDropdowns();
    closeAllNavDropdowns();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllSearchDropdowns();
      closeAllNavDropdowns();
      closeMobileMenu();
      closeEnquiryModal();
      closeAuthModal();
      closeProfileModal();
    }
  });
});
