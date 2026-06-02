'use client';

import { useState, useEffect } from 'react';

const SOURCES = [
  { id: 's1', title: 'Cyclone basketball 2020-21', subtitle: 'Men + Women full season with roster', chipLabel: 'Cyclone basketball 2020-21' },
  { id: 's2', title: 'Cyclone basketball 2022-23', subtitle: 'Men + Women full season with roster', chipLabel: 'Cyclone basketball 2022-23' },
  { id: 's3', title: 'Kansas basketball 2024-25', subtitle: 'Roster only', chipLabel: 'Kansas basketball 2024-25' },
  { id: 's4', title: 'Cyclone basketball 2022-23', subtitle: 'Non-conference opponents', defaultChecked: true, chipLabel: 'Cyclone basketball (non-con) 2022-23' },
];

interface SelectedSource { id: string; label: string }

interface Props {
  onNext: (selected: SelectedSource[]) => void;
  onSelectionChange?: (selected: SelectedSource[]) => void;
}

export default function StepDataSource({ onNext, onSelectionChange }: Props) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(SOURCES.filter((s) => s.defaultChecked).map((s) => s.id))
  );

  // Notify parent whenever selection changes (including initial state)
  useEffect(() => {
    const items = SOURCES
      .filter(s => selected.has(s.id))
      .map(s => ({ id: s.id, label: s.chipLabel }));
    onSelectionChange?.(items);
  }, [selected, onSelectionChange]);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  return (
    <div className="w-full max-w-[600px] animate-fade-up">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden" style={{ border: '1px solid var(--md-outline-variant)' }}>
        <div className="px-6 pt-5 pb-2">
          <h2 className="text-base font-semibold text-foreground tracking-[0.1px]">Suggested sources</h2>
        </div>

        <ul className="divide-y divide-[var(--md-outline-variant)]">
          {SOURCES.map((source) => {
            const checked = selected.has(source.id);
            return (
              <li key={source.id}>
                <button
                  onClick={() => toggle(source.id)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-[var(--md-surface-container-low)] transition-colors text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{source.title}</p>
                    <p className="text-xs text-[var(--md-on-surface-variant)] mt-0.5">{source.subtitle}</p>
                  </div>
                  <div
                    className="w-5 h-5 flex-shrink-0 flex items-center justify-center rounded transition-colors ml-4"
                    style={{
                      border: checked ? 'none' : '2px solid #94a3b8',
                      background: checked ? 'var(--md-primary)' : 'transparent',
                    }}
                  >
                    {checked && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex justify-end px-6 py-4">
          <button
            onClick={() => {
              if (selected.size === 0) return;
              const items = SOURCES
                .filter(s => selected.has(s.id))
                .map(s => ({ id: s.id, label: s.chipLabel }));
              onNext(items);
            }}
            disabled={selected.size === 0}
            className="flex items-center gap-1.5 text-sm font-medium transition-opacity"
            style={{
              padding: '10px 24px',
              borderRadius: 9999,
              background: selected.size > 0 ? 'var(--md-primary)' : 'var(--md-surface-variant)',
              color: selected.size > 0 ? 'var(--md-on-primary)' : 'var(--md-on-surface-variant)',
              opacity: selected.size > 0 ? 1 : 0.5,
              cursor: selected.size > 0 ? 'pointer' : 'not-allowed',
            }}
          >
            Next
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
