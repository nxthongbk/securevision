import { useState } from "react";
import { fakeDataAlerts } from "~/assets/mocks/data";

const defaultViewportMiniMap = {
  longitude: 106.63210413963725,
  latitude: 10.864824940022743,
  zoom: 10,
};

const defaultViewportMapRight = {
  longitude: 106.628604969523,
  latitude: 10.853622619017656,
  zoom: 16.57581824004819,
};

export const initialControlCenterReducer = {
  openLocationPopup: null,
  setOpenLocationPopup: () => {},
  openAlertPopup: null,
  setOpenAlertPopup: () => {},
  openPendingPopup: null,
  setOpenPendingPopup: () => {},
  openCancelPopup: null,
  setOpenCancelPopup: () => {},
  openConfirmPopup: null,
  setOpenConfirmPopup: () => {},
  openMarkerPopup: null,
  setOpenMarkerPopup: () => {},
  openBottomPopup: null,
  setOpenBottomPopup: () => {},
  viewportMiniMap: defaultViewportMiniMap,
  setViewportMiniMap: () => {},
  viewportMapRight: defaultViewportMapRight,
  setViewportMapRight: () => {},
  selectedListDevice: null,
  setSelectedListDevice: () => {},

  selectedFilter: ["ACTIVE", "ALARM", "PENDING", "CONFIRM", "IGNORE", "device"],
  setSelectedFilter: () => {},

  fakeData: fakeDataAlerts,
  setFakeData: () => {},

  fakeHistory: [],
  setFakeHistory: () => {},

  alertTime: null,
  setAlertTime: () => {},

  listOfDevices: [],
  setListOfDevices: () => {},
};

export default function useControlCenterPageReducer() {
  const [openLocationPopup, setOpenLocationPopup] = useState(
    initialControlCenterReducer.openLocationPopup
  );
  const [openCancelPopup, setOpenCancelPopup] = useState(
    initialControlCenterReducer.openCancelPopup
  );
  const [openConfirmPopup, setOpenConfirmPopup] = useState(
    initialControlCenterReducer.openConfirmPopup
  );
  const [openAlertPopup, setOpenAlertPopup] = useState(
    initialControlCenterReducer.openAlertPopup
  );
  const [openPendingPopup, setOpenPendingPopup] = useState(
    initialControlCenterReducer.openPendingPopup
  );
  const [viewportMiniMap, setViewportMiniMap] = useState(
    initialControlCenterReducer.viewportMiniMap
  );
  const [viewportMapRight, setViewportMapRight] = useState(
    initialControlCenterReducer.viewportMapRight
  );
  const [openMarkerPopup, setOpenMarkerPopup] = useState(
    initialControlCenterReducer.openMarkerPopup
  );
  const [openBottomPopup, setOpenBottomPopup] = useState(
    initialControlCenterReducer.openBottomPopup
  );
  const [selectedFilter, setSelectedFilter] = useState(
    initialControlCenterReducer.selectedFilter
  );
  const [fakeData, setFakeData] = useState(
    initialControlCenterReducer.fakeData
  );
  const [fakeHistory, setFakeHistory] = useState(
    initialControlCenterReducer.fakeHistory
  );
  const [listOfDevices, setListOfDevices] = useState(
    initialControlCenterReducer.listOfDevices
  );
  const [alertTime, setAlertTime] = useState(
    initialControlCenterReducer.alertTime
  );

  const [selectedListDevice, setSelectedListDevice] = useState<any>(null);

  const reset = () => {
    setOpenLocationPopup(null);
    setOpenAlertPopup(null);
    setOpenCancelPopup(null);
    setOpenConfirmPopup(null);
    setOpenPendingPopup(null);
    setViewportMiniMap(defaultViewportMiniMap);
    setViewportMapRight(defaultViewportMapRight);
    setOpenMarkerPopup(null);
    setOpenBottomPopup(null);
    setSelectedFilter([
      "ACTIVE",
      "ALARM",
      "PENDING",
      "CONFIRM",
      "IGNORE",
      "device",
    ]);
    setFakeData(fakeDataAlerts);
    setFakeHistory([]);
    setListOfDevices([]);
    setAlertTime(null);
  };
  return {
    openLocationPopup,
    setOpenLocationPopup,
    openCancelPopup,
    setOpenCancelPopup,
    openConfirmPopup,
    setOpenConfirmPopup,
    openAlertPopup,
    setOpenAlertPopup,
    openPendingPopup,
    setOpenPendingPopup,
    viewportMiniMap,
    setViewportMiniMap,
    viewportMapRight,
    setViewportMapRight,
    openMarkerPopup,
    setOpenMarkerPopup,
    openBottomPopup,
    setOpenBottomPopup,
    selectedFilter,
    setSelectedFilter,
    fakeData,
    setFakeData,
    fakeHistory,
    setFakeHistory,
    alertTime,
    setAlertTime,
    listOfDevices,
    setListOfDevices,
    reset,
    selectedListDevice,
    setSelectedListDevice,
  };
}
