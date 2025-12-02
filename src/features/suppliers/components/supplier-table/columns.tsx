import type { MRT_ColumnDef } from 'material-react-table';
import dayjs from 'dayjs';
import { StatusChip } from '@/components/shared/StatusChip';
import { Supplier } from '@/features/suppliers/supplier.interface'; // ajusta el path según tu estructura

export const columns: MRT_ColumnDef<Supplier>[] = [
  { id: 'id', accessorKey: 'id', header: 'ID', size: 60 },
  { id: 'companyName', accessorKey: 'companyName', header: 'Empresa' },
  { id: 'contactName', accessorKey: 'contactName', header: 'Contacto' },
  { id: 'email', accessorKey: 'email', header: 'Correo electrónico' },
  { id: 'phone', accessorKey: 'phone', header: 'Teléfono' },
  { id: 'rfc', accessorKey: 'rfc', header: 'RFC' },
  { id: 'legalName', accessorKey: 'legalName', header: 'Razón social' },
  { id: 'status', accessorKey: 'status', header: 'Estado' },
  { id: 'notes', accessorKey: 'notes', header: 'Notas' },
  {
    id: 'updatedAt',
    accessorKey: 'updatedAt',
    header: 'Actualizado el',
    accessorFn: (row) =>
      row.updatedAt
        ? dayjs(row.updatedAt).format('YYYY-MM-DD HH:mm:ss')
        : '-',
  }
];
