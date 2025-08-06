import Konva from 'konva';
import React, { useRef, useEffect } from 'react';
import { Image } from 'react-konva';

import default_marker from '../../../../../../assets/images/png/default_marker.png';
import useImage from 'use-image';

interface MarkerDiagramProps {
  item: {
    typeIcon?: string;
    telemetry?: any[];
  };
}

const MarkerDiagram: React.FC<MarkerDiagramProps> = ({ item }) => {
  const icon_marker = default_marker;
  const [iconDevice] = useImage(item?.typeIcon ? item?.typeIcon : icon_marker);

  const refFan = useRef<Konva.Image>(null);

  const centerY =
    item.telemetry?.length === 1
      ? 38
      : item.telemetry?.length === 2
        ? 50
        : item.telemetry?.length === 3
          ? 60
          : 28;

  useEffect(() => {
    const rect = refFan.current;
    if (rect) {
      const anim = new Konva.Animation((frame) => {
        rect.y(5 * Math.sin((frame?.time * 2 * Math.PI) / 2000) + centerY);
      }, rect.getLayer());

      anim.start();

      return () => {
        anim.stop(); // Cleanup animation on component unmount
      };
    }
  }, [centerY]);

  return <Image ref={refFan} x={18} image={iconDevice} width={60} height={70} />;
};

export default MarkerDiagram;
