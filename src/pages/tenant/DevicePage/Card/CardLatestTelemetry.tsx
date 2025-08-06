import { IconButton, ListItemIcon, Stack, Typography } from '@mui/material';
import IconPhosphor from '~/assets/iconPhosphor';
import { translation } from '~/utils/translate';
import { DotsThree } from '@phosphor-icons/react';
import DrawerViewLatestTelemetryDetails from '../Drawer/DrawerViewDetailsLatestTelemetry';
import CardCustom from '~/components/CardCustom';
import DrawerWrapper from '~/components/Drawer/DrawerWrapper';
import MenuWrapper from '~/components/MenuOptions/MenuWrapper';
import MenuAutoClose, { MenuItemAutoClose } from '~/components/MenuOptions/MenuAutoClose';

export interface CardLatestTelemetryProps {
  id: string;
  key: string;
  value: string;
  time: string;
}

export default function CardLatestTelemetry(props: CardLatestTelemetryProps) {
  return (
    <CardCustom>
      <Stack direction={'row'}>
        <Stack className='w-full'>
          <Typography component='div' fontSize={14} fontWeight={600} lineHeight={'20px'} color={'#3A3D41'}>
            {props.key || '---'}
          </Typography>
          <Typography component='div' fontSize={12} fontWeight={400} lineHeight={'18px'} color={'#737982'}>
            {props.value}
          </Typography>
        </Stack>
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
              </MenuAutoClose>
            </MenuWrapper.Main>
          </MenuWrapper>
          <DrawerWrapper.Main>
            <DrawerViewLatestTelemetryDetails data={props} />
          </DrawerWrapper.Main>
        </DrawerWrapper>
      </Stack>
    </CardCustom>
  );
}
