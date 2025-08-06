import Konva from 'konva';
import React, { useEffect, useRef, useState } from 'react';
import { Circle, Group, Line, Rect, Text } from 'react-konva';
import { useGetLatestTelemetry } from '~/pages/tenant/DevicePage/handleApi';
import useSocketLatestTelemetry from '~/utils/hooks/socket/useSocketLatestTelemetry';

interface PolygonAnnotationProps {
  points?: number[][];
  setPoints?: React.Dispatch<React.SetStateAction<number[][]>>;
  flattenedPoints?: number[];
  isEdit?: boolean;
  isFinished?: boolean;
  handlePointDragMove?: (e: any) => void;
  handleMouseOverStartPoint?: (e: any) => void;
  handleMouseOutStartPoint?: (e: any) => void;
  arrPolygon?: any;
  width?: number;
  height?: number;
  setIndexSelected?: (index: number) => void;
  setShow?: (show: boolean) => void;
  setPolyComplete?: (complete: boolean) => void;
  setSelected?: (selected: boolean) => void;
  arrArea?: any[];
  setArrArea?: React.Dispatch<React.SetStateAction<any[]>>;
  handleContextMenu?: (e: any, label: string) => void;
  curTypeDevice?: string;
}

const PolygonAnnotation: React.FC<PolygonAnnotationProps> = (props) => {
  const {
    points,
    setPoints,
    flattenedPoints,
    isEdit,
    isFinished,
    handlePointDragMove,
    handleMouseOverStartPoint,
    handleMouseOutStartPoint,
    arrPolygon,
    width,
    height,
    setIndexSelected,
    setShow,
    setPolyComplete,
    setSelected,
    arrArea,
    setArrArea,
    handleContextMenu,
    curTypeDevice
  } = props;
  const vertexRadius = 4;
  const handleGroupMouseOver = (e: any) => {
    if (!isEdit) return;
    e.target.getStage().container().style.cursor = 'pointer';
    const newArrArea = arrArea.map((value) => {
      return value.polygon?.map((item: number, idx: number) => {
        return idx % 2 === 0 ? item * width : item * height;
      });
    });
    for (let i = 0; i < newArrArea.length; i++) {
      if (e.target.attrs.points?.length === newArrArea[i]?.length) {
        const res = e.target.attrs.points.every((item: number, idx: number) => {
          return item === newArrArea[i][idx];
        });
        if (res) {
          setIndexSelected(i);
          break;
        }
      }
    }
  };

  const handleGroupMouseOut = (e: any) => {
    e.target.getStage().container().style.cursor = 'default';
  };

  const handleSelected = (e: string) => {
    if (!isEdit) return;
    const newArrArea = arrArea.map((value) => value.label);

    for (let i = 0; i < newArrArea.length; i++) {
      if (newArrArea[i] === e) {
        setIndexSelected(i);
        break;
      }
    }

    setShow(true);
    setPolyComplete(true);
    setSelected(false);
  };

  const handleDragEnd = (e: any, idx: number) => {
    const position = e.target._lastPos;
    if (position.x < 50) position.x = 50;
    if (position.y < 52) position.y = 52;
    if (position.x > width) position.x = width - 52;
    if (position.y > height) position.y = height;

    const newArea = {
      ...arrArea[idx],
      textPoint: {
        ...arrArea[idx].textPoint,
        topPol: {
          x: position.x / width,
          y: position.y / height
        }
      },
      polygon: arrArea[idx].polygon
    };

    arrArea[idx] = newArea;
    setArrArea([...arrArea]);
    if (e.target.name() === 'polygon') {
      const result: number[][] = [];
      const copyPoints = [...points];
      copyPoints.forEach((point) => result.push([point[0] + e.target.x(), point[1] + e.target.y()]));
      e.target.position({ x: 0, y: 0 });
      setPoints(result);
    }
  };

  const refPolygon = useRef<Konva.Group[]>([]);

  refPolygon.current.forEach((r) => {
    r?.on('dragmove', () => {
      r?.y(Math.max(r?.y(), 50));
      r?.y(Math.min(r?.y(), height + 50 - r?.children[0].attrs.height - 1));
      r?.x(Math.max(r?.x(), 65));
      r?.x(Math.min(r?.x(), width + 65 - r?.children[0].attrs.width - 1));
    });
  });

  const updateBorderColor = (value: number) => {
    let color;
    if (value <= 20) {
      color = 'purple';
    } else if (value <= 40) {
      color = 'red';
    } else if (value <= 60) {
      color = 'orange';
    } else if (value <= 80) {
      color = 'yellow';
    } else {
      color = 'green';
    }
    return color;
  };

  const updateColor = (value: number) => {
    let color;
    if (value <= 20) {
      color = 'rgba(128, 0, 255, 0.4)';
    } else if (value <= 40) {
      color = 'rgba(255, 8, 0, 0.45)';
    } else if (value <= 60) {
      color = 'rgba(255, 171, 7, 0.57)';
    } else if (value <= 80) {
      color = 'rgba(255, 230, 0, 0.6)';
    } else {
      color = 'rgba(25, 219, 21, 0.5)';
    }
    return color;
  };

  return (
    <>
      <Group name='polygon'>
        {arrPolygon?.[0]?.length > 1 &&
          arrPolygon?.map((item, idx) => {
            return (
              <TelemetryPolygon handleContextMenu={handleContextMenu} updateBorderColor={updateBorderColor} updateColor={updateColor} arrArea={arrArea} item={item} telemetryIdx={idx} width={width} height={height} />

            );
          })}
        <Line points={flattenedPoints} stroke='red' strokeWidth={2} closed={isFinished} fill='rgba(210, 0, 0, 0.5)' />
        {points.map((point, index) => {
          const x = point[0] - vertexRadius / 2;
          const y = point[1] - vertexRadius / 2;
          const startPointAttr =
            index === 0
              ? {
                hitStrokeWidth: 1,
                onMouseOver: handleMouseOverStartPoint,
                onMouseOut: handleMouseOutStartPoint
              }
              : null;
          return (
            <Circle
              key={index}
              x={x}
              y={y}
              radius={vertexRadius}
              fill='red'
              stroke='red'
              strokeWidth={1}
              draggable
              onDragMove={handlePointDragMove}
              {...startPointAttr}
            />
          );
        })}
      </Group>
      {arrArea?.map(
        (item, idx) =>
          (item.type === curTypeDevice || curTypeDevice === 'all' || !curTypeDevice) && (
            <Group
              key={idx}
              ref={(el) => (refPolygon.current[idx] = el)}
              draggable={isEdit}
              x={item?.textPoint?.topPol.x * width}
              y={item?.textPoint?.topPol.y * height}
              onDragEnd={(e) => handleDragEnd(e, idx)}
              onMouseOver={handleGroupMouseOver}
              onClick={() => handleSelected(item.label)}
              onMouseOut={handleGroupMouseOut}
              onMouseUp={(e) => handleContextMenu(e, item?.key)}
              onContextMenu={(e) => handleContextMenu(e, item.key)}
            >
              <Rect
                onMouseUp={(e) => handleContextMenu(e, item?.key)}
                onContextMenu={(e) => handleContextMenu(e, item.key)}
                key={item.key}
                x={-66}
                y={-50}
                height={
                  item.telemetry?.length === 0
                    ? 26
                    : item.telemetry?.length === 1
                      ? 36
                      : item.telemetry?.length === 2
                        ? 50
                        : 65
                }
                width={130}
                fill='white'
                cornerRadius={6}
                shadowColor='black'
                shadowBlur={10}
                shadowOpacity={0.5}
              />

              <Text text={item?.label?.toUpperCase()} x={-59} y={-44} fontSize={12} fontStyle='bold' fill={'#007EF5'} />
              {item.telemetry?.map(
                (value, telemetryIdx) =>
                  value.isShow && (
                    <TelemetryText device={item} key={telemetryIdx} value={value} telemetryIdx={telemetryIdx} />
                  )
              )}
            </Group>
          )
      )}
    </>
  );
};

export default PolygonAnnotation;

interface TelemetryTextProps {
  value: any;
  telemetryIdx: number;
  device: any;
}

const TelemetryText: React.FC<TelemetryTextProps> = ({ value, telemetryIdx, device }) => {
  const { data: initLatestTelemetry } = useGetLatestTelemetry({
    entityType: 'DEVICE',
    entityId: device.key
  });
  const [itemTitle, setItemTitle] = useState<any>(value);

  const { rows } = useSocketLatestTelemetry({
    dependency: [device.key],
    topic: `/topic/${device.key}`,
    initData: initLatestTelemetry?.data?.data,
    connectHeaders: {}
  });
  useEffect(() => {
    if (rows.length > 0) {
      rows.map((item) => {
        if (item.id === itemTitle.name) {
          setItemTitle((prev) => ({ ...prev, value: JSON.parse(item.value)?.value }));
        }
      });
    }
  }, [rows]);
  useEffect(() => {
    for (const item in initLatestTelemetry?.data?.data) {
      if (itemTitle.name === item) {
        setItemTitle((prev) => ({ ...prev, value: initLatestTelemetry?.data?.data[item]?.value }));
      }
    }
  }, [initLatestTelemetry, itemTitle.name]);

  return (
    <Text
      text={
        `${itemTitle?.label ? itemTitle?.label + ': ' : ''}` +
        itemTitle.value +
        ' ' +
        (itemTitle.tempo ? itemTitle.tempo : '')
      }
      x={-59}
      y={-28 + telemetryIdx * 14}
      fontSize={12}
      fill={'#333333'}
    />
  );
};

interface TelemetryPolygonProps {
  telemetryIdx: number;
  arrArea?: any[];
  width?: number;
  height?: number;
  handleContextMenu?: (e: any, label: string) => void;
  item?: any;
  updateBorderColor?: (value: number) => string;
  updateColor?: (value: number) => string;
}
const TelemetryPolygon: React.FC<TelemetryPolygonProps> = ({ telemetryIdx, arrArea, width, height, handleContextMenu, item, updateBorderColor, updateColor }) => {
  const { data: initLatestTelemetry } = useGetLatestTelemetry({
    entityType: 'DEVICE',
    entityId: arrArea[telemetryIdx]?.key
  });
  const [health, setHealth] = useState<any>(0);

  const { rows } = useSocketLatestTelemetry({
    dependency: [arrArea[telemetryIdx]?.key],
    topic: `/topic/${arrArea[telemetryIdx]?.key}`,
    initData: initLatestTelemetry?.data?.data,
    connectHeaders: {}
  });
  useEffect(() => {
    if (rows.length > 0) {
      rows.map((item) => {
        if (item.key === 'data_health') {
          setHealth(JSON.parse(item.value)?.value);
        }

      });
    }
  }, [rows]);
  useEffect(() => {
    for (const item in initLatestTelemetry?.data?.data) {
      if ('data_health' === item) {
        setHealth(initLatestTelemetry?.data?.data[item]?.value);
      }
    }
  }, [initLatestTelemetry]);

  return (
    <Group
      key={telemetryIdx}
      onContextMenu={(e) => handleContextMenu(e, arrArea[telemetryIdx]?.key)}
      onMouseUp={(e) => handleContextMenu(e, arrArea[telemetryIdx]?.key)}
    >
      <Line
        points={item}
        stroke={updateBorderColor(health)}
        strokeWidth={2}
        closed={true}
        fill={updateColor(health)}
      />
      <Line
        points={[
          arrArea[telemetryIdx]?.textPoint?.centerPol.x * width,
          arrArea[telemetryIdx]?.textPoint?.centerPol.y * height,
          arrArea[telemetryIdx]?.textPoint?.topPol.x * width,
          arrArea[telemetryIdx]?.textPoint?.topPol.y * height - 25
        ]}
        stroke={updateBorderColor(health)}
        strokeWidth={1}
        fill='black'
      />
    </Group>
  );
};