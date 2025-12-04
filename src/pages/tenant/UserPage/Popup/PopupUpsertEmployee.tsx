import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  Typography,
  buttonBaseClasses
} from '@mui/material';
import { Check, Plus, X, XCircle } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { GlobalError, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import ButtonCustom from '~/components/ButtonCustom';
import InputCustom from '~/components/InputCustom';
import SelectCustom from '~/components/SelectCustom';
import AvatarUpload from '~/components/avatar-upload';
import useLazyQuery from '~/utils/hooks/useLazyQuery';
import { useGetLocations } from '../../LocationPage/handleApi';
import { VN_PHONE_REGEX } from '../../LocationPage/utils';
import { UpsertEmployeeProps } from '../type';
import { useCreateStaff, useGetFunctionGroupPermission, useGetPermissionConfigs, useUpdateStaff } from '../handleApi';
import { useUploadFileAvatar, useDeleteFileAvatar } from '~/utils/hooks/useHandleFileAvatar';
import fileStorageService from '~/services/fileStorage.service';
import staffService from '~/services/staff.service';
import { intersection, isEmpty } from 'lodash';

const defaultValues = {
  fullName: '',
  userName: '',
  phone: '',
  locationIds: [],
  permissionGroupId: '',
  avatarUrl: null
};

const PopupUpsertEmployee = ({ staffId, tenantCode, forceOpen, onClose }: UpsertEmployeeProps) => {
  const [userPageTranslate] = useTranslation('', { keyPrefix: 'user-page' });
  const [open, setOpen] = useState(false);
  const [_imageFile, setFileImage] = useState();
  const [isSelectAllLocations, setSelectAllLocations] = useState<boolean>(false);

  const [imageBlob, setImageBlob] = useState<string>('');
  const { dataFile, mutateUploadFile, resetUploadFile } = useUploadFileAvatar();
  const { mutateDeleteFile } = useDeleteFileAvatar();

  const { mutate: createStaff, isSuccess: createSuccess } = useCreateStaff();
  const { mutate: updateStaff, isSuccess: updateSuccess } = useUpdateStaff();

  const handleFileUpload = (file: any) => {
    setFileImage(file);
  };

  const { data: permissionConfigs } = useGetPermissionConfigs(0, 100, '', tenantCode);
  const { data: functionGroupPermissions } = useGetFunctionGroupPermission(0, 50, '', tenantCode);
  const { data: locations } = useGetLocations(0, 100, '', tenantCode);

  // Form Schema
  const validationSchema = yup.object().shape({
    fullName: yup.string().required(userPageTranslate('please-enter-fullname')).trim(),
    userName: yup
      .string()
      .required(userPageTranslate('please-enter-username'))
      .min(4, userPageTranslate('please-enter-username-valid-min-length'))
      .max(20, userPageTranslate('please-enter-username-valid-max-length'))
      .matches(/^[a-zA-Z0-9]+$/, userPageTranslate('please-enter-username-valid-character'))
      .trim(),
    phone: yup
      .string()
      .required(userPageTranslate('please-enter-phone-number'))
      .matches(VN_PHONE_REGEX, {
        message: userPageTranslate('please-enter-valid-phone-number')
      }),
    avatarUrl: yup.string().nullable(),
    locationIds: yup.array().of(yup.string().uuid()),
    permissionGroupId: yup.string().required(userPageTranslate('please-select-permission-group'))
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

  // Set Image Url when upload new image
  useEffect(() => {
    if (dataFile?.id) {
      setValue('avatarUrl', dataFile.id, {
        shouldValidate: true
      });
    }
  }, [dataFile?.id, setValue]);

  // Lazy Query
  const [trigger, { data: staffDetail }] = useLazyQuery(
    ['getStaffDetail', { tenantCode, staffId }],
    () => staffService.getStaffDetail(staffId, tenantCode),
    { staleTime: 3000 }
  );

  useEffect(() => {
    // Only open edit popup -> Fetch staff detail
    if (staffId && tenantCode && forceOpen) {
      setOpen(true);
      trigger();
    }
  }, [forceOpen, staffId, tenantCode, trigger]);

  useEffect(() => {
    if (staffId) {
      const data = staffDetail?.['data'];
      if (data) {
        if (data.avatarUrl) {
          fileStorageService.getFileImage(data.avatarUrl).then((res: unknown) => {
            const url = URL.createObjectURL(res as Blob);
            setImageBlob(url);
          });
        }
        setSelectAllLocations(data.assignAllLocations);
        reset({
          userName: data.username,
          fullName: data.name,
          phone: data.phone,
          locationIds: data.assignAllLocations ? [] : (data?.locations || []).map((location) => location.id),
          permissionGroupId: data.permissionGroup?.id,
          avatarUrl: data.avatarUrl
        });
      }
    }
  }, [staffDetail, staffId, reset, setValue]);

  const handleClose = () => {
    reset();
    setSelectAllLocations(false);
    setOpen(false);
    onClose?.();
  };

  const getError = (field: keyof yup.InferType<typeof validationSchema>): GlobalError | undefined => {
    return errors[field];
  };

  const handleRemoveItem = (id: any) => {
    setValue(
      'locationIds',
      formValues.locationIds.filter((locationId) => locationId !== id)
    );
  };
  const handleRemoveAll = () => {
    setValue('locationIds', []);
  };

  useEffect(() => {
    if (_imageFile) {
      mutateUploadFile(_imageFile);
    }
    const upsertNotSuccess = !createSuccess && !updateSuccess;
    if (dataFile?.id && upsertNotSuccess) {
      mutateDeleteFile(dataFile?.id);
      resetUploadFile();
    }
  }, [_imageFile]);

  const handleUpsertStaff = handleSubmit((data) => {
    try {
      const requestBody = {
        tenantCode: tenantCode,
        name: data.fullName,
        username: data.userName,
        phone: data.phone,
        avatarUrl: data.avatarUrl,
        locationIds: isSelectAllLocations ? [] : data.locationIds,
        permissionGroupId: data.permissionGroupId,
        assignAllLocations: isSelectAllLocations
      };
      if (staffId) {
        updateStaff({ staffId, requestBody });
        handleClose();
        return;
      }
      createStaff(requestBody);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  });

  return (
    <>
      {!staffId && (
        <Button
          variant='contained'
          color='primary'
          onClick={() => setOpen(true)}
          startIcon={<Plus size={20} color='white' />}
        >
          <Typography variant='button3' color='white'>
            {userPageTranslate('add-new')}
          </Typography>
        </Button>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            // borderRadius: '8px',
            width: 800,
            height: 1000,
            background: "var(--bg)"
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
                {userPageTranslate(staffId ? 'update-information' : 'add-employee')}
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
          <Stack className='gap-3 p-4 h-full overflow-scroll'>
            <div className='w-full justify-center items-center flex'>
              <AvatarUpload
                src={staffId ? imageBlob : null}
                onFileUpload={handleFileUpload}
                avatarSx={{ borderRadius: '8px' }}
                inputSx={{ borderRadius: '8px' }}
                asyncLoadAvatar
              />
            </div>
            <InputCustom
              sx={{ width: '100%' }}
              classNameContainer='w-full'
              label={userPageTranslate('fullname')}
              control={control}
              name='fullName'
              placeholder={userPageTranslate('fullname-placeholder')}
              isRequired
              isError={!!getError('fullName')}
              helperText={errors?.fullName?.message}
            />
            <Box className='flex gap-[16px]'>
              <InputCustom
                sx={{ width: '100%' }}
                classNameContainer='w-full'
                label={userPageTranslate('username')}
                control={control}
                name='userName'
                placeholder={userPageTranslate('username-placeholder')}
                isRequired={true}
                isError={!!getError('userName')}
                helperText={errors?.userName?.message}
              />
              <InputCustom
                sx={{ width: '100%' }}
                classNameContainer='w-full'
                label={userPageTranslate('phone')}
                control={control}
                name='phone'
                placeholder={userPageTranslate('phone-placeholder')}
                isRequired
                isError={!!getError('phone')}
                helperText={errors?.phone?.message}
              />
            </Box>
            <SelectCustom
              isSelectAll={true}
              control={control}
              name='locationIds'
              label={userPageTranslate('location')}
              placeholderText={userPageTranslate('select-location')}
              displayEmpty
              multiple
              MenuProps={{
                slotProps: {
                  paper: {
                    sx: {
                      maxHeight: '450px'
                    }
                  }
                }
              }}
              slotProps={{
                root: {
                  className: '!h-auto',
                  sx: {
                    '& svg': {
                      top: 'unset !important'
                    }
                  }
                },
                input: {
                  className: '!pr-[38px]',
                  sx: {
                    py: formValues.locationIds.length > 0 ? '4.6px' : '10px'
                  }
                }
              }}
              onChange={(event) => {
                const value = event.target.value as string[];
                // TODO: Update to check value.length === loadedLocations (state)
                if (value.includes('ALL') || value.length === locations?.data?.content?.length) {
                  setSelectAllLocations((prev: boolean) => (value.length === 1 ? !prev : true));
                  setValue('locationIds', []);
                  return;
                }
                setSelectAllLocations(false);
                setValue('locationIds', value);
              }}
              renderValue={(selected: any) => {
                if (isSelectAllLocations) {
                  return (
                    <span
                      style={{
                        color: 'var(--text-primary)',
                        fontSize: '14px'
                      }}
                    >
                      {userPageTranslate('all')}
                    </span>
                  );
                }
                if (selected?.length === 0 || !selected) {
                  return (
                    <span
                      style={{
                        color: 'var(--text-tertiary)',
                        fontSize: '14px'
                      }}
                    >
                      {userPageTranslate('select-location')}
                    </span>
                  );
                }
                return (
                  <Stack
                    sx={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginTop: 0.3,
                      justifyContent: 'space-between'
                    }}
                  >
                    <Stack
                      sx={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      {selected.slice(0, 2).map((item) => (
                        <Chip
                          sx={{
                            height: '24px',
                            marginBottom: '4px',
                            marginRight: '4px',
                            fontSize: '14px',
                            fontWeight: '400'
                          }}
                          key={item}
                          label={locations?.data?.content?.find((location) => location.id === item).name}
                          onDelete={() => handleRemoveItem(item)}
                          deleteIcon={
                            <X
                              onMouseDown={(e) => e.stopPropagation()}
                              color='var(--text-secondary)'
                              size={18}
                              style={{ marginRight: '8px' }}
                            />
                          }
                        />
                      ))}
                      {selected.length > 2 && (
                        <Stack>
                          <Box
                            borderRadius={50}
                            width='fit-content'
                            sx={{
                              background: '#EAEBEB',
                              padding: '0px 8px',
                              fontSize: '14px',
                              height: '24px',
                              marginBottom: '4px',
                              lineHeight: '24px'
                            }}
                          >
                            +{selected.length - 2}
                          </Box>
                        </Stack>
                      )}
                    </Stack>
                    <XCircle
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        handleRemoveAll();
                      }}
                      color='var(--text-tertiary)'
                      size={24}
                      style={{ marginBottom: '2.4px' }}
                    />
                  </Stack>
                );
              }}
            >
              <MenuItem
                value='ALL'
                sx={{
                  mb: '5px',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid var(--divider-color)',
                  borderRadius: '0px !important',
                  '&:hover': {
                    backgroundColor: 'var(--white) !important'
                  },
                  [`& .${buttonBaseClasses.root}`]: { padding: '4px' }
                }}
              >
                <Typography variant='button3' color={'var(--primary)'}>
                  {userPageTranslate('all')}
                </Typography>
                <Checkbox
                  checked={isSelectAllLocations}
                  onChange={(event) => {
                    event.stopPropagation();
                    setValue('locationIds', []);
                    setSelectAllLocations(event.target.checked);
                  }}
                />
              </MenuItem>
              {locations?.data?.content?.map((location) => (
                <MenuItem
                  key={location.id}
                  value={location.id}
                  sx={{
                    justifyContent: 'space-between',
                    [`& .${buttonBaseClasses.root}`]: { padding: '4px' }
                  }}
                >
                  <Typography variant='body3'>{location.name}</Typography>
                  <Checkbox
                    checked={isSelectAllLocations || formValues.locationIds.includes(location.id)}
                    onChange={(event) => {
                      event.stopPropagation();
                      if (isSelectAllLocations) {
                        setSelectAllLocations(false);
                        setValue('locationIds', [location.id]);
                        return;
                      }
                      setValue(
                        'locationIds',
                        event.target.checked
                          ? [...formValues.locationIds, location.id]
                          : formValues.locationIds.filter((id) => id !== location.id)
                      );
                    }}
                  />
                </MenuItem>
              ))}
            </SelectCustom>
            <SelectCustom
              control={control}
              name='permissionGroupId'
              label={userPageTranslate('config')}
              placeholderText={userPageTranslate('select-config')}
              isRequired
              classNameContainer='mb-3'
              displayEmpty
              isError={!!getError('permissionGroupId')}
              helperText={errors?.permissionGroupId?.message}
              MenuProps={{
                slotProps: {
                  paper: {
                    sx: {
                      maxHeight: 400
                    }
                  }
                }
              }}
              slotProps={{
                root: {
                  className: '!h-auto',
                  sx: {
                    '& svg': {
                      top: 'unset !important'
                    }
                  }
                },
                input: { className: '!pr-[38px]' }
              }}
            >
              {(permissionConfigs?.data?.content || []).map((config) => (
                <MenuItem key={config.id} value={config.id} sx={{ pl: '10px' }}>
                  <Typography variant='body3'>{config.name}</Typography>
                </MenuItem>
              ))}
            </SelectCustom>
            {formValues.permissionGroupId && (
              <Stack gap='16px' className='flex-1'>
                {(functionGroupPermissions?.data?.content || []).map((fnGroupPermission) => {
                  const selectedConfig = (permissionConfigs?.data?.content || []).find(
                    (config) => config.id === formValues.permissionGroupId
                  );
                  const permissionIds = selectedConfig?.permissionIds || [];
                  const fnGroupPermissions = fnGroupPermission.permissions || [];
                  const fnGroupPermissionIds = fnGroupPermissions.map((item) => item.id);
                  const commonIds = intersection(fnGroupPermissionIds, permissionIds);
                  const hasPermission = !isEmpty(commonIds);

                  const action = hasPermission
                    ? fnGroupPermissions.find((item) => item.id === commonIds[0])?.name || ''
                    : '';
                  const normalizedAction = action
                    ? action.indexOf('(') !== -1
                      ? action.slice(0, action.indexOf('('))
                      : action
                    : '';

                  const permissionIcon = hasPermission ? (
                    <Check style={{ minWidth: '20px' }} size={20} color='var(--green-500)' />
                  ) : (
                    <X style={{ minWidth: '20px' }} size={20} />
                  );

                  return (
                    <Typography
                      key={fnGroupPermission.id}
                      className='flex gap-[4px] items-center'
                      variant='body3'
                      color={hasPermission ? 'var(--text-primary)' : 'var(--tertiary)'}
                    >
                      {permissionIcon}
                      {fnGroupPermission.name} {normalizedAction ? `(${normalizedAction.trim()})` : ''}
                    </Typography>
                  );
                })}
              </Stack>
            )}
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
                  {userPageTranslate('cancel')}
                </Typography>
              </ButtonCustom>
              <ButtonCustom
                variant='contained'
                color='primary'
                type='submit'
                onClick={handleUpsertStaff}
                startIcon={<Check size={18} />}
                disabled={!isValid}
              >
                <Typography variant='button3' fontWeight={600}>
                  {userPageTranslate('save')}
                </Typography>
              </ButtonCustom>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PopupUpsertEmployee;
