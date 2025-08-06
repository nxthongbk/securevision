import * as yup from 'yup';

import { Controller, useForm } from 'react-hook-form';
import { InputAdornment, MenuItem, Typography } from '@mui/material';

import ButtonCustom from '~/components/ButtonCustom';
import InputCustom from '~/components/InputCustom';
import PopupEditCover from '~/components/Modal/PopupEditCover';
import SelectCustom from '~/components/SelectCustom';
import handleNotificationMessage from '~/utils/notification'; // Adjust the path accordingly
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { yupResolver } from '@hookform/resolvers/yup';

const PopupEditLastTelemetry = () => {
  const [t] = useTranslation('', { keyPrefix: 'devicePage' });

  const [condition, setCondition] = useState<any>('');

  const CONDITION_TYPE = [t('condition-1'), t('condition-2')];

  const [isSuccess, setIsSuccess] = useState(false);

  const deviceSchema = yup.object({
    condition: yup.string().required(t('conditionRequired')),
    value_e1: yup.number().test('is-value-e1-required', t('valueE1Require'), function (value) {
      const { condition } = this.parent; // Lấy giá trị condition từ context
      if (condition === t('condition-1')) {
        return value !== undefined && value !== null; // Yêu cầu value_e1 phải có giá trị
      }
      return true; // Nếu không phải điều kiện, bỏ qua
    }),
    value_e2: yup.number().test('is-value-e2-required', t('valueE2Require'), function (value) {
      const { condition } = this.parent; // Lấy giá trị condition từ context
      if (condition === t('condition-1')) {
        return value !== undefined && value !== null; // Yêu cầu value_e2 phải có giá trị
      }
      return true; // Nếu không phải điều kiện, bỏ qua
    }),
    value: yup.number().test('is-value-required', t('valueRequire'), function (value) {
      const { condition } = this.parent; // Lấy giá trị condition từ context
      if (condition === t('condition-2')) {
        return value !== undefined && value !== null; // Yêu cầu value phải có giá trị
      }
      return true; // Nếu không phải điều kiện, bỏ qua
    }),
    period: yup.number().required(t('periodRequired')),
    alertType: yup.string().required(t('alertTypeRequired')),
    detailAlert: yup.string().required(t('detailAlertRequired'))
  });

  const {
    handleSubmit,
    formState: { errors, isValid },
    reset,
    control
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(deviceSchema)
  });

  const onSubmit = handleSubmit(() => {
    setIsSuccess(false);
    // const payload = {
    //   condition: data.condition,
    //   value_e1: condition === t('condition-1') ? data.value_e1 : undefined,
    //   value_e2: condition === t('condition-1') ? data.value_e2 : undefined,
    //   value: condition === t('condition-2') ? data.value : undefined,
    //   period: data.period,
    //   alertType: data.alertType,
    //   detailAlert: data.detailAlert
    // };

    handleNotificationMessage('Submission successful!', 'success');
    setIsSuccess(true);
  });
  const handleClose = () => {
    reset();
  };
  const bodyPopup = () => {
    return (
      <div className='gap-3 flex flex-col h-[550px]'>
        <InputCustom
          sx={{ width: '100%' }}
          classNameContainer='w-full'
          label={t('devices')}
          name='key'
          placeholder={t('enter-key')}
          disabled={true}
        />
        <InputCustom
          sx={{ width: '100%' }}
          classNameContainer='w-full'
          label={'Telemetry'}
          name='telemetry'
          placeholder={'data_current'}
          disabled={true}
        />
        <Controller
          name='condition'
          control={control}
          defaultValue=''
          render={({ field: { onChange, value, ref } }) => (
            <SelectCustom
              label={t('condition')}
              placeholderText={t('select-condition')}
              displayEmpty
              isRequired
              isError={!!errors.condition}
              onChange={(e) => {
                onChange(e); // Gọi hàm onChange của react-hook-form
                setCondition(e.target.value); // Thực hiện logic điều chỉnh state của bạn
              }}
              value={value} // Truyền giá trị hiện tại từ react-hook-form
              inputRef={ref} // Truyền ref để react-hook-form có thể quản lý
            >
              {CONDITION_TYPE.map((type) => (
                <MenuItem key={type} value={type} sx={{ pl: '10px', fontSize: '14px' }}>
                  {type}
                </MenuItem>
              ))}
            </SelectCustom>
          )}
        />

        {condition === t('condition-1') ? (
          <div className='flex flex-row gap-2'>
            <InputCustom
              sx={{ width: '100%' }}
              classNameContainer='w-full'
              label={t('value') + ' e1'}
              name='value_e1'
              placeholder={t('enter-value')}
              isRequired
              control={control}
              isError={!!errors.value_e1}
              helperText={errors.value_e1?.message}
            />
            <InputCustom
              sx={{ width: '100%' }}
              classNameContainer='w-full'
              label={t('value') + ' e2'}
              name='value_e2'
              placeholder={t('enter-value')}
              isRequired
              control={control}
              isError={!!errors.value_e2}
              helperText={errors.value_e2?.message}
            />
          </div>
        ) : (
          <InputCustom
            sx={{ width: '100%' }}
            classNameContainer='w-full'
            label={t('value')}
            name='value'
            placeholder={t('enter-value')}
            isRequired
            isError={!!errors.value}
            helperText={errors.value?.message}
            control={control}
          />
        )}
        <InputCustom
          sx={{ width: '100%', paddingRight: 0 }}
          classNameContainer='w-full'
          label={t('period')}
          name='period'
          placeholder={t('placehoder-input-period')}
          isRequired
          control={control}
          isError={!!errors.period}
          helperText={errors.period?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment
                position='end'
                sx={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#F2F5F7',
                  width: '52px',
                  height: '40px',
                  margin: 0,
                  padding: 0,
                  maxHeight: '40px',
                  borderTopRightRadius: '6px',
                  borderBottomRightRadius: '6px'
                }}
              >
                <Typography
                  variant='body3'
                  sx={{
                    color: '#3A3D41',
                    fontSize: '14px'
                  }}
                >
                  ms
                </Typography>
              </InputAdornment>
            )
          }}
        />
        <InputCustom
          sx={{ width: '100%' }}
          classNameContainer='w-full'
          label={t('alert-type')}
          control={control}
          name='alertType'
          placeholder={t('select-alert-type')}
          isRequired
          isError={!!errors.alertType}
          helperText={errors.alertType?.message}
        />
        <InputCustom
          sx={{ width: '100%' }}
          classNameContainer='w-full'
          label={t('detail-alert')}
          name='detailAlert'
          placeholder={t('enter-detail-alert')}
          isRequired
          control={control}
          isError={!!errors.detailAlert}
          helperText={errors.detailAlert?.message}
        />
      </div>
    );
  };

  return (
    <PopupEditCover
      handleClose={handleClose}
      title='devicePage.add-devices'
      handleSubmit={onSubmit}
      childrent={bodyPopup()}
      isValid={isValid}
      isSuccess={isSuccess}
      handleOpen={() => {}}
      btnComponent={
        <ButtonCustom
          variant='contained'
          className='gap-3'
          sx={{ backgroundColor: '#C0CCD8', color: '#3A3D41', height: 32 }}
        >
          <Typography variant='button3'>{t('edit-warning')}</Typography>
        </ButtonCustom>
      }
    />
  );
};

export default PopupEditLastTelemetry;
