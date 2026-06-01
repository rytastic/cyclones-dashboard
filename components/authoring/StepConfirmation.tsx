'use client';

import { useState, useEffect } from 'react';

interface Props {
  prompt: string;
  onConfirm: () => void;
  onBack: () => void;
}

const INTENT_CARDS = [
  {
    icon: '📊',
    title: 'Season-over-Season Trends',
    description: 'Line chart comparing key stats across 5 seasons (2020–21 through 2024–25)',
    tag: 'Visualization',
    tagStyle: {
      background: 'var(--md-tertiary-container)',
      color: 'var(--md-on-tertiary-container)',
    },
  },
  {
    icon: '🏀',
    title: 'Player Leaderboard',
    description: 'Sortable table of all players with PPG, rebounds, assists, FG%, and more',
    tag: 'Table',
    tagStyle: {
      background: 'var(--md-secondary-container)',
      color: 'var(--md-on-secondary-container)',
    },
  },
  {
    icon: '🎯',
    title: 'Top Performer Cards',
    description: "Highlight cards for the season's top 3 scorers with full stat breakdowns",
    tag: 'Cards',
    tagStyle: {
      background: 'var(--md-primary-container)',
      color: 'var(--md-on-primary-container)',
    },
  },
];

const REFINEMENTS = [
  'Show only Big 12 conference games',
  'Add a player comparison tool',
  'Include shooting heat maps',
];

export default function StepConfirmation({ prompt, onConfirm, onBack }: Props) {
  const [thinking, setThinking] = useState(true);
  const [selectedRefinements, setSelectedRefinements] = useState<string[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setThinking(false), 1800);
    return () => clearTimeout(t);
  }, []);

  const toggleRefinement = (r: string) => {
    setSelectedRefinements(prev =>
      prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]
    );
  };

  if (thinking) {
    return (
      <div className="w-full max-w-2xl flex flex-col items-center gap-8 animate-fade-up">
        {/* Thinking indicator */}
        <div className="relative">
          <div
            className="w-20 h-20 flex items-center justify-center text-5xl"
            style={{
              background: 'var(--md-surface-container)',
              borderRadius: 'var(--md-shape-extra-large)',
              boxShadow: 'var(--md-elevation-2)',
            }}
          >
            🤔
          </div>
          <div
            className="absolute -bottom-1 -right-1 w-6 h-6 flex items-center justify-center bg-primary rounded-full"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-primary-foreground animate-pulse" />
          </div>
        </div>

        <div className="text-center">
          <p
            className="text-sm mb-4 tracking-[0.25px]"
            style={{ color: 'var(--md-on-surface-variant)' }}
          >
            Analyzing your request...
          </p>
          <div
            className="inline-flex items-center gap-2 px-5 py-2.5"
            style={{
              background: 'var(--md-surface-container)',
              borderRadius: 'var(--md-shape-full)',
              boxShadow: 'var(--md-elevation-1)',
            }}
          >
            <ThinkingDots />
            <span
              className="text-sm font-medium italic tracking-[0.1px]"
              style={{ color: 'var(--md-on-surface)' }}
            >
              &ldquo;{prompt.slice(0, 60)}{prompt.length > 60 ? '…' : ''}&rdquo;
            </span>
          </div>
        </div>

        <div className="w-full max-w-sm space-y-2">
          {['Parsing intent', 'Identifying data sources', 'Mapping layout'].map((label, i) => (
            <ThinkingRow key={label} label={label} delay={i * 400} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl animate-fade-up">
      {/* Header */}
      <div className="text-center mb-8">
        {/* M3 "Intent Understood" badge — success tonal */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-4"
          style={{
            background: 'oklch(0.92 0.08 152)',  /* green container */
            color: 'oklch(0.22 0.10 152)',
            borderRadius: 'var(--md-shape-full)',
          }}
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          <span className="text-xs font-semibold uppercase tracking-widest">Intent Understood</span>
        </div>

        {/* M3 Headline Medium */}
        <h2 className="text-2xl font-normal text-foreground mb-2 tracking-[0px]">
          Here&apos;s what I&apos;ll build
        </h2>
        <p
          className="text-sm tracking-[0.25px]"
          style={{ color: 'var(--md-on-surface-variant)' }}
        >
          A full Cyclones basketball dashboard with these components:
        </p>
      </div>

      {/* M3 Elevated cards — intent items */}
      <div className="grid grid-cols-1 gap-3 mb-6">
        {INTENT_CARDS.map((card, i) => (
          <div
            key={card.title}
            className="flex items-start gap-4 animate-fade-up"
            style={{
              background: 'var(--md-surface-container-low)',
              borderRadius: 'var(--md-shape-large)',
              padding: '16px',
              boxShadow: 'var(--md-elevation-1)',
              animationDelay: `${i * 80}ms`,
              animationFillMode: 'both',
            }}
          >
            {/* Leading icon container */}
            <div
              className="w-10 h-10 flex items-center justify-center text-xl flex-shrink-0"
              style={{
                background: 'var(--md-surface-container-high)',
                borderRadius: 'var(--md-shape-medium)',
              }}
            >
              {card.icon}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                {/* M3 Title Small */}
                <span className="text-foreground font-medium text-sm tracking-[0.1px]">
                  {card.title}
                </span>
                {/* M3 Assist chip */}
                <span
                  className="px-2 py-0.5 text-[10px] font-semibold"
                  style={{
                    ...card.tagStyle,
                    borderRadius: 'var(--md-shape-full)',
                  }}
                >
                  {card.tag}
                </span>
              </div>
              {/* M3 Body Small */}
              <p
                className="text-xs leading-5 tracking-[0.4px]"
                style={{ color: 'var(--md-on-surface-variant)' }}
              >
                {card.description}
              </p>
            </div>

            {/* Trailing checkmark */}
            <svg
              className="w-4 h-4 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
              style={{ color: 'oklch(0.45 0.16 152)' }}
            >
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        ))}
      </div>

      {/* M3 Filter chips — optional refinements */}
      <div
        className="p-4 mb-6"
        style={{
          background: 'var(--md-surface-container)',
          borderRadius: 'var(--md-shape-large)',
        }}
      >
        <p
          className="text-xs font-semibold uppercase tracking-[1px] mb-3"
          style={{ color: 'var(--md-on-surface-variant)' }}
        >
          Optional: Refine your dashboard
        </p>
        <div className="flex flex-wrap gap-2">
          {REFINEMENTS.map(r => {
            const selected = selectedRefinements.includes(r);
            return (
              <button
                key={r}
                onClick={() => toggleRefinement(r)}
                className="flex items-center gap-1.5 text-xs font-medium transition-all duration-150"
                style={{
                  padding: '6px 16px',
                  borderRadius: 'var(--md-shape-full)',
                  border: selected ? 'none' : '1px solid var(--md-outline-variant)',
                  background: selected ? 'var(--md-primary-container)' : 'transparent',
                  color: selected ? 'var(--md-on-primary-container)' : 'var(--md-on-surface-variant)',
                }}
              >
                {selected && (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {r}
              </button>
            );
          })}
        </div>
      </div>

      {/* CTAs — M3 Outlined + Filled button pair */}
      <div className="flex items-center gap-3">
        {/* M3 Outlined button */}
        <button
          onClick={onBack}
          className="text-sm font-medium tracking-[0.1px] transition-all duration-150 hover:opacity-80"
          style={{
            padding: '10px 24px',
            borderRadius: 'var(--md-shape-full)',
            border: '1px solid var(--md-outline)',
            color: 'var(--md-primary)',
            background: 'transparent',
          }}
        >
          ← Revise prompt
        </button>

        {/* M3 Filled button */}
        <button
          onClick={onConfirm}
          className="flex-1 flex items-center justify-center gap-2 text-sm font-medium tracking-[0.1px] transition-all duration-200 hover:opacity-90"
          style={{
            padding: '10px 24px',
            borderRadius: 'var(--md-shape-full)',
            background: 'var(--md-primary)',
            color: 'var(--md-on-primary)',
            boxShadow: 'var(--md-elevation-1)',
          }}
        >
          Looks good, build it
          <span className="text-base">🚀</span>
        </button>
      </div>
    </div>
  );
}

function ThinkingDots() {
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"
          style={{ animationDelay: `${i * 200}ms` }}
        />
      ))}
    </div>
  );
}

function ThinkingRow({ label, delay }: { label: string; delay: number }) {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDone(true), delay + 600);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div className="flex items-center gap-3 text-sm">
      <div
        className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
        style={{
          background: done ? 'oklch(0.88 0.09 152)' : 'var(--md-surface-variant)',
        }}
      >
        {done ? (
          <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'oklch(0.35 0.14 152)' }}>
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        ) : (
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        )}
      </div>
      <span
        className="transition-colors duration-300 tracking-[0.25px]"
        style={{ color: done ? 'var(--md-on-surface)' : 'var(--md-on-surface-variant)' }}
      >
        {label}
      </span>
    </div>
  );
}
