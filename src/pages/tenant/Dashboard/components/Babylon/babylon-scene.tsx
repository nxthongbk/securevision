import React, { useEffect, useRef } from 'react';
import { Engine, Scene } from '@babylonjs/core';
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/loaders/glTF'; // ✅ Ensure GLB/GLTF loader is included
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { PointerEventTypes } from '@babylonjs/core/Events/pointerEvents';

interface BabylonViewerProps {
  width: number;
  height: number;
  editMode: boolean;
  modelUrl?: string; // blob or remote .glb file
}

const BabylonViewer: React.FC<BabylonViewerProps> = ({ width, height, editMode, modelUrl }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // ✅ Initialize Babylon engine and scene
    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);

    // ✅ Set up camera
    const camera = new FreeCamera("camera", new Vector3(0, 750, 0), scene);
    camera.setTarget(new Vector3(-750, 0, -750));
    camera.attachControl(canvasRef.current, true);
    camera.inertia = 0.9;
    camera.speed = 5;
    camera.keysUp = [87];  // W
    camera.keysDown = [83]; // S
    camera.keysLeft = [65]; // A
    camera.keysRight = [68]; // D
    camera.inputs.removeMouseWheel();

    // ✅ Add light
    new HemisphericLight('light', new Vector3(0, 1, 0), scene);

    // ✅ Load the .glb model (works with blob URLs)
    if (modelUrl) {
      SceneLoader.Append("", modelUrl, scene, 
        () => console.log("✅ Model loaded successfully"),
        null,
        (scene, message, exception) => {
          console.error("❌ Error loading model:", message, exception, scene);
        },
        ".glb" // 👈 Always treat the file as .glb
      );
    }

    // ✅ Click-to-place marker (edit mode)
    const pointerObserver = scene.onPointerObservable.add((pointerInfo) => {
      if (!editMode) return;
      if (pointerInfo.type === PointerEventTypes.POINTERPICK) {
        const pickResult = pointerInfo.pickInfo;
        if (pickResult?.hit && pickResult.pickedPoint) {
          const marker = MeshBuilder.CreateBox("marker", { size: 10 }, scene);
          const mat = new StandardMaterial("markerMat", scene);
          mat.diffuseColor = new Color3(1, 0, 0);
          marker.material = mat;
          marker.position.copyFrom(pickResult.pickedPoint);
        }
      }
    });

    // ✅ Start render loop
    engine.runRenderLoop(() => scene.render());

    // ✅ Resize handler
    const handleResize = () => engine.resize();
    window.addEventListener('resize', handleResize);

    // ✅ Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (pointerObserver) scene.onPointerObservable.remove(pointerObserver);
      if (!scene.isDisposed) scene.dispose();
      if (!engine.isDisposed) engine.dispose();
    };
  }, [width, height, editMode, modelUrl]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        display: 'block',
        maxWidth: '100%',
        maxHeight: '100%',
      }}
    />
  );
};

export default BabylonViewer;
