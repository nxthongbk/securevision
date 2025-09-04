import { useState } from "react";
import {
  IconButton,
  ListItemIcon,
  Stack,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { DotsThree } from "@phosphor-icons/react";
import IconPhosphor from "~/assets/iconPhosphor";
import CardCustom from "~/components/CardCustom";
import DrawerWrapper from "~/components/Drawer/DrawerWrapper";
import MenuAutoClose, { MenuItemAutoClose } from "~/components/MenuOptions/MenuAutoClose";
import MenuWrapper from "~/components/MenuOptions/MenuWrapper";
import { translationCapitalFirst } from "~/utils/translate";
import PopupRemoveNoti from "../Popup/PopupRemoveNoti";
import DrawerUpsertNotification from "../Drawer/DrawerUpsertNotification";
import axios from "axios";

interface CardNotificationProps {
  id: string;
  updateTime: string;
  startTime: string;
  status: string;
  type: string;
  detail: string;
  token: string;
  deviceId: string;
  telemetryId: string;
  siteId: number;
  partitionId: number;
}

export default function CardNotification(props: CardNotificationProps) {
  const { type, detail, token, telemetryId, deviceId, siteId, partitionId } = props;

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
    open: false,
    message: "",
    severity: "success",
  });

  const handleCloseSnackbar = () => setSnackbar({ ...snackbar, open: false });

  const callSetArm = async (action: "arm" | "disarm" | "stay") => {
    try {
      const res = await axios.post("https://scity-dev.innovation.com.vn/api/alarm/setArm", {
        site_id: siteId,
        partition_id: partitionId,
        action: action,
      });
      console.log("✅ SetArm success:", res.data);
      setSnackbar({ open: true, message: `${action.toUpperCase()} thành công`, severity: "success" });
    } catch (err: any) {
      console.error("❌ SetArm error:", err.response?.data || err.message);
      setSnackbar({ open: true, message: `${action.toUpperCase()} thất bại`, severity: "error" });
    }
  };

  return (
    <CardCustom>
      <Stack direction="row">
        <Stack className="w-full">
          <Typography component="div" fontSize={14} fontWeight={600} lineHeight={"20px"} color={"#3A3D41"}>
            {type || "---"}
          </Typography>
          <Typography component="div" fontSize={12} fontWeight={400} lineHeight={"18px"} color={"#737982"}>
            {detail || "---"}
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
                {/* Update Notification */}
                <MenuItemAutoClose>
                  <DrawerWrapper.Trigger>
                    <Stack direction={"row"}>
                      <ListItemIcon>
                        <IconPhosphor iconName="PencilSimple" size={20} />
                      </ListItemIcon>
                      <Typography variant="body3">
                        {translationCapitalFirst("update")}
                      </Typography>
                    </Stack>
                  </DrawerWrapper.Trigger>
                </MenuItemAutoClose>

                {/* Arm */}
                <MenuItemAutoClose onClick={() => callSetArm("arm")}>
                  <Stack direction={"row"}>
                    <ListItemIcon>
                      <IconPhosphor iconName="ShieldCheck" size={20} />
                    </ListItemIcon>
                    <Typography variant="body3">Arm</Typography>
                  </Stack>
                </MenuItemAutoClose>

                {/* Disarm */}
                <MenuItemAutoClose onClick={() => callSetArm("disarm")}>
                  <Stack direction={"row"}>
                    <ListItemIcon>
                      <IconPhosphor iconName="ShieldSlash" size={20} />
                    </ListItemIcon>
                    <Typography variant="body3">Disarm</Typography>
                  </Stack>
                </MenuItemAutoClose>

                {/* Partial (Stay Arm) */}
                <MenuItemAutoClose onClick={() => callSetArm("stay")}>
                  <Stack direction={"row"}>
                    <ListItemIcon>
                      <IconPhosphor iconName="ShieldStar" size={20} />
                    </ListItemIcon>
                    <Typography variant="body3">Partial (Stay Arm)</Typography>
                  </Stack>
                </MenuItemAutoClose>

                {/* Remove Notification */}
                <PopupRemoveNoti deviceToken={token} />
              </MenuAutoClose>
            </MenuWrapper.Main>
          </MenuWrapper>
          <DrawerWrapper.Main>
            <DrawerUpsertNotification isUpdating={true} deviceId={deviceId} telemetryId={telemetryId} />
          </DrawerWrapper.Main>
        </DrawerWrapper>
      </Stack>

      {/* Snackbar feedback */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </CardCustom>
  );
}
