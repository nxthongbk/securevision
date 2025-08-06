import {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
  useContext,
} from "react";
import { BellRinging, BellSlash } from "@phosphor-icons/react";
import { Button, Stack, Tooltip, Typography } from "@mui/material";
import LocationLog, { ILocationLog } from "../LocationLog";
import mapboxgl, { LngLatLike } from "mapbox-gl";
import AlertPopup from "../Popup/AlertPopup";
import { AppContext } from "~/contexts/app.context";
import CancelPopup from "../Popup/CancelPopup";
import LocationPopup from "../Popup/LocationPopup";
import MapBox from "~/components/MapBox";
import MarkerMap from "../../../../../components/Marker";
import PendingPopup from "../Popup/PendingPopup";
import { useTranslation } from "react-i18next";
import { Popup } from "react-map-gl";
import "./style.scss";
import CustomDataGrid from "~/components/DataGrid/CustomDataGrid";
import { useGetLatestTelemetryNoC } from "~/pages/tenant/DevicePage/handleApi";
import { isBoolean, isObject, sortBy } from "lodash";
import { useDataTab } from "~/pages/systemAdmin/SysDevicePage/DrawerDevice/useDataTab";
import { GridColDef } from "@mui/x-data-grid";
import { translationCapitalFirst } from "~/utils/translate";
import TooltipEllipsisTypography from "~/components/EllipsisTypography/TooltipEllipsisTypography";

function MapRight({
  mapRef,
  socketData,
}: {
  mapRef: any;
  socketData: any;
}) {
  const {
    openLocationPopup,
    openCancelPopup,
    openAlertPopup,
    openPendingPopup,
    viewportMapRight,
    setOpenBottomPopup,
    listOfDevices,
    setListOfDevices,
    openMarkerPopup,
    setOpenMarkerPopup,
  } = useContext(AppContext);

  const { t } = useTranslation();
  const logContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [logs, setLogs] = useState<ILocationLog[]>([]);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(5);
  const [keyword] = useState<string>("");
  const [isBellRingAlarm, setIsBellRingAlarm] = useState(true);
  const [isSatelliteView, setIsSatelliteView] = useState(false);
  const [tableRows, setTableRows] = useState([]);

  const { data: initLatestTelemetry } = useGetLatestTelemetryNoC({
    entityType: "DEVICE",
    entityId: openMarkerPopup?.id,
  });

  const pageSizeOptions = [5, 10, 30, 50, 100].map((val) => ({
    value: val,
    text: `${val} / ${translationCapitalFirst("page")}`,
  }));

  useEffect(() => {
    setPage(1);
  }, [openMarkerPopup]);

  useEffect(() => {
    if (logs.length > 100) {
      setLogs(logs.slice(-50));
    }
  }, [logs]);

  useEffect(() => {
    if (initLatestTelemetry?.data?.data) {
      const responseData = initLatestTelemetry.data.data || {};
      const rows = Object.keys(responseData).map((key, index) => ({
        id: index,
        key,
        value: responseData[key]?.value,
      }));
      setTableRows(sortBy(rows, (row) => row.key.toLowerCase()));
    } else {
      setTableRows([]);
    }
  }, [openMarkerPopup, initLatestTelemetry]);

  const { resultData, total } = useDataTab({
    data: tableRows,
    page,
    size,
    keyword,
  });

  function extractValuesOnly(data: Record<string, any>) {
    const result: Record<string, any> = {};
    for (const key in data) {
      if (
        typeof data[key] === "object" &&
        data[key] !== null &&
        "value" in data[key]
      ) {
        result[key] = data[key].value;
      } else {
        result[key] = data[key];
      }
    }

    return result;
  }

  useEffect(() => {
    if (!socketData) return;

    const cleanedSocketData = extractValuesOnly(socketData) as any;

    const lat = cleanedSocketData.latitude;
    const lon = cleanedSocketData.longitude;
    if (!lat || !lon || lat === "null" || lon === "null") return;

    setListOfDevices((prev) => {
      const index = prev.findIndex(
        (item) => item.id === cleanedSocketData.deviceId
      );
      if (index === -1) return prev;

      const oldItem = prev[index];
      const oldLat = oldItem.latitude;
      const oldLon = oldItem.longitude;

      const hasMoved =
        parseFloat(oldLat) !== parseFloat(lat) ||
        parseFloat(oldLon) !== parseFloat(lon);

      if (!hasMoved) return prev;

      const updated = [...prev];
      updated[index] = { ...oldItem, ...cleanedSocketData };
      return updated;
    });

    setLogs((prevLogs) => {
      const newLog: ILocationLog = { deviceSocketData: cleanedSocketData };
      const lastLog = prevLogs[prevLogs.length - 1];
      const isDuplicate = JSON.stringify(lastLog) === JSON.stringify(newLog);
      return isDuplicate ? prevLogs : [...prevLogs, newLog];
    });
  }, [socketData]);

  useEffect(() => {
    // Scroll to bottom whenever logs change
    if (logContainerRef.current) {
      logContainerRef.current.scrollTo({
        top: logContainerRef.current.scrollHeight,
        behavior: "smooth", // Enables smooth scrolling
      });
    }
  }, [logs]);

  const onLoadMap = useCallback((evt: mapboxgl.MapboxEvent) => {
    setMap(evt?.target);
  }, []);

  function convertNMEAToDecimal(coord: string): number {
    const value = parseFloat(coord);
    const degrees = Math.floor(value / 100);
    const minutes = value % 100;
    return degrees + minutes / 60;
  }

  const coordinates = useMemo(() => {
    if (!socketData?.deviceId) return [];

    const latestDevice = listOfDevices.find(
      (item) => item.id === socketData.deviceId
    );
    const lonStr = latestDevice?.longitude;
    const latStr = latestDevice?.latitude;

    if (!lonStr || !latStr) return [];

    const lon =
      typeof lonStr === "string" ? convertNMEAToDecimal(lonStr) : lonStr;
    const lat =
      typeof latStr === "string" ? convertNMEAToDecimal(latStr) : latStr;

    if (lon < -180 || lon > 180 || lat < -90 || lat > 90) return [];

    return [[lon, lat]];
  }, [listOfDevices, socketData?.deviceId]) as LngLatLike[];

  function isValidBounds(bounds: mapboxgl.LngLatBounds): boolean {
    try {
      const sw = bounds.getSouthWest();
      const ne = bounds.getNorthEast();

      return (
        sw.lng >= -180 &&
        sw.lng <= 180 &&
        sw.lat >= -90 &&
        sw.lat <= 90 &&
        ne.lng >= -180 &&
        ne.lng <= 180 &&
        ne.lat >= -90 &&
        ne.lat <= 90
      );
    } catch {
      return false;
    }
  }

  useEffect(() => {
    if (map && coordinates.length) {
      const bounds = new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]);

      for (const coord of coordinates) {
        bounds.extend(coord);
      }

      if (isValidBounds(bounds)) {
        map.fitBounds(bounds, {
          padding: {
            top: 100,
            bottom: 20,
            left: 20,
            right: 20,
          },
        });
      }
    }
  }, [coordinates, map]);

  const handleButtonClick = () => {
    const newValue = !isBellRingAlarm;
    setIsBellRingAlarm(newValue);
    localStorage.setItem("isBellRingAlarm", newValue.toString());
    window.dispatchEvent(new Event("localStorageChange"));
  };

  const onClose = () => {
    setOpenMarkerPopup(null);
  };

  useEffect(() => {
    const checkLocalStorage = () => {
      const isBellRingAlarm =
        localStorage.getItem("isBellRingAlarm") === "true";
      setIsBellRingAlarm(isBellRingAlarm);
    };
    checkLocalStorage();
    window.addEventListener("storage", checkLocalStorage);
    window.addEventListener("localStorageChange", checkLocalStorage);
    return () => {
      window.removeEventListener("storage", checkLocalStorage);
      window.removeEventListener("localStorageChange", checkLocalStorage);
    };
  }, []);

  const handleToggleView = () => {
    setIsSatelliteView(!isSatelliteView);
  };

  return (
    <MapBox
      ref={mapRef}
      initialViewState={viewportMapRight}
      viewState={viewportMapRight}
      onLoad={onLoadMap}
      mapStyle={
        isSatelliteView
          ? "mapbox://styles/mapbox/satellite-v9"
          : "mapbox://styles/mapbox/streets-v12"
      }
    >
      {listOfDevices?.map((item) => {
        const lonStr = item?.longitude;
        const latStr = item?.latitude;

        let longitude = 106.62823723344383;
        let latitude = 10.853397686226927;

        if (lonStr && latStr) {
          const convertedLon = convertNMEAToDecimal(lonStr);
          const convertedLat = convertNMEAToDecimal(latStr);
          if (
            convertedLon >= -180 &&
            convertedLon <= 180 &&
            convertedLat >= -90 &&
            convertedLat <= 90
          ) {
            longitude = convertedLon;
            latitude = convertedLat;
          }
        }

        return (
          <MarkerMap
            key={item?.id || "fallback-data-marker"}
            status={"ACTIVE"}
            longitude={longitude}
            latitude={latitude}
            avatarUrl={item?.deviceProfile?.imageUrl}
            name={item?.name}
            ipAddress={item?.ip_address}
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              setOpenBottomPopup(item);
              setOpenMarkerPopup(item);
            }}
          />
        );
      })}

      {openMarkerPopup && (
        <>
          {
            <Popup
              longitude={
                convertNMEAToDecimal(openMarkerPopup?.longitude) ||
                106.62823723344383
              }
              latitude={
                convertNMEAToDecimal(openMarkerPopup?.latitude) ||
                10.853397686226927
              }
              onClose={onClose}
              anchor="left"
              className="!top-[-30px] min-w-[340px]"
            >
              <div className="flex w-[430px] justify-center">
                <CustomDataGrid
                  page={page}
                  setPage={setPage}
                  size={size}
                  setSize={setSize}
                  rows={resultData}
                  columns={ColumnsAttribute(openMarkerPopup?.name)}
                  total={total}
                  explainName="attributes"
                  pageSizeOptions={pageSizeOptions}
                />
              </div>
            </Popup>
          }
        </>
      )}
      {openLocationPopup && <LocationPopup />}
      {openCancelPopup && <CancelPopup />}
      {openAlertPopup && <AlertPopup />}
      {openPendingPopup && <PendingPopup />}

      <div className="absolute flex flex-col top-4 right-4 rounded-lg bg-opacity-70 bg-blue-200 p-2 z-50 w-fit">
        <div className="flex flex-row justify-center items-center z-50">
          <Button
            onClick={handleToggleView}
            variant="text"
            color="primary"
            sx={{
              padding: "10px",
              zIndex: 1,
            }}
          >
            <img
              className="w-10 h-10"
              src={
                isSatelliteView
                  ? "https://maps.gstatic.com/tactile/layerswitcher/ic_satellite-1x.png"
                  : "https://maps.gstatic.com/tactile/layerswitcher/ic_default_colors2-1x.png"
              }
            />
          </Button>
          <Button
            className={`!px-6 ${!isBellRingAlarm && "!bg-[var(--grey-primary-100)]"}`}
            onClick={handleButtonClick}
            variant="contained"
            startIcon={
              isBellRingAlarm ? (
                <BellRinging size={18} />
              ) : (
                <BellSlash size={18} />
              )
            }
            sx={{
              padding: "10px",
              zIndex: 1,
            }}
          >
            <Typography variant="button3" fontWeight={600}>
              {t("alram-ring")}
            </Typography>
          </Button>
        </div>
        <div
          ref={logContainerRef}
          className="flex flex-col overflow-y-scroll w-[320px] max-h-[700px]"
        >
          {logs?.map((log) => <LocationLog log={log} />)}
        </div>
      </div>
    </MapBox>
  );
}

export default MapRight;

const ColumnsAttribute = (deviceName: string) => {
  const columns: GridColDef[] = [
    {
      flex: 5,
      field: "key",
      editable: false,
      sortable: false,
      headerClassName: "table-grid__header",
      renderHeader: () => (
        <Stack direction={"row"} alignItems={"center"} spacing={1}>
          <Typography variant="label3">{deviceName}</Typography>
        </Stack>
      ),
      hideSortIcons: true,
    },
    {
      flex: 3.44,
      field: "value",
      editable: false,
      sortable: false,
      headerClassName: "table-grid__header",
      renderHeader: (params) => (
        <Typography variant="label3">{params.colDef.headerName}</Typography>
      ),
      renderCell: (params) => {
        const isObj = isObject(params.value);
        const cellValue = isObj
          ? JSON.stringify(params.value)
          : isBoolean(params.value)
            ? `${params.value}`
            : params.value;

        if (params.row.key === "image" && typeof cellValue === "string") {
          const base64Img = cellValue;
          return (
            <Tooltip
              title={
                <img
                  src={`data:image/jpeg;base64,${base64Img}`}
                  alt="Preview"
                  style={{
                    width: 400,
                    maxHeight: 400,
                    objectFit: "contain",
                    border: "3px solid #fff",
                    borderRadius: 8,
                  }}
                />
              }
              placement="right"
              componentsProps={{
                tooltip: {
                  sx: {
                    bgcolor: "transparent",
                    p: 0,
                    m: 0,
                    boxShadow: "none",
                  },
                },
              }}
            >
              <img
                src={`data:image/jpeg;base64,${base64Img}`}
                alt="Thumbnail"
                style={{ width: 80, height: 50, borderRadius: 8 }}
              />
            </Tooltip>
          );
        }

        return (
          <TooltipEllipsisTypography lines={2}>
            {cellValue}
          </TooltipEllipsisTypography>
        );
      },
    },
  ];

  return columns;
};
