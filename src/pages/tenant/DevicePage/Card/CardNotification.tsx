import { IconButton, ListItemIcon, Stack, Typography } from "@mui/material";
import { DotsThree } from "@phosphor-icons/react";
import IconPhosphor from "~/assets/iconPhosphor";
import CardCustom from "~/components/CardCustom";
import DrawerWrapper from "~/components/Drawer/DrawerWrapper";
import MenuAutoClose, { MenuItemAutoClose } from "~/components/MenuOptions/MenuAutoClose";
import MenuWrapper from "~/components/MenuOptions/MenuWrapper";
import { translationCapitalFirst } from "~/utils/translate";
import PopupRemoveNoti from "../Popup/PopupRemoveNoti";
import DrawerUpsertNotification from "../Drawer/DrawerUpsertNotification";

interface CardNotificationProps {
    id: string
    updateTime: string
    startTime: string
    status: string
    type: string
    detail: string
    token: string
    deviceId: string
    telemetryId: string
}

export default function CardNotification(props: CardNotificationProps) {
  const {type, detail, token, telemetryId, deviceId} = props;

  return (
    <CardCustom>
      <Stack direction='row'>
        <Stack className='w-full'>
          <Typography component='div' fontSize={14} fontWeight={600} lineHeight={'20px'} color={'#3A3D41'}>
            {type || '---'}
          </Typography>
          <Typography component='div' fontSize={12} fontWeight={400} lineHeight={'18px'} color={'#737982'}>
            {detail}
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
                <PopupRemoveNoti deviceToken={token} />
              </MenuAutoClose>
            </MenuWrapper.Main>
          </MenuWrapper>
          <DrawerWrapper.Main>
            <DrawerUpsertNotification isUpdating={true} deviceId={deviceId} telemetryId={telemetryId} />
          </DrawerWrapper.Main>
        </DrawerWrapper>
      </Stack>
    </CardCustom>
  )
}
