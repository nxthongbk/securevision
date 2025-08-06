import * as yup from 'yup';

import { DrawerProps, MenuItem } from '@mui/material';
import { useForm, useWatch } from 'react-hook-form';

import DrawerUpdate from '../../../../components/Drawer/DrawerUpdate';
import InputCustom from '~/components/InputCustom';
import SelectCustom from '~/components/SelectCustom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useUpsertAttribute } from '../handleApi';
import { yupResolver } from '@hookform/resolvers/yup';

const ATTRIBUTE_TYPE = ['String', 'Integer', 'Double', 'Boolean', 'Json'];

interface DrawerUpdateAttributeProps extends DrawerProps {
  deviceId: string;
  keyName?: string;
  value?: string;
  isUpdating: boolean;
}

// const determineType = (value: string | boolean): string => {
//   if (value === true || value === false) {
//     return 'Boolean';
//   }

//   if (/^\d+$/.test(value)) {
//     return 'Integer';
//   }
//   if (!isNaN(parseFloat(value))) {
//     return 'Double';
//   }
//   if (isObject(value)) return 'Json';

//   return 'String';
// };

export default function DrawerUpsertAtrribute(props: DrawerUpdateAttributeProps) {
  const { deviceId, isUpdating, ...rest } = props;

  const [t] = useTranslation('', { keyPrefix: 'devicePage' });
  const { mutate, isPending, isSuccess } = useUpsertAttribute();

  const attributesDeviceSchema = yup.object().shape({
    key: yup.string().required(t('please-enter-key')).trim().max(255, t('key-maxlength')),
    type: yup.string().required(t('please-select-type')),
    value: yup
      .string()
      .required(t('please-enter-value'))
      .when('type', ([type], schema) => {
        return schema.test('validate-based-on-type', t('invalid-value-by-type'), (value) => {
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
    trigger
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
    mutate({
      deviceId,
      attributes: { [data.key]: value }
    });
  });

  useEffect(() => {
    if (formValues.type && dirtyFields.value) trigger('value');
  }, [formValues.type, trigger, dirtyFields.value]);

  const title = t(isUpdating ? 'update-attribute' : 'add-new-attribute');

  return (
    <DrawerUpdate
      title={title}
      isValid={isValid}
      isLoading={isPending}
      isSuccess={isSuccess}
      onSubmit={onSubmit}
      anchor='bottom'
      {...rest}
    >
      <InputCustom
        sx={{ width: '100%' }}
        classNameContainer='w-full'
        label={t('key')}
        control={control}
        name='key'
        placeholder={t('enter-key')}
        isRequired
        isError={!!errors.key}
        disabled={isUpdating}
        helperText={errors?.key?.message}
      />
      <SelectCustom
        control={control}
        name='type'
        label={t('type')}
        placeholderText={t('select-type')}
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
        label={t('value')}
        control={control}
        name='value'
        placeholder={t('enter-value')}
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
    </DrawerUpdate>
  );
}
