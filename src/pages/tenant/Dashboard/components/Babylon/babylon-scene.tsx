import React, { useEffect, useRef } from 'react';
import * as BABYLON from '@babylonjs/core';
import '@babylonjs/loaders';

interface BabylonViewerProps {
  modelUrl: string;
  editMode: boolean;
  isDraw: boolean;
  showAddArea?: boolean; // 👈 new
  areas?: { id?: string; label?: string; x: number; y: number; z: number }[];
  onMarkerPlaced?: (coords: { x: number; y: number; z: number }) => void;
  onSceneReady?: (payload: {
    scene: BABYLON.Scene;
    camera: BABYLON.ArcRotateCamera;
    engine: BABYLON.Engine;
    canvas: HTMLCanvasElement;
  }) => void;
}

const BabylonViewer: React.FC<BabylonViewerProps> = ({
  modelUrl,
  editMode,
  isDraw,
  showAddArea,
  areas = [],
  onMarkerPlaced,
  onSceneReady,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<BABYLON.Engine | null>(null);
  const sceneRef = useRef<BABYLON.Scene | null>(null);
  const markerMeshes = useRef<BABYLON.Mesh[]>([]);
  useEffect(() => {
    const scene = sceneRef.current;
    const canvas = canvasRef.current;
    if (!scene || !canvas) return;

    const camera = scene.activeCamera as BABYLON.ArcRotateCamera;
    if (!camera) return;

    if (showAddArea) {
      // 👇 Full detach to stop intercepting input
      camera.inputs.clear();
      camera.detachControl();
      canvas.blur();
      canvas.tabIndex = -1;
      console.log('🎯 Full camera detachment (modal open)');
    } else {
      // 👇 Reattach all inputs
      camera.inputs.addKeyboard();
      camera.inputs.addMouseWheel();
      camera.inputs.addPointers();
      camera.attachControl(canvas, true);
      canvas.tabIndex = 1;
      console.log('🎯 Camera fully reattached (modal closed)');
    }
  }, [showAddArea]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new BABYLON.Engine(canvasRef.current, true);
    const scene = new BABYLON.Scene(engine);
    engineRef.current = engine;
    sceneRef.current = scene;

    const camera = new BABYLON.ArcRotateCamera(
      'camera',
      Math.PI / 2,
      Math.PI / 3,
      10,
      new BABYLON.Vector3(0, 100, 0),
      scene
    );
    camera.attachControl(canvasRef.current, true);

    new BABYLON.HemisphericLight('light', new BABYLON.Vector3(1, 1, 0), scene);

    BABYLON.SceneLoader.Append(
      '',
      modelUrl,
      scene,
      () => console.log('✅ Model loaded:', modelUrl),
      undefined,
      (_, message, exception) => console.error('❌ Load error:', message, exception),
      '.glb'
    );

    onSceneReady?.({ scene, camera, engine, canvas: canvasRef.current });

    engine.runRenderLoop(() => scene.render());
    window.addEventListener('resize', () => engine.resize());

    return () => {
      engine.stopRenderLoop();
      scene.dispose();
      engine.dispose();
    };
  }, [modelUrl]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const pointerHandler = (pointerInfo: BABYLON.PointerInfo) => {
      if (!isDraw || !editMode) return;

      if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERPICK) {
        const pickInfo = pointerInfo.pickInfo;
        if (pickInfo?.hit && pickInfo.pickedPoint) {
          const { x, y, z } = pickInfo.pickedPoint;

          const marker = BABYLON.MeshBuilder.CreateSphere('marker', { diameter: 0.2 }, scene);
          marker.position = pickInfo.pickedPoint;

          const mat = new BABYLON.StandardMaterial('markerMat', scene);
          mat.diffuseColor = new BABYLON.Color3(1, 0, 0);
          marker.material = mat;
          markerMeshes.current.push(marker);

          onMarkerPlaced?.({ x, y, z });
        }
      }
    };

    scene.onPointerObservable.add(pointerHandler);
    return () => {
      scene.onPointerObservable.removeCallback(pointerHandler);
    };
  }, [isDraw, editMode, onMarkerPlaced]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    markerMeshes.current.forEach((m) => m.dispose());
    markerMeshes.current = [];

    areas.forEach((area) => {
      const marker = BABYLON.MeshBuilder.CreateSphere(
        `area-${area.id}`,
        { diameter: 0.2 },
        scene
      );
      marker.position = new BABYLON.Vector3(area.x, area.y, area.z);

      const mat = new BABYLON.StandardMaterial('areaMat', scene);
      mat.diffuseColor = new BABYLON.Color3(0, 0.8, 1);
      marker.material = mat;
      markerMeshes.current.push(marker);
    });
  }, [areas]);
  useEffect(() => {
  const scene = sceneRef.current;
  if (!scene) return;

  const camera = scene.activeCamera as BABYLON.ArcRotateCamera;
  if (!camera) return;

  const canvas = canvasRef.current;

  console.log('🧭 Camera input test');
  console.log('  Attached controls:', camera.inputs.attached);
  console.log('  Canvas tabindex:', canvas?.tabIndex);
}, [showAddArea]);
  return (
    <canvas
      ref={canvasRef}
      style={{ width: '100%', height: '100%', display: 'block', outline: 'none' }}
    />
  );
};

export default BabylonViewer;
