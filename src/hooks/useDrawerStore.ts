import { create } from 'zustand';

import { ModeAction } from '@/config/enums/mode-action.enum';

export interface BaseDrawerStoreProps<T> {
  mode: ModeAction;
  isOpen: boolean;
  item: T | null;
  title?: string;
  onClose: () => void;
  setItem: (item: T | null) => void;
  onCreate: (title?: string) => void;
  onEdit: (item: T, title?: string) => void;
  onShow: (item: T, title?: string) => void;
}

/**
 * Factory function to create a reusable drawer store for any entity
 * @template T - The type of entity (e.g., Machine, User, Product)
 * @returns A zustand store with drawer state management
 *
 * @example
 * ```tsx
 * const useMachineDrawerStore = createDrawerStore<Machine>();
 *
 * function MyComponent() {
 *   const { isOpen, item, onCreate, onEdit, onShow, onClose } = useMachineDrawerStore();
 *   // ...
 * }
 * ```
 */
export function createDrawerStore<T>() {
  return create<BaseDrawerStoreProps<T>>(set => ({
    mode: ModeAction.Create,
    isOpen: false,
    item: null,
    onClose: () => set({ isOpen: false, item: null }),
    setItem: item => set({ item }),
    onCreate: (title?: string) =>
      set({
        isOpen: true,
        mode: ModeAction.Create,
        item: null,
        title: title ?? ''
      }),
    onEdit: (item, title?: string) =>
      set({
        isOpen: true,
        mode: ModeAction.Edit,
        item,
        title: title ?? ''
      }),
    onShow: (item, title?: string) =>
      set({ isOpen: true, mode: ModeAction.Show, item, title: title ?? '' })
  }));
}
