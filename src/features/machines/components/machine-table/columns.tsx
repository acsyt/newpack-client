import type { MRT_ColumnDef } from 'material-react-table';

import dayjs from 'dayjs';

import { Machine } from '../../machine.interface';

export const machineColumns: MRT_ColumnDef<Machine>[] = [
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
    header: 'Proceso',
    id: 'process.name',
    accessorKey: 'process.name',
    Cell: ({ row: { original } }) => original.process?.name || '-'
  },
  {
    header: 'Velocidad M/H',
    id: 'speed_mh',
    accessorKey: 'speedMh',
    size: 120,
    Cell: ({ row: { original } }) =>
      original.speedMh !== null ? original.speedMh.toFixed(2) : '-'
  },
  {
    header: 'Velocidad KG/H',
    id: 'speed_kgh',
    accessorKey: 'speedKgh',
    size: 120,
    Cell: ({ row: { original } }) =>
      original.speedKgh !== null ? original.speedKgh.toFixed(2) : '-'
  },
  {
    header: 'Circunferencia Total',
    id: 'circumference_total',
    accessorKey: 'circumferenceTotal',
    size: 150,
    Cell: ({ row: { original } }) =>
      original.circumferenceTotal !== null
        ? original.circumferenceTotal.toFixed(2)
        : '-'
  },
  {
    header: 'Ancho Máximo',
    id: 'max_width',
    accessorKey: 'maxWidth',
    size: 120,
    Cell: ({ row: { original } }) =>
      original.maxWidth !== null ? original.maxWidth.toFixed(2) : '-'
  },
  {
    header: 'Centro Máximo',
    id: 'max_center',
    accessorKey: 'maxCenter',
    size: 120,
    Cell: ({ row: { original } }) =>
      original.maxCenter !== null ? original.maxCenter.toFixed(2) : '-'
  },
  {
    header: 'Estado',
    id: 'status',
    accessorKey: 'status',
    size: 100
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
