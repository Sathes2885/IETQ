import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#8dd1e1'];

interface ChartWrapperProps {
  height?: number | string;
  width?: number | string;
  children: React.ReactNode;
}

export function ChartWrapper({ height = 300, width = '100%', children }: ChartWrapperProps) {
  return (
    <div style={{ height, width, position: 'relative' }} className="chart-wrapper">
      {children}
    </div>
  );
}

interface BarChartProps {
  data: any[];
  xAxisKey: string;
  bars: {
    dataKey: string;
    name?: string;
    fill?: string;
    stackId?: string;
  }[];
  layout?: 'vertical' | 'horizontal';
  height?: number | string;
  yAxisDomain?: [number, number];
  showLegend?: boolean;
  showGrid?: boolean;
}

export function SimpleBarChart({
  data,
  xAxisKey,
  bars,
  layout = 'horizontal',
  height = 300,
  yAxisDomain,
  showLegend = true,
  showGrid = true,
}: BarChartProps) {
  const isVertical = layout === 'vertical';

  return (
    <ChartWrapper height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout={layout}
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} horizontal={!isVertical} vertical={isVertical} />}
          {isVertical ? (
            <>
              <XAxis type="number" domain={yAxisDomain} />
              <YAxis dataKey={xAxisKey} type="category" width={120} />
            </>
          ) : (
            <>
              <XAxis dataKey={xAxisKey} />
              <YAxis domain={yAxisDomain} />
            </>
          )}
          <Tooltip />
          {showLegend && <Legend />}
          {bars.map((bar, index) => (
            <Bar
              key={bar.dataKey}
              dataKey={bar.dataKey}
              name={bar.name || bar.dataKey}
              stackId={bar.stackId}
              fill={bar.fill || COLORS[index % COLORS.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

interface LineChartProps {
  data: any[];
  xAxisKey: string;
  lines: {
    dataKey: string;
    name?: string;
    stroke?: string;
    strokeWidth?: number;
    activeDot?: boolean | object;
    type?: 'monotone' | 'linear' | 'step' | 'stepBefore' | 'stepAfter' | 'basis' | 'basisOpen' | 'basisClosed' | 'natural' | 'monotoneX' | 'monotoneY';
  }[];
  height?: number | string;
  yAxisDomain?: [number, number];
  showLegend?: boolean;
  showGrid?: boolean;
}

export function SimpleLineChart({
  data,
  xAxisKey,
  lines,
  height = 300,
  yAxisDomain,
  showLegend = true,
  showGrid = true,
}: LineChartProps) {
  return (
    <ChartWrapper height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />}
          <XAxis dataKey={xAxisKey} />
          <YAxis domain={yAxisDomain} />
          <Tooltip />
          {showLegend && <Legend />}
          {lines.map((line, index) => (
            <Line
              key={line.dataKey}
              type={line.type || 'monotone'}
              dataKey={line.dataKey}
              name={line.name || line.dataKey}
              stroke={line.stroke || COLORS[index % COLORS.length]}
              strokeWidth={line.strokeWidth || 2}
              activeDot={line.activeDot === false ? undefined : line.activeDot || { r: 8 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

interface AreaChartProps {
  data: any[];
  xAxisKey: string;
  areas: {
    dataKey: string;
    name?: string;
    stroke?: string;
    fill?: string;
    fillOpacity?: number;
    stackId?: string;
    type?: 'monotone' | 'linear' | 'step' | 'stepBefore' | 'stepAfter' | 'basis' | 'basisOpen' | 'basisClosed' | 'natural' | 'monotoneX' | 'monotoneY';
  }[];
  height?: number | string;
  yAxisDomain?: [number, number];
  showLegend?: boolean;
  showGrid?: boolean;
}

export function SimpleAreaChart({
  data,
  xAxisKey,
  areas,
  height = 300,
  yAxisDomain,
  showLegend = true,
  showGrid = true,
}: AreaChartProps) {
  return (
    <ChartWrapper height={height}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />}
          <XAxis dataKey={xAxisKey} />
          <YAxis domain={yAxisDomain} />
          <Tooltip />
          {showLegend && <Legend />}
          {areas.map((area, index) => (
            <Area
              key={area.dataKey}
              type={area.type || 'monotone'}
              dataKey={area.dataKey}
              name={area.name || area.dataKey}
              stroke={area.stroke || COLORS[index % COLORS.length]}
              fill={area.fill || COLORS[index % COLORS.length]}
              fillOpacity={area.fillOpacity || 0.2}
              stackId={area.stackId}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

interface PieChartProps {
  data: any[];
  dataKey: string;
  nameKey?: string;
  labelType?: 'percent' | 'value' | 'name' | 'none';
  height?: number | string;
  width?: number | string;
  outerRadius?: number;
  innerRadius?: number;
  colors?: string[];
  showLegend?: boolean;
}

export function SimplePieChart({
  data,
  dataKey,
  nameKey = 'name',
  labelType = 'percent',
  height = 250,
  width = '100%',
  outerRadius = 80,
  innerRadius = 0,
  colors = COLORS,
  showLegend = true,
}: PieChartProps) {
  
  // Generate label based on type
  const renderLabel = ({ name, value, percent }: any) => {
    if (labelType === 'none') return null;
    if (labelType === 'percent') return `${(percent * 100).toFixed(0)}%`;
    if (labelType === 'value') return value;
    if (labelType === 'name') return name;
    return `${name}: ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <ChartWrapper height={height} width={width}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={labelType !== 'none'}
            label={renderLabel}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey={dataKey}
            nameKey={nameKey}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => (typeof value === 'number' ? value.toLocaleString() : value)} />
          {showLegend && <Legend />}
        </PieChart>
      </ResponsiveContainer>
    </ChartWrapper>
  );
}

export { COLORS };