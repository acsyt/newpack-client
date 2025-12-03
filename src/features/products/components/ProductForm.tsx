import { useMemo, useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Grid,
  IconButton,
  Paper,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography
} from '@mui/material';
import Table from '@mui/material/Table';
import TableContainer from '@mui/material/TableContainer';
import { Trash2 } from 'lucide-react';
import { DefaultValues, useFieldArray, useForm } from 'react-hook-form';

import { useSaveRawMaterialMutation } from '../hooks/products.mutations';
import {
  useMeasureUnitsQuery,
  useProductsQuery
} from '../hooks/products.query';
import {
  ProductParams,
  ProductTypeCode,
  useProductDrawerStore
} from '../product.interface';
import { ProductDto, productSchema } from '../product.schema';

import { CustomDrawer } from '@/components/shared/CustomDrawer';
import { CustomFormTextField } from '@/components/shared/CustomFormTextField';
import {
  CustomOption,
  StaticAutocomplete
} from '@/components/shared/StaticAutocomplete';
import { ModeAction } from '@/config/enums/mode-action.enum';
import { Environment } from '@/config/env';
import { customFaker } from '@/config/utils/faker.util';

interface ProductDrawerProps {
  productParams: ProductParams;
  type: ProductTypeCode;
}

export const ProductForm = ({ productParams, type }: ProductDrawerProps) => {
  const { isOpen, onClose, item, mode, title } = useProductDrawerStore();
  const { data: measureUnits } = useMeasureUnitsQuery();
  const { data: rawMaterials } = useProductsQuery({
    options: {
      filter: {
        type: 'MP'
      }
    },
    enabled: type === 'COMP'
  });

  const isProd = Environment.isProd;
  const isShow = mode === ModeAction.Show;

  const mutation = useSaveRawMaterialMutation({
    id: item?.id || undefined,
    productParams: productParams,
    onClose
  });

  const defaultValues = useMemo<DefaultValues<ProductDto>>(() => {
    if (item && mode !== ModeAction.Create) {
      return {
        mode,
        sku: item.sku,
        name: item.name,
        type: type,
        measure_unit_id: item.measureUnitId ?? undefined,
        ingredients:
          item.ingredients?.map(ingredient => ({
            ingredient_id: ingredient.id,
            quantity: Number(ingredient.quantity) || 0,
            product: {
              sku: ingredient.sku,
              name: ingredient.name
            }
          })) || []
      };
    }

    if (isProd) {
      return {
        mode: ModeAction.Create,
        sku: '',
        name: '',
        type: type,
        measure_unit_id: undefined
      };
    }

    return {
      mode: ModeAction.Create,
      name: customFaker.commerce.productName(),
      sku: customFaker.string.alphanumeric(5).toUpperCase(),
      type: type,
      measure_unit_id: undefined
    };
  }, [item, mode, isProd, type]);

  const {
    handleSubmit,
    control,
    reset,
    register,
    formState: { errors }
  } = useForm<ProductDto>({
    resolver: zodResolver(productSchema),
    defaultValues
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'ingredients'
  });

  const rawMaterialOptions = useMemo<CustomOption[]>(() => {
    return (
      rawMaterials?.data.map(product => ({
        label: `${product.sku} - ${product.name}`,
        value: product.id,
        sku: product.sku,
        name: product.name
      })) ?? []
    );
  }, [rawMaterials]);

  const onSelectRawMaterial = (option: CustomOption | null) => {
    if (!option) return;

    const exists = fields.some(
      field => field.ingredient_id === (option.value as number)
    );

    if (exists) return;

    append({
      ingredient_id: option.value as number,
      quantity: 0,
      product: {
        sku: option['sku'],
        name: option['name']
      }
    });
  };

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <CustomDrawer
      open={isOpen}
      title={title ?? ''}
      width={type === 'COMP' ? '800px' : '450px'}
      footer={
        ![ModeAction.Show].includes(mode) && (
          <Button
            fullWidth
            type='submit'
            variant='contained'
            color='primary'
            size='large'
            disabled={mutation.isPending}
            onClick={handleSubmit(data => {
              mutation.mutate(data);
            })}
          >
            {mutation.isPending ? 'Guardando...' : 'Guardar'}
          </Button>
        )
      }
      onClose={onClose}
    >
      <form className='flex flex-col h-full'>
        <Grid container spacing={2.5}>
          <Grid size={12}>
            <CustomFormTextField
              fieldType='text'
              name='sku'
              label='SKU'
              placeholder='Ingrese el SKU'
              control={control}
              disabled={isShow}
            />
          </Grid>

          <Grid size={12}>
            <CustomFormTextField
              fieldType='text'
              name='name'
              label='Nombre'
              placeholder='Ingrese el nombre'
              control={control}
              disabled={isShow}
            />
          </Grid>

          <Grid size={12}>
            <CustomFormTextField
              fieldType='select'
              name='measure_unit_id'
              label='Unidad de medida'
              placeholder='Seleccione una unidad de medida'
              control={control}
              disabled={isShow}
              options={
                measureUnits?.data.map(measureUnit => ({
                  value: measureUnit.id,
                  label: measureUnit.name
                })) ?? []
              }
            />
          </Grid>
        </Grid>
        {type === 'COMP' && (
          <Box className='mt-6'>
            <Typography
              gutterBottom
              variant='subtitle2'
              color='text.primary'
              fontWeight={600}
            >
              Materias Primas:
            </Typography>
            <Box
              sx={{
                p: 2,
                border: '1px solid #E2E8F0',
                borderRadius: 2
              }}
            >
              {mode !== ModeAction.Show && (
                <Box mb={2}>
                  <Typography
                    variant='caption'
                    fontWeight={600}
                    mb={1}
                    display='block'
                  >
                    Código de Materia Prima:
                  </Typography>
                  <StaticAutocomplete
                    label=''
                    options={rawMaterialOptions}
                    value={null}
                    disabled={isShow}
                    onChange={onSelectRawMaterial}
                  />
                </Box>
              )}
              <TableContainer
                component={Paper}
                variant='outlined'
                sx={{ borderRadius: 2, maxHeight: '55vh', bgcolor: 'white' }}
              >
                <Table stickyHeader size='small'>
                  <TableHead>
                    <TableRow
                      sx={{ '& th': { bgcolor: '#F8FAFC', fontWeight: 600 } }}
                    >
                      <TableCell>CÓDIGO</TableCell>
                      <TableCell>NOMBRE</TableCell>
                      <TableCell width='20%'>PORCENTAJE (%)</TableCell>
                      {mode !== ModeAction.Show && (
                        <TableCell width='10%' align='center'>
                          ACCIONES
                        </TableCell>
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>{field.product?.sku}</TableCell>
                        <TableCell>{field.product?.name}</TableCell>
                        <TableCell>
                          <TextField
                            {...register(`ingredients.${index}.quantity`)}
                            fullWidth
                            size='small'
                            type='number'
                            disabled={isShow}
                            error={!!errors.ingredients?.[index]?.quantity}
                            helperText={
                              errors.ingredients?.[index]?.quantity?.message
                            }
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                bgcolor: '#F8FAFC'
                              },
                              '& .MuiOutlinedInput-notchedOutline': {
                                border: 'none'
                              }
                            }}
                          />
                        </TableCell>
                        {mode !== ModeAction.Show && (
                          <TableCell align='center'>
                            <IconButton
                              color='error'
                              size='small'
                              disabled={isShow}
                              onClick={() => remove(index)}
                            >
                              <Trash2 size={18} />
                            </IconButton>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                    {fields.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align='center' sx={{ py: 3 }}>
                          <Typography variant='body2' color='text.secondary'>
                            No hay materias primas agregadas
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        )}
      </form>
    </CustomDrawer>
  );
};
