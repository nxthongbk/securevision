import * as yup from 'yup';

import { Box, Dialog, DialogContent, Divider, IconButton, MenuItem, Typography } from '@mui/material';
import { Check, X } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import ButtonCustom from '~/components/ButtonCustom';
import InputCustom from '~/components/InputCustom';
import SelectCustom from '~/components/SelectCustom';
import { isObject } from 'lodash';
import { useTranslation } from 'react-i18next';
import { useUpsertAttribute } from '../handleApi';
import { yupResolver } from '@hookform/resolvers/yup';

const ATTRIBUTE_TYPE = ['String', 'Integer', 'Double', 'Boolean', 'Json'];

const PopupUpsertAttribute = ({
  deviceId,
  forceOpen,
  keyName,
  value,
  onClose,
  isEdit = false
}: {
  deviceId: string;
  forceOpen?: boolean;
  keyName?: string;
  value?: string;
  onClose?: () => void;
  isEdit?: boolean;
}) => {
  const [open, setOpen] = useState(false);
  const [deviceTranslate] = useTranslation('', { keyPrefix: 'devicePage' });
  const mutation = useUpsertAttribute();

  const attributesDeviceSchema = yup.object().shape({
    key: yup.string().required(deviceTranslate('please-enter-key')).trim().max(255, deviceTranslate('key-maxlength')),
    type: yup.string().required(deviceTranslate('please-select-type')),
    value: yup
      .string()
      .required(deviceTranslate('please-enter-value'))
      .when('type', ([type], schema) => {
        return schema.test('validate-based-on-type', deviceTranslate('invalid-value-by-type'), (value) => {
          if (!value) return true;

          switch (type) {
            case 'String':
              return typeof value === 'string';
            case 'Integer':
              return /^\d+$/.test(value);
            case 'Double':
              return !isNaN(parseFloat(value));
            case 'Boolean':
              return value === 'true' || value === 'false';
            case 'Json':
              try {
                JSON.parse(value);
                return true;
              } catch (e) {
                return false;
              }
            default:
              return true;
          }
        });
      })
  });

  const {
    control,
    formState: { errors, isValid, dirtyFields },
    handleSubmit,
    trigger,
    setValue
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      key: '',
      value: '',
      type: ''
    },
    resolver: yupResolver(attributesDeviceSchema)
  });

  const formValues = useWatch({ control });

  const formatValue = (data: any) => {
    switch (data.type) {
      case 'String':
        return data.value;
      case 'Integer':
        return parseInt(data.value);
      case 'Double':
        return parseFloat(data.value);
      case 'Boolean':
        return data.value === 'true';
      case 'Json':
        return JSON.parse(data.value);
      default:
        return data.value;
    }
  };

  const onSubmit = handleSubmit((data) => {
    const value = formatValue(data);
    mutation.mutate({
      deviceId,
      attributes: { [data.key]: value }
    });
    handleClose();
  });

  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  const determineType = (value: string | boolean): string => {
    if (value === true || value === false) {
      return 'Boolean';
    }

    if (/^\d+$/.test(value)) {
      return 'Integer';
    }
    if (!isNaN(parseFloat(value))) {
      return 'Double';
    }
    if (isObject(value)) return 'Json';

    return 'String';
  };

  const handleOpenUpdatePopup = () => {
    setOpen(true);
    const type = determineType(value);
    setValue('type', type);
    setValue('key', keyName || '');

    const isObjValue = isObject(value);
    setValue('value', isObjValue ? JSON.stringify(value) : value);
  };

  useEffect(() => {
    if (formValues.type && dirtyFields.value) trigger('value');
  }, [formValues.type, trigger, dirtyFields.value]);

  useEffect(() => {
    if (forceOpen) setOpen(true);
  }, [forceOpen]);

  return (
    <>
      {isEdit && (
        <Box className='w-full' onClick={handleOpenUpdatePopup}>
          <Typography variant='button3'>{deviceTranslate('update')}</Typography>
        </Box>
      )}
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          '& .MuiPaper-root': {
            borderRadius: '8px',
            width: 600,
            minHeight: 500,
            maxHeight: 640
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
                {deviceTranslate(isEdit ? 'update-attribute' : 'add-new-attribute')}
              </Typography>
              <IconButton aria-label='close ' onClick={handleClose}>
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
          <Box className='gap-3 flex flex-col p-[16px] h-full mb-auto'>
            <InputCustom
              sx={{ width: '100%' }}
              classNameContainer='w-full'
              label={deviceTranslate('key')}
              control={control}
              name='key'
              placeholder={deviceTranslate('enter-key')}
              isRequired
              isError={!!errors.key}
              disabled={isEdit}
              helperText={errors?.key?.message}
            />
            <SelectCustom
              control={control}
              name='type'
              label={deviceTranslate('type')}
              placeholderText={deviceTranslate('select-type')}
              displayEmpty
              isRequired
              isError={!!errors.type}
              helperText={errors?.type?.message}
            >
              {ATTRIBUTE_TYPE.map((type) => (
                <MenuItem key={type} value={type} sx={{ pl: '10px', fontSize: '14px' }}>
                  {type}
                </MenuItem>
              ))}
            </SelectCustom>
            <InputCustom
              classNameContainer='w-full'
              label={deviceTranslate('value')}
              control={control}
              name='value'
              placeholder={deviceTranslate('enter-value')}
              isRequired
              isError={!!errors.value}
              helperText={errors?.value?.message}
              multiline
              maxRows={10}
              InputProps={{
                sx: {
                  padding: 0
                }
              }}
            />
          </Box>
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
                  {deviceTranslate('cancel')}
                </Typography>
              </ButtonCustom>
              <ButtonCustom
                variant='contained'
                color='primary'
                type='submit'
                onClick={onSubmit}
                startIcon={<Check size={18} />}
                disabled={!isValid}
              >
                <Typography variant='button3' fontWeight={600}>
                  {deviceTranslate('save')}
                </Typography>
              </ButtonCustom>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PopupUpsertAttribute;
