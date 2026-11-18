/**
 * AyojanSetu – Customer Homepage Interactive Logic
 * Includes:
 * 1. Top Nav Mega-Dropdowns (Explore Vendors & Event Categories - 3-Col Icon + Text)
 * 2. Hero Search Custom Dropdowns (Icon + Name Only)
 * 3. Custom Panchangam Calendar Picker
 * 4. Bookmark Toggle & Quick Enquiry Modal
 */

document.addEventListener('DOMContentLoaded', () => {
  /* ==========================================
     1. HEADER MEGA-DROPDOWNS (EXPLORE VENDORS & EVENT CATEGORIES)
     ========================================== */
  const navDropdowns = document.querySelectorAll('[data-nav-dropdown]');
  const allSearchDropdowns = document.querySelectorAll('.ay-dropdown');

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

  navDropdowns.forEach((navDd) => {
    const trigger = navDd.querySelector('.nav-dropdown-trigger');
    const links = navDd.querySelectorAll('.nav-mega-link');

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

    links.forEach((link) => {
      link.addEventListener('click', () => {
        const targetService = link.getAttribute('data-select-service');
        if (targetService) {
          const serviceItem = document.querySelector(
            `#serviceDropdown .ay-dropdown-item[data-value="${targetService}"]`
          );
          if (serviceItem) serviceItem.click();
        }
        closeAllNavDropdowns();
      });
    });
  });

  /* ==========================================
     2. HERO SEARCH CUSTOM DROPDOWNS (ICON + NAME ONLY)
     ========================================== */
  allSearchDropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector('.ay-dropdown-trigger');
    const items = dropdown.querySelectorAll('.ay-dropdown-item');
    const hiddenInput = dropdown.querySelector('input[type="hidden"]');
    const valueDisplay = dropdown.querySelector('.ay-dropdown-value');
    const iconDisplay = dropdown.querySelector('.ay-dropdown-icon-box .material-symbols-outlined');

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
     3. CUSTOM OCCASION DATE CALENDAR PICKER
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

  const muhurthamDays = {
    10: [19, 20, 22, 25, 28, 29],
    11: [3, 4, 6, 11, 13, 18, 20, 25],
    0: [15, 18, 22, 24, 29],
    1: [5, 7, 12, 14, 19, 21]
  };

  let currentCalYear = 2026;
  let currentCalMonth = 10;
  let selectedDateStr = '2026-11-20';

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
    const auspiciousList = muhurthamDays[currentCalMonth] || [8, 14, 20, 25];

    for (let i = 0; i < firstDayOfWeek; i++) {
      const emptyEl = document.createElement('div');
      emptyEl.className = 'ay-calendar-day is-muted';
      calDaysGrid.appendChild(emptyEl);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDateString(currentCalYear, currentCalMonth, day);
      const isMuhurtham = auspiciousList.includes(day);
      const isSelected = dateStr === selectedDateStr;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ay-calendar-day';
      if (isMuhurtham) btn.classList.add('is-muhurtham');
      if (isSelected) btn.classList.add('is-selected');
      btn.textContent = String(day);

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectedDateStr = dateStr;
        const ddFormatted = String(day).padStart(2, '0');
        const suffix = isMuhurtham ? ' · Muhurtham' : '';
        const label = `${ddFormatted} ${shortMonths[currentCalMonth]} ${currentCalYear}${suffix}`;

        if (heroDateInput) heroDateInput.value = dateStr;
        if (dateTriggerValue) dateTriggerValue.textContent = label;

        presetBtns.forEach((p) => {
          p.classList.toggle('is-active', p.getAttribute('data-date-preset') === dateStr);
        });

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
      const presetDate = btn.getAttribute('data-date-preset');
      const presetLabel = btn.getAttribute('data-date-label');
      if (presetDate) {
        selectedDateStr = presetDate;
        const parts = presetDate.split('-');
        currentCalYear = parseInt(parts[0], 10);
        currentCalMonth = parseInt(parts[1], 10) - 1;
        if (heroDateInput) heroDateInput.value = presetDate;
      }
      if (presetLabel && dateTriggerValue) {
        dateTriggerValue.textContent = presetLabel;
      }
      presetBtns.forEach((p) => p.classList.remove('is-active'));
      btn.classList.add('is-active');
      renderCalendar();
      closeAllSearchDropdowns();
    });
  });

  if (calFlexibleBtn) {
    calFlexibleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (dateTriggerValue) dateTriggerValue.textContent = 'Flexible · Nov / Dec 2026';
      presetBtns.forEach((p) => p.classList.remove('is-active'));
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

  // Global outside click & Escape handler
  document.addEventListener('click', () => {
    closeAllSearchDropdowns();
    closeAllNavDropdowns();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllSearchDropdowns();
      closeAllNavDropdowns();
    }
  });

  /* ==========================================
     4. TRENDING TAGS POPULATE CUSTOM SERVICE DROPDOWN
     ========================================== */
  const trendingTags = document.querySelectorAll('[data-trending-service]');
  const serviceDropdown = document.getElementById('serviceDropdown');

  trendingTags.forEach((tag) => {
    tag.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const targetVal = tag.getAttribute('data-trending-service');
      if (serviceDropdown && targetVal) {
        const matchingItem = serviceDropdown.querySelector(`.ay-dropdown-item[data-value="${targetVal}"]`);
        if (matchingItem) {
          matchingItem.click();
          serviceDropdown.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  });

  /* ==========================================
     5. BOOKMARK / FAVORITE TOGGLE ON VENDOR CARDS
     ========================================== */
  const bookmarkBtns = document.querySelectorAll('.vendor-bookmark-btn');
  bookmarkBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      btn.classList.toggle('is-active');
      const icon = btn.querySelector('.material-symbols-outlined');
      if (btn.classList.contains('is-active')) {
        icon.style.fontVariationSettings = "'FILL' 1";
      } else {
        icon.style.fontVariationSettings = "'FILL' 0";
      }
    });
  });

  /* ==========================================
     6. QUICK ENQUIRY MODAL
     ========================================== */
  const modal = document.getElementById('enquiryModal');
  const modalVendorName = document.getElementById('modalVendorName');
  const openModalBtns = document.querySelectorAll('[data-open-enquiry]');
  const closeModalBtns = document.querySelectorAll('[data-close-enquiry]');
  const enquiryForm = document.getElementById('quickEnquiryForm');
  const enquiryFeedback = document.getElementById('enquirySuccessBanner');

  openModalBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const vendor = btn.getAttribute('data-vendor') || 'Verified Hyderabad Partner';
      if (modalVendorName) modalVendorName.textContent = vendor;
      if (enquiryFeedback) enquiryFeedback.style.display = 'none';
      if (enquiryForm) enquiryForm.style.display = 'flex';
      if (modal) modal.classList.add('is-open');
    });
  });

  closeModalBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      if (modal) modal.classList.remove('is-open');
    });
  });

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('is-open');
    });
  }

  if (enquiryForm) {
    enquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      enquiryForm.style.display = 'none';
      if (enquiryFeedback) enquiryFeedback.style.display = 'block';
    });
  }

  /* ==========================================
     7. HERO SEARCH FORM SUBMIT
     ========================================== */
  const heroSearchForm = document.getElementById('heroSearchForm');
  if (heroSearchForm) {
    heroSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const vendorsSection = document.getElementById('featured-vendors');
      if (vendorsSection) {
        vendorsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});
