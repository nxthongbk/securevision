import DialogCustom from '~/components/DialogCustom';
import ButtonCustom from '~/components/ButtonCustom';
import { PencilSimple, Phone } from '@phosphor-icons/react';
import { Box, Stack, Typography } from '@mui/material';
import MarkerMap from '~/components/Marker';
import MapBox from '~/components/MapBox';
import { useGetLocationDetail } from '../handleApi';
import { useTranslation } from 'react-i18next';
import { UserRole } from '~/utils/constant';
import AvatarTableRow from '~/components/AvatarTableRow';

export default function PopupLocationDetail({
  locationId,
  tenantCode,
  onEdit,
  userRole,
  forceOpen,
  onClose,
  hasEdit
}: Readonly<{
  locationId: string;
  tenantCode: string;
  onEdit: () => void;
  userRole: UserRole;
  forceOpen?: boolean;
  onClose?: () => void;
  hasEdit: boolean;
}>) {
  const [locationTranslate] = useTranslation('', { keyPrefix: 'locationPage' });
  const { data } = useGetLocationDetail(locationId, tenantCode);
  const isAdmin = userRole === UserRole.SYSADMIN;

  const handleClose = () => {
    onClose();
  };

  const handleUpdateLocation = () => {
    handleClose();
    onEdit();
  };

  const locationDetail = data?.data || {};

  const fields = [
    { key: 'ID', value: locationDetail.code && String(locationDetail.code).padStart(4, '0') },
    { key: locationTranslate(isAdmin ? 'location-capitalize' : 'name'), value: locationDetail.name },
    { key: locationTranslate('address-capitalize'), value: locationDetail.address },
    {
      key: locationTranslate('coordinate'),
      value: `${locationDetail.location?.latitude}, ${locationDetail.location?.longitude}`
    },
    {
      key: locationTranslate('total-devices'),
      value: locationDetail.devices?.total || 0
    },
    { key: locationTranslate('manager'), value: locationDetail.operatorInfo, isTenantInfo: true }
  ];

  const renderField = (label, value, order, isTenantInfo) => {
    const tenantBlock = (
      <Stack direction='row' gap='8px' className='flex-1 overflow-hidden'>
        <AvatarTableRow
          sx={{ width: '32px', height: '32px', alignSelf: 'center', borderRadius: '4px !important' }}
          avatarUrl={locationDetail?.operatorInfo?.avatarUrl}
        />
        <Stack overflow='hidden'>
          <Typography variant='body3' textOverflow='ellipsis' overflow='hidden' className='flex-1 whitespace-nowrap'>
            {value?.name}
          </Typography>
          <Box className='flex gap-0.5'>
            <Phone size={16} color='var(--text-secondary)' />
            <Typography variant='caption1' color='var(--text-secondary)'>
              {value?.phone}
            </Typography>
          </Box>
        </Stack>
      </Stack>
    );

    return (
      <div
        className={`flex w-full px-[12px] py-[12px] ${order % 2 === 0 ? ' bg-[var(--grey-primary-60)] rounded-md' : ''}`}
      >
        <Typography variant='label3' className='w-[28%]'>
          {label}
        </Typography>
        {isTenantInfo ? (
          tenantBlock
        ) : (
          <Typography variant='body3' className='flex-1 text-ellipsis overflow-hidden'>
            {value}
          </Typography>
        )}
      </div>
    );
  };

  return (
    <DialogCustom
      open={forceOpen}
      title={locationTranslate('location-information')}
      maxWidth='800px'
      handleClose={handleClose}
      footer={
        hasEdit ? (
          <div className='flex gap-4'>
            <ButtonCustom
              onClick={handleUpdateLocation}
              variant='contained'
              startIcon={<PencilSimple />}
              className='!bg-[var(--primary)] !text-[var(--white)] !font-semibold'
            >
              <Typography variant='button3'>{locationTranslate('update')}</Typography>
            </ButtonCustom>
          </div>
        ) : null
      }
      content={
        <div className='flex flex-col gap-6 px-[16px] py-[24px]'>
          <AvatarTableRow
            sx={{ width: '120px', height: '120px', alignSelf: 'center' }}
            avatarUrl={locationDetail?.imageUrl}
          />
          <div className='flex flex-col'>
            {fields.map((data, index) => renderField(data.key, data.value, index, data?.isTenantInfo))}
          </div>
          <div className='w-full h-[412px] border border-[var(--grey-neutral-100)] rounded-lg overflow-hidden'>
            {locationDetail.location && (
              <MapBox
                initialViewState={{
                  longitude: locationDetail.location.longitude,
                  latitude: locationDetail.location.latitude,
                  zoom: 14
                }}
                mapStyle={'mapbox://styles/mapbox/streets-v12'}
              >
                <MarkerMap
                  status='ACTIVE'
                  longitude={locationDetail.location.longitude}
                  latitude={locationDetail.location.latitude}
                />
              </MapBox>
            )}
          </div>
        </div>
      }
    />
  );
}
