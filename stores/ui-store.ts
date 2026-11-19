/**
 * AyojanSetu – Global UI Store (Zustand)
 */

import { create } from 'zustand';
import type { EventTypeFilter, MicroMarketId, ServiceId } from '@/types';

export interface ProfileModalData {
  eyebrow: string;
  name: string;
  category: string;
  area: string;
  about: string;
  price: string;
  status: string;
}

interface UiStoreState {
  // 1. Vendor Enquiry Modal State
  isEnquiryModalOpen: boolean;
  enquiryVendorName: string;
  openEnquiryModal: (vendorName?: string) => void;
  closeEnquiryModal: () => void;

  // 2. Customer Auth (Login / Sign Up) Prototype Modal State
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;

  // 3. Vendor Profile / Registration Guide Modal State
  isProfileModalOpen: boolean;
  profileModalData: ProfileModalData | null;
  openProfileModal: (data: ProfileModalData) => void;
  closeProfileModal: () => void;

  // 4. Mobile Navigation Drawer State
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;

  // 5. Shared Marketplace Search Filters
  selectedEventType: EventTypeFilter;
  selectedService: ServiceId;
  selectedLocation: MicroMarketId;
  selectedDate: string;
  selectedDateLabel: string;
  isSearchPrototypeActive: boolean;
  setSelectedEventType: (eventType: EventTypeFilter) => void;
  setSelectedService: (service: ServiceId) => void;
  setSelectedLocation: (location: MicroMarketId) => void;
  setSelectedDate: (date: string, label: string) => void;
  activateSearchPrototype: () => void;
  resetSearchFilters: () => void;

  // 6. Client-side Vendor Bookmarks
  bookmarkedVendorIds: string[];
  toggleVendorBookmark: (vendorId: string) => void;
}

export const useUiStore = create<UiStoreState>((set) => ({
  isEnquiryModalOpen: false,
  enquiryVendorName: 'Sri Venkateswara Event & Stage Decor',
  openEnquiryModal: (vendorName = 'Sample Hyderabad Vendor') =>
    set({
      isEnquiryModalOpen: true,
      enquiryVendorName: vendorName,
      isMobileMenuOpen: false,
      isProfileModalOpen: false,
    }),
  closeEnquiryModal: () => set({ isEnquiryModalOpen: false }),

  isAuthModalOpen: false,
  openAuthModal: () =>
    set({
      isAuthModalOpen: true,
      isMobileMenuOpen: false,
    }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  isProfileModalOpen: false,
  profileModalData: null,
  openProfileModal: (data) =>
    set({
      isProfileModalOpen: true,
      profileModalData: data,
      isMobileMenuOpen: false,
    }),
  closeProfileModal: () => set({ isProfileModalOpen: false }),

  isMobileMenuOpen: false,
  toggleMobileMenu: () =>
    set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),

  selectedEventType: 'All Events',
  selectedService: 'all',
  selectedLocation: 'all',
  selectedDate: 'flexible',
  selectedDateLabel: 'Flexible Dates',
  isSearchPrototypeActive: false,
  setSelectedEventType: (eventType) => set({ selectedEventType: eventType }),
  setSelectedService: (service) => set({ selectedService: service }),
  setSelectedLocation: (location) => set({ selectedLocation: location }),
  setSelectedDate: (date, label) =>
    set({ selectedDate: date, selectedDateLabel: label }),
  activateSearchPrototype: () => set({ isSearchPrototypeActive: true }),
  resetSearchFilters: () =>
    set({
      selectedEventType: 'All Events',
      selectedService: 'all',
      selectedLocation: 'all',
      selectedDate: 'flexible',
      selectedDateLabel: 'Flexible Dates',
      isSearchPrototypeActive: false,
    }),

  bookmarkedVendorIds: [],
  toggleVendorBookmark: (vendorId) =>
    set((state) => {
      const exists = state.bookmarkedVendorIds.includes(vendorId);
      return {
        bookmarkedVendorIds: exists
          ? state.bookmarkedVendorIds.filter((id) => id !== vendorId)
          : [...state.bookmarkedVendorIds, vendorId],
      };
    }),
}));
