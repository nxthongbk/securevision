import { Typography } from '@mui/material';
import classNames from 'classnames';
import { Controller } from 'react-hook-form';

export default function Textarea(props: any) {
  const { control, name, label, isRequired, classNameContainer, ...rest } = props;
  const classNameCont = classNames('flex flex-col', {
    [classNameContainer]: classNameContainer ? true : false
  });
  return (
    <div className={classNameCont}>
      <Typography variant='label3' className='!mb-1'>
        {label} {isRequired && <span className='text-[var(--semantic-alert)]'>*</span>}
      </Typography>
      {control ? (
        <Controller control={control} name={name} render={({ field }) => <textarea {...field} {...rest} />} />
      ) : (
        <textarea {...rest} />
      )}
    </div>
  );
}
