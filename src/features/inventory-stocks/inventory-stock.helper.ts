import { InventoryStockStatus } from './inventory-stock.interface';

import { CustomOption } from '@/interfaces/custom-option.interface';

export class InventoryStockHelper {
  public static humanStatuses: Record<InventoryStockStatus, string> = {
    [InventoryStockStatus.Available]: 'Disponible',
    [InventoryStockStatus.Reserved]: 'Reservado',
    [InventoryStockStatus.Damaged]: 'Dañado'
  };

  public static statusTransitions: Record<
    InventoryStockStatus,
    InventoryStockStatus[]
  > = {
    [InventoryStockStatus.Available]: [
      InventoryStockStatus.Reserved,
      InventoryStockStatus.Damaged
    ],
    [InventoryStockStatus.Reserved]: [
      InventoryStockStatus.Available,
      InventoryStockStatus.Damaged
    ],
    [InventoryStockStatus.Damaged]: [
      InventoryStockStatus.Available,
      InventoryStockStatus.Reserved
    ]
  };

  public static humanReadableStatus(status: InventoryStockStatus): string {
    return InventoryStockHelper.humanStatuses[status] ?? '---';
  }

  public static getHumanStatuses(): CustomOption[] {
    return Object.entries(InventoryStockHelper.humanStatuses).map(
      ([key, value]) => ({
        value: key,
        label: value
      })
    );
  }
}
