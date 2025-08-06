import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { Typography } from '@mui/material';
import { translationCapitalFirst } from '~/utils/translate';
import { Control, Controller } from 'react-hook-form';
import { useGetDataDeviceType } from '../handleApi';
import { useEffect, useState } from 'react';
import { IDeviceTypeOption, IDeviceTypeContent } from '~/@types/deviceProfile/deviceProfile.type';

const filter = createFilterOptions<IDeviceTypeContent>();

export default function FreeSoloCreateOption({
  control,
  name,
  error,
  helperText
}: {
  control: Control<any, any>;
  name: string;
  error: boolean;
  helperText: string;
}) {
  const [options, setOptions] = useState<IDeviceTypeOption[]>([]);
  //get type
  const { dataDeviceTypeR } = useGetDataDeviceType({ keyword: '', page: 0, size: 1000 });

  //create type

  useEffect(() => {
    if (dataDeviceTypeR?.data) {
      const listType: IDeviceTypeOption[] = dataDeviceTypeR?.data?.content?.map((item: IDeviceTypeContent) => {
        return { label: item?.label, id: item.id };
      });
      setOptions(listType);
    }
  }, [dataDeviceTypeR?.data]);

  return (
    <div className={'flex flex-col'}>
      <Typography variant='label3' className='!mb-1'>
        {translationCapitalFirst('type-device', 'deviceProfile')}{' '}
        <span className='text-[var(--semantic-alert)]'>*</span>
      </Typography>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Autocomplete
            {...field}
            fullWidth
            // value={value}
            onChange={(_event, newValue) => {
              field.onChange(newValue);
            }}
            filterOptions={(options, params) => {
              const filtered = filter(options, params);

              const { inputValue } = params;
              // Suggest the creation of a new value
              const isExisting = options.some((option) => inputValue === option.label);
              if (inputValue.trim() !== '' && !isExisting) {
                filtered.push({
                  inputValue,
                  label: inputValue,
                  id: ''
                });
              }

              return filtered;
            }}
            selectOnFocus
            clearOnBlur
            handleHomeEndKeys
            id='free-solo-with-text-demo'
            options={options}
            getOptionLabel={(option) => {
              // Value selected with enter, right from the input
              if (typeof option === 'string') {
                return option;
              }
              // Add "xxx" option created dynamically
              if (option.inputValue) {
                return option.inputValue;
              }
              // Regular option
              return option.label;
            }}
            renderOption={(props, option) => {
              if (option.inputValue) {
                return (
                  <Typography variant='body3' {...props} key={option?.inputValue}>
                    {option?.label} <span className='px-3 py-1 bg-[var(--blue-80)] rounded-2xl ml-2 text-xs'>Mới</span>
                  </Typography>
                );
              }
              return (
                <Typography variant='body3' {...props} key={option?.id}>
                  {option?.label}
                </Typography>
              );
            }}
            freeSolo
            renderInput={(params) => (
              <TextField
                {...params}
                sx={{ '& .MuiOutlinedInput-root': { borderWidth: '0px !important' } }}
                size='small'
                placeholder={translationCapitalFirst('enter-type-device', 'deviceProfile')}
                error={error}
                helperText={helperText}
              />
            )}
          />
        )}
      />
    </div>
  );
}
