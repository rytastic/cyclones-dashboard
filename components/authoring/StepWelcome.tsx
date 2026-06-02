'use client';

import { useState, useRef, useEffect } from 'react';

const SUGGESTIONS = [
  'Build me a basketball stats dashboard for Iowa State Cyclones showing the last 5 seasons',
  'Show me a player comparison view for this season with scoring leaders',
  'Create a season-over-season trend dashboard with team and individual stats',
];

export default function StepWelcome({ onSubmit }: { onSubmit: (prompt: string) => void }) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { textareaRef.current?.focus(); }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && value.trim()) {
      e.preventDefault();
      onSubmit(value.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl animate-fade-up">
      {/* Hero */}
      <div className="text-center mb-10">
        {/* M3 Assist chip — "AI Dashboard Builder" badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 mb-6"
          style={{
            background: 'var(--md-primary-container)',
            color: 'var(--md-on-primary-container)',
            borderRadius: 'var(--md-shape-full)',
          }}
        >
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest">AI Dashboard Builder</span>
        </div>

        {/* M3 Display Small */}
        <h1 className="text-4xl font-normal text-foreground mb-3 leading-tight tracking-[-0.25px]">
          What would you like<br />
          <span className="text-primary font-medium">to build today?</span>
        </h1>

        {/* M3 Body Large */}
        <p className="text-[var(--md-on-surface-variant)] text-base leading-6 tracking-[0.5px]">
          Describe your dashboard in plain English. Our AI will design and build it for you.
        </p>
      </div>

      {/* M3 Outlined text field (multiline) */}
      <div
        className="bg-[var(--md-surface-container-low)] transition-all duration-200"
        style={{
          borderRadius: 'var(--md-shape-extra-large)',
          border: focused
            ? '2px solid var(--md-primary)'
            : '1px solid var(--md-outline)',
          boxShadow: 'var(--md-elevation-1)',
        }}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Build me a basketball stats dashboard for Iowa State Cyclones showing the last 5 seasons..."
          rows={4}
          className="w-full bg-transparent text-foreground placeholder-[var(--md-on-surface-variant)] p-5 text-base resize-none outline-none leading-relaxed tracking-[0.5px]"
        />

        {/* Action row */}
        <div className="flex items-center justify-between px-5 pb-4">
          <span className="text-[var(--md-on-surface-variant)] text-xs tracking-[0.4px]">
            Enter to continue · Shift+Enter for new line
          </span>

          {/* M3 Filled button */}
          <button
            onClick={() => value.trim() && onSubmit(value.trim())}
            disabled={!value.trim()}
            className="flex items-center gap-2 text-sm font-medium tracking-[0.1px] transition-all duration-200"
            style={{
              padding: '10px 24px',
              borderRadius: 'var(--md-shape-full)',
              background: value.trim() ? 'var(--md-primary)' : 'var(--md-surface-variant)',
              color: value.trim() ? 'var(--md-on-primary)' : 'var(--md-on-surface-variant)',
              boxShadow: value.trim() ? 'var(--md-elevation-1)' : 'none',
              opacity: value.trim() ? 1 : 0.6,
              cursor: value.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            Generate Dashboard
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>
      </div>

      {/* M3 Suggestion chips */}
      <div className="mt-6">
        <p
          className="text-xs uppercase tracking-[1px] mb-3 text-center"
          style={{ color: 'var(--md-on-surface-variant)' }}
        >
          Try one of these
        </p>
        <div className="flex flex-col gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => { setValue(s); textareaRef.current?.focus(); }}
              className="text-left text-sm transition-all duration-150 group"
              style={{
                padding: '12px 16px',
                borderRadius: 'var(--md-shape-medium)',
                border: '1px solid var(--md-outline-variant)',
                background: 'var(--md-surface-container-low)',
                color: 'var(--md-on-surface-variant)',
                letterSpacing: '0.25px',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--md-primary-container)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--md-primary)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--md-on-primary-container)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = 'var(--md-surface-container-low)';
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--md-outline-variant)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--md-on-surface-variant)';
              }}
            >
              <span className="text-primary mr-2 font-medium">→</span>
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
