import React, { useEffect, useState } from 'react';

import CameraCard from './CameraCard';
import { FrigateCamera } from '~/@types/frigate/frigate';
import { getCameras } from '~/services/frigateApi';

const CameraGrid: React.FC = () => {
  const [cameraList, setCameraList] = useState<FrigateCamera[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCameras();
        const cams = Object.keys(data).map(name => ({ name, ...data[name] }));
        setCameraList(cams);
      } catch (err) {
        console.error('Failed to fetch cameras:', err);
      }
    };
    load();
  }, []);

  return (
    <div className="p-4 grid grid-cols-1 smallLaptop:grid-cols-2 desktop:grid-cols-3 gap-4">
      {cameraList.map(cam => (
        <CameraCard key={cam.name} name={cam.name} />
      ))}
     
    </div>
  );
};

export default CameraGrid;
