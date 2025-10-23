import React, { useEffect, useRef } from 'react';
import { Engine, Scene } from '@babylonjs/core';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/loaders/glTF';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { PointerEventTypes } from '@babylonjs/core/Events/pointerEvents';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';

interface BabylonViewerProps {
  width: number;
  height: number;
  editMode: boolean;
  modelUrl?: string;
  sensitivity?: number; // user slider (0–100)
}

const BabylonViewer: React.FC<BabylonViewerProps> = ({
  width,
  height,
  editMode,
  modelUrl,
  sensitivity = 50
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // ✅ Initialize Babylon engine and scene
    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);

    // ✅ ArcRotateCamera
    const camera = new ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 3,
      10,
      new Vector3(0, 0, 0),
      scene
    );

    camera.minZ = 0.1;
    camera.maxZ = 10000000;
    camera.upperRadiusLimit = 10000;
    camera.attachControl(canvasRef.current, true);

    // 🧮 Global sensitivity setup
    const BASE_SENSITIVITY_FACTOR = 1.0; // change this to scale all speeds globally
    const normalized = Math.max(0.1, sensitivity / 50); // maps 0–100 → 0.1–2.0
    const sensitivityFactor = normalized * BASE_SENSITIVITY_FACTOR;

    // 🎮 Apply linear scaling to all camera movements
    // Higher sensitivityFactor → faster controls
    camera.angularSensibilityX = 2000 / sensitivityFactor; // rotate X
    camera.angularSensibilityY = 2000 / sensitivityFactor; // rotate Y
    camera.panningSensibility = 50 / sensitivityFactor;  // pan (right-click)
    camera.wheelPrecision = 10 / sensitivityFactor;        // zoom (scroll)

    // ✅ Add light
    new HemisphericLight("light", new Vector3(0, 1, 0), scene);

    // ✅ Load model if provided
    if (modelUrl) {
      SceneLoader.Append(
        "",
        modelUrl,
        scene,
        () => console.log("✅ Model loaded successfully"),
        null,
        (scene, message, exception) => {
          console.error("❌ Error loading model:", message, exception, scene);
        },
        ".glb"
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

    // ✅ Render loop
    engine.runRenderLoop(() => scene.render());

    // ✅ Handle resize
    const handleResize = () => engine.resize();
    window.addEventListener("resize", handleResize);

    // ✅ Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (pointerObserver) scene.onPointerObservable.remove(pointerObserver);
      if (!scene.isDisposed) scene.dispose();
      if (!engine.isDisposed) engine.dispose();
    };
  }, [width, height, editMode, modelUrl, sensitivity]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
};

export default BabylonViewer;
