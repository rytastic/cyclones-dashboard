'use client';

import { useState, useEffect } from 'react';
import type { Player } from './types';
import type { ChartMetric } from './types';

type SortKey = 'name' | 'ppg' | 'rpg' | 'apg' | 'spg' | 'bpg' | 'fgPct' | 'threePct' | 'ftPct' | 'mpg';

interface Props {
  players: Player[];
  highlightedPlayer: string | null;
  chartMetric: ChartMetric;
  externalSortKey?: string;
  limit?: number | null;
}

const COLUMNS: { key: SortKey; label: string; width: string }[] = [
  { key: 'name', label: 'Player', width: 'min-w-32' },
  { key: 'ppg', label: 'PPG', width: 'w-16' },
  { key: 'rpg', label: 'RPG', width: 'w-16' },
  { key: 'apg', label: 'APG', width: 'w-16' },
  { key: 'spg', label: 'STL', width: 'w-16' },
  { key: 'bpg', label: 'BLK', width: 'w-16' },
  { key: 'fgPct', label: 'FG%', width: 'w-16' },
  { key: 'threePct', label: '3P%', width: 'w-16' },
  { key: 'ftPct', label: 'FT%', width: 'w-16' },
  { key: 'mpg', label: 'MPG', width: 'w-16' },
];

export default function LeaderboardTable({ players, highlightedPlayer, chartMetric, externalSortKey, limit }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>('ppg');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Sync when an external command changes the sort
  useEffect(() => {
    if (externalSortKey && COLUMNS.some(c => c.key === externalSortKey)) {
      setSortKey(externalSortKey as SortKey);
      setSortDir(externalSortKey === 'name' ? 'asc' : 'desc');
    }
  }, [externalSortKey]);

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir(key === 'name' ? 'asc' : 'desc');
    }
  };

  const sorted = [...players].sort((a, b) => {
    const av = a[sortKey] as string | number;
    const bv = b[sortKey] as string | number;
    if (typeof av === 'string') {
      return sortDir === 'asc' ? av.localeCompare(bv as string) : (bv as string).localeCompare(av);
    }
    return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
  });

  const displayed = limit != null ? sorted.slice(0, limit) : sorted;

  const accent = '#3b82f6';
  const accentLight = 'bg-blue-50 border-blue-200';
  const accentText = 'text-[#3b82f6]';

  const metricToColumn: Record<ChartMetric, SortKey> = { ppg: 'ppg', rpg: 'rpg', apg: 'apg', spg: 'spg' };
  const highlightCol = metricToColumn[chartMetric];

  return (
    <div className="rounded-xl overflow-hidden border border-slate-100">
      {limit != null && limit < players.length && (
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-xs text-slate-400">
          Showing top {limit} of {players.length} players
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left px-4 py-3 text-slate-500 text-xs font-semibold uppercase tracking-wide w-8">#</th>
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`text-left px-3 py-3 text-xs font-semibold uppercase tracking-wide cursor-pointer select-none transition-colors duration-150 ${col.width} ${
                    sortKey === col.key ? accentText : 'text-slate-500'
                  } ${col.key === highlightCol ? 'bg-slate-100' : ''} hover:text-slate-700`}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key && (
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        {sortDir === 'desc'
                          ? <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                          : <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        }
                      </svg>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayed.map((player, idx) => {
              const isHighlighted = highlightedPlayer !== null &&
                player.name.toLowerCase().includes(highlightedPlayer.toLowerCase());
              const isTop = idx === 0 && sortKey === 'ppg' && sortDir === 'desc';

              return (
                <tr
                  key={player.name}
                  className={`border-b border-slate-100 last:border-0 transition-all duration-300 ${
                    isHighlighted ? `${accentLight} border-l-2` : 'hover:bg-slate-50'
                  }`}
                  style={isHighlighted ? { borderLeftColor: accent } : {}}
                >
                  <td className="px-4 py-3">
                    {isTop
                      ? <span className="text-base">🏆</span>
                      : <span className="text-slate-400 font-mono text-xs">{idx + 1}</span>
                    }
                  </td>
                  <td className="px-3 py-3">
                    <div>
                      <span className={`font-semibold ${isHighlighted ? accentText : 'text-slate-800'}`}>
                        {player.name}
                      </span>
                      {isHighlighted && (
                        <span className="ml-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#3b82f6] text-white">●</span>
                      )}
                    </div>
                    <span className="text-slate-400 text-xs">{player.position}</span>
                  </td>
                  {(['ppg','rpg','apg','spg','bpg','fgPct','threePct','ftPct','mpg'] as SortKey[]).map(key => (
                    <td
                      key={key}
                      className={`px-3 py-3 font-mono text-xs ${
                        sortKey === key ? accentText + ' font-bold' : 'text-slate-700'
                      } ${key === highlightCol ? 'bg-slate-50' : ''}`}
                    >
                      {typeof player[key] === 'number' ? (player[key] as number).toFixed(1) : player[key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
