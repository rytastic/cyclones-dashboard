'use client';

import ReactECharts from 'echarts-for-react';
import type { Season, ChartMetric } from './types';
import { METRIC_LABELS, METRIC_SHORT } from './types';

interface Props {
  season: Season;
  metric: ChartMetric;
  highlightedPlayer: string | null;
}

export default function ComparisonChart({ season, metric, highlightedPlayer }: Props) {
  const primaryColor = '#3b82f6';
  const dimColor = '#cbd5e1';

  const data = [...season.players]
    .sort((a, b) => b[metric] - a[metric])
    .map(p => ({
      name: p.name.split(' ').pop() ?? p.name,
      fullName: p.name,
      value: +p[metric].toFixed(1),
    }));

  const option = {
    backgroundColor: 'transparent',
    grid: { top: 8, right: 16, bottom: 56, left: 40, containLabel: false },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#1e293b',
      borderColor: '#334155',
      borderWidth: 1,
      textStyle: { color: '#e2e8f0', fontSize: 12 },
      axisPointer: { type: 'none' },
      formatter: (params: { name: string; value: number }[]) => {
        const p = params[0];
        const full = data.find(d => d.name === p.name)?.fullName ?? p.name;
        return `${full}<br/><b>${p.value} ${METRIC_SHORT[metric]}</b>`;
      },
    },
    xAxis: {
      type: 'category',
      data: data.map(d => d.name),
      axisLine: { lineStyle: { color: '#e2e8f0' } },
      axisTick: { show: false },
      axisLabel: { color: '#94a3b8', fontSize: 10, rotate: -35, interval: 0 },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: '#f1f5f9' } },
      axisLabel: { color: '#94a3b8', fontSize: 11 },
    },
    series: [
      {
        type: 'bar',
        data: data.map(d => {
          const isHl = highlightedPlayer !== null &&
            d.fullName.toLowerCase().includes(highlightedPlayer.toLowerCase());
          return {
            value: d.value,
            itemStyle: {
              color: isHl ? primaryColor : dimColor,
              opacity: highlightedPlayer && !isHl ? 0.5 : 1,
              borderRadius: [4, 4, 0, 0],
            },
          };
        }),
        barMaxWidth: 40,
      },
    ],
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="text-slate-800 font-semibold text-sm">Player Comparison</h3>
          <p className="text-slate-400 text-xs mt-0.5">
            {season.year} · {METRIC_LABELS[metric]}
          </p>
        </div>
        <div className="text-xs font-semibold px-2 py-1 rounded-md bg-slate-100 text-slate-600">
          {METRIC_SHORT[metric]}
        </div>
      </div>

      <ReactECharts option={option} style={{ height: 260 }} notMerge />
    </div>
  );
}
