import React from 'react';
import { Ellipse, Group, Rect, Text } from 'react-konva';
import Konva from 'konva';
import MarkerDiagram from '../FeatureDiagram/macker-diagram';

// Define types for the props
interface Telemetry {
  label?: string;
  value: string | number;
  tempo?: string;
}

interface Point {
  x: number;
  y: number;
}

interface Item {
  id: string;
  label: string;
  type: string;
  telemetry?: Telemetry[];
  topLeftPoint: Point;
  topRightPoint?: Point;
  key?: string;
}

interface GroupMachineProps {
  index?: number;
  item?: Item;
  isEdit?: boolean;
  width?: number;
  height?: number;
  refShape?: any;
  handleGroupMouseOut?: () => void;
  handleGroupMouseOver?: () => void;
  handleDragStart?: (x: number) => void;
  handleDragEnd?: (e: Konva.KonvaEventObject<DragEvent>) => void;
  handleContextMenu: (e: Konva.KonvaEventObject<MouseEvent>, label: string) => void;
  setNumberKey?: (numberKey: number) => void;
  setShow?: (show: boolean) => void;
  setSelected?: (selected: boolean) => void;
  setCurCam?: (curCam: string) => void;
}

const GroupMachine: React.FC<GroupMachineProps> = ({
  index,
  item,
  isEdit,
  width,
  height,
  refShape,
  handleGroupMouseOut,
  handleGroupMouseOver,
  handleDragStart,
  handleDragEnd,
  handleContextMenu,
  setNumberKey,
  setShow,
  setSelected,
  setCurCam
}) => {
  let position = 6;

  const handleClickEdit = (numberKey: number) => {
    if (isEdit) {
      setNumberKey(numberKey);
      setShow(true);
      setSelected(true);
    }
  };

  const handleSelectCamera = (value: Item) => {
    if (value.type === "TC-CAM") {
      setCurCam(value.key);
    }
  };

  return (
    <Group
      ref={(el) => (refShape.current[index] = el!)}
      draggable={isEdit ? true : false}
      key={item.id}
      onClick={() => handleSelectCamera(item)}
      onDragStart={() => handleDragStart(item.topLeftPoint.x)}
      onDragEnd={(e) => handleDragEnd(e)}
      id={item.id}
      x={
        (item.topRightPoint?.x! * width + 90 > width
          ? width - 90
          : item.topRightPoint?.x! * width) - 5
      }
      y={
        (item.topRightPoint?.y! * height < 40
          ? 20
          : item.topRightPoint?.y! * height) - 13
      }
      onMouseUp={(e) => handleContextMenu(e, item.label)}
      onContextMenu={(e) => handleContextMenu(e, item.label)}
    >
      <Rect
        onMouseOut={handleGroupMouseOut}
        onMouseOver={handleGroupMouseOver}
        fill="white"
        cornerRadius={6}
        width={130}
        height={
          item.telemetry?.length === 1
            ? 35
            : item.telemetry?.length === 2
              ? 46
              : item.telemetry?.length === 3
                ? 60
                : 25
        }
        x={-12}
        shadowColor="black"
        shadowBlur={10}
        shadowOpacity={0.5}
        onClick={() => handleClickEdit(item.topLeftPoint.x)}
        onMouseUp={(e) => handleContextMenu(e, item.label)}
        onContextMenu={(e) => handleContextMenu(e, item.label)}
      />

      {/* label */}
      <Text
        text={item?.label?.toUpperCase()}
        x={-6}
        y={item.type === 'ca' ? 10 : 6}
        fontSize={12}
        fill="black"
        fontStyle="bold"
      />

      {/* info */}
      {item.telemetry?.map((value, idx) => (
        <Text
          key={idx} // Add a key prop when mapping elements
          text={
            `${value?.label ? value?.label + ': ' : ''}` +
            value.value +
            ' ' +
            (value.tempo ? value.tempo : '')
          }
          x={-6}
          y={(position += 13)}
          fontSize={11}
          fontStyle="italic"
          fill={idx === 0 ? '#c0504e' : idx === 1 ? '#3949ab' : '#188039'}
        />
      ))}
      {/* shadow */}
      <Ellipse
        x={53}
        y={
          item.telemetry?.length === 2
            ? 120
            : item.telemetry?.length === 3
              ? 130
              : item.telemetry?.length === 1
                ? 108
                : 98
        }
        radiusX={9}
        radiusY={4}
        fill="#2A2B2B"
        opacity={0.6}
        shadowColor="black"
        shadowBlur={4}
        shadowOpacity={1}
      />
      <MarkerDiagram item={item} />
    </Group>
  );
};

export default GroupMachine;