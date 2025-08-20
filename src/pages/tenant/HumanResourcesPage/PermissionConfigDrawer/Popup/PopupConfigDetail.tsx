import { Box, CircularProgress, Stack, Typography } from '@mui/material';
import { Check, PencilSimple, X } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import ButtonCustom from '~/components/ButtonCustom';
import DialogCustom from '~/components/DialogCustom';
import { useGetFunctionGroupPermission, useGetPermissionConfigDetail } from '../../handleApi';
import { intersection, isEmpty } from 'lodash';

export default function PopupConfigDetail({
  open,
  permissionGroupId,
  tenantCode,
  onEdit,
  onClose
}: Readonly<{
  open: boolean;
  permissionGroupId: string;
  tenantCode: string;
  onEdit: () => void;
  onClose: () => void;
}>) {
  const [hrPageTranslate] = useTranslation('', { keyPrefix: 'hr-page' });
  const { data: permissionConfigDetail, isLoading: loadingPermissionConfigDetail } =
    useGetPermissionConfigDetail(permissionGroupId);
  const configDetail = permissionConfigDetail?.data || {};
  const { data: functionGroupPermissions, isLoading: loadingFnGroupPermisisons } = useGetFunctionGroupPermission(
    0,
    50,
    '',
    tenantCode
  );

  const handleUpdateConfig = () => {
    onClose();
    onEdit();
  };

  const fields = [
    { label: 'ID', value: configDetail.code && String(configDetail.code).padStart(4, '0'), key: 'id' },
    {
      label: hrPageTranslate('config-name'),
      value: configDetail.name,
      key: 'configName'
    },
    {
      label: hrPageTranslate('staff-count'),
      value: configDetail.userCount || 0,
      key: 'staffCount'
    },
    { label: hrPageTranslate('permission'), value: configDetail, key: 'permission' }
  ];

  const renderField = ({ label, value, key }, order) => {
    let valueJSX: JSX.Element;

    switch (key) {
      case 'permission':
        valueJSX = (
          <Stack gap='16px' className='flex-1'>
            {(functionGroupPermissions?.data?.content || []).map((fnGroupPermission) => {
              const staffPermissions = configDetail?.permissionIds || [];
              const fnGroupPermissions = fnGroupPermission.permissions || [];
              const fnGroupPermissionIds = fnGroupPermissions.map((item) => item.id);
              const commonIds = intersection(fnGroupPermissionIds, staffPermissions);
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
        );
        break;
      default:
        valueJSX = (
          <Typography variant='body3' className='flex-1 text-ellipsis overflow-hidden'>
            {value}
          </Typography>
        );
    }

    return (
      <div
        key={key}
        className={`flex w-full px-[12px] py-[12px] ${order % 2 === 0 ? ' bg-[var(--grey-primary-60)] rounded-md' : ''}`}
      >
        <Typography variant='label3' className='w-[38%] flex-shrink-0'>
          {label}
        </Typography>
        {valueJSX}
      </div>
    );
  };

  const renderContent = () => {
    if (loadingPermissionConfigDetail || loadingFnGroupPermisisons) {
      return (
        <Box className='flex items-center justify-center h-[472px]'>
          <CircularProgress size={50} />
        </Box>
      );
    }
    return (
      <div className='flex flex-col gap-6 px-[16px] py-[24px] h-[472px]'>
        <div className='flex flex-col'>{fields.map((data, index) => renderField(data, index))}</div>
      </div>
    );
  };

  return (
    <DialogCustom
      open={open}
      title={hrPageTranslate('config-info')}
      maxWidth='600px'
      handleClose={onClose}
      footer={
        <ButtonCustom
          onClick={handleUpdateConfig}
          variant='contained'
          startIcon={<PencilSimple />}
          className='!bg-[var(--primary)] !text-[var(--white)] !font-semibold'
        >
          <Typography variant='button3'>{hrPageTranslate('update')}</Typography>
        </ButtonCustom>
      }
      content={renderContent()}
    />
  );
}
