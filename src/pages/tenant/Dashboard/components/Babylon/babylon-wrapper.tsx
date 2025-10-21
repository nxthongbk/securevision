import React, { useState, useRef } from 'react';
import BabylonViewer from './babylon-scene';
import ModalMarker from './babylon-modalmarker';
import * as BABYLON from '@babylonjs/core';

interface BabylonWrapperProps {
  modelUrl: string;
  isEdit: boolean;
  isDraw: boolean;
  arrArea: any[];
  setArrArea: React.Dispatch<React.SetStateAction<any[]>>;
}

const BabylonWrapper: React.FC<BabylonWrapperProps> = ({
  modelUrl,
  isEdit,
  isDraw,
  arrArea,
  setArrArea,
}) => {
  const [showAddArea, setShowAddArea] = useState(false);
  const [tempMarker, setTempMarker] = useState<{ x: number; y: number; z: number } | null>(null);
  const [controlsAttached, setControlsAttached] = useState(true);

  const scenePayload = useRef<{
    scene: BABYLON.Scene;
    camera: BABYLON.ArcRotateCamera;
    engine: BABYLON.Engine;
    canvas: HTMLCanvasElement;
  } | null>(null);

  const handleSceneReady = (payload: {
    scene: BABYLON.Scene;
    camera: BABYLON.ArcRotateCamera;
    engine: BABYLON.Engine;
    canvas: HTMLCanvasElement;
  }) => {
    scenePayload.current = payload;
  };

  const openModal = (coords: { x: number; y: number; z: number }) => {
    setTempMarker(coords);
    setShowAddArea(true);

    if (scenePayload.current && controlsAttached) {
      scenePayload.current.camera.detachControl();
      setControlsAttached(false);
    }
  };

  const closeModal = () => {
    setShowAddArea(false);
    setTempMarker(null);

    if (scenePayload.current && !controlsAttached) {
      scenePayload.current.camera.attachControl(scenePayload.current.canvas, true);
      setControlsAttached(true);
    }
  };

  const handleSaveMarker = (formData: any) => {
    if (!tempMarker) return;

    const newArea = {
      ...formData,
      x: tempMarker.x,
      y: tempMarker.y,
      z: tempMarker.z,
      id: Date.now().toString(),
    };

    setArrArea((prev) => {
      const updated = [...prev, newArea];
      console.log('✅ New marker added:', newArea);
      console.log('📦 Updated markers array:', updated);
      return updated;
    });

    closeModal();
  };

  return (
    <div className="relative w-full h-full">
      <BabylonViewer
        modelUrl={modelUrl}
        editMode={isEdit}
        isDraw={isDraw}
        areas={arrArea}
        showAddArea={showAddArea}
        onMarkerPlaced={(coords) => {
          if (isDraw) openModal(coords);
        }}
        onSceneReady={handleSceneReady}
      />

      {showAddArea && tempMarker && (
        <ModalMarker
          show={showAddArea}
          setShow={setShowAddArea}
          coords={tempMarker}
          arrayMarker={arrArea || []} // ✅ Pass current markers to modal
          handleSaveMarker={handleSaveMarker}
        />
      )}
    </div>
  );
};

export default BabylonWrapper;
