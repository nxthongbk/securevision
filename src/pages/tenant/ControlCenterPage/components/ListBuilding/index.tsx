import { Divider, Typography } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AvatarTableRow from '~/components/AvatarTableRow';
import { AppContext } from '~/contexts/app.context';

import SelectedIcon from '~/assets/uisvg/ListBuildingSVG/selected.svg';
import UnselectedIcon from '~/assets/uisvg/ListBuildingSVG/unselected.svg';
import AlarmSelectedIcon from '~/assets/uisvg/ListBuildingSVG/alarmSelected.svg';
import AlarmUnselectedIcon from '~/assets/uisvg/ListBuildingSVG/alarmUnselected.svg';
// import HeaderIcon from '~/assets/uisvg/ListBuildingSVG/header.svg';

interface ItemBuilding {
  name: string;
  status: string;
  isSelected?: boolean;
  warningDevice: number;
  totalDevice: number;
  onClick?: any;
  imageUrl?: string;
}

function ItemBuilding({
  name,
  status,
  warningDevice,
  totalDevice,
  onClick,
  imageUrl,
  isSelected = false
}: Readonly<ItemBuilding>) {
  // Pick the correct SVG for container
  let SvgBackground;
  if (status === 'ALARM' && isSelected) {
    SvgBackground = AlarmSelectedIcon;
  } else if (status === 'ALARM' && !isSelected) {
    SvgBackground = AlarmUnselectedIcon;
  } else if (isSelected) {
    SvgBackground = SelectedIcon;
  } else {
    SvgBackground = UnselectedIcon;
  }

  return (
    <div onClick={onClick} className="cursor-pointer w-full">
      <svg width="100%" height="88" viewBox="0 0 336 88" xmlns="http://www.w3.org/2000/svg">
        {/* SVG as the card background */}
        <image href={SvgBackground} width="336" height="88" />

        {/* Content inside SVG */}
        <foreignObject x="0" y="0" width="336" height="88">
          <div className="w-full h-full flex items-center gap-3 px-4 py-3">
            <AvatarTableRow
              avatarUrl={imageUrl}
              sx={{ width: '56px', height: '56px', borderRadius: '10px !important' }}
            />
            <div className="flex-1 min-w-0">
              <Typography variant="label2" className="word-wrap text-[17px] text-white">
                {name}
              </Typography>
              <Typography variant="body3" className="truncate opacity-80 text-white">
                ({warningDevice}/{totalDevice})
              </Typography>
            </div>
          </div>
        </foreignObject>
      </svg>
    </div>
  );
}

export default function ListBuilding({ data, mapRef, closeDialog }: { data: any[]; mapRef: any; closeDialog?: any }) {
  const { selectedFilter, setOpenMarkerPopup, openMarkerPopup } = useContext(AppContext);
  const [warningData, setWarningData] = useState<any>([]);
  const { t } = useTranslation('');

  useEffect(() => {
    const newData = data?.filter((item) => item.status === 'ALARM');
    setWarningData(newData);
  }, [data]);

  const moveToBuilding = (item) => {
    if (mapRef.current) {
      const longitude = item?.location?.longitude;
      const latitude = item?.location?.latitude;
      mapRef.current?.flyTo({ center: [longitude, latitude], duration: 1500, essential: true, zoom: 17 });
      setOpenMarkerPopup(item);
    }
  };

  return (
    <div
      className="h-[87vh] overflow-y-auto flex flex-col gap-3 px-2 
      scrollbar-none
      [-ms-overflow-style:none] 
      scrollbar-width:none 
      [&::-webkit-scrollbar]:hidden
      [&::-webkit-scrollbar]:w-0
      [&::-webkit-scrollbar-track]:bg-transparent
      [&::-webkit-scrollbar-thumb]:bg-transparent"
    >
      {/* ALARM section */}
      {warningData?.length > 0 && (
        <>
          <div style={{ display: selectedFilter.includes('ALARM') ? 'block' : 'none' }}>
            <div className="sticky top-0 z-10 -mx-2 px-2 py-2 bg-[rgba(8,16,26,0.9)] backdrop-blur">
              <Typography variant="label2" className="tracking-wide text-[#36BFFA]">
                {t('alarm-locations')} ({warningData?.length})
              </Typography>
            </div>

            <div className="flex flex-col gap-1 mt-1">
              {warningData.map((item: Record<string, any>) => (
                <ItemBuilding
                  key={item.id}
                  name={item.name}
                  status={item.status}
                  isSelected={item.id === openMarkerPopup?.id}
                  warningDevice={item?.devices?.totalActive}
                  totalDevice={item?.devices?.total}
                  imageUrl={item.imageUrl}
                  onClick={() => {
                    closeDialog && closeDialog();
                    moveToBuilding(item);
                  }}
                />
              ))}
            </div>
          </div>
          <Divider className="opacity-20" />
        </>
      )}

      {/* ACTIVE section */}
      <div style={{ display: !selectedFilter.includes('ACTIVE') ? 'none' : 'block' }}>
        <div className="sticky top-0 z-10 -mx-2 px-2 py-2 bg-[rgba(8,16,26,0.9)] backdrop-blur">
          <Typography variant="label2" className="tracking-wide text-[#36BFFA]">
            {t('all-locations')} ({data?.length}) 
          </Typography>
        </div>

        <div className="flex flex-col gap-2 mt-1">
          {data.map((item: Record<string, any>) => (
            <ItemBuilding
              key={item.id}
              name={item.name}
              status={item.status}
              isSelected={item.id === openMarkerPopup?.id}
              warningDevice={item?.devices?.totalActive}
              totalDevice={item?.devices?.total}
              imageUrl={item.imageUrl}
              onClick={() => {
                closeDialog && closeDialog();
                moveToBuilding(item);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
