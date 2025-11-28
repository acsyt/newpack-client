import { create } from 'zustand';

import { ModeAction } from '@/config/enums/mode-action.enum';

export interface BaseDrawerStoreProps<T> {
  mode: ModeAction;
  isOpen: boolean;
  item: T | null;
  onClose: () => void;
  setItem: (item: T | null) => void;
  onCreate: () => void;
  onEdit: (item: T) => void;
  onShow: (item: T) => void;
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
    onCreate: () => set({ isOpen: true, mode: ModeAction.Create, item: null }),
    onEdit: item => set({ isOpen: true, mode: ModeAction.Edit, item }),
    onShow: item => set({ isOpen: true, mode: ModeAction.Show, item })
  }));
}
