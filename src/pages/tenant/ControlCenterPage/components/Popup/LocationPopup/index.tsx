import { Typography, useMediaQuery, useTheme } from '@mui/material';
import { useContext, useEffect, useMemo, useState } from 'react';

import { AppContext } from '~/contexts/app.context';
import { CameraDetail } from '../AlertPopup';
import CarouselCustom from '~/components/Carousel';
import CommonInfoLocation from '../../CommonInfoLocation';
import DialogCustom from '~/components/DialogCustom';
import DrawerViewDetails from '~/components/Drawer/DrawerViewDetails';
import { useGetLocationDetail } from '~/pages/tenant/LocationPage/handleApi';
import { useTenantCode } from '~/utils/hooks/useTenantCode';
import { useTranslation } from 'react-i18next';
import { MenuItem } from '../../../../Dashboard/components/CustomWidgets/menu-item.component';
import { useNavigate } from 'react-router-dom';
import { useGetDashboards } from '../../../handleApi';

export default function LocationPopup() {
  const [locationTranslate] = useTranslation('', { keyPrefix: 'locationPage' });
  const [alarmTranslate] = useTranslation('', { keyPrefix: 'alarm-page' });
  const { openLocationPopup, setOpenLocationPopup } = useContext(AppContext);
  const [cameraList, setCameraList] = useState([]);
  const { tenantCode } = useTenantCode();
  const { data: detail } = useGetLocationDetail(openLocationPopup?.id, tenantCode);
  const handleClose = () => {
    setOpenLocationPopup(null);
  };

  const navigate = useNavigate();

  const { data } = useGetDashboards(detail?.data?.id, tenantCode);
  const dashboards = useMemo(() => data?.data || [], [data?.data]);

  useEffect(() => {
    if (detail) {
      setCameraList(detail?.data?.cameraList);
    }
  }, [detail?.data]);

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('tablet'));
  const title = alarmTranslate('location-information');

  const renderBody = () => (
    <div className="flex flex-col gap-4 p-3 tablet:px-4 tablet:py-4">

      {/* Top row: Common Info + Warning */}
      <div className="grid grid-cols-1 tablet:grid-cols-2 gap-4">
        {/* Common Info */}
        <div className="bg-[#161B29] p-3">
          <CommonInfoLocation info={openLocationPopup} />
        </div>

        {/* Warning */}
        <div className="bg-[#0D1117] p-3">
          <Typography variant="label1" className="text-white">
            {alarmTranslate("warning")}
          </Typography>
          <Typography variant="body2" className="text-[var(--text-secondary)]">
            {alarmTranslate("no-alarm")}
          </Typography>
        </div>
      </div>

      {/* Dashboard full row */}
      <div className="bg-[#161B29] p-3 flex flex-col flex-1">
        <Typography variant="label1" className="text-white mb-2">
          Dashboard
        </Typography>
        <div className="overflow-y-auto max-h-56 flex flex-col gap-1">
          {dashboards.length > 0 ? (
            dashboards.map((item) => (
              <MenuItem
                key={item.id}
                title={item.name}
                img={item.imageUrl}
                onClick={() => navigate(`/dashboard/${item.id}`)}
                tenantCode={tenantCode}
                data={item}
              />
            ))
          ) : (
            <Typography variant="body2" className="text-[var(--text-secondary)]">
              No dashboards
            </Typography>
          )}
        </div>
      </div>

      {/* Camera Section */}
      {cameraList?.length > 0 && (
        <div className="bg-[#0D1117] p-3">
          <Typography variant="label1" className="text-white mb-2">
            Camera
          </Typography>
          <CarouselCustom>
            {cameraList.map((deviceInfo, index) => (
              <div key={index} className="mx-2">
                <CameraDetail deviceInfo={deviceInfo} />
              </div>
            ))}
          </CarouselCustom>
        </div>
      )}
    </div>


  );


  return (
    <>
      {isTablet ? (
        <DrawerViewDetails title={title} open={openLocationPopup} onClose={handleClose}>
          {renderBody()}
        </DrawerViewDetails>
      ) : (
        <DialogCustom
          open={Boolean(openLocationPopup)}
          title={locationTranslate('location-information')}
          maxWidth='1280px'
          handleClose={handleClose}
          content={renderBody()}
        />
      )}
    </>
  );
}
