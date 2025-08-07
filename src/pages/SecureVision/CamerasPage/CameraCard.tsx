import React, { useState } from 'react';
import { getCameraSnapshot } from '~/services/frigateApi';

interface CameraCardProps {
  name: string;
}

const CameraCard: React.FC<CameraCardProps> = ({ name }) => {
  const [error, setError] = useState(false);

  const snapshotUrl = getCameraSnapshot(name);

  return (
    <div className="bg-white dark:bg-gray-900 rounded shadow p-2 w-full">
      <div className="aspect-video bg-black rounded overflow-hidden flex items-center justify-center">
        {!error ? (
          <img
            src={snapshotUrl}
            alt={name}
            className="w-full object-cover"
            onError={() => setError(true)}
          />
        ) : (
          <div className="text-white text-center p-4">
            <div className="text-4xl mb-2">⚠️</div>
            <div>No frames have been received,<br />check error logs</div>
          </div>
        )}
      </div>
      <div className="mt-2 font-bold text-sm uppercase">{name}</div>
      <div className="flex space-x-3 mt-1 text-blue-600 text-sm">
        <a href={`/events/${name}`}>Events</a>
        <a href={`/recordings/${name}`}>Recordings</a>
        <button title="Detect" className="ml-auto hover:scale-110 transition">🧍‍♂️</button>
        <button title="Snapshot" className="hover:scale-110 transition">📸</button>
      </div>
    </div>
  );
};

export default CameraCard;
