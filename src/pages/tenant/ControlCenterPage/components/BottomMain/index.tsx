import { AppContext } from "~/contexts/app.context";
import MiniMap from "../MiniMap";
import { useContext, useEffect, useState } from "react";
import "./style.scss";
import ImgDevice from "~/assets/images/png/device.png";
import ImgCamera from "~/assets/images/png/camera.png";
import HLSPlayer from "../Stream-video";

const DeviceDashboardBottom = () => {
  const backgroundColor = "rgba(34, 154, 225, 0.8)";
  const [itemCam, setItemCam] = useState(null);
  const { openMarkerPopup } = useContext(AppContext);
	const [openBottomPopup, setOpenBottomPopup] = useState(openMarkerPopup);

  console.log(
    `http://192.168.12.10:9090/stream/${itemCam?.IPv4?.replace(/\./g, "_")}/index.m3u8`
  );

  useEffect(() => {
    setOpenBottomPopup(openMarkerPopup);
    setItemCam(null);
  }, [openMarkerPopup]);

  if (!openMarkerPopup) {
    return null; // Render nothing if no device is selected
  }

  return (
    <>
      <div className="w-full flex flex-col smallLaptop:flex-row miniLaptop:flex-row text-white">
        {/* MiniMap Section */}
        <div
          className="w-full relative smallLaptop:w-[20%] miniLaptop:w-[20%] h-[240px] pt-5 pb-12 pl-3 pr-5 [clip-path:polygon(94%_0,100%_10%,100%_100%,0_100%,0_0)]"
          style={{ backgroundColor: "rgba(0, 101, 161, 0.78)" }}
        >
          <div
            className="h-full"
            style={{ backgroundColor: "rgba(10, 23, 84, 0.3)" }}
          >
            <MiniMap />
          </div>
        </div>
        <div
          className="absolute left-0 smallLaptop:w-[20%] miniLaptop:w-[20%] w-[50%] h-6 bottom-0"
          style={{ backgroundColor: "rgba(0, 101, 161, 0.78)" }}
        ></div>

        {/* Center: Device + Camera */}
        <div
          className="w-full mt-6 smallLaptop:w-[50%] miniLaptop:w-[50%] h-[240px] shadow-lg"
          style={{ backgroundColor }}
        >
          <div
            className="h-full bg-[#030820] py-4 flex flex-col justify-between relative w-[100.1%]"
            style={{ backgroundColor: "rgba(10, 23, 84, 0.3)" }}
          >
            <div className="flex gap-4 h-full border-2 border-[#CFF9FE80] bg-devices rounded-md">
              {/* Device Info Center */}
              {openBottomPopup && (
                <div className="flex gap-16 h-full p-4 w-full">
                  <div className="flex flex-col gap-0.5 items-center justify-center text-center w-[40%]">
                    <img
                      src={ImgDevice}
                      className="w-[60px] h-[60px] rounded-md"
                    />
                    <div className="font-semibold text-sm text-[#67E3F9]">
                      {openBottomPopup?.name || ""}
                    </div>
                    <div className="text-sm text-[#67E3F9]">
                      {openBottomPopup?.deviceProfile?.name}
                    </div>
                    <div className="text-xs text-white">IP ADDRESS:</div>
                    <div className="text-sm text-white">
                      {openBottomPopup?.ip_address || "192.168.1.23"}
                    </div>
                    <div className="text-xs text-white">MAC:</div>
                    <div className="text-sm text-white">
                      {openBottomPopup?.mac_address || "8D:74:32:AB:3F:12"}
                    </div>
                  </div>

                  {/* Camera Grid 3x2 */}
                  <div className="grid grid-cols-3 grid-rows-2 gap-2 w-full">
                    {openBottomPopup?.list_camera &&
                      openBottomPopup?.list_camera
                        ?.slice(0, 6)
                        .map((cam, index) => (
                          <div
                            key={index}
                            onClick={() => setItemCam(cam)}
                            className="bg-[#5984C099] cursor-pointer rounded-md flex flex-col items-center justify-center p-2 shadow-md"
                          >
                            <img
                              src={ImgCamera}
                              alt={`Camera ${index + 1}`}
                              className="w-12 h-12 mb-1"
                            />
                            <div className="text-xs text-[#67E3F9]">
                              {cam?.IPv4}
                            </div>
                          </div>
                        ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Device Detail Info */}
        <div
          className="w-full smallLaptop:w-[30%] miniLaptop:w-[30%] h-[250px] shadow-lg [clip-path:polygon(4%_0,100%_0%,100%_100%,0_100%,0_10%)]"
          style={{ backgroundColor }}
        >
          <div
            className="h-full bg-[#030820] pt-6 pb-4 pl-5 pr-20 flex flex-col justify-between"
            style={{ backgroundColor: "rgba(10, 23, 84, 0.3)" }}
          >
            <div>
              {itemCam && itemCam?.IPv4 ? (
                <div className="w-full h-full flex items-center justify-center relative">
                  {/* Close Button */}
                  <button
                    className="absolute top-2 right-2 z-10 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-700"
                    onClick={() => setItemCam(null)}
                    title="Close"
                  >
                    ✕
                  </button>

                  {/* HLS Video */}
                  <div className="w-full h-[200px] rounded-md overflow-hidden">
                    <HLSPlayer
                      // src={`http://192.168.12.10:9090/${itemCam?.IPv4?.replace(/\./g, '_')}/index.m3u8`}
                      // src={`http://192.168.12.10:9090/stream/cam1/index.m3u8`}
                      src={`http://192.168.12.10:9090/stream/${itemCam?.IPv4?.replace(/\./g, "_")}/index.m3u8`}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-1 flex flex-col gap-5 text-sm z-20 h-full smallLaptop:pt-[2px] smallLaptop:px-1 relative border-2 bg-devices border-[#CFF9FE80] rounded-md py-2 px-4">
                  {openBottomPopup && (
                    <div className="flex flex-col gap-1 text-sm">
                      <h3 className="font-bold text-base text-[#67E3F9]">
                        {openBottomPopup?.name || "WULU-0000007"}
                      </h3>
                      <div className="text-white font-semibold text-xs bg-[#16B364] px-2 py-1 w-fit rounded-md">
                        {openBottomPopup?.status || "ACTIVE"}
                      </div>
                      <div className="text-xs text-white break-all">
                        <img src="ImgLocation" alt="" />
                        UUID:{" "}
                        {openBottomPopup?.deviceId ||
                          "26bbc8b1-ff9c-4438-ba80-53b68cc8e0c8"}
                      </div>
                      <div className="text-xs text-white">
                        <img src="ImgLocation" alt="" />
                        MODEL: {openBottomPopup?.model}
                      </div>
                      <div className="text-xs text-white">
                        <img src="ImgLocation" alt="" />
                        TYPE: {openBottomPopup?.deviceProfile?.name}
                      </div>
                      <div className="text-xs text-white">
                        <img src="ImgLocation" alt="" />
                        FIRMWARE VERSION: {openBottomPopup?.firmware_version}
                      </div>
                      <div className="text-xs text-white">
                        ALTITUDE: {openBottomPopup?.altitude || ""}
                      </div>
                      <div className="text-xs text-white">
                        SIGNAL:{" "}
                        <span className="text-white font-semibold">
                          {openBottomPopup?.deviceProfile?.signalWaitingTime ||
                            "5 MINUTES"}
                        </span>
                      </div>
                      <div className="text-xs text-white">
                        ARCH:{" "}
                        <span className="text-white font-semibold">
                          {openBottomPopup?.deviceProfile?.arch}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        <div
          className="absolute right-0 smallLaptop:w-[30%] miniLaptop:w-[30%] w-[50%] h-[14px] bottom-0"
          style={{ backgroundColor: "rgba(4, 114, 180, 0.86)" }}
        ></div>
      </div>
    </>
  );
};

export default DeviceDashboardBottom;
