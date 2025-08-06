import { AutocompleteRenderInputParams, Box, OutlinedInputProps, TextFieldProps, styled } from '@mui/material';
import TextField from './TextField';
import { MapPin } from '@phosphor-icons/react';
import { translation } from '~/utils/translate';

const SearchTextField = styled((props: TextFieldProps) => (
  <TextField
    InputProps={props.InputProps as Partial<OutlinedInputProps>}
    fullWidth
    placeholder={translation('enter-coordinates', 'locationPage')}
    sx={{
      height: '100%'
    }}
    {...props}
  />
))(() => ({
  input: {
    padding: '0.625rem 1rem',
    letterSpacing: 'initial',
    fontSize: '0.75rem',
    marginLeft: '1rem',
    heigh: '100px'
  }
}));

const AutocompleteSearchTextField = (
  params: AutocompleteRenderInputParams & {
    hasValue: boolean;
    label?: string;
  }
) => {
  const { label, ...restParams } = params;

  return (
    <SearchTextField
      {...restParams}
      InputProps={{
        ...restParams.InputProps,
        startAdornment: (
          <Box p='4px 0px 4px 14px'>
            <MapPin size={20} color='var(--tertiary)' />
          </Box>
        )
      }}
      label={label}
    />
  );
};

export default AutocompleteSearchTextField;
