import type { Currency, CurrencyParams } from '../../currency.interface';
import type { MRT_ColumnDef } from 'material-react-table';
import type { FC } from 'react';

import { useMemo } from 'react';

import Chip from '@mui/material/Chip';

import { useCurrenciesQuery } from '../../hooks/currencies.query';

import { CustomTable } from '@/components/shared/CustomTable';

interface CurrenciesTableProps {}

export const CurrencyTable: FC<CurrenciesTableProps> = ({}) => {
  const currencyParams: CurrencyParams = {};

  const columns = useMemo<MRT_ColumnDef<Currency>[]>(
    () => [
      {
        id: 'id',
        header: 'ID',
        accessorKey: 'id',
        size: 60
      },
      {
        header: 'Nombre',
        id: 'name',
        accessorKey: 'name',
        size: 200
      },
      {
        header: 'Código',
        id: 'code',
        accessorKey: 'code',
        size: 120
      },
      {
        header: 'Estado',
        id: 'active',
        accessorKey: 'active',
        size: 120,
        filterVariant: 'select',
        filterSelectOptions: [
          { label: 'Activo', value: 'true' },
          { label: 'Inactivo', value: 'false' }
        ],
        Cell: ({ row: { original } }) => (
          <Chip
            label={original.active ? 'Activo' : 'Inactivo'}
            color={original.active ? 'success' : 'default'}
            size='small'
          />
        )
      }
    ],
    []
  );

  return (
    <CustomTable
      queryHook={useCurrenciesQuery}
      queryProps={{
        options: currencyParams
      }}
      columns={columns}
      enableRowActions={false}
      initialState={{
        columnVisibility: { id: false }
      }}
    />
  );
};
