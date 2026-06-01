'use client';

import { useState } from 'react';
import StepWelcome from './StepWelcome';
import StepConfirmation from './StepConfirmation';
import StepBuilding from './StepBuilding';
import StepPreview from './StepPreview';
import Dashboard from '@/components/dashboard/Dashboard';

export type Step = 'welcome' | 'confirmation' | 'building' | 'preview' | 'published';

export default function AuthoringFlow() {
  const [step, setStep] = useState<Step>('welcome');
  const [prompt, setPrompt] = useState('');

  if (step === 'published') {
    return <Dashboard />;
  }

  return (
    <div className="min-h-full bg-background flex flex-col">
      {/* M3 Top App Bar */}
      <header
        className="flex items-center justify-between px-6 py-3 bg-[var(--md-surface-container-low)] border-b border-[var(--md-outline-variant)]"
        style={{ boxShadow: 'var(--md-elevation-1)' }}
      >
        {/* Leading — app logo + title */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 flex items-center justify-center bg-primary text-primary-foreground font-bold text-xs"
            style={{ borderRadius: 'var(--md-shape-small)' }}
          >
            IS
          </div>
          <span className="text-foreground font-medium text-base tracking-[0.15px]">
            Dashboard Builder
          </span>
        </div>

        {/* Trailing — M3 horizontal stepper */}
        <StepPips current={step} />
      </header>

      <main className="flex-1 flex items-center justify-center p-8">
        {step === 'welcome' && (
          <StepWelcome onSubmit={(p) => { setPrompt(p); setStep('confirmation'); }} />
        )}
        {step === 'confirmation' && (
          <StepConfirmation
            prompt={prompt}
            onConfirm={() => setStep('building')}
            onBack={() => setStep('welcome')}
          />
        )}
        {step === 'building' && (
          <StepBuilding onComplete={() => setStep('preview')} />
        )}
        {step === 'preview' && (
          <StepPreview onPublish={() => setStep('published')} />
        )}
      </main>
    </div>
  );
}

const STEPS: Step[] = ['welcome', 'confirmation', 'building', 'preview'];
const STEP_LABELS: Record<Step, string> = {
  welcome:      'Describe',
  confirmation: 'Confirm',
  building:     'Build',
  preview:      'Preview',
  published:    'Published',
};

function StepPips({ current }: { current: Step }) {
  const idx = STEPS.indexOf(current);
  return (
    <div className="flex items-center">
      {STEPS.map((s, i) => {
        const isComplete = i < idx;
        const isActive   = i === idx;

        return (
          <div key={s} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              {/* Step circle */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                  isComplete
                    ? 'bg-primary text-primary-foreground'
                    : isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'border-2 border-[var(--md-outline-variant)] text-[var(--md-on-surface-variant)]'
                }`}
              >
                {isComplete ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              {/* Step label */}
              <span
                className={`text-[10px] font-medium tracking-[0.5px] uppercase transition-colors duration-300 ${
                  isActive ? 'text-primary' : 'text-[var(--md-on-surface-variant)]'
                }`}
              >
                {STEP_LABELS[s]}
              </span>
            </div>

            {/* Connector line */}
            {i < STEPS.length - 1 && (
              <div
                className={`w-10 h-px mx-2 mb-4 transition-colors duration-300 ${
                  isComplete ? 'bg-primary' : 'bg-[var(--md-outline-variant)]'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
