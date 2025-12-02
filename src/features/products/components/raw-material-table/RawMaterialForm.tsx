import { useMemo, useEffect } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Grid } from '@mui/material';
import { DefaultValues, useForm } from 'react-hook-form';

import { useSaveRawMaterialMutation } from '../../hooks/products.mutations';
import { useMeasureUnitsQuery } from '../../hooks/products.query';
import { ProductParams } from '../../product.interface';
import { ProductDto, productSchema } from '../../product.schema';

import { useRawMaterialDrawerStore } from '@/app/_authenticated/raw-materials';
import { CustomDrawer } from '@/components/shared/CustomDrawer';
import { CustomFormTextField } from '@/components/shared/CustomFormTextField';
import { ModeAction } from '@/config/enums/mode-action.enum';
import { Environment } from '@/config/env';
import { customFaker } from '@/config/utils/faker.util';

interface SaveRawMaterialDrawerProps {
  rawMaterialParams: ProductParams;
}

export const RawMaterialForm = ({
  rawMaterialParams
}: SaveRawMaterialDrawerProps) => {
  const { isOpen, onClose, item, mode } = useRawMaterialDrawerStore();
  const { data: measureUnits } = useMeasureUnitsQuery();

  const isProd = Environment.isProd;
  const isShow = mode === ModeAction.Show;

  const mutation = useSaveRawMaterialMutation({
    id: item?.id || undefined,
    productParams: rawMaterialParams,
    onClose
  });

  const defaultValues = useMemo<DefaultValues<ProductDto>>(() => {
    if (item && mode !== ModeAction.Create) {
      return {
        mode,
        sku: item.sku,
        name: item.name,
        type: 'MP',
        measure_unit_id: item.measureUnitId ?? undefined
      };
    }

    if (isProd) {
      return {
        mode: ModeAction.Create,
        sku: '',
        name: '',
        type: 'MP',
        measure_unit_id: undefined
      };
    }

    return {
      mode: ModeAction.Create,
      name: customFaker.commerce.productName(),
      sku: customFaker.string.alphanumeric(5).toUpperCase(),
      type: 'MP',
      measure_unit_id: undefined
    };
  }, [item, mode, isProd]);

  const { handleSubmit, control, reset } = useForm<ProductDto>({
    resolver: zodResolver(productSchema),
    defaultValues
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const title = {
    [ModeAction.Create]: 'Crear Materia Prima',
    [ModeAction.Edit]: 'Editar Materia Prima',
    [ModeAction.Show]: 'Detalle Materia Prima'
  }[mode];

  return (
    <CustomDrawer
      open={isOpen}
      title={title}
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
      </form>
    </CustomDrawer>
  );
};
