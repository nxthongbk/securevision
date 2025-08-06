import { useEffect } from 'react';
import InputCustom from '~/components/InputCustom';
import { translationCapitalFirst } from '~/utils/translate';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { attributesDeviceSchema } from '~/utils/yup';
import PopupEditCover from '~/components/Modal/PopupEditCover';
import { Typography } from '@mui/material';

interface IFormInput {
  key: string;
  value: string;
}
export default function PopupUpdateAttributesDevice({ id, props }: { id: string; props: IFormInput }) {
  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    setValue
  } = useForm({
    defaultValues: {
      key: '',
      value: ''
    },
    resolver: yupResolver(attributesDeviceSchema)
  });
  useEffect(() => {
    setValue('key', props?.key);
    setValue('value', props?.value);
  }, [props]);

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    console.log(data, id);
  };
  const bodyPopup = () => {
    return (
      <div className='gap-3 flex flex-col '>
        <InputCustom
          sx={{ width: '100%' }}
          classNameContainer='w-full'
          label={translationCapitalFirst('key', 'devicePage')}
          control={control}
          name='key'
          placeholder={translationCapitalFirst('enter-key', 'devicePage')}
          isRequired={true}
          isError={Boolean(errors.key)}
          inputProps={{ maxLength: 6 }}
        />

        <InputCustom
          classNameContainer='w-full'
          label={translationCapitalFirst('value', 'devicePage')}
          control={control}
          name='value'
          placeholder={translationCapitalFirst('enter-value', 'devicePage')}
          isRequired={true}
          isError={Boolean(errors.value)}
          inputProps={{ maxLength: 6 }}
        />
      </div>
    );
  };
  return (
    <PopupEditCover
      btnComponent={
        <div className='w-full'>
          <Typography variant='button3'>{translationCapitalFirst('update')}</Typography>
        </div>
      }
      isSuccess={false}
      handleClose={() => {}}
      title={translationCapitalFirst('update-information', 'devicePage')}
      handleSubmit={handleSubmit(onSubmit)}
      childrent={bodyPopup()}
      isValid={isValid}
      isLoading={false}
    />
  );
}
