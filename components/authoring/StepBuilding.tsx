'use client';

import { useState, useEffect } from 'react';

const BUILD_STEPS = [
  { label: 'Selecting optimal layout',    icon: '🎨', duration: 800 },
  { label: 'Pulling player statistics',   icon: '📥', duration: 700 },
  { label: 'Calculating season averages', icon: '🧮', duration: 600 },
  { label: 'Rendering season trend chart',icon: '📈', duration: 700 },
  { label: 'Building player leaderboard', icon: '📋', duration: 600 },
  { label: 'Generating comparison charts',icon: '📊', duration: 600 },
  { label: 'Assembling player cards',     icon: '🃏', duration: 500 },
  { label: 'Applying Iowa State branding',icon: '🌪️', duration: 400 },
  { label: 'Final polish',               icon: '✨', duration: 500 },
];

export default function StepBuilding({ onComplete }: { onComplete: () => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let stepIdx = 0;
    let elapsed = 0;
    const totalDuration = BUILD_STEPS.reduce((s, b) => s + b.duration, 0) + 600;

    const tick = () => {
      if (stepIdx >= BUILD_STEPS.length) {
        setDone(true);
        setProgress(100);
        setTimeout(onComplete, 600);
        return;
      }
      setCurrentStep(stepIdx);
      elapsed += BUILD_STEPS[stepIdx].duration;
      setProgress(Math.round((elapsed / totalDuration) * 100));
      stepIdx++;
      if (stepIdx < BUILD_STEPS.length) {
        setTimeout(tick, BUILD_STEPS[stepIdx - 1].duration);
      } else {
        setTimeout(() => {
          setDone(true);
          setProgress(100);
          setTimeout(onComplete, 600);
        }, BUILD_STEPS[stepIdx - 1].duration);
      }
    };

    const start = setTimeout(tick, 200);
    return () => clearTimeout(start);
  }, [onComplete]);

  return (
    <div className="w-full max-w-xl animate-fade-up">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="relative inline-block mb-6">
          {/* M3 Surface container with extra-large shape */}
          <div
            className="w-24 h-24 flex items-center justify-center text-5xl"
            style={{
              background: 'var(--md-surface-container)',
              borderRadius: 'var(--md-shape-extra-large)',
              boxShadow: 'var(--md-elevation-2)',
            }}
          >
            {done ? '✅' : BUILD_STEPS[currentStep]?.icon ?? '🔨'}
          </div>
          {!done && (
            <div
              className="absolute inset-0 animate-ping opacity-30"
              style={{
                borderRadius: 'var(--md-shape-extra-large)',
                border: '2px solid var(--md-primary)',
              }}
            />
          )}
        </div>

        {/* M3 Headline Small */}
        <h2 className="text-2xl font-normal text-foreground mb-2 tracking-[0px]">
          {done ? 'Dashboard Ready!' : 'Building your dashboard...'}
        </h2>

        {/* M3 Body Medium */}
        <p
          className="text-sm tracking-[0.25px]"
          style={{ color: 'var(--md-on-surface-variant)' }}
        >
          {done
            ? 'Everything looks great. Launching preview...'
            : BUILD_STEPS[currentStep]?.label}
        </p>
      </div>

      {/* M3 Linear progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span
            className="text-xs tracking-[0.4px]"
            style={{ color: 'var(--md-on-surface-variant)' }}
          >
            Progress
          </span>
          <span className="text-xs font-mono font-semibold text-foreground">
            {progress}%
          </span>
        </div>
        {/* M3 track + indicator (4px height per spec) */}
        <div
          className="h-1 overflow-hidden"
          style={{
            background: 'var(--md-surface-variant)',
            borderRadius: 'var(--md-shape-full)',
          }}
        >
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{
              width: `${progress}%`,
              background: 'var(--md-primary)',
              borderRadius: 'var(--md-shape-full)',
            }}
          />
        </div>
      </div>

      {/* M3 List — build steps */}
      <div
        style={{
          background: 'var(--md-surface-container-low)',
          borderRadius: 'var(--md-shape-large)',
          boxShadow: 'var(--md-elevation-1)',
          overflow: 'hidden',
        }}
      >
        {BUILD_STEPS.map((step, i) => {
          const isComplete = i < currentStep || done;
          const isCurrent  = i === currentStep && !done;

          return (
            <div
              key={step.label}
              className="flex items-center gap-3 transition-all duration-300"
              style={{
                padding: '12px 16px',
                borderBottom: i < BUILD_STEPS.length - 1
                  ? '1px solid var(--md-outline-variant)'
                  : 'none',
                background: isCurrent ? 'var(--md-primary-container)' : 'transparent',
              }}
            >
              {/* Leading state indicator */}
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300"
                style={{
                  background: isComplete
                    ? 'oklch(0.88 0.09 152)'
                    : isCurrent
                    ? 'var(--md-primary)'
                    : 'var(--md-surface-variant)',
                }}
              >
                {isComplete ? (
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'oklch(0.35 0.14 152)' }}>
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : isCurrent ? (
                  <div
                    className="w-2 h-2 rounded-full animate-pulse"
                    style={{ background: 'var(--md-on-primary)' }}
                  />
                ) : (
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: 'var(--md-on-surface-variant)', opacity: 0.4 }}
                  />
                )}
              </div>

              <span className="text-sm mr-1">{step.icon}</span>

              {/* M3 Body Medium */}
              <span
                className="text-sm transition-colors duration-300 tracking-[0.25px]"
                style={{
                  color: isComplete
                    ? 'var(--md-on-surface-variant)'
                    : isCurrent
                    ? 'var(--md-on-primary-container)'
                    : 'var(--md-on-surface-variant)',
                  opacity: !isComplete && !isCurrent ? 0.5 : 1,
                  textDecoration: isComplete ? 'line-through' : 'none',
                  textDecorationColor: 'var(--md-outline)',
                }}
              >
                {step.label}
              </span>

              {/* Trailing activity indicator for active step */}
              {isCurrent && (
                <div className="ml-auto flex gap-1">
                  {[0, 1, 2].map(j => (
                    <div
                      key={j}
                      className="w-1 h-1 rounded-full bg-primary animate-pulse"
                      style={{ animationDelay: `${j * 150}ms` }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
