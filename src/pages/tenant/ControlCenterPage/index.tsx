import { Box, useMediaQuery } from "@mui/material";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AppContext } from "~/contexts/app.context";
import DataGridHeader from "~/components/DataGrid/DataGridHeader";
import IconPhosphor from "~/assets/iconPhosphor";
import ListBuilding from "./components/ListBuilding";
import SearchBox from "./components/SearchBox";
import SockJS from "sockjs-client";
import Sound from "~/assets/videos/fire-alarm-33770.mp3";
import Stomp from "stompjs";
import theme from "~/assets/theme";
import useDebounce from "~/utils/hooks/useDebounce";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useGetDataDevice } from "../DevicePage/handleApi";
import DeviceDashboardBottom from "./components/BottomMain";
import CustomMap from "~/components/LeafletMapBox";
import { popupStyles } from "./styled";
import { MapRef } from "react-map-gl";
import { difference, isEmpty } from "lodash";

const SOCKET_URL = import.meta.env.VITE_API_HOST + "/websocket/ws";

export default function ControlCenterPage() {
  const queryClient = useQueryClient();
  const {
    userInfo,
    setOpenMarkerPopup,
    setViewportMapRight,
    viewportMapRight,
  } = useContext(AppContext);
  const { t } = useTranslation();
  const hasNewAlarmRef = useRef<boolean>(false);

  const [keyword, setKeyword] = useState("");
  const keywordDebounce = useDebounce(keyword, 500);
  // const { data } = useGetLocationMap({ tenantCode, keyword: keywordDebounce });
  const { data } = useGetDataDevice({
    page: 0,
    size: 1000,
    keyword: keywordDebounce,
  });
  const timeoutId = useRef<NodeJS.Timeout>();
  const socket = new SockJS(SOCKET_URL);
  const mapRefRight = useRef<MapRef>();
  const [socketData, setSocketData] = useState<any>();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const alarmLocationIdsRef = useRef<string[]>([]);
  const hasAutoFocused = useRef(false);

  const locations = useMemo(
    () => data?.data?.content || [],
    [data?.data?.content]
  );

  console.log(socketData);

  useEffect(() => {
    const topic = "/topic/" + userInfo?.tenant?.id;
    const connectHeaders = {};

    let stompClient = Stomp.over(socket);

    if (!stompClient.connected) {
      stompClient.connect(connectHeaders, () => {
        stompClient.subscribe(topic, (message) => {
          const body = JSON.parse(message.body);
          if (body.hasNewAlarm) {
            hasNewAlarmRef.current = true;
            timeoutId.current = setTimeout(() => {
              queryClient.invalidateQueries({ queryKey: ["locationMap"] });
            }, 1200);
          } else {
            setSocketData(body);
          }
        });
      });
    }

    // Cleanup
    return () => {
      clearTimeout(timeoutId.current);
      if (stompClient.connected) {
        stompClient.unsubscribe("sub-0");
        stompClient.disconnect(() => {
          stompClient = null;
        });
      }
    };
  }, []);

  useEffect(() => {
    const locationIdsWithAlarmStatus = locations
      .filter((location) => location.status === "ALARM")
      .map((item) => item.id);

    if (hasNewAlarmRef.current) {
      const differenceIds = difference(
        locationIdsWithAlarmStatus,
        alarmLocationIdsRef.current
      );
      if (!isEmpty(differenceIds)) {
        const locationId = differenceIds[0];
        const locationsData = locations.filter(
          (location) => location.id === locationId
        );
        const locationData = locationsData[0];
        setSocketData(locationsData);
        if (locationData) {
          hasNewAlarmRef.current = false;
          mapRefRight.current?.flyTo({
            center: [
              locationData?.location?.longitude,
              locationData?.location?.latitude,
            ],
            duration: 1000,
            zoom: 14,
          });
          setOpenMarkerPopup(locationData);
        }
      }
    }

    alarmLocationIdsRef.current = locationIdsWithAlarmStatus;
  }, [locations, setOpenMarkerPopup, setViewportMapRight, viewportMapRight]);

  useEffect(() => {
    const hasAlarm = locations.some((loc) => loc.status === "ALARM");
    if (
      locations.length > 0 &&
      !hasAlarm &&
      !hasAutoFocused.current &&
      typeof setOpenMarkerPopup === "function"
    ) {
      const firstLocation = locations[0];
      console.log("firstLocation", firstLocation);

      setOpenMarkerPopup(firstLocation);
      hasAutoFocused.current = true;
    }
  }, [locations, setOpenMarkerPopup]);

  useEffect(() => {
    const alarmSound = new Audio(Sound);
    alarmSound.loop = true;

    const checkLocalStorage = () => {
      const isBellRingAlarm =
        localStorage.getItem("isBellRingAlarm") === "true";
      const newData = locations?.filter((item) => item.status === "ALARM");
      if (isBellRingAlarm && newData.length > 0) {
        alarmSound.play();
      } else {
        alarmSound.pause();
        alarmSound.currentTime = 0;
      }
    };

    checkLocalStorage();
    window.addEventListener("storage", checkLocalStorage);
    window.addEventListener("localStorageChange", checkLocalStorage);

    return () => {
      window.removeEventListener("storage", checkLocalStorage);
      window.removeEventListener("localStorageChange", checkLocalStorage);
      alarmSound.pause();
      alarmSound.currentTime = 0;
    };
  }, [locations]);

  useEffect(() => {
    localStorage.setItem("isBellRingAlarm", "false");
  }, []);

  const isSmallScreen = useMediaQuery(theme.breakpoints.down("tablet"));

  return (
    <div className="overflow-hidden miniLaptop:flex block h-full">
      <div className="block px-6 miniLaptop:hidden">
        <DataGridHeader
          isSearch={false}
          setKeyword={setKeyword}
          title={t("monitoring")}
        />
      </div>
      {isSmallScreen ? (
        <div className="pt-6 px-4 bg-white border-r border-[var(--border-color)] min-w-[320px]">
          <SearchBox setKeyword={setKeyword} />
          <ListBuilding data={locations} mapRefRight={mapRefRight} />
        </div>
      ) : (
        <div className="relative">
          <button
            onClick={() => setIsSidebarOpen((prev) => !prev)}
            className="absolute top-4 left-[320px] z-20 bg-primary text-white px-2 py-1 rounded-r-md transition-all duration-300"
            style={{
              transform: isSidebarOpen ? "translateX(0)" : "translateX(-320px)",
            }}
          >
            {isSidebarOpen ? (
              <IconPhosphor iconName="CaretLeft" size={20} />
            ) : (
              <IconPhosphor iconName="CaretRight" size={20} />
            )}
          </button>

          <div
            className="absolute top-0 left-0 h-screen miniLaptop:h-[calc(70vh-35px)] rounded-br-md bg-white border-r border-[var(--border-color)] shadow transition-transform duration-300 z-10"
            style={{
              width: "320px",
              transform: isSidebarOpen ? "translateX(0)" : "translateX(-100%)",
            }}
          >
            <div className="pt-6 px-4 bg-white h-full overflow-y-auto">
              <SearchBox setKeyword={setKeyword} />
              <ListBuilding data={locations} mapRefRight={mapRefRight} />
            </div>
          </div>
        </div>
      )}

      <Box
        className="relative w-full smallLaptop:h-full miniLaptop:h-full h-[calc(100vh-100px)]"
        sx={popupStyles}
      >
        <CustomMap
          initialCenter={{ lat: -16.92250772004144, lng: 145.7485087054897 }}
          mapRef={mapRefRight}
        />
      </Box>

      <Box className="fixed w-full bottom-0 z-10">
        <DeviceDashboardBottom />
      </Box>
    </div>
  );
}
