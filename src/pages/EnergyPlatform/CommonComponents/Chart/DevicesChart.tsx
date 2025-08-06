import { ResponsiveContainer, Sankey, Tooltip } from 'recharts';

type SankeyNode = { name: string; color?: string };
type SankeyLink = { source: number; target: number; value: number; color?: string };
type SankeyData = { nodes: SankeyNode[]; links: SankeyLink[] };

type SankeyChartRechartsProps = {
  data: SankeyData;
};

const colorPalette = [
  '#8884d8',
  '#ff8000',
  '#3366ff',
  '#9933ff',
  '#66ff99',
  '#ff66cc',
  '#00cccc',
  '#ccff33',
  '#996633',
  '#999999',
];

const getNodeColor = (name: string, nodeColorMap: Record<string, string>) => {
  return nodeColorMap[name] || '#8884d8';
};

export default function SankeyChartRecharts({ data }: SankeyChartRechartsProps) {
  const nodeColorMap: Record<string, string> = {};
  const linkColorMap: Record<string, string> = {};

  data.nodes.forEach((node, index) => {
    nodeColorMap[node.name] = colorPalette[index % colorPalette.length];
  });

  data.links.forEach(link => {
    const targetNode = data.nodes[link.target];
    const targetName = targetNode?.name;
    const color = nodeColorMap[targetName] || '#ccc';
    link.color = color;
    linkColorMap[`${link.source}-${link.target}`] = color;
  });

  const renderCustomNode = (nodeProps: any) => {
    const { x, y, width, height, index, payload } = nodeProps;
    const nodeColor = getNodeColor(payload.name, nodeColorMap);

    if (typeof width !== 'number' || isNaN(width) || typeof height !== 'number' || isNaN(height)) {
      return null;
    }

    const isRoot = payload.depth === 0;
    const labelX = isRoot ? x - 8 : x + width + 6;
    const anchor = isRoot ? 'end' : 'start';

    return (
      <g key={`node-${index}`}>
        <rect x={x} y={y} width={width} height={height} fill={nodeColor} strokeWidth={1} />
        <text
          x={labelX}
          y={y + height / 2 - 6}
          fontSize={12}
          fill="#fff"
          textAnchor={anchor}
          dominantBaseline="middle"
        >
          {payload.name}
        </text>
        <text
          x={labelX}
          y={y + height / 2 + 14}
          fontSize={8}
          fill="#ccc"
          textAnchor={anchor}
          dominantBaseline="middle"
        >
          {payload.value !== undefined ? `${payload.value} kWh` : ''}
        </text>
      </g>
    );
  };
  const renderCustomLink = (props: any) => {
    const { sourceX, sourceY, targetX, targetY, sourceControlX, targetControlX, payload } = props;

    if (!payload) {
      return null;
    }

    const { value, color } = payload;
    const path = `
    M${sourceX},${sourceY}
    C${sourceControlX},${sourceY}
     ${targetControlX},${targetY}
     ${targetX},${targetY}
  `;

    return (
      <path
        d={path}
        stroke={color || '#aaa'}
        strokeWidth={Math.max(1, value / 50)}
        fill="none"
        opacity={0.3}
      />
    );
  };

  return (
    <ResponsiveContainer width="100%" minHeight={400}>
      <Sankey
        data={data}
        node={renderCustomNode}
        link={renderCustomLink}
        nodePadding={20}
        margin={{ top: 10, bottom: 10, left: 90, right: 170 }}
      >
        <Tooltip />
      </Sankey>
    </ResponsiveContainer>
  );
}
