import type { MouseEvent } from 'react';
import type { StoreApi } from 'zustand';

import { create } from 'zustand';

export interface UIActions {
  closeUserMenu: () => void;
  openUserMenu: (event: MouseEvent<HTMLElement>) => void;
  scrollToTop: () => void;
  setScrollContainer: (container: HTMLElement | null) => void;
  setDrawerOpen: (open: boolean) => void;
}

export interface UIState {
  userMenu: HTMLElement | null;
  scrollContainer: HTMLElement | null;
  drawerOpen: boolean;
}

export const uiInitialState: UIState = {
  userMenu: null,
  scrollContainer: null,
  drawerOpen: false
};

export const uiActions = (
  set: StoreApi<UIState & UIActions>['setState'],
  get: StoreApi<UIState & UIActions>['getState']
): UIActions => ({
  openUserMenu: (event: MouseEvent<HTMLElement>) =>
    set({ userMenu: event.currentTarget }),
  closeUserMenu: () => set({ userMenu: null }),
  setScrollContainer: (container: HTMLElement | null) =>
    set({ scrollContainer: container }),
  setDrawerOpen: (open: boolean) => set({ drawerOpen: open }),
  scrollToTop: () => {
    const { scrollContainer } = get();

    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }
});

export const useUIStore = create<UIState & UIActions>()((set, get) => ({
  ...uiInitialState,
  ...uiActions(set, get)
}));
