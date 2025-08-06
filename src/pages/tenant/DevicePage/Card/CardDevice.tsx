import Typography from '@mui/material/Typography';
import { IRowTableDeviceInterface } from '~/@types/deviceType/device.type';
import AvatarTableRow from '~/components/AvatarTableRow';
import { IconButton, ListItemIcon, Stack } from '@mui/material';
import StatusChip from '~/components/StatusChip';
import DrawerDeviceDetails from '../Drawer/DrawerDeviceDetails';
import IconPhosphor from '~/assets/iconPhosphor';
import { translationCapitalFirst } from '~/utils/translate';
import { DotsThree } from '@phosphor-icons/react';
import MenuWrapper from '~/components/MenuOptions/MenuWrapper';
import DrawerWrapper from '~/components/Drawer/DrawerWrapper';
import MenuAutoClose, { MenuItemAutoClose } from '~/components/MenuOptions/MenuAutoClose';
import CardCustom from '~/components/CardCustom';
import PopupRemoveDeviceByLocation from '../Popup/PopupRemoveDeviceByLocation';

export default function CardDevice(props: IRowTableDeviceInterface) {
  return (
    <CardCustom>
      <Stack direction={'row'} gap={'12px'}>
        <AvatarTableRow
          sx={{ height: '64px', width: '64px', borderRadius: '8px' }}
          avatarUrl={props.deviceProfileImageUrl}
        />
        <Stack className='w-full'>
          <Typography component='div' fontSize={14} fontWeight={600} lineHeight={'20px'} color={'#3A3D41'}>
            {props.deviceName}
          </Typography>
          <Typography component='div' fontSize={12} fontWeight={400} lineHeight={'18px'} color={'#737982'}>
            {props.code}
          </Typography>
          <StatusChip status={props.alarmStatus} />
        </Stack>
        <Stack>
          <DrawerWrapper>
            <MenuWrapper>
              <MenuWrapper.Trigger>
                <IconButton>
                  <DotsThree />
                </IconButton>
              </MenuWrapper.Trigger>
              <MenuWrapper.Main>
                {/* `open` will be overridden in MenuWrapper.Main */}
                <MenuAutoClose open={false}>
                  <MenuItemAutoClose>
                    <DrawerWrapper.Trigger>
                      <Stack direction={'row'}>
                        <ListItemIcon>
                          <IconPhosphor iconName='Info' size={20} />
                        </ListItemIcon>
                        <Typography variant='body3'>{translationCapitalFirst('show-infos')}</Typography>
                      </Stack>
                    </DrawerWrapper.Trigger>
                  </MenuItemAutoClose>
                  <PopupRemoveDeviceByLocation deviceToken={props.token} />
                </MenuAutoClose>
              </MenuWrapper.Main>
            </MenuWrapper>
            <DrawerWrapper.Main>
              <DrawerDeviceDetails {...props.dataIndex} />
            </DrawerWrapper.Main>
          </DrawerWrapper>
        </Stack>
      </Stack>
    </CardCustom>
  );
}
