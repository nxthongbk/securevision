import { Box, FormControl, MenuItem, Select, SelectProps, Typography } from '@mui/material';
import { Control, Controller } from 'react-hook-form';

import { ReactNode } from 'react';
import { Warning } from '@phosphor-icons/react';
import classNames from 'classnames';
import { t } from 'i18next';
import { translationCapitalFirst } from '~/utils/translate';

type SSelectProps = {
  control?: Control<any, any>;
  label?: string;
  name?: string;
  isRequired?: boolean;
  children?: ReactNode;
  classNameContainer?: string;
  placeholderText?: string;
  isError?: boolean;
  helperText?: string;
  isSelectAll?: boolean;
} & SelectProps;
export default function SelectCustom(props: SSelectProps) {
  const {
    control,
    isError = false,
    label,
    name,
    isRequired,
    children,
    classNameContainer,
    placeholderText,  
    slotProps,
    helperText,
    isSelectAll,
    ...rest
  } = props;
  const classNameCont = classNames('flex flex-col', {
    [classNameContainer]: classNameContainer ? true : false
  });

  return (
    <div className={classNameCont}>
      <Typography variant='label3' className='!mb-1'color="var(--text-primary)">
        {label} {isRequired && <span className='text-[var(--semantic-alert)]'>*</span>}
      </Typography>
      {control ? (
        <Controller
          control={control}
          name={name}
          render={({ field }) => {
            return (
              <FormControl fullWidth>
                <Box position='relative'>
                  <Typography
                    variant='body2'
                    className='absolute top-2/4 left-[16px] translate-y-[-50%] text-[var(--tertiary)]'
                    hidden={Array.isArray(field?.value) ? field?.value.length > 0 : !!field?.value}
                    fontSize='14px'
                  >
                    {translationCapitalFirst(placeholderText)}
                  </Typography>
                  <Select {...field} {...rest} error={isError} slotProps={slotProps} placeholder={placeholderText}>
                    {field?.value && !isSelectAll && (
                      <MenuItem
                        key={'default'}
                        value=''
                        sx={{
                          mb: '5px',
                          borderBottom: '1px solid var(--divider-color)',
                          backgroundColor: 'var(--white) !important',
                          '&:hover': {
                            backgroundColor: 'var(--white) !important'
                          }
                        }}
                      >
                        <Typography variant='button3' color={'var(--primary)'}>
                          {t('unselect')}
                        </Typography>
                      </MenuItem>
                    )}
                    {children}
                  </Select>
                </Box>
                {isError ? (
                  <Typography
                    variant='caption1'
                    color='var(--semantic-alert)'
                    className='flex items-center gap-1 !mt-1 !leading-[18px]'
                  >
                    <Warning size={16} /> {helperText}
                  </Typography>
                ) : null}
              </FormControl>
            )
          }}
        />
      ) : (
        <FormControl fullWidth>
          <Select {...rest}>{children}</Select>
        </FormControl>
      )}
    </div>
  );
}
