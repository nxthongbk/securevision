import * as yup from 'yup';

import { SubmitHandler, useForm } from 'react-hook-form';
import { useDeleteFileAvatar, useDownloadFileAvatar, useUploadFileAvatar } from '~/utils/hooks/useHandleFileAvatar';
import { useEffect, useState } from 'react';
import { useMediaQuery, useTheme } from '@mui/material';

import AvatarUpload from '~/components/avatar-upload';
import InputCustom from '~/components/InputCustom';
import PopupEditCover from '~/components/Modal/PopupEditCover';
import { translationCapitalFirst } from '~/utils/translate';
import { useUpdateTenant } from '../handleApi';
import { yupResolver } from '@hookform/resolvers/yup';

type IFormInput = {
  name: string;
  phone: string;
  email: string;
  username: string;
};
type Props = {
  id: string;
  tenant: string;
  userName: string;
  phoneNumber: string;
  email: string;
  avatarUrl: string;
  openEdit: boolean;
  handleCloseEdit: () => void;
};
export default function PopupEditTenant({ props }: { props: Props }) {
  const { email, id, phoneNumber, tenant, userName, avatarUrl, openEdit, handleCloseEdit } = props;
  const { isPending, isSuccess, mutate, dataUpdateTenant } = useUpdateTenant();
  // handle avatar
  const { dataFile, mutateUploadFile, resetUploadFile, isPendingUploadFile } = useUploadFileAvatar();
  const { mutateDeleteFile } = useDeleteFileAvatar();
  const { imageUrl } = useDownloadFileAvatar(avatarUrl);
  const [_imageFile, setFileImage] = useState();
  const invalidEmailMessage = translationCapitalFirst('invalid-email', 'tenantPage');
  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('tablet'));

  const handleFileUpload = (file: any) => {
    setFileImage(file);
  };

  const sysTenantSchema = yup.object({
    name: yup
      .string()
      .required(translationCapitalFirst('error-enter-tenant', 'tenantPage'))
      .trim(translationCapitalFirst('error-enter-tenant', 'tenantPage')),

    phone: yup
      .string()
      .required(translationCapitalFirst('error-enter-phone-tenant', 'tenantPage'))
      .max(10, translationCapitalFirst('error-phone-tenant', 'tenantPage'))
      .min(10, translationCapitalFirst('error-phone-tenant', 'tenantPage'))
      .matches(/^[0-9]+$/, translationCapitalFirst('only-enter-number', 'tenantPage'))
      .matches(/^0\d*$/, translationCapitalFirst('only-start-with-0', 'tenantPage')),
    email: yup.string().test('is-valid-email', translationCapitalFirst('invalid-email', 'tenantPage'), (value) => {
      if (value === '') return true;

      return yup
        .string()
        .email(invalidEmailMessage)
        .matches(/^[a-zA-Z0-9]+([._-][a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/, invalidEmailMessage)
        .isValidSync(value);
    }),

    username: yup
      .string()
      .required(translationCapitalFirst('error-username-tenant', 'tenantPage'))
      .min(4, translationCapitalFirst('lenght-username-tenant', 'tenantPage'))
      .max(20, translationCapitalFirst('lenght-username-tenant', 'tenantPage'))

      .matches(/^(?=.*[a-zA-Z0-9])[a-zA-Z0-9]+$/, translationCapitalFirst('invalid-username', 'tenantPage'))
  });
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isValid }
  } = useForm({
    mode: 'all',
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      username: ''
    },
    resolver: yupResolver(sysTenantSchema)
  });

  //upload image mới, xóa image nếu có thay đổi file hoặc close popup
  useEffect(() => {
    if (_imageFile) {
      mutateUploadFile(_imageFile);
    }
    if (dataFile?.id && !isSuccess) {
      mutateDeleteFile(dataFile?.id);
      resetUploadFile();
    }
  }, [_imageFile]);

  // delete file image cũ nếu thay đổi image thành công
  useEffect(() => {
    if (isSuccess) {
      if (avatarUrl && dataUpdateTenant?.avatarUrl !== avatarUrl) {
        mutateDeleteFile(avatarUrl);
      }
    }
  }, [isSuccess]);

  const onSubmit: SubmitHandler<IFormInput> = async (data) => {
    const payload = { ...data, id, avatarUrl: avatarUrl };
    try {
      if (_imageFile) {
        payload.avatarUrl = dataFile?.id;
        await mutate(payload);
      } else {
        await mutate(payload);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpen = () => {
    setValue('email', email);
    setValue('phone', phoneNumber);
    setValue('name', tenant);
    setValue('username', userName);
  };
  const handleClose = () => {
    reset();
    setFileImage(undefined);
    handleCloseEdit();
  };

  const bodyPopup = () => {
    return (
      <div className='flex flex-col justify-start  gap-3 min-h-[48vh]'>
        <div className='w-full justify-center items-center flex'>
          <AvatarUpload onFileUpload={handleFileUpload} src={imageUrl} />
        </div>

        <InputCustom
          isRequired={true}
          control={control}
          name='name'
          placeholder={translationCapitalFirst('enter-tenant-name', 'tenantPage')}
          label={translationCapitalFirst('tenant-name', 'tenantPage')}
          isError={Boolean(errors?.name)}
          helperText={errors?.name?.message}
          inputProps={{ maxLength: 200 }}
        />
        {/* <InputCustom
        isRequired={true}
          control={control}
          name='address'
          placeholder={translationCapitalFirst('address', 'locationPage')}
          label={translationCapitalFirst('address', 'locationPage')}
        /> */}
        {isTablet ? (
          <>
            <InputCustom
              isRequired={true}
              classNameContainer='w-full'
              control={control}
              name='phone'
              placeholder={translationCapitalFirst('enter-phone-number', 'tenantPage')}
              label={translationCapitalFirst('phone-number', 'tenantPage')}
              isError={Boolean(errors?.phone)}
              helperText={errors?.phone?.message}
            />
            <InputCustom
              classNameContainer='w-full'
              control={control}
              name='email'
              placeholder={translationCapitalFirst('enter-email', 'tenantPage')}
              label={translationCapitalFirst('email', 'tenantPage')}
              isError={Boolean(errors?.email)}
              helperText={errors?.email?.message}
              inputProps={{ maxLength: 100 }}
            />
          </>
        ) : (
          <div className='flex gap-4 items-start'>
            <InputCustom
              isRequired={true}
              classNameContainer='w-full'
              control={control}
              name='phone'
              placeholder={translationCapitalFirst('enter-phone-number', 'tenantPage')}
              label={translationCapitalFirst('phone-number', 'tenantPage')}
              isError={Boolean(errors?.phone)}
              helperText={errors?.phone?.message}
            />
            <InputCustom
              classNameContainer='w-full'
              control={control}
              name='email'
              placeholder={translationCapitalFirst('enter-email', 'tenantPage')}
              label={translationCapitalFirst('email', 'tenantPage')}
              isError={Boolean(errors?.email)}
              helperText={errors?.email?.message}
              inputProps={{ maxLength: 100 }}
            />
          </div>
        )}

        <InputCustom
          isRequired={true}
          classNameContainer='w-full'
          control={control}
          name='username'
          placeholder={translationCapitalFirst('enter-user-name', 'tenantPage')}
          label={translationCapitalFirst('user-name', 'tenantPage')}
          isError={Boolean(errors?.username)}
          helperText={errors?.username?.message}
        />
      </div>
    );
  };

  return (
    <PopupEditCover
      openOver={openEdit}
      btnComponent={<></>}
      childrent={bodyPopup()}
      isSuccess={isSuccess}
      handleSubmit={handleSubmit(onSubmit)}
      title={translationCapitalFirst('edit-tenant', 'tenantPage')}
      handleClose={handleClose}
      handleOpen={handleOpen}
      sx={{
        '& .MuiPaper-root': {
          maxWidth: '800px',
          width: '800px'
        }
      }}
      isValid={isValid}
      isLoading={isPending || isPendingUploadFile}
    />
  );
}
