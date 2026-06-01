'use client';

import { useState } from 'react';
import Dashboard from '@/components/dashboard/Dashboard';

export default function StepPreview({ onPublish }: { onPublish: () => void }) {
  const [publishing, setPublishing] = useState(false);

  const handlePublish = () => {
    setPublishing(true);
    setTimeout(onPublish, 800);
  };

  return (
    <div className="w-full h-full flex flex-col animate-fade-up" style={{ minHeight: 'calc(100vh - 120px)' }}>
      {/* M3 Banner bar — "Preview Mode" */}
      <div
        className="flex items-center justify-between px-5 py-3 mb-4 flex-shrink-0"
        style={{
          background: 'var(--md-surface-container-low)',
          borderRadius: 'var(--md-shape-large)',
          boxShadow: 'var(--md-elevation-1)',
        }}
      >
        {/* Leading — status chip */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-3 py-1"
            style={{
              background: 'var(--md-secondary-container)',
              borderRadius: 'var(--md-shape-full)',
            }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: 'var(--md-secondary)' }}
            />
            <span
              className="text-sm font-medium tracking-[0.1px]"
              style={{ color: 'var(--md-on-secondary-container)' }}
            >
              Preview Mode
            </span>
          </div>
          <span
            className="text-xs tracking-[0.4px]"
            style={{ color: 'var(--md-on-surface-variant)' }}
          >
            · Not yet published
          </span>
        </div>

        {/* Trailing — actions */}
        <div className="flex items-center gap-3">
          {/* Preview label */}
          <div
            className="flex items-center gap-1.5 text-xs tracking-[0.4px]"
            style={{ color: 'var(--md-on-surface-variant)' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview only
          </div>

          {/* M3 Filled button — Publish */}
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="flex items-center gap-2 text-sm font-medium tracking-[0.1px] transition-all duration-200"
            style={{
              padding: '10px 24px',
              borderRadius: 'var(--md-shape-full)',
              background: publishing
                ? 'oklch(0.88 0.09 152)'
                : 'var(--md-primary)',
              color: publishing
                ? 'oklch(0.22 0.10 152)'
                : 'var(--md-on-primary)',
              boxShadow: publishing ? 'none' : 'var(--md-elevation-1)',
              opacity: publishing ? 0.9 : 1,
            }}
          >
            {publishing ? (
              <>
                <div
                  className="w-3.5 h-3.5 border-2 rounded-full animate-spin"
                  style={{
                    borderColor: 'oklch(0.45 0.16 152 / 50%)',
                    borderTopColor: 'oklch(0.45 0.16 152)',
                  }}
                />
                Publishing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Publish Dashboard
              </>
            )}
          </button>
        </div>
      </div>

      {/* Dashboard preview — M3 elevated surface */}
      <div
        className="flex-1 overflow-hidden"
        style={{
          borderRadius: 'var(--md-shape-large)',
          boxShadow: 'var(--md-elevation-3)',
        }}
      >
        <Dashboard isPreview />
      </div>
    </div>
  );
}
