import { Divider, Typography } from '@mui/material';
import classNames from 'classnames';
import { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AvatarTableRow from '~/components/AvatarTableRow';
import { AppContext } from '~/contexts/app.context';

interface IItemBuilding {
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
}: Readonly<IItemBuilding>) {
  const className = classNames(
    'w-full min-h-9 rounded-md flex items-center px-2 py-2 gap-2 cursor-pointer hover:text-[var(--blue-600)] hover:bg-[var(--blue-60)]',
    {
      'bg-[var(--red-60)] text-[var(--alert)] hover:text-white hover:bg-[var(--red-600)]': status === 'ALARM'
    },
    {
      'bg-[var(--blue-500)] text-[var(--white)] hover:text-white hover:bg-[var(--blue-500)]':
        isSelected && status !== 'ALARM'
    }
  );
  return (
    <div onClick={onClick} className={className}>
      <AvatarTableRow avatarUrl={imageUrl} sx={{ width: '30px', height: '30px', borderRadius: '4px !important' }} />
      <div className='w-[203px] truncate'>
        <Typography variant='label3'>{name}</Typography>
      </div>
      <Typography variant='body3'>
        ({warningDevice}/{totalDevice})
      </Typography>
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
    <div className='mt-4 overflow-y-scroll h-[87vh] gap-4 flex flex-col'>
      {warningData?.length > 0 && (
        <>
          <div style={{ display: selectedFilter.includes('ALARM') ? 'block' : 'none' }}>
            <Typography variant='label2'>
              {t('fire-locations')}({warningData?.length})
            </Typography>
            <div className='flex flex-col gap-1 mt-2'>
              {(warningData || []).map((item: Record<string, any>) => {
                return (
                  <ItemBuilding
                    key={item.id}
                    name={item.name}
                    status={item.status}
                    warningDevice={item?.devices?.totalActive}
                    totalDevice={item?.devices?.total}
                    onClick={() => {
                      closeDialog && closeDialog();
                      moveToBuilding(item);
                    }}
                  />
                );
              })}
            </div>
          </div>
          <Divider />
        </>
      )}

      <div style={{ display: !selectedFilter.includes('ACTIVE') ? 'none' : 'block' }}>
        <Typography variant='label2' className='mb-2'>
          {t('all-locations')} ({data?.length})
        </Typography>
        <div className='flex flex-col gap-1 mt-2'>
          {(data || [])?.map((item: Record<string, any>) => (
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
