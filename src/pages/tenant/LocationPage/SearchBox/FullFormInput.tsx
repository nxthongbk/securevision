import { FormControl, FormHelperText, InputLabel, SelectProps, TextFieldProps, ThemeProvider } from '@mui/material';
import { ComponentType, forwardRef } from 'react';
import theme from '~/assets/theme';

function FullFormInput<P extends TextFieldProps & SelectProps>(
  {
    id,
    label,
    Input,
    ...props
  }:
    | ({ Input: ComponentType<P> } & TextFieldProps)
    | ({ Input: ComponentType<P> } & SelectProps & {
          helperText?: string | undefined;
        }),
  ref: any
) {
  return (
    <ThemeProvider theme={theme}>
      <FormControl
        fullWidth
        sx={{
          '.MuiFormControl-root': {
            mb: 0
          },
          '.MuiInputBase-multiline': {
            padding: '0.5rem 1rem',
            textarea: {
              padding: '0'
            }
          }
        }}
      >
        <InputLabel
          htmlFor={id}
          sx={{
            lineHeight: '0.87875rem',
            py: '0.5rem',
            '&.Mui-focused': {
              color: 'initial'
            }
          }}
        >
          {label}
        </InputLabel>
        <Input id={id} label={undefined} ref={ref as any} {...(props as P)} helperText={undefined} />
        <FormHelperText error={props.error}>{props.helperText}</FormHelperText>
      </FormControl>
    </ThemeProvider>
  );
}

export default forwardRef(FullFormInput);
