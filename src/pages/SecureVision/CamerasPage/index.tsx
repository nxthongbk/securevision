import { FilmStrip, ImageSquare, PersonSimpleRun } from '@phosphor-icons/react';

const cameras = [
  {
    id: 'CAMERA116',
    name: 'CAMERA116',
    image: 'https://dummyimage.com/400x225/cccccc/000000&text=Camera116',
    error: false,
    time: '2025-08-07 13:50:21',
  },
  {
    id: 'CAMERA118',
    name: 'CAMERA118',
    image: '',
    error: true,
    time: '',
  },
  {
    id: 'CAMERA120',
    name: 'CAMERA120',
    image: '',
    error: true,
    time: '',
  },
  {
    id: 'CAMERA211',
    name: 'CAMERA211',
    image: 'https://dummyimage.com/400x225/cccccc/000000&text=Camera211',
    error: false,
    time: '2025-08-07 13:50:21',
  },
  {
    id: 'CAMERA213',
    name: 'CAMERA213',
    image: 'https://dummyimage.com/400x225/cccccc/000000&text=Camera213',
    error: false,
    time: '2025-08-07 13:50:21',
  },
];

export default function CamerasPage() {
  return (
    <div className="grid grid-cols-1 smallLaptop:grid-cols-2 desktop:grid-cols-3 gap-4">
      {cameras.map(cam => (
        <div
          key={cam.id}
          className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="h-[298px] bg-gray-100 flex items-center justify-center">
            {cam.error ? (
              <div className="flex flex-col items-center justify-center w-full h-full text-gray-500">
                <span className="text-5xl">❗</span>
                <span className="mt-2 text-sm">No frames have been received, check error logs</span>
              </div>
            ) : (
              // <img src={cam.image} alt={cam.name} className="object-cover w-full h-full" />
              <a href="/cameras/camera116">
                <div className="relative w-full">
                  <canvas data-testid="cameraimage-canvas" height="298" width="530"></canvas>
                </div>
              </a>
            )}
          </div>
          <div className="p-4 flex-1 flex flex-col">
            <div className="font-semibold text-base mb-2">{cam.name}</div>
            <div className="flex items-center mb-2 text-xs text-blue-700 font-medium gap-2">
              <a href="#" className="hover:underline">
                EVENTS
              </a>
              <a href="#" className="hover:underline ml-2">
                RECORDINGS
              </a>
              <div className="flex-1"></div>
              <div className="flex gap-4 pl-4 ">
                {[
                  { icon: <PersonSimpleRun size={22} />, label: 'Person' },
                  { icon: <FilmStrip size={22} className="text-red-600" />, label: 'Film' },
                  { icon: <ImageSquare size={22} />, label: 'Image' },
                ].map(action => (
                  <button
                    key={action.label}
                    className="hover:text-blue-900 transition-colors"
                    title={action.label}
                    tabIndex={-1}
                    type="button"
                  >
                    {action.icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
