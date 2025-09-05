import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  Divider,
  FormControlLabel,
  FormGroup,
  IconButton,
  Stack,
  Typography,
  styled
} from '@mui/material';
import { Check, Plus, X } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { Controller, GlobalError, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import ButtonCustom from '~/components/ButtonCustom';
import InputCustom from '~/components/InputCustom';
import useLazyQuery from '~/utils/hooks/useLazyQuery';
import { UpsertPermissionGroupProps } from '../../type';
import permissionService from '~/services/permission.service';
import { useCreatePermissionConfig, useGetFunctionGroupPermission, useUpdatePermissionConfig } from '../../handleApi';

const defaultValues = {
  configName: '',
  permissionIds: []
};

const PermissionFormControlLabel = styled(FormControlLabel)(() => ({
  '&.MuiFormControlLabel-root': {
    width: '100%',
    marginRight: 0,
    marginLeft: 0,
    padding: '4px 4px 8px 6px'
  }
}));

const PopupUpsertConfig = ({ permissionGroupId, tenantCode, forceOpen, onClose }: UpsertPermissionGroupProps) => {
  const [hrPageTranslate] = useTranslation('', { keyPrefix: 'hr-page' });
  const [open, setOpen] = useState(false);

  const { mutate } = useCreatePermissionConfig();
  const { mutate: updatePermissionConfig } = useUpdatePermissionConfig();

  // Form Schema
  const validationSchema = yup.object().shape({
    configName: yup
      .string()
      .required(hrPageTranslate('please-enter-config-name'))
      .max(255, hrPageTranslate('config-name-max-length'))
      .trim(),
    permissionIds: yup.array().of(yup.string().uuid()).nullable()
  });

  const {
    control,
    formState: { errors, isValid },
    handleSubmit,
    setValue,
    reset
  } = useForm<yup.InferType<typeof validationSchema>>({
    defaultValues,
    mode: 'onBlur',
    resolver: yupResolver(validationSchema)
  });

  const formValues = useWatch({ control });

  const { data: functionGroupPermissions } = useGetFunctionGroupPermission(0, 50, '', tenantCode);

  // Lazy Query
  const [trigger, { data: configDetail }] = useLazyQuery(
    ['getPermissionConfigDetail', { permissionGroupId }],
    () => permissionService.getPermissionConfigDetail(permissionGroupId),
    { staleTime: 3000 }
  );

  useEffect(() => {
    // Only open edit popup -> Fetch detail
    if (permissionGroupId && tenantCode && forceOpen) {
      setOpen(true);
      trigger();
    }
  }, [forceOpen, permissionGroupId, tenantCode, trigger]);

  useEffect(() => {
    if (permissionGroupId) {
      const data = configDetail?.['data'];
      if (data) {
        reset({
          configName: data.name,
          permissionIds: data.permissionIds
        });
      }
    }
  }, [configDetail, permissionGroupId, reset, setValue]);

  const handleClose = () => {
    reset();
    setOpen(false);
    onClose?.();
  };

  const getError = (field: keyof yup.InferType<typeof validationSchema>): GlobalError | undefined => {
    return errors[field];
  };

  const renderFunctionGroupPermisison = (data: { name: string; permissions: { id: string; name: string }[] }) => {
    const { name, permissions } = data;
    return (
      <Stack className='bg-[var(--grey-neutral-60)] p-4 pb-0 rounded-md'>
        <Typography variant='label3'>{name}</Typography>
        <Box className='flex ml-[-16px]'>
          {(permissions || []).map((permisison) => (
            <PermissionFormControlLabel
              checked={formValues.permissionIds.includes(permisison.id)}
              value={permisison.id}
              control={<Checkbox />}
              label={<Typography variant='body3'>{permisison.name}</Typography>}
            />
          ))}
        </Box>
      </Stack>
    );
  };

  const handleUpsertConfig = handleSubmit((data) => {
    try {
      const requestBody = {
        tenantCode,
        name: data.configName,
        description: '',
        status: 'ACTIVE',
        permissionIds: data.permissionIds
      };
      if (permissionGroupId) {
        updatePermissionConfig({
          permissionGroupId,
          requestBody
        });
        handleClose();
        return;
      }
      mutate(requestBody);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <>
      {!permissionGroupId && (
        <Button
          variant='contained'
          color='primary'
          onClick={() => setOpen(true)}
          startIcon={<Plus size={20} color='white' />}
        >
          <Typography variant='button3' color='white'>
            {hrPageTranslate('add-new')}
          </Typography>
        </Button>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '8px',
            width: 800,
            height: 1000
          }
        }}
        disableRestoreFocus
      >
        <DialogContent
          sx={{
            padding: '0',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden'
          }}
        >
          <Box>
            <Box className='flex justify-between items-center px-4 py-2.5'>
              <Typography color='var(--text-primary)' variant='h6'>
                {hrPageTranslate(permissionGroupId ? 'update-config' : 'add-new-config')}
              </Typography>
              <IconButton aria-label='close' onClick={handleClose}>
                <X size={20} />
              </IconButton>
            </Box>
            <Divider
              sx={{
                borderBottom: '1px solid var(--border-color)',
                width: '100%'
              }}
            />
          </Box>
          <Stack className='gap-6 p-4 h-full overflow-scroll'>
            <InputCustom
              sx={{ width: '100%' }}
              classNameContainer='w-full'
              label={hrPageTranslate('config-name')}
              control={control}
              name='configName'
              placeholder={hrPageTranslate('enter-config-name')}
              isRequired
              isError={!!getError('configName')}
              helperText={errors?.configName?.message}
            />
            <Controller
              control={control}
              name='permissionIds'
              render={({ field }) => (
                <FormGroup
                  {...field}
                  onChange={(e: any) => {
                    setValue(
                      'permissionIds',
                      formValues.permissionIds.includes(e.target.value)
                        ? formValues.permissionIds.filter((id) => id != e.target.value)
                        : [...formValues.permissionIds, e.target.value]
                    );
                  }}
                >
                  <Stack className='w-full gap-3'>
                    <Typography variant='label3'>{hrPageTranslate('permission-setting')}</Typography>
                    {(functionGroupPermissions?.data?.content || []).map((item) => renderFunctionGroupPermisison(item))}
                  </Stack>
                </FormGroup>
              )}
            />
          </Stack>
          <Box>
            <Divider
              sx={{
                borderBottom: '1px solid var(--border-color)',
                width: '100%'
              }}
            />
            <Box className='flex justify-end items-center p-4 gap-3'>
              <ButtonCustom variant='outlined' color='primary' onClick={handleClose} startIcon={<X size={18} />}>
                <Typography variant='button3' fontWeight={600}>
                  {hrPageTranslate('cancel')}
                </Typography>
              </ButtonCustom>
              <ButtonCustom
                variant='contained'
                color='primary'
                type='submit'
                onClick={handleUpsertConfig}
                startIcon={<Check size={18} />}
                disabled={!isValid}
              >
                <Typography variant='button3' fontWeight={600}>
                  {hrPageTranslate('save')}
                </Typography>
              </ButtonCustom>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PopupUpsertConfig;
