'use client';

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useChartColors } from './use-chart-colors';

const axisProps = (color: string) =>
  ({
    stroke: color,
    fontSize: 12,
    tickLine: false,
    axisLine: false,
  }) as const;

function ChartTooltip({ colors }: { colors: Record<string, string> }) {
  return (
    <Tooltip
      cursor={{ fill: colors.muted ?? colors.border, opacity: 0.4 }}
      contentStyle={{
        background: colors.card,
        border: `1px solid ${colors.border}`,
        borderRadius: 10,
        color: colors.foreground,
        fontSize: 12,
        boxShadow: '0 4px 12px hsl(0 0% 0% / 0.08)',
      }}
      labelStyle={{ color: colors['muted-foreground'], marginBottom: 4 }}
    />
  );
}

interface SeriesData {
  [key: string]: string | number;
}

export function AreaTrendChart({
  data,
  xKey,
  yKey,
  height = 240,
}: {
  data: SeriesData[];
  xKey: string;
  yKey: string;
  height?: number;
}) {
  const c = useChartColors();
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 6, right: 6, left: -16, bottom: 0 }}>
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={c['chart-1']} stopOpacity={0.3} />
            <stop offset="100%" stopColor={c['chart-1']} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke={c.border} vertical={false} />
        <XAxis dataKey={xKey} {...axisProps(c['muted-foreground'])} />
        <YAxis {...axisProps(c['muted-foreground'])} width={48} />
        <ChartTooltip colors={c} />
        <Area
          type="monotone"
          dataKey={yKey}
          stroke={c['chart-1']}
          strokeWidth={2.5}
          fill="url(#areaFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function BarsChart({
  data,
  xKey,
  yKey,
  height = 240,
}: {
  data: SeriesData[];
  xKey: string;
  yKey: string;
  height?: number;
}) {
  const c = useChartColors();
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 6, right: 6, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={c.border} vertical={false} />
        <XAxis dataKey={xKey} {...axisProps(c['muted-foreground'])} />
        <YAxis {...axisProps(c['muted-foreground'])} width={48} />
        <ChartTooltip colors={c} />
        <Bar dataKey={yKey} fill={c['chart-1']} radius={[6, 6, 0, 0]} maxBarSize={42} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DonutChart({
  data,
  height = 240,
}: {
  data: { name: string; value: number }[];
  height?: number;
}) {
  const c = useChartColors();
  const palette = [c['chart-1'], c['chart-2'], c['chart-3'], c['chart-4'], c['chart-5']];
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          innerRadius="58%"
          outerRadius="82%"
          paddingAngle={2}
          stroke="none"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={palette[i % palette.length]} />
          ))}
        </Pie>
        <ChartTooltip colors={c} />
      </PieChart>
    </ResponsiveContainer>
  );
}
