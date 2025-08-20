import { Stack, Typography } from '@mui/material';
import { Check, Password, PencilSimple, X } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import AvatarTableRow from '~/components/AvatarTableRow';
import ButtonCustom from '~/components/ButtonCustom';
import DialogCustom from '~/components/DialogCustom';
import StatusChip from '~/components/StatusChip';
import { useGetFunctionGroupPermission } from '../handleApi';
import { intersection, isEmpty } from 'lodash';

export default function PopupDetail({
  open,
  staffDetail,
  tenantCode,
  onEdit,
  onClose,
  onResetPassword,
  hasEdit
}: Readonly<{
  open: boolean;
  staffDetail: Record<string, any> | null;
  tenantCode: string;
  onEdit: () => void;
  onClose: () => void;
  onResetPassword: () => void;
  hasEdit: boolean;
}>) {
  const [hrPageTranslate] = useTranslation('', { keyPrefix: 'hr-page' });
  const { data: functionGroupPermissions } = useGetFunctionGroupPermission(0, 50, '', tenantCode);

  const handleUpdateStaff = () => {
    onClose();
    onEdit();
  };

  const handleResetPassword = () => {
    onClose();
    onResetPassword();
  };

  const fields = [
    { label: 'ID', value: staffDetail.code && String(staffDetail.code).padStart(4, '0'), key: 'id' },
    { label: hrPageTranslate('username'), value: staffDetail.username, key: 'username' },
    { label: hrPageTranslate('fullname'), value: staffDetail.name, key: 'fullname' },
    {
      label: hrPageTranslate('phone'),
      value: staffDetail.phone,
      key: 'phone'
    },
    {
      label: hrPageTranslate('location'),
      value: staffDetail.assignAllLocations
        ? hrPageTranslate('all-location')
        : (staffDetail.locations || []).map((location) => location.name).join(', '),
      key: 'location'
    },
    {
      label: hrPageTranslate('location-manage'),
      value: (staffDetail.locations || [])
        .filter((location) => location.operator)
        .map((location) => location.name)
        .join(', '),
      key: 'locationManaged'
    },
    { label: hrPageTranslate('status'), value: staffDetail.status || '', key: 'status' },
    { label: hrPageTranslate('permission'), value: staffDetail, key: 'permission' }
  ];

  const renderField = ({ label, value, key }, order) => {
    let valueJSX: JSX.Element;

    switch (key) {
      case 'status':
        valueJSX = <StatusChip status={value} />;
        break;
      case 'permission':
        valueJSX = (
          <Stack gap='16px' className='flex-1 overflow-hidden'>
            <Typography variant='body2' className=' text-ellipsis overflow-hidden'>
              {staffDetail?.permissionGroup?.name || ''}
            </Typography>
            {(functionGroupPermissions?.data?.content || []).map((fnGroupPermission) => {
              const staffPermissions = staffDetail?.permissionGroup?.permissionIds || [];
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
        <Typography variant='label3' className='w-[28%]'>
          {label}
        </Typography>
        {valueJSX}
      </div>
    );
  };

  return (
    <DialogCustom
      open={open}
      title={hrPageTranslate('personal-information')}
      maxWidth='800px'
      handleClose={onClose}
      footer={
        <div className='flex gap-4'>
          <ButtonCustom
            onClick={handleResetPassword}
            variant='outlined'
            startIcon={<Password />}
            className='!font-semibold'
          >
            <Typography variant='button3'>{hrPageTranslate('reset-password')}</Typography>
          </ButtonCustom>
          {hasEdit && (
            <ButtonCustom
              onClick={handleUpdateStaff}
              variant='contained'
              startIcon={<PencilSimple />}
              className='!bg-[var(--primary)] !text-[var(--white)] !font-semibold'
            >
              <Typography variant='button3'>{hrPageTranslate('update')}</Typography>
            </ButtonCustom>
          )}
        </div>
      }
      content={
        <div className='flex flex-col gap-6 px-[16px] py-[24px] h-[750px]'>
          <AvatarTableRow
            sx={{ width: '120px', height: '120px', alignSelf: 'center' }}
            avatarUrl={staffDetail?.avatarUrl}
          />
          <div className='flex flex-col'>{fields.map((data, index) => renderField(data, index))}</div>
        </div>
      }
    />
  );
}
