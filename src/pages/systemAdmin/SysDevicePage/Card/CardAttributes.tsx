import IconPhosphor from '~/assets/iconPhosphor';
import { translationCapitalFirst } from '~/utils/translate';
import { FormatTime } from '~/utils/formatDateTime';
import PopupDeleteAttributeDevice from '../Popup/PopupDeleteAttributeDevice';
import { DotsThree } from '@phosphor-icons/react';
import { IconButton, ListItemIcon, Stack, Typography } from '@mui/material';
import MenuWrapper from '../../../../components/MenuOptions/MenuWrapper';
import MenuAutoClose, { MenuItemAutoClose } from '../../../../components/MenuOptions/MenuAutoClose';
import DrawerWrapper from '../../../../components/Drawer/DrawerWrapper';
import DrawerUpsertAtrribute from '../Drawer/DrawerUpsertAtrribute';
import CardCustom from '../../../../components/CardCustom';

interface CardAttributesProps {
  deviceId: string;
  key: string;
  value: string;
  time: string;
}

export default function CardAttributes(props: CardAttributesProps) {
  const { deviceId, key, time } = props;

  return (
    <CardCustom>
      <Stack direction='row'>
        <Stack className='w-full'>
          <Typography component='div' fontSize={14} fontWeight={600} lineHeight={'20px'} color={'#3A3D41'}>
            {key || '---'}
          </Typography>
          <Typography component='div' fontSize={12} fontWeight={400} lineHeight={'18px'} color={'#737982'}>
            {FormatTime(new Date(time))}
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
                        <IconPhosphor iconName='PencilSimple' size={20} />
                      </ListItemIcon>
                      <Typography variant='body3'>{translationCapitalFirst('update')}</Typography>
                    </Stack>
                  </DrawerWrapper.Trigger>
                </MenuItemAutoClose>
                <PopupDeleteAttributeDevice deviceId={deviceId} keyAtrribute={key} />
              </MenuAutoClose>
            </MenuWrapper.Main>
          </MenuWrapper>
          <DrawerWrapper.Main>
            <DrawerUpsertAtrribute isUpdating {...props} />
          </DrawerWrapper.Main>
        </DrawerWrapper>
      </Stack>
    </CardCustom>
  );
}
