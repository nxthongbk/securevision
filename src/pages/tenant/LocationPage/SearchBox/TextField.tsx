import { TextField as TextFieldMUI, TextFieldProps } from '@mui/material';
import { forwardRef } from 'react';
import FullFormInput from './FullFormInput';

const TextField = forwardRef(({ label, ...props }: TextFieldProps, ref) => {
  return <FullFormInput {...props} label={label} Input={TextFieldMUI} ref={ref as any} />;
});

export default TextField;
