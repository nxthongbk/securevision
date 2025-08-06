import { IconButton, Typography, useMediaQuery, useTheme } from '@mui/material';

import AvatarTableRow from '~/components/AvatarTableRow';
import DrawerUpdateDevice from '../../Drawer/DrawerUpdateDevice';
import DrawerWrapper from '~/components/Drawer/DrawerWrapper';
import IconPhosphor from '~/assets/iconPhosphor';
import PopupEdit from '../../Popup/TenantView/PupupEdit';
import StatusChip from '~/components/StatusChip';
import StatusConnect from '~/components/StatusConnect';
import { translationCapitalFirst } from '~/utils/translate';
import { useGetDataDeviceType } from '~/pages/systemAdmin/SysDeviceProfilePage/handleApi';

type Data = {
  key: string;
  lable: string;
  value: string;
};

export default function TabsInforDevice({ props, hasEdit }: { props: Record<string, any>; hasEdit: boolean }) {
  const translate = (text: string) => translationCapitalFirst(text, 'devicePage');
  const { dataDeviceTypeR } = useGetDataDeviceType({ keyword: '', page: 0, size: 1000 });

  const { code, id, deviceProfile, status, locationInfo, alarmStatus } = props;

  const data: Data[] = [
    { key: 'status', lable: translate('status'), value: <StatusChip status={alarmStatus} /> },
    { key: 'connect', lable: translate('device-status'), value: <StatusConnect isConnect={status === 'CONNECTED'} /> },
    { key: 'iddevice', lable: translate('label-device-id'), value: String(code).padStart(4, '0') },
    { key: 'uiiddevice', lable: 'UIID', value: String(id) },
    { key: 'location', lable: translate('location'), value: locationInfo?.name || '---' },
    { key: 'deviceProfile', lable: translate('device-profile'), value: deviceProfile?.name },
    {
      key: 'type',
      lable: translate('device-type'),
      value: (dataDeviceTypeR?.data?.content || []).find((type) => type.id === deviceProfile?.typeId)?.label || ''
    },
    { key: 'waitingTime', lable: translate('time-waiting'), value: deviceProfile?.signalWaitingTime / 60000 + ' phút' },
    {
      key: 'description',
      lable: translate('description'),
      value: deviceProfile?.description
    }
  ];

  const theme = useTheme();
  const isTablet = useMediaQuery(theme.breakpoints.down('tablet'));

  return (
    <div className='w-full flex flex-col justify-start'>
      <div className='h-[132px] flex justify-between items-start'>
        <AvatarTableRow avatarUrl={deviceProfile?.imageUrl} sx={{ width: '120px', height: '120px' }} />
        {isTablet ? (
          <DrawerWrapper>
            <DrawerWrapper.Trigger>
              <IconButton>
                <IconPhosphor iconName='PencilSimple' size={20} />
              </IconButton>
            </DrawerWrapper.Trigger>
            <DrawerWrapper.Main>
              <DrawerUpdateDevice />
            </DrawerWrapper.Main>
          </DrawerWrapper>
        ) : (
          <div className='flex justify-end items-center gap-4'>{hasEdit && <PopupEdit props={props} />}</div>
        )}
      </div>
      {data?.map((item: Data, idx: number) => {
        return (
          <div
            key={idx}
            className={`w-full flex justify-start items-start py-3 px-4 rounded-md ${idx % 2 === 0 ? ' bg-[var(--grey-primary-60)]' : ''}`}
          >
            <div className='w-[30%]'>
              <Typography variant='label2'>{item.lable}</Typography>
            </div>
            <div className='w-[70%] flex justify-start items-center'>
              <Typography variant='body2'>{item.value}</Typography>
            </div>
          </div>
        );
      })}
    </div>
  );
}
