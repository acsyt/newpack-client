import type {
  BasePaginationParams,
  PaginationResponse
} from '@/interfaces/pagination-response.interface';
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

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import {
  MaterialReactTable,
  MaterialReactTableProps,
  MRT_ShowHideColumnsButton,
  MRT_TableHeadCellFilterContainer,
  MRT_ToggleDensePaddingButton,
  MRT_ToggleFullScreenButton,
  MRT_ToggleGlobalFilterButton,
  useMaterialReactTable
} from 'material-react-table';
import { useDebounce } from 'use-debounce';

import { CustomDrawer } from './CustomDrawer';

import {
  DEBOUNCE_FILTER_TIME,
  INITIAL_PAGE,
  INITIAL_PAGE_SIZE
} from '@/config/constants/app.constants';
import { MRT_Localization_ES } from '@/config/i18n/mrt-localization.es';

interface CustomTableProps<
  T extends MRT_RowData,
  P = any,
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
  queryHook: (props: { options: P }) => UseQueryResult<PaginationResponse<T>>;
  queryProps: { options: P };
  columns: MRT_ColumnDef<T>[];
  queryPrefetch?: (
    queryClient: QueryClient,
    options: BasePaginationParams<Y, F>
  ) => void;
  enableRowSelection?: boolean;
  onRowSelectionChange?: (selectedIds: number[]) => void;
  allowFullWidthActions?: boolean;
  customFilters?: ColumnFiltersState;
}

export const CustomTable = <
  T extends Record<string, any>,
  P = any,
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
  customFilters,
  ...rest
}: CustomTableProps<T, P, F, I>) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const queryClient = useQueryClient();

  const memoizedColumns = useMemo(() => columns, [columns]);

  const [debouncedColumnFilters] = useDebounce(
    columnFilters,
    DEBOUNCE_FILTER_TIME
  );

  const optionsParams = queryProps.options as any;

  const immutableFilters = useMemo(
    () => optionsParams?.filter ?? ({} as F),
    [optionsParams?.filter]
  );

  const mutableFilters = useMemo(() => {
    const filters = {} as Record<string, string[]>;

    const processFilters = (filterList: ColumnFiltersState) => {
      filterList?.forEach(({ id, value }) => {
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
    };

    processFilters(debouncedColumnFilters);
    if (customFilters) {
      processFilters(customFilters);
    }

    return filters as F;
  }, [debouncedColumnFilters, customFilters]);

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

  const options = useMemo<BasePaginationParams<F, I>>(
    () => ({
      page: pagination.pageIndex + 1,
      per_page: pagination.pageSize,
      filter: {
        ...(combinedFilters as F),
        ...(globalFilter ? { search: globalFilter } : {})
      },
      sort,
      include: (optionsParams?.include || []) as I[]
    }),
    [
      pagination.pageIndex,
      pagination.pageSize,
      combinedFilters,
      sort,
      globalFilter,
      optionsParams?.include
    ]
  );

  const newQueryProps = useMemo(
    () => ({
      ...queryProps,
      options: options as unknown as P
    }),
    [queryProps, options]
  );

  const { data, isLoading, isFetching, isError, refetch } =
    queryHook(newQueryProps);

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

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const onOpenFilterDrawer = () => {
    setIsFilterDrawerOpen(true);
  };

  const onCloseFilterDrawer = () => {
    setIsFilterDrawerOpen(false);
  };

  const clearFilters = () => {
    setColumnFilters([]);
    setSorting([]);
    setGlobalFilter('');
    setPagination({ pageIndex: 0, pageSize: INITIAL_PAGE_SIZE });
  };

  const table = useMaterialReactTable({
    ...rest,
    columns: memoizedColumns,
    data: paginationData,
    getRowId: row => row.id,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    enableColumnResizing: true,
    enableStickyHeader: true,
    enableRowSelection: enableRowSelection,
    columnResizeMode: 'onEnd',
    rowCount: data?.meta?.total || 0,
    layoutMode: 'semantic',
    positionActionsColumn: 'last',
    columnFilterDisplayMode: 'custom',
    enableFacetedValues: true,
    enableGlobalFilter: enableGlobalFilter,

    muiTablePaperProps: {
      elevation: 0,
      sx: {
        borderRadius: '12px',
        backgroundColor: 'transparent',
        overflow: 'hidden'
      }
    },
    muiTopToolbarProps: {
      sx: {
        backgroundColor: 'transparent'
      }
    },
    muiTableContainerProps: {
      sx: {
        maxHeight: '550px',
        borderRadius: '12px',
        boxShadow: 'none',
        '&::-webkit-scrollbar': {
          width: '8px',
          height: '8px'
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: 'transparent'
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.1)',
          borderRadius: '4px'
        },
        '&::-webkit-scrollbar-thumb:hover': {
          backgroundColor: 'rgba(0,0,0,0.2)'
        }
      }
    },
    muiTableBodyRowProps: {
      hover: true,
      sx: {
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.02) !important'
        }
      }
    },
    muiTableBodyCellProps: ({ cell }) => {
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
          whiteSpace: 'nowrap',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }
      };
    },
    muiTableHeadCellProps: ({ column }) => {
      if (allowFullWidthActions && column.id === 'mrt-row-actions') {
        return {
          sx: {
            minWidth: 'auto',
            width: 'auto',
            whiteSpace: 'nowrap',
            backgroundColor: 'primary.main',
            color: 'primary.contrastText'
          }
        };
      }

      return {
        sx: {
          maxWidth: '200px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
          fontWeight: 600,
          textTransform: 'uppercase',
          fontSize: '0.875rem',
          '& .MuiSvgIcon-root': {
            color: 'inherit'
          },
          '& .MuiTableSortLabel-root': {
            color: 'inherit !important',
            '&:hover': {
              color: 'inherit !important'
            },
            '&.Mui-active': {
              color: 'inherit !important',
              '& .MuiTableSortLabel-icon': {
                color: 'inherit !important',
                opacity: 1
              }
            }
          },
          '& .MuiTableSortLabel-icon': {
            color: 'inherit !important',
            opacity: 0.5
          },
          '& .MuiButtonBase-root': {
            color: 'inherit'
          },
          transition: 'background-color 0.2s',
          '&:hover': {
            backgroundColor: 'primary.dark'
          }
        }
      };
    },
    muiFilterTextFieldProps: ({ column }) => ({
      label: column.columnDef.header,
      variant: 'outlined',
      size: 'small',
      fullWidth: true,
      sx: {
        mb: 1,
        '& .MuiOutlinedInput-root': {
          borderRadius: '8px',
          backgroundColor: 'background.paper',
          '& fieldset': {
            borderColor: 'divider'
          },
          '&:hover fieldset': {
            borderColor: 'primary.main',
            borderWidth: '1px'
          },
          '&.Mui-focused fieldset': {
            borderColor: 'primary.main',
            borderWidth: '2px'
          }
        },
        '& .MuiInputLabel-root': {
          fontSize: '0.875rem',
          '&.Mui-focused': {
            color: 'primary.main'
          }
        },
        '& .MuiInputBase-input': {
          fontSize: '0.875rem'
        }
      }
    }),
    renderEmptyRowsFallback: () => {
      if (isError) {
        return (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              minHeight: '300px',
              gap: 2,
              p: 3
            }}
          >
            <ErrorOutlineIcon
              color='error'
              sx={{ fontSize: 64, opacity: 0.8 }}
            />
            <Box textAlign='center'>
              <Typography gutterBottom variant='h6' color='text.primary'>
                Ocurrió un error al cargar los datos
              </Typography>
              <Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
                Por favor, intenta recargar la tabla nuevamente.
              </Typography>
              <Button
                variant='contained'
                color='primary'
                startIcon={<RefreshIcon />}
                onClick={() => refetch()}
              >
                Reintentar
              </Button>
            </Box>
          </Box>
        );
      }

      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100%',
            minHeight: '300px',
            gap: 2,
            p: 3,
            color: 'text.secondary'
          }}
        >
          <SearchOffIcon sx={{ fontSize: 64, opacity: 0.5 }} />
          <Typography variant='h6' color='text.primary'>
            No se encontraron registros
          </Typography>
          <Typography variant='body2'>
            Intenta ajustar los filtros o la búsqueda para encontrar lo que
            buscas.
          </Typography>
        </Box>
      );
    },
    muiToolbarAlertBannerProps: undefined,
    initialState: {
      ...rest.initialState,
      showColumnFilters: false,
      showGlobalFilter: Boolean(globalFilter),
      columnPinning: { right: ['mrt-row-actions'] }
    },
    state: {
      ...rest.state,
      columnFilters,
      isLoading: isLoadingFreshData,
      pagination,
      showAlertBanner: false,
      showProgressBars: isLoading,
      sorting,
      globalFilter,
      rowSelection: enableRowSelection ? rowSelection : {}
    },
    localization: MRT_Localization_ES,
    enableRowActions: true,
    onRowSelectionChange: enableRowSelection
      ? handleRowSelectionChange
      : undefined,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: pagination => setPagination(pagination),
    onSortingChange: sorting => setSorting(sorting),
    onGlobalFilterChange: value => {
      const filterValue = typeof value === 'string' ? value : '';

      setGlobalFilter(filterValue);
    },
    renderTopToolbarCustomActions: params => (
      <Box>{rest.renderTopToolbarCustomActions?.(params)}</Box>
    ),
    renderToolbarInternalActions: ({ table }) => {
      const activeFiltersCount = columnFilters.length;

      return (
        <Box
          display='flex'
          flexDirection={'column'}
          justifyContent={'flex-end'}
        >
          <Box display='flex' justifyContent={'flex-end'}>
            {enableGlobalFilter && (
              <MRT_ToggleGlobalFilterButton table={table} />
            )}
            <Tooltip title={'Ver todos los filtros'}>
              <IconButton onClick={onOpenFilterDrawer}>
                <Badge badgeContent={activeFiltersCount} color='primary'>
                  <FilterListIcon />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title={'Limpiar filtros'}>
              <IconButton
                disabled={activeFiltersCount === 0}
                onClick={clearFilters}
              >
                <FilterAltOffIcon />
              </IconButton>
            </Tooltip>
            <MRT_ShowHideColumnsButton table={table} />
            <MRT_ToggleDensePaddingButton table={table} />
            <MRT_ToggleFullScreenButton table={table} />
          </Box>
        </Box>
      );
    }
  });

  const canFilter = useMemo(
    () =>
      table.getLeafHeaders().filter(header => header.column.getCanFilter())
        .length > 0,
    [table]
  );

  return (
    <Box>
      <MaterialReactTable table={table} />

      <CustomDrawer
        open={isFilterDrawerOpen}
        title='Filtros'
        width='400px'
        footer={
          <Box display='flex' justifyContent='flex-end' width='100%' gap={2}>
            <Button color='inherit' onClick={onCloseFilterDrawer}>
              Cerrar
            </Button>
          </Box>
        }
        onClose={onCloseFilterDrawer}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <Box sx={{ pb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
              <Typography variant='body2' color='text.secondary'>
                {columnFilters.length > 0
                  ? `${columnFilters.length} filtro${columnFilters.length !== 1 ? 's' : ''} activo${columnFilters.length !== 1 ? 's' : ''}`
                  : 'Sin filtros aplicados'}
              </Typography>
              {columnFilters.length > 0 && (
                <Tooltip title='Limpiar todos los filtros'>
                  <IconButton
                    size='small'
                    sx={{ ml: 'auto' }}
                    onClick={clearFilters}
                  >
                    <FilterAltOffIcon fontSize='small' />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Box>

          <Divider sx={{ mb: 2 }} />

          <Stack gap='8px'>
            {canFilter ? (
              table
                .getLeafHeaders()
                .filter(header => header.column.getCanFilter())
                .map(header => {
                  return (
                    header.column.getCanFilter() && (
                      <MRT_TableHeadCellFilterContainer
                        key={header.id}
                        in
                        header={header}
                        table={table}
                      />
                    )
                  );
                })
            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  py: 8
                }}
              >
                <FilterListIcon
                  sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }}
                />
                <Typography
                  variant='body1'
                  color='text.secondary'
                  align='center'
                >
                  No hay filtros disponibles
                </Typography>
                <Typography
                  variant='body2'
                  color='text.disabled'
                  align='center'
                  sx={{ mt: 1 }}
                >
                  Esta tabla no tiene columnas filtrables
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>
      </CustomDrawer>
    </Box>
  );
};

/* Referencia

// return (
//   <MaterialReactTable
//     {...rest}
//     enableRowActions
//     manualPagination
//     manualFiltering
//     manualSorting
//     enableStickyHeader
//     enableColumnResizing={false}
//     layoutMode='semantic'
//     positionActionsColumn='last'
//     columnResizeMode={'onEnd'}
//     data={paginationData}
//     columns={memoizedColumns}
//     getRowId={row => row.id}
//     rowCount={data?.meta?.total || 0}
//     enableRowSelection={enableRowSelection}
//     enableGlobalFilter={enableGlobalFilter}
//     enableColumnFilters={true}
//     enableSorting={false}
//     initialState={{
//       ...rest.initialState,
//       showColumnFilters: true,
//       showGlobalFilter: Boolean(globalFilter),
//       columnPinning: { right: ['mrt-row-actions'] }
//     }}
//     columnFilterDisplayMode='popover'
//     muiTableContainerProps={{
//       className: 'max-h-[650px]',
//       sx: {
//         maxHeight: '650px',
//         borderRadius: '12px',
//         overflow: 'auto',
//         boxShadow: 'none'
//       }
//     }}
//     muiTablePaperProps={{
//       elevation: 0,
//       sx: {
//         borderRadius: '12px',
//         backgroundColor: 'transparent',
//         overflow: 'hidden'
//       }
//     }}
//     muiTopToolbarProps={{
//       sx: {
//         backgroundColor: 'transparent'
//       }
//     }}
//     muiTableBodyCellProps={({ cell }) => {
//       if (cell.column.id === 'mrt-row-actions') {
//         return {
//           sx: {
//             ...(allowFullWidthActions && {
//               minWidth: 'auto',
//               width: 'auto',
//               whiteSpace: 'nowrap'
//             }),

//             '& .MuiBox-root': {
//               display: 'flex',
//               gap: 0,
//               alignItems: 'center'
//             }
//           }
//         };
//       }

//       if (allowFullWidthActions && cell.column.id === 'mrt-row-actions') {
//         return {
//           sx: {
//             minWidth: 'auto',
//             width: 'auto',
//             whiteSpace: 'nowrap'
//           }
//         };
//       }

//       return {
//         sx: {
//           paddingY: 2,
//           fontSize: '0.9375rem',
//           color: '#101828',
//           borderBottom: '1px solid #F3F4F6',
//           backgroundColor: '#FFFFFF',
//           maxWidth: '200px',
//           overflow: 'hidden',
//           textOverflow: 'ellipsis',
//           whiteSpace: 'nowrap'
//         }
//       };
//     }}
//     muiTableHeadCellProps={({ column }) => {
//       if (allowFullWidthActions && column.id === 'mrt-row-actions') {
//         return {
//           sx: {
//             minWidth: 'auto',
//             width: 'auto',
//             whiteSpace: 'nowrap'
//           }
//         };
//       }

//       return {
//         sx: {
//           backgroundColor: '#101828',
//           color: '#FFFFFF',
//           fontWeight: 700,
//           fontSize: '0.875rem',
//           textTransform: 'uppercase',
//           letterSpacing: '0.05em',
//           borderBottom: 'none',
//           paddingY: 2,
//           whiteSpace: 'nowrap'
//         }
//       };
//     }}
//     mrtTheme={theme => ({
//       baseBackgroundColor: theme.palette.background.default
//     })}
//     renderTopToolbarCustomActions={params => (
//       <Box>{rest.renderTopToolbarCustomActions?.(params)}</Box>
//     )}
//     renderToolbarInternalActions={({ table }) => (
//       <Box
//         display='flex'
//         flexDirection={'column'}
//         justifyContent={'flex-end'}
//       >
//         <Box display='flex' justifyContent={'flex-end'}>
//           <MRT_ShowHideColumnsButton table={table} />
//           <MRT_ToggleDensePaddingButton table={table} />
//           <MRT_ToggleFullScreenButton table={table} />
//         </Box>
//       </Box>
//     )}
//     muiToolbarAlertBannerProps={
//       isError
//         ? {
//             color: 'error',
//             content: 'Error loading data'
//           }
//         : undefined
//     }
//     state={{
//       ...rest.state,
//       columnFilters,
//       isLoading: isLoadingFreshData,
//       pagination,
//       showAlertBanner: isError,
//       showProgressBars: isLoading,
//       sorting,
//       globalFilter,
//       rowSelection: enableRowSelection ? rowSelection : {}
//     }}
//     paginationDisplayMode='pages'
//     onRowSelectionChange={handleRowSelectionChange}
//     onPaginationChange={pagination => setPagination(pagination)}
//   />
// );

*/
