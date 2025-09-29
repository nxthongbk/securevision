// ControlCenterWrapper.tsx
import { useState } from 'react';
import MapViewPage from './index';
import CameraViewPage from './components/Frigate/index';

export default function ControlCenterWrapper() {
  const [isCameraView, setIsCameraView] = useState(
    localStorage.getItem('isCameraView') === 'true'
  );

  const handleToggle = (checked: boolean) => {
    setIsCameraView(checked);
    localStorage.setItem('isCameraView', String(checked));
  };

  return isCameraView ? (
    <CameraViewPage onToggle={handleToggle} isCameraView={isCameraView} />
  ) : (
    <MapViewPage onToggle={handleToggle} isCameraView={isCameraView} />
  );
}
