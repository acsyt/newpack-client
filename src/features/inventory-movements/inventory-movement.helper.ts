import { MovementType } from './inventory-movement.interface';

import { CustomOption } from '@/interfaces/custom-option.interface';

export class InventoryMovementHelper {
  public static humanTypes: Record<MovementType, string> = {
    [MovementType.Entry]: 'Entrada',
    [MovementType.Exit]: 'Salida'
  };

  public static humanReadableType(type: MovementType): string {
    return InventoryMovementHelper.humanTypes[type] ?? '---';
  }

  public static getHumanTypes(): CustomOption[] {
    return Object.entries(InventoryMovementHelper.humanTypes).map(
      ([key, value]) => ({
        value: key,
        label: value
      })
    );
  }
}
