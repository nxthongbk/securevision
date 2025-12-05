import { Box, Button, Divider, Typography, useMediaQuery, useTheme } from '@mui/material';
import { Popup } from 'react-map-gl';
import './style.scss';
import { useContext } from 'react';
import { AppContext } from '~/contexts/app.context';
import ButtonCustom from '~/components/ButtonCustom';
import BuildingImg from '~/assets/images/jpg/DemoBuilding.jpg';
import AvatarTableRow from '~/components/AvatarTableRow';
import { useTranslation } from 'react-i18next';
import { translation } from '~/utils/translate';
import DrawerCustom from '~/components/Drawer/DrawerCustom';
import { useGetLatestTelemetry } from '~/pages/tenant/DevicePage/handleApi';

export default function PopupMarker() {
  const { t } = useTranslation();
  const { openMarkerPopup, setOpenLocationPopup, setOpenPendingPopup, setOpenAlertPopup, setOpenMarkerPopup } =
    useContext(AppContext);

  const handleClickOpenPopupDetail = () => {
    if (['ACTIVE', 'CONFIRM', 'IGNORE'].includes(openMarkerPopup.status)) setOpenLocationPopup(openMarkerPopup);
    if (openMarkerPopup.status === 'ALARM') setOpenAlertPopup(openMarkerPopup);
    if (openMarkerPopup.status === 'PENDING') setOpenPendingPopup(openMarkerPopup);
  };

  const onClose = () => {
    setOpenMarkerPopup(null);
  };

  const renderBuildingImage = () => {
    if (openMarkerPopup?.imageUrl) {
      return (
        <AvatarTableRow
          avatarUrl={openMarkerPopup.imageUrl}
          sx={{ width: '76px', height: '76px', borderRadius: '4px !important' }}
        />
      );
    }
    return <img className='w-[72px] h-[72px] rounded' src={BuildingImg} />;
  };

  const { data: initLatestTelemetry } = useGetLatestTelemetry({
    entityType: 'DEVICE',
    entityId: openMarkerPopup?.id
  });

  const getTelemetryValue = (field) => {
    return initLatestTelemetry?.data?.data?.[field]?.value ?? '';
  };

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('tablet'));
  const title = translation('tenant-infor', 'tenantPage');

  const renderBody = () => (
    <>
      <div className='flex w-full gap-[12px] p-0 tablet:p-4'>
        {renderBuildingImage()}
        <div className='max-w-full tablet:max-w-[172px] mt-[-4px]'>
          <Typography variant='label2' display='block' className='text-[#36BFFA] !important'>
            {openMarkerPopup?.name}
          </Typography>
          <Typography variant='body3'>{openMarkerPopup?.address}</Typography>
        </div>
      </div>
      {!isTablet && <Divider />}
      <div className='p-0 tablet:px-4 pt-4 tablet:pb-3'>
        <div className='flex flex-col gap-1.5'>
          {/* <div className='flex'>
            <Typography variant='label3' display='block' className='flex-1'>
              ID:
            </Typography>
            <Typography variant='body3' display='block' className='flex-1'>
              {openMarkerPopup?.code ? String(openMarkerPopup.code).padStart(4, '0') : ''}
            </Typography>
          </div> */}
          <div className='flex'>
            <Typography variant='label3' display='block' className='flex-1'>
              {t('locationPage.manager')}:
            </Typography>
            <Typography variant='body3' display='block' className='flex-1'>
              {openMarkerPopup?.operatorInfo?.name}
            </Typography>
          </div>
          <div className='flex'>
            <Typography variant='label3' display='block' className='flex-1'>
              {t('user-page.phone')}:
            </Typography>
            <Typography variant='body3' display='block' className='flex-1'>
              {openMarkerPopup?.operatorInfo?.phone}
            </Typography>
          </div>

          {(getTelemetryValue('car') || getTelemetryValue('motorBike')) && (
            <div className='flex flex-col gap-2'>
              <div className='flex'>
                <Typography variant='label3' display='block' className='flex-1'>
                  {t('Car')}:
                </Typography>
                <Typography variant='body3' display='block' className='flex-1'>
                  {getTelemetryValue('car') || 0}
                </Typography>
              </div>
              <div className='flex'>
                <Typography variant='label3' display='block' className='flex-1'>
                  {t('Motor Bike')}:
                </Typography>
                <Typography variant='body3' display='block' className='flex-1'>
                  {getTelemetryValue('motorBike') || 0}
                </Typography>
              </div>
            </div>
          )}
          {getTelemetryValue('image') && (
            <div className='w-full object-cover rounded-lg overflow-hidden'>
              <img src={getTelemetryValue('image')} alt='Building' className='w-full h-auto object-cover' />
            </div>
          )}
        </div>
      </div>
    </>
  );

  return (
    <>
      {isTablet ? (
        <DrawerCustom
          className='h-[50vh]'
          title={title}
          sx={{ height: '50vh' }}
          open={openMarkerPopup}
          onClose={onClose}
        >
          <DrawerCustom.Body>{renderBody()}</DrawerCustom.Body>
          <DrawerCustom.Action>
            <Box sx={{ padding: 1, textAlign: 'center' }}>
              <Button fullWidth variant='contained' color='primary' onClick={handleClickOpenPopupDetail}>
                {translation('view-detail')}
              </Button>
            </Box>
          </DrawerCustom.Action>
        </DrawerCustom>
      ) : (
        <Popup
          longitude={openMarkerPopup?.location?.longitude}
          latitude={openMarkerPopup?.location?.latitude}
          onClose={onClose}
          className='!top-[-30px] min-w-[320px]'
        >
          <div className='!cursor-pointer'>
            <div className='flex flex-col w-full gap-[12px] p-4'>
              {renderBody()}
              <ButtonCustom
                onClick={handleClickOpenPopupDetail}
                variant='contained'
                className='w-full !min-h-[40px] !mt-3 !bg-[#36BFFA3D] !rounded-none'
              >
                <Typography variant='button3' color='white'>
                  {t('view-detail')}
                </Typography>
              </ButtonCustom>
            </div>
          </div>
        </Popup>
      )}
    </>
  );
}
