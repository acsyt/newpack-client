import { Process } from '../processes';

import { BasePaginationParams } from '@/interfaces/pagination-response.interface';

export interface Machine {
  id: number;
  code: string;
  name: string;
  processId: number;
  process?: Process;
  speedMh: number | null;
  speedKgh: number | null;
  circumferenceTotal: number | null;
  maxWidth: number | null;
  maxCenter: number | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface MachineFilter {
  id?: number[];
  code?: string;
  name?: string;
  processId?: number;
  status?: string;
  search?: string;
}

export type MachineRelations = 'process';

export interface MachineParams
  extends BasePaginationParams<MachineFilter, MachineRelations> {}
