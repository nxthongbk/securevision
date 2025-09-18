import { Box, Tabs, Tab, Typography, useMediaQuery, useTheme } from '@mui/material';
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
  const { t } = useTranslation()
  const [alarmTranslate] = useTranslation('', { keyPrefix: 'alarm-page' });
  const { openLocationPopup, setOpenLocationPopup } = useContext(AppContext);
  const [cameraList, setCameraList] = useState([]);
  const { tenantCode } = useTenantCode();
  const { data: detail } = useGetLocationDetail(openLocationPopup?.id, tenantCode);
  const { data } = useGetDashboards(detail?.data?.id, tenantCode);
  const dashboards = useMemo(() => data?.data || [], [data?.data]);
  const navigate = useNavigate();

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('tablet'));
  const title = locationTranslate('location-information');

  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (detail) setCameraList(detail?.data?.cameraList || []);
  }, [detail?.data]);

  const handleClose = () => setOpenLocationPopup(null);

  const renderBody = () => (
    <Box>
      {/* Tabs */}
      <Tabs value={tabIndex} onChange={(_, newValue) => setTabIndex(newValue)} sx={{ borderBottom: '1px solid var(--border-color)' }}>
        <Tab label={t('alarm-page.location')} />
        <Tab label={t('alarm-page.device')} />
        <Tab label={("Dashboard")} />
      </Tabs>

      {/* Location Tab */}
      {tabIndex === 0 && (
        <Box className="flex flex-col gap-4 p-4">
          <Box className="bg-[#161B29] p-3">
            <CommonInfoLocation info={openLocationPopup} />
          </Box>
          <Box className="bg-[#0D1117] p-3 rounded-md">
            <Typography variant="label1" className="text-white">{alarmTranslate("warning")}</Typography>
            <Typography variant="body2" className="text-[var(--text-secondary)]">{alarmTranslate("no-alarm")}</Typography>
          </Box>
        </Box>
      )}

      {/* Devices Tab */}
      {tabIndex === 1 && (
        <Box className="bg-[#0D1117] p-3">
          {cameraList?.length > 0 ? (
            <CarouselCustom>
              {cameraList.map((deviceInfo, index) => (
                <div key={index} className="mx-2">
                  <CameraDetail deviceInfo={deviceInfo} />
                </div>
              ))}
            </CarouselCustom>
          ) : (
            <Typography className="text-[var(--text-secondary)]">No devices found</Typography>
          )}
        </Box>
      )}

      {/* Dashboards Tab */}
      {tabIndex === 2 && (
        <Box className="flex flex-col gap-3 bg-[#161B29] p-3">
          <Typography variant="label1" className="text-white">Dashboard</Typography>
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
              <Typography variant="body2" className="text-[var(--text-secondary)]">No dashboards</Typography>
            )}
          </div>
        </Box>
      )}
    </Box>
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
          title={title}
          maxWidth={1280}
          handleClose={handleClose}
          content={renderBody()}
        />
      )}
    </>
  );
}
