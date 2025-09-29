import { useEffect, useRef, useState } from "react";

export function CameraCard({
  title,
  wsUrl,
  isActive,
}: {
  title: string;
  wsUrl: string;
  isActive: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playerRef = useRef<any>(null);

  const [error, setError] = useState(false);
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  // ✅ Debug overlay toggles
  const [showBBox, setShowBBox] = useState(false);
  const [showTimestamp, setShowTimestamp] = useState(false);
  const [showRegions, setShowRegions] = useState(false);
  const [showZones, setShowZones] = useState(false);
  const [showMotion, setShowMotion] = useState(false);
  const [showMask, setShowMask] = useState(false);

  const isDebugMode =
    showBBox || showTimestamp || showRegions || showZones || showMotion || showMask;

  // Build snapshot URL for debug/fallback mode
  const buildSnapshotUrl = () => {
    const base = wsUrl
      .replace("/live/jsmpeg/", "/api/")
      .replace(/^wss/, "https")
      .replace(/\/debug\.mjpg$/, "");

    const params = new URLSearchParams({
      h: "360",
      cache: Date.now().toString(),
      bbox: showBBox ? "1" : "0",
      timestamp: showTimestamp ? "1" : "0",
      regions: showRegions ? "1" : "0",
      zones: showZones ? "1" : "0",
      motion: showMotion ? "1" : "0",
      mask: showMask ? "1" : "0",
    });

    return `${base}/latest.jpg?${params.toString()}`;
  };

  // Poll snapshots when debug mode is active
  useEffect(() => {
    if (!isActive || !isDebugMode) return;

    const updateImage = () => setImgUrl(buildSnapshotUrl());
    updateImage();
    const interval = setInterval(updateImage, 300); // adjust to control refresh rate
    return () => clearInterval(interval);
  }, [isActive, isDebugMode, showBBox, showTimestamp, showRegions, showZones, showMotion, showMask, wsUrl]);

  // Setup JSMpeg stream when not in debug mode
  useEffect(() => {
    const JSMpeg = (window as any).JSMpeg;

    // Cleanup if switching to debug or on unmount
    if (playerRef.current) {
      try {
        playerRef.current.destroy?.();
      } catch (e) {
        console.warn("Cleanup error:", e);
      }
      playerRef.current = null;
    }

    setError(false);

    if (!isActive || isDebugMode) return;

    if (canvasRef.current && JSMpeg) {
      try {
        const player = new JSMpeg.Player(wsUrl, {
          canvas: canvasRef.current,
          autoplay: true,
          audio: false,
          disableGl: false,
          onError: (err: any) => {
            console.error("JSMpeg Error:", err);
            setError(true);
          },
        });
        playerRef.current = player;
      } catch (err) {
        console.error("Error creating JSMpeg player:", err);
        setError(true);
      }
    }
  }, [isActive, wsUrl, isDebugMode]);

  return (
    <div className="bg-[#0a0f1d] rounded-xl border border-[#36BFFA]/20 shadow-lg flex flex-col overflow-hidden relative">
      <div className="flex items-center justify-between p-3">
        <div className="text-sm font-semibold text-gray-200">{title}</div>

        {/* ✅ Overlay Toggle Controls */}
        <div className="flex gap-1 flex-wrap">
          <button onClick={() => setShowBBox((v) => !v)} className={`text-xs px-2 py-1 rounded ${showBBox ? "bg-[#36BFFA]" : "bg-gray-700"}`}>BBox</button>
          <button onClick={() => setShowTimestamp((v) => !v)} className={`text-xs px-2 py-1 rounded ${showTimestamp ? "bg-[#36BFFA]" : "bg-gray-700"}`}>Timestamp</button>
          <button onClick={() => setShowRegions((v) => !v)} className={`text-xs px-2 py-1 rounded ${showRegions ? "bg-[#36BFFA]" : "bg-gray-700"}`}>Regions</button>
          <button onClick={() => setShowZones((v) => !v)} className={`text-xs px-2 py-1 rounded ${showZones ? "bg-[#36BFFA]" : "bg-gray-700"}`}>Zones</button>
          <button onClick={() => setShowMotion((v) => !v)} className={`text-xs px-2 py-1 rounded ${showMotion ? "bg-[#36BFFA]" : "bg-gray-700"}`}>Motion</button>
          <button onClick={() => setShowMask((v) => !v)} className={`text-xs px-2 py-1 rounded ${showMask ? "bg-[#36BFFA]" : "bg-gray-700"}`}>Mask</button>
        </div>
      </div>

      {/* Render stream or snapshot depending on debug/error */}
      {isDebugMode || error ? (
        <img
          src={imgUrl || buildSnapshotUrl()}
          alt="Camera snapshot"
          className="w-full h-full object-cover"
        />
      ) : (
        <canvas ref={canvasRef} className="w-full h-full object-cover" />
      )}

      {/* Optional: overlay message if stream failed */}
      {error && !isDebugMode && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-gray-300 text-sm">
          Stream unavailable, showing snapshot
        </div>
      )}
    </div>
  );
}
