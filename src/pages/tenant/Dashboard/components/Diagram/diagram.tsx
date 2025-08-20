import { Layer, Rect, Stage } from 'react-konva';
import React, { useEffect, useRef, useState } from 'react';

import BackgroundDiagram from './FeatureDiagram/background-diagram';
import ContextMenu from './FeatureDiagram/context-menu';
import GroupMachine from './ShapeDiagram/group-machine';
import Konva from 'konva';
import ModalArea from './components/Modal/Area/modal-area';
import PolygonAnnotation from './ShapeDiagram/polygon-annotation';
import Portal from './FeatureDiagram/portal';

// Types
interface DiagramProps {
  width?: number;
  height?: number;
  ImageDiagram?: string;
  dataDiagram?: any[];
  isDraw?: boolean;
  isDelete?: boolean;
  setDelete?: (deleteState: boolean) => void;
  isEdit?: boolean;
  setEdit?: (editState: boolean) => void;
  arrMachine?: any[];
  setArrMachine?: (arrMachine: any[]) => void;
  points?: any;
  setPoints?: any;
  isPolyComplete?: boolean;
  setPolyComplete?: (polyComplete: boolean) => void;
  dataArea?: any[];
  flattenedPoints?: number[];
  setFlattenedPoints?: any;
  selected?: boolean;
  setSelected?: (selected: boolean) => void;
  arrArea?: any;
  setArrArea?: (arrArea: any[]) => void;
  curCam?: any;
  setCurCam?: (cam: any) => void;
  curTypeDevice?: string;
  showLiveStream?: boolean;
  typeProject?: string;
  column?: number;
}

const Diagram: React.FC<DiagramProps> = ({
  width,
  height,
  ImageDiagram,
  dataDiagram,
  isDraw,
  isEdit,
  arrMachine,
  points,
  setPoints,
  setPolyComplete,
  dataArea,
  flattenedPoints,
  selected,
  arrArea,
  setArrArea,
  curTypeDevice,
  isPolyComplete,
  setFlattenedPoints,
  setSelected
}) => {
  const [selectedContextMenu, setSelectedContextMenu] = useState<any>(null);
  const [isShowMenu, setShowMenu] = useState<boolean>(false);
  const [position, setPosition] = useState([0, 0]);
  const [isShowArea, setShowArea] = useState<boolean>(false);
  // const [isShowMarker, setShowMarker] = useState<boolean>(false);
  const [isMouseOverPoint, setMouseOverPoint] = useState(false);
  const [positionKey, setPositionKey] = useState<any>();
  const refImage = useRef<HTMLImageElement>(null);
  // draw polygon
  const [arrPolygon, setArrPolygon] = useState();
  // const [arrPoint, setArrPoint] = useState();
  // selected drag
  const layerRef = useRef<Konva.Layer>(null);
  const handleMouseOverStartPoint = (e) => {
    if (isPolyComplete || points.length < 2) return;
    e.target.scale({ x: 2, y: 2 });
    setMouseOverPoint(true);
  };
  const handleMouseOutStartPoint = (e) => {
    e.target.scale({ x: 1, y: 1 });
    setMouseOverPoint(false);
  };
  const [startPoint, setStartPoint] = useState<any>();
  useEffect(() => {
    isPolyComplete && setShowArea(true);
  }, [isPolyComplete]);
  useEffect(() => {
    // arrArea?.length > 0 &&
    setArrPolygon(
      arrArea?.map(
        (item) =>
          (item.type === curTypeDevice || curTypeDevice === 'all' || !curTypeDevice) &&
          item.polygon?.map((value, idx) => {
            if (idx % 2 === 0) {
              return (value *= width);
            } else {
              return (value *= height);
            }
          })
      )
    );
  }, [arrArea?.[0]?.key, arrArea?.length, width, height, curTypeDevice]);
  useEffect(() => {
    if (selected) {
      setPoints([]);
      setPolyComplete(false);
      setFlattenedPoints();
    } else {
      setFlattenedPoints(points.concat(isPolyComplete ? [] : position).reduce((a, b) => a.concat(b), []));
    }
  }, [selected, position, isPolyComplete]);

  const handlePointDragMove = (e) => {
    const stage = e.target.getStage();
    const index = e.target.index - 1;
    const pos = [e.target._lastPos.x, e.target._lastPos.y];
    if (pos[0] < 0) pos[0] = 0;
    if (pos[1] < 0) pos[1] = 0;
    if (pos[0] > stage.width()) pos[0] = stage.width();
    if (pos[1] > stage.height()) pos[1] = stage.height();
    setPoints([...points.slice(0, index), pos, ...points.slice(index + 1)]);
  };
  const handleContextMenu = (e: any, key: string) => {
    e.evt.preventDefault();
    if (!isDraw && !isEdit) {
      const mousePosition = e.target.getStage().getPointerPosition();
      setPositionKey(key);
      setSelectedContextMenu({
        position: mousePosition
      });
      setShowMenu(true);
    }
  };

  // Fetch project data
  const selection = React.useRef({
    visible: false,
    x1: 0,
    y1: 0,
    x2: 0,
    y2: 0
  });
  const selectionRectRef = React.useRef();
  const onMouseDown = (event: any) => {
    setShowMenu(false);
    if (isDraw && !isShowMenu && !isEdit) {
      if (selected) {
        const pos = event.target.getStage().getPointerPosition();

        selection.current.visible = true;
        selection.current.x1 = pos.x;
        selection.current.y1 = pos.y;
        selection.current.x2 = pos.x;
        selection.current.y2 = pos.y;
        updateSelectionRect();

        let PosX = 0;
        let PosY = 0;

        if (event.evt.pageX || event.evt.pageY) {
          PosX = event.evt.pageX;
          PosY = event.evt.pageY;

          setStartPoint({ x: PosX, y: PosY });
        } else if (event.evt.clientX || event.evt.clientY) {
          PosX = event.evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
          PosY = event.evt.clientY + document.body.scrollTop + document.documentElement.scrollTop;

          setStartPoint({ x: PosX, y: PosY });
        }
      } else {
        if (isPolyComplete) return;
        const stage = event.target.getStage();
        const mousePos = getMousePos(stage);
        if (isMouseOverPoint && points.length >= 2) {
          setPolyComplete(true);
        } else {
          setPoints([...points, mousePos]);
        }
      }
    }
  };

  const onMouseMove = (e) => {
    if (!isShowMenu && isDraw && !isEdit) {
      if (selected) {
        if (!selection.current.visible) {
          return;
        }
        const pos = e.target.getStage().getPointerPosition();
        selection.current.x2 = pos.x;
        selection.current.y2 = pos.y;
        updateSelectionRect();
      } else {
        const stage = e.target.getStage();
        const mousePos = getMousePos(stage);
        setPosition(mousePos);
      }
    }
  };
  const getMousePos = (stage) => {
    return [stage.getPointerPosition().x, stage.getPointerPosition().y];
  };
  const onMouseUp = (e) => {
    if (isDraw && !isShowMenu && !isEdit && selected) {
      if (!selection.current.visible) {
        return;
      }
      selection.current.visible = false;
      updateSelectionRect();

      let PosX = 0;
      let PosY = 0;

      if (e.evt.pageX || e.evt.pageY) {
        PosX = e.evt.pageX;
        PosY = e.evt.pageY;
      } else if (e.evt.clientX || e.evt.clientY) {
        PosX = e.evt.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        PosY = e.evt.clientY + document.body.scrollTop + document.documentElement.scrollTop;
      }

      if (!(PosX === startPoint.x && PosY === startPoint.y)) setShowArea(true);
    }
  };

  const updateSelectionRect = () => {
    const node = selectionRectRef.current as Konva.Rect;
    node.setAttrs({
      visible: selection.current.visible,
      x: Math.min(selection.current.x1, selection.current.x2),
      y: Math.min(selection.current.y1, selection.current.y2),
      width: Math.abs(selection.current.x1 - selection.current.x2),
      height: Math.abs(selection.current.y1 - selection.current.y2),
      fill: 'rgba(0, 161, 255, 0.3)'
    });
    if (node) {
      node.getLayer().batchDraw();
    }
  };

  return (
    <>
      <Stage
        width={width}
        height={height}
        onMouseDown={(e) => {
          onMouseDown(e);
        }}
        onMouseUp={(e) => {
          onMouseUp(e);
        }}
        onMouseMove={(e) => {
          onMouseMove(e);
        }}
      >
        <Layer ref={layerRef}>
          <BackgroundDiagram
            ImageDiagram={ImageDiagram}
            width={width}
            height={height}
            selected={selected}
            isDraw={isDraw}
          />
          {(isEdit || isDraw ? arrMachine : dataDiagram).map(
            (item, index) =>
              (curTypeDevice === item.type || curTypeDevice === 'all' || !curTypeDevice) && (
                <GroupMachine
                  key={index}
                  index={index}
                  item={item}
                  isEdit={isEdit}
                  width={width}
                  height={height}
                  handleContextMenu={handleContextMenu}
                  setNumberKey={(key) => {
                    console.log('🚀 ~ key:', key);
                  }}
                />
              )
          )}
          <PolygonAnnotation
            curTypeDevice={curTypeDevice}
            arrArea={arrArea}
            setArrArea={setArrArea}
            handleContextMenu={handleContextMenu}
            points={points}
            setPoints={setPoints}
            flattenedPoints={flattenedPoints}
            isEdit={isEdit}
            handleMouseOverStartPoint={handleMouseOverStartPoint}
            handleMouseOutStartPoint={handleMouseOutStartPoint}
            isFinished={isPolyComplete}
            setSelected={setSelected}
            setPolyComplete={setPolyComplete}
            arrPolygon={arrPolygon}
            setShow={setShowArea}
            width={width}
            height={height}
            handlePointDragMove={handlePointDragMove}
          />

          {selectedContextMenu && (
            <Portal>
              {isShowMenu && (
                <ContextMenu
                  {...selectedContextMenu}
                  arrArea={arrArea}
                  dataDiagram={dataDiagram}
                  positionKey={positionKey}
                  closeMenu={() => setShowMenu(false)}
                  setArrArea={setArrArea}
                />
              )}
            </Portal>
          )}

          <Rect fill='rgba(0,0,255,0.5)' />
        </Layer>
      </Stage>

      {isShowArea && (
        <ModalArea
          isDraw={isDraw}
          indexSelected={0}
          show={isShowArea}
          setShow={() => setShowArea(false)}
          setPoints={setPoints}
          setPolyComplete={setPolyComplete}
          flattenedPoints={flattenedPoints}
          width={width}
          height={height}
          dataArea={dataArea}
          arrArea={arrArea}
          setArrArea={setArrArea}
        />
      )}
      <img
        ref={refImage}
        width={'100%'}
        height={'100%'}
        src={ImageDiagram}
        alt='diagram-virtual'
        className='absolute top-0 left-0'
      />
    </>
  );
};

export default React.memo(Diagram);
