import Grid from '@mui/material/Grid';
import { CustomFormTextField } from '@/components/shared/CustomFormTextField';
import {
  Control,
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
  UseFormWatch,
} from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { apiFetcher } from '@/config/api-fetcher';
import { CustomOption } from '@/interfaces/custom-option.interface';

interface FormAddressProps<T extends FieldValues> {
  control: Control<T>;
  isDisabled: boolean;
  labels: LabelsValues<T>;
  setValue: UseFormSetValue<T>;
  watch: UseFormWatch<T>;
  zipCode: string | undefined;
}

interface LabelsValues<T extends FieldValues> {
  state: Path<T>;
  city: Path<T>;
  suburb_id: Path<T>;
  zip_code: Path<T>;
}

interface ZipCodeLookupResponse {
  status: string;
  data: {
    zip_code: string;
    state: { name: string };
    city: { name: string };
    suburbs: {id: number, name: string}[];
  };
}

export function FormAddress<T extends FieldValues & { city: string; state: string; zip_code: string; suburb_id: number }>({
  control,
  isDisabled,
  labels,
  setValue,
  watch,
  zipCode
}: FormAddressProps<T>) {
    
  const getOptionsSuburbs = async (zipCode: string): Promise<CustomOption[]> => {
    try {
      const response = await apiFetcher.get<ZipCodeLookupResponse>(
        `/addresses/lookup/${zipCode}`
      );
      const options = response.data.data.suburbs.map((item) => ({
        key: item.id,
        value: item.id,
        label: item.name,
      }));
      setValue(labels.city, response.data.data.city.name as PathValue<T, Path<T>>);
      setValue(labels.state, response.data.data.state.name as PathValue<T, Path<T>>);
      return options;
    } catch {
      return [];
    }
  };

  const zip = (zipCode) ? zipCode : watch(labels.zip_code); 

  const { data: suburbs, refetch } = useQuery({
    queryKey: ['address', zip],
    queryFn: () => getOptionsSuburbs(zip),
    enabled: zipCode ?  true : false,
  });

  return (
    <Grid size={12}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 3 }}>
          <CustomFormTextField
            fieldType="text"
            name={labels.state}
            label="Estado"
            control={control}
            disabled
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <CustomFormTextField
            fieldType="text"
            name={labels.city}
            label="Ciudad"
            control={control}
            disabled
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <CustomFormTextField
            fieldType="select"
            name={labels.suburb_id}
            label="Colonia"
            placeholder="Ingresa la colonia"
            control={control}
            disabled={isDisabled || suburbs?.length === 0}
            options={suburbs ?? []}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 3 }}>
          <CustomFormTextField
            fieldType="text"
            name={labels.zip_code}
            label="Código postal"
            placeholder="Ingrese el código postal"
            control={control}
            disabled={isDisabled}
            onBlur={() => refetch()}
          />
        </Grid>
      </Grid>
    </Grid>
  );
}
