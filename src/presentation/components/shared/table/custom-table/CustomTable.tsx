import type {
  BasePaginationParams,
  PaginationResponse
} from '@/domain/interfaces/pagination-response.interface';
import type { QueryClient, UseQueryResult } from '@tanstack/react-query';
import type {
  ColumnFiltersState,
  PaginationState,
  SortingState
} from '@tanstack/react-table';
import type {
  MRT_RowData,
  MRT_ColumnDef,
  MRT_RowSelectionState
} from 'material-react-table';

import { useEffect, useMemo, useState } from 'react';

import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import {
  MaterialReactTable,
  MaterialReactTableProps,
  MRT_ShowHideColumnsButton,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton
} from 'material-react-table';
import { useDebounce } from 'use-debounce';

import {
  DEBOUNCE_FILTER_TIME,
  INITIAL_PAGE,
  INITIAL_PAGE_SIZE
} from '@/config/constants/app.constants';

interface Params<J = Record<string, any[]>, F = string> {
  options: BasePaginationParams<J, F>;
}

interface CustomTableProps<
  T extends MRT_RowData,
  J,
  Y = Record<string, any[]>,
  F = string
> extends Omit<
    MaterialReactTableProps<T>,
    | 'queryHook'
    | 'queryProps'
    | 'queryPrefetch'
    | 'table'
    | 'onRowSelectionChange'
  > {
  queryHook: (props: J & Params) => UseQueryResult<PaginationResponse<T>>;
  queryProps: J & Params;
  columns: MRT_ColumnDef<T>[];
  queryPrefetch?: (
    queryClient: QueryClient,
    options: BasePaginationParams<Y, F>
  ) => void;
  enableRowSelection?: boolean;
  onRowSelectionChange?: (selectedIds: number[]) => void;
  allowFullWidthActions?: boolean;
}

export const CustomTable = <
  T extends Record<string, any>,
  J,
  F extends Record<string, any[]> = Record<string, any[]>,
  I = string
>({
  queryProps,
  queryHook,
  columns,
  queryPrefetch,
  enableGlobalFilter = true,
  enableRowSelection = false,
  onRowSelectionChange,
  allowFullWidthActions = false,
  ...rest
}: CustomTableProps<T, J, F, I>) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const queryClient = useQueryClient();

  const memoizedColumns = useMemo(() => columns, [columns]);

  const [debouncedColumnFilters] = useDebounce(
    columnFilters,
    DEBOUNCE_FILTER_TIME
  );

  const immutableFilters = useMemo(
    () => queryProps.options?.filter ?? ({} as F),
    [queryProps.options?.filter]
  );

  const mutableFilters = useMemo(() => {
    const filters = {} as Record<string, string[]>;

    debouncedColumnFilters?.forEach(({ id, value }) => {
      const isArray = Array.isArray(value);

      if (!isArray) {
        if (typeof value === 'string') {
          filters[id] = [value];
        } else if (typeof value === 'number') {
          filters[id] = [value.toString()];
        } else if (typeof value === 'boolean') {
          filters[id] = [value ? 'true' : 'false'];
        } else if (dayjs.isDayjs(value)) {
          filters[id] = [value.toISOString().split('T')[0]];
        } else if (value instanceof Date) {
          filters[id] = [value.toISOString().split('T')[0]];
        } else {
          filters[id] = [String(value)];
        }
      } else {
        filters[id] = value.map(item => {
          if (dayjs.isDayjs(item)) {
            return item.toISOString().split('T')[0];
          } else if (item instanceof Date) {
            return item.toISOString().split('T')[0];
          } else {
            return String(item);
          }
        });
      }
    });

    return filters as F;
  }, [debouncedColumnFilters]);

  const combinedFilters = useMemo(() => {
    return {
      ...mutableFilters,
      ...immutableFilters
    } as F;
  }, [immutableFilters, mutableFilters]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: INITIAL_PAGE - 1,
    pageSize: INITIAL_PAGE_SIZE
  });
  const [globalFilter, setGlobalFilter] = useState<string>('');

  const [sorting, setSorting] = useState<SortingState>(() => {
    return rest.initialState?.sorting || [{ id: 'id', desc: true }];
  });

  const sort = useMemo<string>(() => {
    if (sorting.length === 0) return '';
    const { desc, id } = sorting[0];

    return desc ? `-${id}` : id;
  }, [sorting]);

  const options = useMemo<any>(
    () => ({
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      filters: combinedFilters as F,
      sort,
      term: globalFilter,
      include: (queryProps.options.include || []) as string[]
    }),
    [
      pagination.pageIndex,
      pagination.pageSize,
      combinedFilters,
      sort,
      globalFilter,
      queryProps.options.include
    ]
  );

  const newQueryProps = useMemo(
    () => ({
      ...queryProps,
      options
    }),
    [queryProps, options]
  );

  const { data, isLoading, isFetching, isError } = queryHook(newQueryProps);

  const paginationData = data?.data ?? [];

  const isLoadingFreshData =
    isLoading || (isFetching && data?.data.length === 0);

  const currentPage = data?.meta?.current_page || 1;
  const lastPage = data?.meta?.last_page || 1;
  const hasMore = currentPage < lastPage;

  useEffect(() => {
    if (paginationData.length > 0 && hasMore && queryPrefetch && !isFetching) {
      queryPrefetch(queryClient, {
        ...newQueryProps,
        page: currentPage + 1
      });
    }
  }, [
    currentPage,
    hasMore,
    isFetching,
    newQueryProps,
    paginationData.length,
    queryClient,
    queryPrefetch
  ]);

  const clearFilters = () => {
    setPagination({
      pageIndex: INITIAL_PAGE - 1,
      pageSize: INITIAL_PAGE_SIZE
    });
    setGlobalFilter('');
    setSorting([]);
    setColumnFilters([]);
  };

  const [rowSelection, setRowSelection] = useState<MRT_RowSelectionState>({});

  const handleRowSelectionChange: MaterialReactTableProps<T>['onRowSelectionChange'] =
    updaterOrValue => {
      const newRowSelection =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(rowSelection)
          : updaterOrValue;

      setRowSelection(newRowSelection);

      if (onRowSelectionChange) {
        const selectedIds = Object.keys(newRowSelection)
          .filter(key => newRowSelection[key] === true)
          .map(id => Number(id))
          .filter(id => !isNaN(id));

        onRowSelectionChange(selectedIds);
      }
    };

  useEffect(() => {
    if (enableRowSelection == false) {
      setRowSelection({});
    }
  }, [enableRowSelection]);

  return (
    <MaterialReactTable
      {...rest}
      manualFiltering
      manualPagination
      manualSorting
      enableColumnResizing
      enableStickyHeader
      data={paginationData}
      columns={memoizedColumns}
      getRowId={row => row.id}
      enableRowSelection={enableRowSelection}
      columnResizeMode={'onEnd'}
      muiTableContainerProps={{ sx: { maxHeight: '550px' } }}
      muiTableBodyCellProps={({ cell }) => {
        if (cell.column.id === 'mrt-row-actions') {
          return {
            sx: {
              ...(allowFullWidthActions && {
                minWidth: 'auto',
                width: 'auto',
                whiteSpace: 'nowrap'
              }),

              '& .MuiBox-root': {
                display: 'flex',
                gap: 0,
                alignItems: 'center'
              }
            }
          };
        }

        if (allowFullWidthActions && cell.column.id === 'mrt-row-actions') {
          return {
            sx: {
              minWidth: 'auto',
              width: 'auto',
              whiteSpace: 'nowrap'
            }
          };
        }

        return {
          sx: {
            maxWidth: '200px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }
        };
      }}
      muiTableHeadCellProps={({ column }) => {
        if (allowFullWidthActions && column.id === 'mrt-row-actions') {
          return {
            sx: {
              minWidth: 'auto',
              width: 'auto',
              whiteSpace: 'nowrap'
            }
          };
        }

        return {
          sx: {
            maxWidth: '200px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }
        };
      }}
      rowCount={data?.meta?.total || 0}
      layoutMode='semantic'
      positionActionsColumn='last'
      initialState={{
        ...rest.initialState,
        showColumnFilters: true,
        showGlobalFilter: Boolean(globalFilter),
        columnPinning: { right: ['mrt-row-actions'] }
      }}
      columnFilterDisplayMode='popover'
      renderTopToolbarCustomActions={params => (
        <Box>{rest.renderTopToolbarCustomActions?.(params)}</Box>
      )}
      renderToolbarInternalActions={({ table }) => (
        <Box
          display='flex'
          flexDirection={'column'}
          justifyContent={'flex-end'}
        >
          <Box display='flex' justifyContent={'flex-end'}>
            {enableGlobalFilter && (
              <MRT_ToggleGlobalFilterButton table={table} />
            )}
            <Tooltip title={'Clear filters'}>
              <IconButton onClick={clearFilters}>
                <FilterAltOffIcon />
              </IconButton>
            </Tooltip>
            <MRT_ShowHideColumnsButton table={table} />
            <MRT_ToggleDensePaddingButton table={table} />
            <MRT_ToggleFullScreenButton table={table} />
          </Box>
        </Box>
      )}
      muiToolbarAlertBannerProps={
        isError
          ? {
              color: 'error',
              content: 'Error loading data'
            }
          : undefined
      }
      state={{
        ...rest.state,
        columnFilters,
        isLoading: isLoadingFreshData,
        pagination,
        showAlertBanner: isError,
        showProgressBars: isLoading,
        sorting,
        globalFilter,
        rowSelection: enableRowSelection ? rowSelection : {}
      }}
      enableGlobalFilter={enableGlobalFilter}
      onRowSelectionChange={
        enableRowSelection ? handleRowSelectionChange : undefined
      }
      onColumnFiltersChange={filters => setColumnFilters(filters)}
      onPaginationChange={pagination => setPagination(pagination)}
      onSortingChange={sorting => setSorting(sorting)}
      onGlobalFilterChange={value => {
        const filterValue = typeof value === 'string' ? value : '';

        setGlobalFilter(filterValue);
      }}
    />
  );
};
