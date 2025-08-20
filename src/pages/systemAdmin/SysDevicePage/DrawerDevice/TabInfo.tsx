import { IconButton, ListItemIcon, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import MenuAutoClose, { MenuItemAutoClose } from '../../../../components/MenuOptions/MenuAutoClose';

import AvatarTableRow from '~/components/AvatarTableRow';
import ButtonCustom from '~/components/ButtonCustom';
import { DotsThree } from '@phosphor-icons/react';
import DrawerUpdateDevice from '../Drawer/DrawerUpdateDevice';
import DrawerWrapper from '../../../../components/Drawer/DrawerWrapper';
import IconPhosphor from '~/assets/iconPhosphor';
import MenuWrapper from '../../../../components/MenuOptions/MenuWrapper';
import PopupEdit from '../Popup/PupupEdit';
import PopupMQTT from '../Popup/PupupMQTT';
import StatusChip from '~/components/StatusChip';
import StatusConnect from '~/components/StatusConnect';
import { translationCapitalFirst } from '~/utils/translate';
import { useGetDataDeviceType } from '../../SysDeviceProfilePage/handleApi';

type Data = {
  key: string;
  lable: string;
  value: string;
};

export default function TabsInforDevice({ props }: { props: Record<string, any> }) {
  const translate = (text: string) => translationCapitalFirst(text, 'devicePage');
  const { dataDeviceTypeR } = useGetDataDeviceType({ keyword: '', page: 0, size: 1000 });

  const { id, code, token, deviceProfile, status, tenantInfo, locationInfo, alarmStatus } = props;

  const data: Data[] = [
    { key: 'status', lable: translate('status'), value: <StatusChip status={alarmStatus} /> },
    { key: 'connect', lable: translate('device-status'), value: <StatusConnect isConnect={status === 'CONNECTED'} /> },
    { key: 'iddevice', lable: translate('label-device-id'), value: String(code).padStart(4, '0') },
    { key: 'uuid', lable: 'UUID', value: id },
    { key: 'token', lable: translate('device-token'), value: token },
    { key: 'tenant', lable: translate('tenant'), value: tenantInfo?.name || '---' },
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
            <MenuWrapper>
              <MenuWrapper.Trigger>
                <IconButton>
                  <DotsThree />
                </IconButton>
              </MenuWrapper.Trigger>
              <MenuWrapper.Main>
                <MenuAutoClose open={false}>
                  <MenuItemAutoClose>
                    <DrawerWrapper.Trigger>
                      <Stack direction={"row"}>
                        <ListItemIcon>
                          <IconPhosphor iconName='PencilSimple' size={20} />
                        </ListItemIcon>
                        <Typography variant='body3'>{translationCapitalFirst('update')}</Typography>
                      </Stack>
                    </DrawerWrapper.Trigger>
                  </MenuItemAutoClose>
                  <PopupMQTT deviceId={id} />
                  <MenuItemAutoClose>
                    <Stack direction={"row"} onClick={() => navigator.clipboard.writeText(id)}>
                      <ListItemIcon>
                        <IconPhosphor iconName='CopySimple' size={20} />
                      </ListItemIcon>
                      <Typography variant='body3'>Copy UUID</Typography>
                    </Stack>
                  </MenuItemAutoClose>
                  <MenuItemAutoClose>
                    <Stack direction={"row"} onClick={() => navigator.clipboard.writeText(token)}>
                      <ListItemIcon>
                        <IconPhosphor iconName='CopySimple' size={20} />
                      </ListItemIcon>
                      <Typography variant='body3'>Copy Token</Typography>
                    </Stack>
                  </MenuItemAutoClose>
                </MenuAutoClose>
              </MenuWrapper.Main>
            </MenuWrapper>
            <DrawerWrapper.Main>
              <DrawerUpdateDevice />
            </DrawerWrapper.Main>
          </DrawerWrapper>
        ) : (
          <div className='flex justify-end items-center gap-4'>
            <ButtonCustom
              variant='outlined'
              className='gap-2'
              onClick={() => {
                navigator.clipboard.writeText(id);
              }}
            >
              <IconPhosphor iconName='CopySimple' size={20} />
              <Typography variant='button3'>Copy UUID</Typography>
            </ButtonCustom>
            <ButtonCustom
              variant='outlined'
              className='gap-2'
              onClick={() => {
                navigator.clipboard.writeText(token);
              }}
            >
              <IconPhosphor iconName='CopySimple' size={20} />
              <Typography variant='button3'>Copy Token</Typography>
            </ButtonCustom>
            <PopupMQTT deviceId={id} />
            <PopupEdit props={props} />
          </div>
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
            <div className='w-[70%] flex justify-start items-center h-full'>
              <Typography variant='body2'>{item.value}</Typography>
            </div>
          </div>
        );
      })}
    </div>
  );
}
