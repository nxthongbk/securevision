import Typography from '@mui/material/Typography';
import { IconButton, ListItemIcon, Stack } from '@mui/material';
import StatusChip from '~/components/StatusChip';
import IconPhosphor from '~/assets/iconPhosphor';
import { translation, translationCapitalFirst } from '~/utils/translate';
import PopupTurnOffAlarmDevice from '../Popup/PopupTurnOfffAlarmDevice';
import CardCustom from '../../../../components/CardCustom';
import DrawerWrapper from '../../../../components/Drawer/DrawerWrapper';
import MenuWrapper from '../../../../components/MenuOptions/MenuWrapper';
import MenuAutoClose, { MenuItemAutoClose } from '../../../../components/MenuOptions/MenuAutoClose';
import { DotsThree } from '@phosphor-icons/react';
import DrawerViewDetailsAlarm from '../Drawer/DrawerViewDetailsAlarm';

export interface CardAlarmProps {
  token: string;
  detail: string;
  id: string;
  startTime: string;
  status: string;
  type: string;
  updateTime: string;
}

export default function CardAlarm(props: CardAlarmProps) {
  return (
    <CardCustom>
      <Stack direction={'row'}>
        <Stack className='w-full' gap={'4px'}>
          <Typography component='div' fontSize={14} fontWeight={600} lineHeight={'20px'} color={'#3A3D41'}>
            {props.type}
          </Typography>
          <Typography component='div' fontSize={12} fontWeight={400} lineHeight={'18px'} color={'#737982'}>
            {`${translationCapitalFirst('update')}: ${props.updateTime}`}
          </Typography>
          <StatusChip status={props.status} />
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
                <MenuAutoClose open={false}>
                  <MenuItemAutoClose>
                    <DrawerWrapper.Trigger>
                      <Stack direction={'row'}>
                        <ListItemIcon>
                          <IconPhosphor iconName='Info' size={20} />
                        </ListItemIcon>
                        <Typography variant='body3'>{translation('view-info', 'devicePage')}</Typography>
                      </Stack>
                    </DrawerWrapper.Trigger>
                  </MenuItemAutoClose>
                  {props.status === 'ALARM' && <PopupTurnOffAlarmDevice type={props.type} token={props.token} />}
                </MenuAutoClose>
              </MenuWrapper.Main>
            </MenuWrapper>
            <DrawerWrapper.Main>
              <DrawerViewDetailsAlarm data={props} />
            </DrawerWrapper.Main>
          </DrawerWrapper>
        </Stack>
      </Stack>
    </CardCustom>
  );
}
