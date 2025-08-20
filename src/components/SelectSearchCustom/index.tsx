import { Autocomplete, FormControl, TextField, Typography } from '@mui/material';
import { Control, Controller } from 'react-hook-form';

import { Warning } from '@phosphor-icons/react';
import classNames from 'classnames';
import { translationCapitalFirst } from '~/utils/translate';

type SSelectProps = {
  control?: Control<any, any>;
  label?: string;
  name?: string;
  isRequired?: boolean;
  placeholderText?: string;
  isError?: boolean;
  helperText?: string;
  classNameContainer?: string;
  options?: Array<{ label: string; value: any }>;
  isSelectAll?: boolean;
  defaultValue?: any;
  onChange?: (event: any, value: any) => void;
  MenuProps?: object;
};

export default function SelectSearchCustom(props: SSelectProps) {
  const {
    control,
    label,
    name,
    isRequired = false,
    placeholderText,
    isError = false,
    helperText,
    classNameContainer,
    options = [],
    isSelectAll = false,
    defaultValue,
    onChange,
    MenuProps,
    ...rest
  } = props;

  const classNameCont = classNames('flex flex-col', {
    [classNameContainer]: classNameContainer ? true : false
  });

  return (
    <div className={classNameCont}>
      {label && (
        <Typography variant='label3' className='!mb-1'>
          {label} {isRequired && <span className='text-[var(--semantic-alert)]'>*</span>}
        </Typography>
      )}

      {control ? (
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <FormControl fullWidth>
              <Autocomplete
                {...field}
                {...rest}
                size='small'
                options={options}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) => option.value === value}
                renderInput={(params) => <TextField {...params} error={isError} placeholder={placeholderText} />}
                value={options.find((option) => option.value === field.value) || null}
                onChange={(_, selectedOption) => {
                  field.onChange(selectedOption?.value || '');
                  onChange?.(_, selectedOption?.value || '');
                }}
                disableClearable
                {...MenuProps}
              />
              {isError && (
                <Typography
                  variant='caption1'
                  color='var(--semantic-alert)'
                  className='flex items-center gap-1 !mt-1 !leading-[18px]'
                >
                  <Warning size={16} /> {helperText}
                </Typography>
              )}
            </FormControl>
          )}
        />
      ) : (
        <FormControl fullWidth>
          <Autocomplete
            {...rest}
            size='small'
            options={options}
            getOptionLabel={(option) => option.label}
            isOptionEqualToValue={(option, value) => option.value === value}
            renderInput={(params) => (
              <TextField
                {...params}
                {...(label ? { label: translationCapitalFirst(placeholderText) } : {})}
                error={isError}
                placeholder={placeholderText}
              />
            )}
            value={options.find((option) => option.value === defaultValue) || null}
            onChange={(_, selectedOption) => {
              onChange?.(_, selectedOption?.value || '');
            }}
            disableClearable
            {...MenuProps}
          />
          {isError && (
            <Typography
              variant='caption1'
              color='var(--semantic-alert)'
              className='flex items-center gap-1 !mt-1 !leading-[18px]'
            >
              <Warning size={16} /> {helperText}
            </Typography>
          )}
        </FormControl>
      )}
    </div>
  );
}
