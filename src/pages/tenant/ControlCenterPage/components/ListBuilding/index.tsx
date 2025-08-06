import { Divider, Typography } from "@mui/material";
import classNames from "classnames";
import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import AvatarTableRow from "~/components/AvatarTableRow";
import { AppContext } from "~/contexts/app.context";
import { useGetLatestTelemetrysNoC } from "~/pages/tenant/DevicePage/handleApi";

interface IItemBuilding {
  name: string;
  status: string;
  isSelected?: boolean;
  warningDevice: number;
  totalDevice: number;
  onClick?: any;
  imageUrl?: string;
}

function ItemBuilding({
  name,
  status,
  onClick,
  imageUrl,
  isSelected = false,
}: Readonly<IItemBuilding>) {
  const className = classNames(
    "w-full min-h-9 rounded-md flex items-center px-2 py-2 gap-2 cursor-pointer hover:text-[var(--blue-600)]",
    {
      "bg-[var(--red-60)] text-[var(--alert)] hover:text-white hover:bg-[var(--red-600)]":
        status === "ALARM",
    },
    {
      "bg-[var(--blue-500)] text-[var(--white)] hover:text-white hover:bg-[var(--blue-500)]":
        isSelected && status !== "ALARM",
    }
  );
  return (
    <div onClick={onClick} className={className}>
      <AvatarTableRow
        avatarUrl={imageUrl}
        sx={{ width: "30px", height: "30px", borderRadius: "4px !important" }}
      />
      <div className="w-[203px] truncate">
        <Typography variant="label3">{name}</Typography>
      </div>
    </div>
  );
}

export default function ListBuilding({
  data,
  closeDialog,
  mapRefRight,
}: {
  data: any[];
  closeDialog?: any;
  mapRefRight: any;
}) {
  const {
    selectedFilter,
    listOfDevices,
    setListOfDevices,
    openMarkerPopup,
    setOpenMarkerPopup,
    selectedListDevice,
    setSelectedListDevice,
  } = useContext(AppContext);
  const [telemetries, setTelemetries] = useState<any>();
  const [warningData, setWarningData] = useState<any>([]);
  const { t } = useTranslation("");
  const mappedId = listOfDevices.map((device) => device.id);
  const hasAutoMoved = useRef(false);

  const queries = useGetLatestTelemetrysNoC({
    entityType: "DEVICE",
    entityIds: mappedId,
  });

  function cleanedData(data: Record<string, any>[]) {
    return data.map((item) => {
      const result: Record<string, any> = {};
      for (const key in item) {
        if (
          typeof item[key] === "object" &&
          item[key] !== null &&
          "value" in item[key]
        ) {
          result[key] = item[key].value;
        } else {
          result[key] = item[key];
        }
      }
      return result;
    });
  }

  useEffect(() => {
    const newData = data?.filter((item) => item.status === "ALARM");
    setWarningData(newData);
    if (!listOfDevices?.length) {
      setListOfDevices(data);
    }
  }, [data]);

  useEffect(() => {
    const newTelemetries: any[] = [];

    queries?.forEach((query, index) => {
      const deviceId = mappedId[index];
      if (query.data?.data?.data) {
        newTelemetries.push({
          id: deviceId,
          ...query.data.data.data,
        });
      }
    });

    if (JSON.stringify(newTelemetries) !== JSON.stringify(telemetries)) {
      const updatedList = [...listOfDevices];
      const data = cleanedData(newTelemetries);

      data.forEach((telemetry) => {
        const index = updatedList.findIndex((item) => item.id === telemetry.id);
        if (index !== -1) {
          updatedList[index] = {
            ...updatedList[index],
            ...telemetry,
          };
        }
      });
      setTelemetries(newTelemetries);
      setListOfDevices(updatedList);
    }
  }, [queries]);

  function convertNMEAToDecimal(coord: string): number {
    const value = parseFloat(coord);
    const degrees = Math.floor(value / 100);
    const minutes = value % 100;
    return degrees + minutes / 60;
  }

  const moveToBuilding = (item) => {
    setSelectedListDevice(item);
    // Force state change if the same device is clicked again
    if (openMarkerPopup?.id === item.id) {
      setOpenMarkerPopup(null);
      setTimeout(() => setOpenMarkerPopup({ ...item }), 0);
    } else {
      setOpenMarkerPopup({ ...item });
    }

    const convertedLon = convertNMEAToDecimal(item?.longitude);
    const convertedLat = convertNMEAToDecimal(item?.latitude);
    const longitude = convertedLon || 106.62823723344383;
    const latitude = convertedLat || 10.853397686226927;

    if (mapRefRight?.current) {
      mapRefRight.current.flyTo([latitude, longitude], 17, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }
  };

  // Auto moving to first device
  useEffect(() => {
    const hasAlarm = listOfDevices.some((loc) => loc.status === "ALARM");
    if (
      listOfDevices.length > 0 &&
      !hasAlarm &&
      !openMarkerPopup &&
      !hasAutoMoved.current
    ) {
      moveToBuilding(listOfDevices[0]);
      hasAutoMoved.current = true;
    }
  }, [listOfDevices, openMarkerPopup]);

  useEffect(() => {
    if (openMarkerPopup && mapRefRight?.current) {
      // Move to the selected device (including first load)
      const convertedLon = convertNMEAToDecimal(openMarkerPopup?.longitude);
      const convertedLat = convertNMEAToDecimal(openMarkerPopup?.latitude);
      const longitude = convertedLon || 106.62823723344383;
      const latitude = convertedLat || 10.853397686226927;
      mapRefRight.current.flyTo([latitude, longitude], 17, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }
  }, [openMarkerPopup, mapRefRight]);

  useEffect(() => {
    if (listOfDevices.length > 0 && !selectedListDevice) {
      setSelectedListDevice(listOfDevices[0]);
    }
  }, [listOfDevices, selectedListDevice, setSelectedListDevice]);

  return (
    <div className="mt-4 overflow-y-scroll h-[55vh] gap-4 flex flex-col">
      {warningData?.length > 0 && (
        <>
          <div
            style={{
              display: selectedFilter.includes("ALARM") ? "block" : "none",
            }}
          >
            <Typography variant="label2">
              {t("fire-locations")}({warningData?.length})
            </Typography>
            <div className="flex flex-col gap-1 mt-2">
              {(warningData || []).map((item: Record<string, any>) => {
                return (
                  <ItemBuilding
                    key={item.id}
                    name={item.name}
                    status={item.status}
                    warningDevice={item?.devices?.totalActive}
                    totalDevice={item?.devices?.total}
                    onClick={() => {
                      closeDialog && closeDialog();
                      moveToBuilding(item);
                    }}
                  />
                );
              })}
            </div>
          </div>
          <Divider />
        </>
      )}

      <div
        style={{
          display: !selectedFilter.includes("ACTIVE") ? "none" : "block",
        }}
      >
        <Typography variant="label2" className="mb-2">
          {t("all-devices")} ({listOfDevices?.length})
        </Typography>
        <div className="flex flex-col gap-1 mt-2">
          {(listOfDevices || [])?.map((item: Record<string, any>) => (
            <ItemBuilding
              key={item.id}
              name={item.name}
              status={item.status}
              isSelected={item.id === selectedListDevice?.id}
              warningDevice={item?.devices?.totalActive}
              totalDevice={item?.devices?.total}
              imageUrl={item?.deviceProfile?.imageUrl}
              onClick={() => {
                closeDialog && closeDialog();
                moveToBuilding(item);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
