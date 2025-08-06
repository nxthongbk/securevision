import React from 'react';
import { Image as KonvaImage } from 'react-konva';
import useImage from 'use-image';

interface BackgroundDiagramProps {
  width: number;
  height: number;
  ImageDiagram: any;
  selected: boolean;
  isDraw: boolean;
}

const BackgroundDiagram: React.FC<BackgroundDiagramProps> = ({
  width,
  height,
  ImageDiagram,
  selected,
  isDraw,
}) => {

  const [image] = useImage(ImageDiagram);
  return (
    <KonvaImage
      width={width}
      height={height}
      image={image}
      onMouseEnter={(e) => {
        const container = e.target.getStage()?.container();
        if (container && selected && isDraw) {
          container.style.cursor = 'crosshair';
        }
      }}
      onMouseLeave={(e) => {
        const container = e.target.getStage()?.container();
        if (container) {
          container.style.cursor = 'default';
        }
      }}
    />
  );
};

export default BackgroundDiagram;
