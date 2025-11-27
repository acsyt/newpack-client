import type { MRT_ColumnDef } from 'material-react-table';

import dayjs from 'dayjs';
import { Check, X } from 'lucide-react';

import { Process } from '../../process.interface';

export const columns: MRT_ColumnDef<Process>[] = [
  {
    id: 'id',
    header: 'ID',
    accessorKey: 'id',
    size: 20
  },
  {
    header: 'Código',
    id: 'code',
    accessorKey: 'code',
    size: 100
  },
  {
    header: 'Nombre',
    id: 'name',
    accessorKey: 'name'
  },
  {
    header: 'Aplica a PT',
    id: 'appliesToPt',
    accessorKey: 'appliesToPt',
    filterVariant: 'select',
    filterSelectOptions: [
      { label: 'Sí', value: 'true' },
      { label: 'No', value: 'false' }
    ],
    size: 120,
    Cell: ({ row: { original } }) => (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {original.appliesToPt ? (
          <Check size={18} color='green' />
        ) : (
          <X size={18} color='red' />
        )}
      </div>
    )
  },
  {
    header: 'Aplica a MP',
    id: 'appliesToMp',
    accessorKey: 'appliesToMp',
    filterVariant: 'select',
    filterSelectOptions: [
      { label: 'Sí', value: 'true' },
      { label: 'No', value: 'false' }
    ],
    size: 120,
    Cell: ({ row: { original } }) => (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {original.appliesToMp ? (
          <Check size={18} color='green' />
        ) : (
          <X size={18} color='red' />
        )}
      </div>
    )
  },
  {
    header: 'Aplica a Compuestos',
    id: 'appliesToCompounds',
    accessorKey: 'appliesToCompounds',
    filterVariant: 'select',
    filterSelectOptions: [
      { label: 'Sí', value: 'true' },
      { label: 'No', value: 'false' }
    ],
    size: 150,
    Cell: ({ row: { original } }) => (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {original.appliesToCompounds ? (
          <Check size={18} color='green' />
        ) : (
          <X size={18} color='red' />
        )}
      </div>
    )
  },
  {
    id: 'updated_at',
    header: 'Actualizado el',
    accessorKey: 'updatedAt',
    filterVariant: 'date-range',
    size: 150,
    accessorFn: row =>
      row.updatedAt
        ? dayjs(row.updatedAt)
            .tz(dayjs.tz.guess())
            .format('MM/DD/YYYY HH:mm:ss')
        : '-'
  }
];
