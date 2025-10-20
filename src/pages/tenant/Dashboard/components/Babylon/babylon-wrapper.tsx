import React, { useState, useRef } from 'react';
import BabylonViewer from './babylon-scene';
import AddArea3D from './babylon-addarea'; // ✅ Import new 3D modal
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

  // ✅ When the scene is ready, store the Babylon engine + camera + scene ref
  const handleSceneReady = (payload: {
    scene: BABYLON.Scene;
    camera: BABYLON.ArcRotateCamera;
    engine: BABYLON.Engine;
    canvas: HTMLCanvasElement;
  }) => {
    scenePayload.current = payload;
  };

  // ✅ Open modal with 3D coordinates
  const openModal = (coords: { x: number; y: number; z: number }) => {
    setTempMarker(coords);
    setShowAddArea(true);

    if (scenePayload.current && controlsAttached) {
      scenePayload.current.camera.detachControl();
      setControlsAttached(false);
    }
  };

  // ✅ Close modal and reattach camera controls
  const closeModal = () => {
    setShowAddArea(false);
    setTempMarker(null);

    if (scenePayload.current && !controlsAttached) {
      scenePayload.current.camera.attachControl(scenePayload.current.canvas, true);
      setControlsAttached(true);
    }
  };

  // ✅ When modal saves a new area
  const handleSaveArea = (formData: any) => {
    if (!tempMarker) return;

    const newArea = {
      ...formData,
      x: tempMarker.x,
      y: tempMarker.y,
      z: tempMarker.z,
      id: Date.now().toString(),
    };

    // Add to list of areas
    setArrArea((prev) => [...prev, newArea]);
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

      {/* ✅ New AddArea3D modal */}
      {showAddArea && tempMarker && (
        <AddArea3D
          show={showAddArea}
          setShow={setShowAddArea}  
          handleClose={closeModal}
          handleSaveArea={handleSaveArea}
          coords3D={tempMarker}
        />
      )}
    </div>
  );
};

export default BabylonWrapper;
