import { Control, Controller } from 'react-hook-form';
import { Eye, EyeSlash, Warning } from '@phosphor-icons/react';
import { TextField, TextFieldProps, Typography, inputBaseClasses } from '@mui/material';

import classNames from 'classnames';
import { useState } from 'react';

type TProps = {
  name?: string;
  label?: string;
  control?: Control<any, any>;
  isRequired?: boolean;
  isSpacingHelperText?: boolean;
  classNameContainer?: string;
  isError?: boolean;
  helperText?: string;
  typeInput?: string;
} & TextFieldProps;

export default function InputCustom(props: TProps) {
  const {
    name,
    control,
    label,
    classNameContainer,
    isRequired = false,
    isError,
    helperText,
    InputProps,
    isSpacingHelperText = false,
    type,
    ...rest
  } = props;
  const classNameCont = classNames('flex flex-col', {
    [classNameContainer]: classNameContainer ? true : false,
  });

  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className={classNameCont}>
      {label && (
        <Typography variant="body3" className="!mb-1">
          {label} {isRequired && <span className="text-[var(--semantic-alert)]">*</span>}
        </Typography>
      )}

      {control ? (
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <TextField
              {...field}
              {...rest}
              type={type === 'password' && !showPassword ? 'password' : 'text'}
              error={isError}
              helperText={
                isError ? (
                  <span
                    className="flex items-center gap-1 !leading-[18px]"
                    style={{
                      color: 'var(--semantic-alert)',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <Warning size={16} /> {helperText}
                  </span>
                ) : !isError && isSpacingHelperText ? (
                  <span className="w-full h-[18px] block"></span>
                ) : null
              }
              sx={{
                [`& .${inputBaseClasses.root}`]: { border: 'none' },
                // [`& .MuiInputBase-input`]: { color: '#fff !important', opacity: 1 },
                // [`& .MuiInputBase-input::placeholder`]: { color: '#fff !important', opacity: 0.75 },
              }}
              InputProps={
                type === 'password'
                  ? {
                      endAdornment: (
                        <span
                          onClick={() => {
                            setShowPassword(prev => !prev);
                          }}
                        >
                          {!showPassword ? (
                            <EyeSlash
                              size={20}
                              color="var(--text-tertiary)"
                              className="cursor-pointer"
                            />
                          ) : (
                            <Eye
                              size={20}
                              color="var(--text-tertiary)"
                              className="cursor-pointer"
                            />
                          )}
                        </span>
                      ),
                    }
                  : type === 'duration'
                    ? {
                        endAdornment: <span>ms</span>,
                      }
                    : InputProps
              }
            />
          )}
        />
      ) : (
        <TextField {...rest} />
      )}
    </div>
  );
}
