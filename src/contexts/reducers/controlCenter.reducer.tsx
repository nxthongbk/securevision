import { useState } from 'react';
import { fakeDataAlerts } from '~/assets/mocks/data';

const defaultViewport = {
  longitude: 106.72101215314161,
  latitude: 10.727682560482615,
  zoom: 6
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
  viewportMapRight: defaultViewport,
  setViewportMapRight: () => {},

  selectedFilter: ['ACTIVE', 'ALARM', 'PENDING', 'CONFIRM', 'IGNORE', 'device'],
  setSelectedFilter: () => {},

  fakeData: fakeDataAlerts,
  setFakeData: () => {},

  fakeHistory: [],
  setFakeHistory: () => {},

  alertTime: null,
  setAlertTime: () => {}
};

export default function useControlCenterPageReducer() {
  const [openLocationPopup, setOpenLocationPopup] = useState(initialControlCenterReducer.openLocationPopup);
  const [openCancelPopup, setOpenCancelPopup] = useState(initialControlCenterReducer.openCancelPopup);
  const [openConfirmPopup, setOpenConfirmPopup] = useState(initialControlCenterReducer.openConfirmPopup);
  const [openAlertPopup, setOpenAlertPopup] = useState(initialControlCenterReducer.openAlertPopup);
  const [openPendingPopup, setOpenPendingPopup] = useState(initialControlCenterReducer.openPendingPopup);
  const [viewportMapRight, setViewportMapRight] = useState(initialControlCenterReducer.viewportMapRight);
  const [openMarkerPopup, setOpenMarkerPopup] = useState(initialControlCenterReducer.openMarkerPopup);
  const [selectedFilter, setSelectedFilter] = useState(initialControlCenterReducer.selectedFilter);
  const [fakeData, setFakeData] = useState(initialControlCenterReducer.fakeData);
  const [fakeHistory, setFakeHistory] = useState(initialControlCenterReducer.fakeHistory);
  const [alertTime, setAlertTime] = useState(initialControlCenterReducer.alertTime);

  const reset = () => {
    setOpenLocationPopup(null);
    setOpenAlertPopup(null);
    setOpenCancelPopup(null);
    setOpenConfirmPopup(null);
    setOpenPendingPopup(null);
    setViewportMapRight(defaultViewport);
    setOpenMarkerPopup(null);
    setSelectedFilter(['ACTIVE', 'ALARM', 'PENDING', 'CONFIRM', 'IGNORE', 'device']);
    setFakeData(fakeDataAlerts);
    setFakeHistory([]);
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
    viewportMapRight,
    setViewportMapRight,
    openMarkerPopup,
    setOpenMarkerPopup,
    selectedFilter,
    setSelectedFilter,
    fakeData,
    setFakeData,
    fakeHistory,
    setFakeHistory,
    alertTime,
    setAlertTime,
    reset
  };
}
