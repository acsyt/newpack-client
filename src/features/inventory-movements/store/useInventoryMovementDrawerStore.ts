import { create } from 'zustand';

import { MovementType } from '@/features/inventory-movements/inventory-movement.interface';

interface InventoryMovementDrawerStore {
  isOpen: boolean;
  movementType: MovementType | null;
  onOpen: (type: MovementType) => void;
  onClose: () => void;
}

export const useInventoryMovementDrawerStore =
  create<InventoryMovementDrawerStore>(set => ({
    isOpen: false,
    movementType: null,
    onOpen: type => set({ isOpen: true, movementType: type }),
    onClose: () => set({ isOpen: false, movementType: null })
  }));
