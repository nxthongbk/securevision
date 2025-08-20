export default interface IControlCenterReducer {
  // Open location popup
  openLocationPopup: any;
  setOpenLocationPopup: React.Dispatch<React.SetStateAction<any | null>>;

  // Open alert popup
  openAlertPopup: any;
  setOpenAlertPopup: React.Dispatch<React.SetStateAction<any | null>>;

  openPendingPopup: any;
  setOpenPendingPopup: React.Dispatch<React.SetStateAction<any | null>>;

  // Open cancel popup
  openCancelPopup: any;
  setOpenCancelPopup: React.Dispatch<React.SetStateAction<any | null>>;

  // Open confirm popup
  openConfirmPopup: any;
  setOpenConfirmPopup: React.Dispatch<React.SetStateAction<any | null>>;

  // Viewport Map Right
  viewportMapRight: any;
  setViewportMapRight: React.Dispatch<React.SetStateAction<any | null>>;

  // Open marker popup
  openMarkerPopup: any;
  setOpenMarkerPopup: React.Dispatch<React.SetStateAction<any | null>>;

  // selected filter
  selectedFilter: any[];
  setSelectedFilter: React.Dispatch<React.SetStateAction<any | null>>;

  // Fake Data
  fakeData: any[];
  setFakeData: React.Dispatch<React.SetStateAction<any | null>>;

  //Fake them lich su canh bao chay
  fakeHistory: any[];
  setFakeHistory: any;

  alertTime: any;
  setAlertTime: any;
}
