import { useMemo, useState } from 'react';

import Autocomplete, {
  AutocompleteRenderInputParams
} from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

export interface CustomOption {
  label: string;
  value: string | number;
  [key: string]: any;
}

interface StaticAutocompleteProps {
  name?: string;
  label: string;
  value: CustomOption | null;
  onChange: (selected: CustomOption | null) => void;
  options: CustomOption[];
  noOptionsText?: string;
  defaultValue?: CustomOption | null;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

export const StaticAutocomplete: React.FC<StaticAutocompleteProps> = ({
  name,
  label,
  value,
  onChange,
  options,
  defaultValue = null,
  noOptionsText = 'No hay opciones',
  disabled = false,
  error = false,
  helperText = '',
  required = false
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions: CustomOption[] = useMemo(() => {
    const uniqueOptions = new Map<string | number, CustomOption>();

    const filtered = options.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    filtered.forEach(opt => {
      uniqueOptions.set(opt.value, opt);
    });

    if (value && !uniqueOptions.has(value.value)) {
      uniqueOptions.set(value.value, value);
    }

    return Array.from(uniqueOptions.values());
  }, [options, value, searchTerm]);

  return (
    <Autocomplete
      fullWidth
      options={filteredOptions}
      getOptionLabel={option => option.label}
      isOptionEqualToValue={(option, val) => option.value === val.value}
      value={value}
      defaultValue={defaultValue}
      disabled={disabled}
      filterOptions={(x, state) => {
        return x.filter(option =>
          option.label.toLowerCase().includes(state.inputValue.toLowerCase())
        );
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          padding: '0px 10px'
        }
      }}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField
          {...params}
          name={name}
          required={required}
          label={label}
          variant='outlined'
          error={error}
          helperText={helperText}
          onChange={e => setSearchTerm(e.target.value)}
        />
      )}
      noOptionsText={noOptionsText}
      onChange={(_, selected) => {
        onChange(selected);
      }}
    />
  );
};
