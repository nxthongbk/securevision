import { CameraCard } from './CameraCard';

export default function CameraViewPage({
  onToggle,
  isCameraView,
}: {
  onToggle: (checked: boolean) => void;
  isCameraView: boolean;
}) {
  const wsUrls = [
    'wss://cloud.innovation.com.vn/live/jsmpeg/camera-1f834933-16fa-4ee1-ba5d-6d084389374e',
    'wss://cloud.innovation.com.vn/live/jsmpeg/camera-1f834933-16fa-4ee1-ba5d-6d084389374e',
    'wss://cloud.innovation.com.vn/live/jsmpeg/camera118',
    'wss://cloud.innovation.com.vn/live/jsmpeg/camera213',
  ];

  console.log('🎬 Active Camera URLs:', wsUrls);

  return (
    <div className="relative flex flex-col h-screen bg-black text-white overflow-hidden">
      {/* camera/location toggle */}
      <div className="absolute top-10 left-4 z-20 bg-[#0a0f1d]/80 px-5 py-2.5 rounded-lg border border-[#36BFFA]/30 flex items-center gap-3 shadow-md backdrop-blur-sm">
        <span className="text-sm font-medium">
          {isCameraView ? 'Camera View' : 'Map View'}
        </span>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={isCameraView}
            onChange={(e) => onToggle(e.target.checked)}
          />
          <div className="relative w-12 h-6 bg-gray-700 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-300">
            <span className="absolute top-[2px] left-[2px] h-5 w-5 bg-white rounded-full shadow-md transition-transform duration-300 peer-checked:translate-x-6"></span>
          </div>
        </label>
      </div>

      {/* Camera Grid */}
      {isCameraView ? (
        <div className="flex-grow flex justify-center items-center px-8 py-4">
          <div className="grid grid-cols-2 grid-rows-2 gap-6 w-full h-full max-w-[90vw] max-h-[85vh]">
            {wsUrls.map((url, i) => (
              <CameraCard
                key={i}
                title={`Camera ${i + 1}`}
                wsUrl={url}
                isActive={isCameraView}
              />
            ))}
          </div>
        </div>
      ) : (
        <h1 className="text-center mt-20 text-2xl font-bold">
          Map View Placeholder
        </h1>
      )}
    </div>
  );
}
