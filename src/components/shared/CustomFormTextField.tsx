import type { CustomOption } from '@/interfaces/custom-option.interface';
import type { AutocompleteProps } from '@mui/material/Autocomplete';
import type { CheckboxProps } from '@mui/material/Checkbox';
import type { FormControlLabelProps } from '@mui/material/FormControlLabel';
import type { TextFieldProps } from '@mui/material/TextField';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import { Eye, EyeOff } from 'lucide-react';
import {
  Control,
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
  FieldValues,
  UseControllerProps
} from 'react-hook-form';
import { NumericFormat } from 'react-number-format';
import {
  InternalNumberFormatBase,
  NumberFormatBaseProps
} from 'react-number-format/types/types';

interface BaseFieldProps<T extends FieldValues> extends UseControllerProps<T> {
  control: Control<T>;
  label?: string;
}

type TextFieldInputProps<T extends FieldValues> = BaseFieldProps<T> &
  TextFieldProps & {
    fieldType: 'text';
  };

type PasswordFieldProps<T extends FieldValues> = BaseFieldProps<T> &
  TextFieldProps & {
    fieldType: 'password';
  };

type SelectFieldInputProps<T extends FieldValues> = BaseFieldProps<T> &
  TextFieldProps & {
    fieldType: 'select';
    options: CustomOption[];
    initialOption?: CustomOption;
  };

type NumericFormatProps = NumberFormatBaseProps<
  InternalNumberFormatBase & {
    thousandSeparator?: boolean | string;
    decimalSeparator?: string;
    allowedDecimalSeparators?: Array<string>;
    thousandsGroupStyle?: 'thousand' | 'lakh' | 'wan' | 'none';
    decimalScale?: number;
    fixedDecimalScale?: boolean;
    allowNegative?: boolean;
    allowLeadingZeros?: boolean;
    suffix?: string;
    prefix?: string;
  }
>;

type CurrencyFieldInputProps<T extends FieldValues> = BaseFieldProps<T> &
  TextFieldProps &
  NumericFormatProps & {
    fieldType: 'currency';
  };

type SwitchFieldInputProps<T extends FieldValues> = BaseFieldProps<T> & {
  fieldType: 'switch';
  labelTrue?: string;
  labelFalse?: string;
};

type CheckboxFieldInputProps<T extends FieldValues> = BaseFieldProps<T> &
  CheckboxProps & {
    fieldType: 'checkbox';
    labelPlacement?: FormControlLabelProps['labelPlacement'];
  };

type AutocompleteFieldInputProps<T extends FieldValues, O> = BaseFieldProps<T> &
  AutocompleteProps<O, false, false, false> & {
    fieldType: 'autocomplete';
  };

type SelectCustomFieldInputProps<T extends FieldValues> = BaseFieldProps<T> &
  TextFieldProps & {
    fieldType: 'selectBoolean';
    options: CustomOption[];
    initialOption?: CustomOption;
  };

type DurationFieldInputProps<T extends FieldValues> = BaseFieldProps<T> &
  TextFieldProps & {
    fieldType: 'duration';
    options: CustomOption[];
    initialOption?: CustomOption;
  };

type CustomFormFieldProps<T extends FieldValues> =
  | TextFieldInputProps<T>
  | SelectFieldInputProps<T>
  | CurrencyFieldInputProps<T>
  | SwitchFieldInputProps<T>
  | PasswordFieldProps<T>
  | CheckboxFieldInputProps<T>
  | AutocompleteFieldInputProps<T, CustomOption>
  | SelectCustomFieldInputProps<T>
  | DurationFieldInputProps<T>;

export const CustomFormTextField = <T extends FieldValues>({
  control,
  name,
  fieldType = 'text',
  ...restProps
}: CustomFormFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const renderField = (
    controllerRenderProps: ControllerRenderProps<T>,
    { error }: ControllerFieldState
  ) => {
    const { name, onBlur, onChange, ref, value, disabled } =
      controllerRenderProps;

    switch (fieldType) {
      case 'checkbox': {
        const props = restProps as CheckboxFieldInputProps<T>;
        const isChecked = value === 'true' || value === true || value === 1;

        return (
          <FormControlLabel
            control={
              <Checkbox
                ref={ref}
                checked={isChecked}
                disabled={props.disabled}
                onChange={e => onChange(e.target.checked)}
                {...(restProps as CheckboxProps)}
              />
            }
            label={props.label || ''}
            labelPlacement={props.labelPlacement}
          />
        );
      }
      case 'switch': {
        const props = restProps as SwitchFieldInputProps<T>;
        const { labelTrue = 'Yes', labelFalse = 'No' } = props;

        return (
          <FormControl component='fieldset'>
            <FormLabel component='legend'>{props.label}</FormLabel>
            <FormGroup>
              <FormControlLabel
                label={value ? labelTrue : labelFalse}
                control={
                  <Switch
                    ref={ref}
                    color='primary'
                    checked={value || false}
                    disabled={props.disabled}
                    onChange={e => onChange(Boolean(e.target.checked))}
                  />
                }
              />
            </FormGroup>
          </FormControl>
        );
      }
      case 'currency': {
        const props = restProps as CurrencyFieldInputProps<T>;

        return (
          <NumericFormat
            {...props}
            customInput={TextField}
            getInputRef={ref}
            value={value as number}
            disabled={disabled}
            thousandSeparator={true}
            onBlur={onBlur}
            onValueChange={({ floatValue }) => onChange(floatValue ?? 0)}
          />
        );
      }
      case 'select': {
        const props = restProps as SelectFieldInputProps<T>;
        const {
          initialOption = {
            value: '',
            label: 'Select option'
          },
          ...restOptions
        } = props;

        return (
          <TextField
            select
            name={name}
            inputRef={ref}
            value={value || ''}
            disabled={disabled}
            error={!!error}
            helperText={error?.message || props.helperText}
            onBlur={onBlur}
            onChange={e => onChange(e.target.value)}
            {...(restOptions as TextFieldProps)}
          >
            <MenuItem
              value={initialOption.value}
              disabled={Boolean(initialOption.disabled)}
            >
              {initialOption.label}
            </MenuItem>
            {props.options.map(option => (
              <MenuItem
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        );
      }
      case 'password': {
        const props = restProps as PasswordFieldProps<T>;

        return (
          <TextField
            fullWidth
            type={showPassword ? 'text' : 'password'}
            name={name}
            value={value || ''}
            disabled={props.disabled}
            error={!!error}
            helperText={
              error?.message || (restProps as TextFieldProps).helperText
            }
            aria-invalid={Boolean(error)}
            label={props.label}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='Toggle password visibility'
                    edge='end'
                    onClick={handleClickShowPassword}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </IconButton>
                </InputAdornment>
              )
            }}
            onBlur={onBlur}
            onChange={e => onChange(e.target.value as string)}
          />
        );
      }
      case 'duration': {
        const props = restProps as DurationFieldInputProps<T>;
        const { options } = props;

        const defaultUnit = options[0]?.value || 'minutes';

        const parseValue = (val: string) => {
          if (!val) return { value: '', unit: defaultUnit };
          const parts = val.split(' ');

          if (parts.length === 2) {
            return { value: parts[0], unit: parts[1] };
          }

          return { value: val, unit: defaultUnit };
        };

        const currentValue = parseValue(value || '');

        const handleValueChange = (newValue: string) => {
          const unit = currentValue.unit || defaultUnit;

          onChange(newValue && unit ? `${newValue} ${unit}` : '');
        };

        const handleUnitChange = (newUnit: string) => {
          const val = currentValue.value || '';
          const unit = newUnit || defaultUnit;

          onChange(val && unit ? `${val} ${unit}` : '');
        };

        return (
          <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
            <TextField
              name={`${name}_value`}
              type='number'
              value={currentValue.value}
              disabled={props.disabled}
              error={!!error}
              placeholder='Valor'
              sx={{ flex: 1 }}
              inputProps={{ min: 0 }}
              onChange={e => handleValueChange(e.target.value)}
            />
            <TextField
              select
              name={`${name}_unit`}
              value={currentValue.unit || defaultUnit}
              disabled={props.disabled}
              error={!!error}
              placeholder='Unidad'
              sx={{ flex: 1 }}
              onChange={e => handleUnitChange(e.target.value)}
            >
              {options.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        );
      }

      case 'text':
      default:
        return (
          <TextField
            name={name}
            inputRef={ref}
            value={value || ''}
            disabled={disabled}
            error={!!error}
            helperText={
              error?.message || (restProps as TextFieldProps).helperText
            }
            aria-invalid={Boolean(error)}
            onBlur={onBlur}
            onChange={e => onChange(e.target.value as string)}
            {...(restProps as TextFieldProps)}
          />
        );
    }
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => renderField(field, fieldState)}
    />
  );
};
