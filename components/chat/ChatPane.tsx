'use client';

import { useState, useRef, useEffect } from 'react';
import type { ChartMetric } from '@/components/dashboard/types';

interface Message {
  id: number;
  role: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export interface ParsedCommand {
  type:
    | 'setMetric'
    | 'highlight'
    | 'clearHighlight'
    | 'setSeason'
    | 'setChartType'
    | 'setSort'
    | 'setLimit'
    | 'setAccentColor'
    | 'setWidgetTitle';
  value?: string;
  widgetId?: string;
}

export interface WidgetContext {
  id: string;
  label: string;
  isChart: boolean;
}

interface Props {
  onCommand: (cmd: ParsedCommand) => void;
  onClose?: () => void;
  chartMetric: ChartMetric;
  highlightedPlayer: string | null;
  selectedWidget: WidgetContext | null;
  onClearWidget: () => void;
}

// ─── command parsing ──────────────────────────────────────────────────────────

const METRIC_TRIGGERS: { patterns: RegExp[]; metric: ChartMetric; label: string }[] = [
  { patterns: [/\brebound/i, /\brpg\b/i], metric: 'rpg', label: 'Rebounds Per Game' },
  { patterns: [/\bassist/i, /\bapg\b/i], metric: 'apg', label: 'Assists Per Game' },
  { patterns: [/\bsteal/i, /\bspg\b/i, /\bstl\b/i], metric: 'spg', label: 'Steals Per Game' },
  { patterns: [/\bpoints?\b/i, /\bscoring\b/i, /\bppg\b/i], metric: 'ppg', label: 'Points Per Game' },
];

const SORT_TRIGGERS: { patterns: RegExp[]; key: string; label: string }[] = [
  { patterns: [/sort.*\bpoints?\b/i, /sort.*\bppg\b/i, /sort.*\bscor/i], key: 'ppg', label: 'points' },
  { patterns: [/sort.*\brebound/i, /sort.*\brpg\b/i], key: 'rpg', label: 'rebounds' },
  { patterns: [/sort.*\bassist/i, /sort.*\bapg\b/i], key: 'apg', label: 'assists' },
  { patterns: [/sort.*\bsteal/i, /sort.*\bspg\b/i], key: 'spg', label: 'steals' },
  { patterns: [/sort.*\bblock/i, /sort.*\bbpg\b/i], key: 'bpg', label: 'blocks' },
  { patterns: [/sort.*\bminut/i, /sort.*\bmpg\b/i], key: 'mpg', label: 'minutes' },
  { patterns: [/sort.*\bfg%/i, /sort.*\bfield goal/i], key: 'fgPct', label: 'FG%' },
  { patterns: [/sort.*\bname/i, /sort.*\balpha/i], key: 'name', label: 'name' },
];

const COLOR_TRIGGERS: { patterns: RegExp[]; value: string; label: string }[] = [
  { patterns: [/\bred\b/i, /\bisu\b/i, /\bcardinal\b/i], value: '#C8102E', label: 'ISU cardinal red' },
  { patterns: [/\bblue\b/i], value: '#3b82f6', label: 'blue' },
  { patterns: [/\bgreen\b/i], value: '#22c55e', label: 'green' },
  { patterns: [/\bpurple\b/i], value: '#a855f7', label: 'purple' },
  { patterns: [/\bgold\b/i, /\byellow\b/i], value: '#f59e0b', label: 'gold' },
  { patterns: [/\borange\b/i], value: '#f97316', label: 'orange' },
];

const HIGHLIGHT_TRIGGER = /highlight\s+([\w\s]+?)(?:\s+in|\s+on|\s*$)/i;
const TOP_SCORER_TRIGGER = /highlight.*\btop\s+scor/i;
const CLEAR_TRIGGER = /clear|remove|reset\s+highlight/i;

function parseCommand(
  input: string,
  selectedWidget: WidgetContext | null,
): { command: ParsedCommand; response: string } | null {
  // ── highlight / clear (check before metric so "scorer" doesn't match PPG) ──
  if (CLEAR_TRIGGER.test(input)) {
    return {
      command: { type: 'clearHighlight' },
      response: 'Cleared! The player highlight has been removed.',
    };
  }
  if (TOP_SCORER_TRIGGER.test(input)) {
    return {
      command: { type: 'highlight', value: '__top_scorer__' },
      response: "Done! I've highlighted the top scorer in the leaderboard and player cards.",
    };
  }
  const hlMatch = input.match(HIGHLIGHT_TRIGGER);
  if (hlMatch) {
    const name = hlMatch[1].trim();
    return {
      command: { type: 'highlight', value: name },
      response: `Done! Highlighting **${name}** across the leaderboard and comparison chart.`,
    };
  }

  // ── chart type ─────────────────────────────────────────────────────────────
  if (/\bbar\b.*chart|\bbar\b.*graph|switch.*\bbar\b|change.*\bbar\b|as bars?\b|to bar\b/i.test(input)) {
    const widgetId = selectedWidget?.isChart ? selectedWidget.id : 'trend-chart';
    const label = selectedWidget?.isChart ? selectedWidget.label : 'Chart 1 · Scoring Trend';
    return {
      command: { type: 'setChartType', value: 'bar', widgetId },
      response: `Switched **${label}** to a bar chart.`,
    };
  }
  if (/\bline\b.*chart|\bline\b.*graph|switch.*\bline\b|change.*\bline\b|as lines?\b|to line\b/i.test(input)) {
    const widgetId = selectedWidget?.isChart ? selectedWidget.id : 'trend-chart';
    const label = selectedWidget?.isChart ? selectedWidget.label : 'Chart 1 · Scoring Trend';
    return {
      command: { type: 'setChartType', value: 'line', widgetId },
      response: `Switched **${label}** to a line chart.`,
    };
  }

  // ── leaderboard sort ───────────────────────────────────────────────────────
  for (const { patterns, key, label } of SORT_TRIGGERS) {
    if (patterns.some(p => p.test(input))) {
      return {
        command: { type: 'setSort', value: key },
        response: `Sorted the leaderboard by **${label}**.`,
      };
    }
  }

  // ── leaderboard row limit ──────────────────────────────────────────────────
  const topNMatch = input.match(/top\s+(\d+)\s*player|show\s+(\d+)\s*player|show\s+top\s+(\d+)/i);
  if (topNMatch) {
    const n = parseInt(topNMatch[1] ?? topNMatch[2] ?? topNMatch[3]);
    return {
      command: { type: 'setLimit', value: String(n) },
      response: `Showing the top **${n} players** in the leaderboard.`,
    };
  }
  if (/show\s+all|all\s+player|reset\s+(?:limit|filter)|full\s+leaderboard/i.test(input)) {
    return {
      command: { type: 'setLimit', value: '' },
      response: 'Showing all players in the leaderboard.',
    };
  }

  // ── accent color ───────────────────────────────────────────────────────────
  if (/color|theme|accent/i.test(input)) {
    for (const { patterns, value, label } of COLOR_TRIGGERS) {
      if (patterns.some(p => p.test(input))) {
        return {
          command: { type: 'setAccentColor', value },
          response: `Updated the chart accent to **${label}**.`,
        };
      }
    }
  }

  // ── widget title rename ────────────────────────────────────────────────────
  const renameMatch = input.match(
    /rename.*?to\s+["']?(.+?)["']?\s*$|set.*?title.*?to\s+["']?(.+?)["']?\s*$|call\s+(?:it|this)\s+["']?(.+?)["']?\s*$/i,
  );
  if (renameMatch && selectedWidget) {
    const newTitle = (renameMatch[1] ?? renameMatch[2] ?? renameMatch[3])?.trim();
    if (newTitle) {
      return {
        command: { type: 'setWidgetTitle', value: newTitle, widgetId: selectedWidget.id },
        response: `Renamed **${selectedWidget.label}** to **${newTitle}**.`,
      };
    }
  }

  // ── metric changes (after sort so "sort by points" ≠ metric change) ───────
  for (const { patterns, metric, label } of METRIC_TRIGGERS) {
    if (patterns.some(p => p.test(input))) {
      return {
        command: { type: 'setMetric', value: metric },
        response: `Updated both charts to show **${label}**.`,
      };
    }
  }

  return null;
}

// ─── component ────────────────────────────────────────────────────────────────

let msgIdCounter = 10;

export default function ChatPane({
  onCommand,
  onClose,
  chartMetric,
  highlightedPlayer,
  selectedWidget,
  onClearWidget,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      text: "Hi! Select a widget on the dashboard, then describe how you'd like to edit it.",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: ++msgIdCounter, role: 'user', text, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    await new Promise(r => setTimeout(r, 500 + Math.random() * 400));
    setIsTyping(false);

    const result = parseCommand(text, selectedWidget);
    let responseText: string;

    if (result) {
      onCommand(result.command);
      responseText = result.response;
    } else {
      responseText = buildFallback(text, selectedWidget);
    }

    setMessages(prev => [
      ...prev,
      { id: ++msgIdCounter, role: 'assistant', text: responseText, timestamp: new Date() },
    ]);
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-slate-900 flex items-center justify-center">
            <StarIcon className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-sm font-semibold text-slate-900">Data assistant</span>
        </div>
        <div className="flex items-center gap-0.5">
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
            <PaperclipIcon className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 transition-colors">
            <DotsIcon className="w-4 h-4" />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                <StarIcon className="w-3 h-3 text-white" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-slate-900 text-white rounded-tr-sm'
                  : 'bg-slate-100 text-slate-800 rounded-tl-sm'
              }`}
            >
              <FormattedText text={msg.text} />
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
              <StarIcon className="w-3 h-3 text-white" />
            </div>
            <div className="bg-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
              {[0, 1, 2].map(i => (
                <div
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"
                  style={{ animationDelay: `${i * 120}ms` }}
                />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Widget context card */}
      {selectedWidget && (
        <div className="px-4 py-3 border-t border-slate-100 flex-shrink-0">
          <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
            <div className="relative h-[88px] bg-gradient-to-b from-slate-50 to-white px-3 pt-3 pb-1">
              <MiniChartSVG />
              <button
                onClick={onClearWidget}
                className="absolute top-2 right-2 w-5 h-5 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
              >
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-3 py-2 border-t border-slate-100">
              <p className="text-xs font-medium text-slate-700">{selectedWidget.label}</p>
            </div>
          </div>

          {/* Context-aware suggestions */}
          <div className="mt-2.5 flex flex-wrap gap-2">
            {selectedWidget.isChart && (
              <>
                <SuggestionPill label="Change to bar chart" onSend={sendMessage} />
                <SuggestionPill label="Change to line chart" onSend={sendMessage} />
                <SuggestionPill label="Use ISU red" onSend={sendMessage} />
              </>
            )}
            {selectedWidget.id === 'leaderboard' && (
              <>
                <SuggestionPill label="Sort by rebounds" onSend={sendMessage} />
                <SuggestionPill label="Show top 5 players" onSend={sendMessage} />
              </>
            )}
            {selectedWidget.id === 'stats' && (
              <SuggestionPill label="Highlight top scorer" onSend={sendMessage} />
            )}
          </div>
        </div>
      )}

      {/* Global suggestions when nothing selected */}
      {!selectedWidget && (
        <div className="px-4 pb-3 flex-shrink-0">
          <p className="text-[10px] text-slate-400 uppercase tracking-wide font-medium mb-2">Try asking…</p>
          <div className="flex flex-wrap gap-2">
            <SuggestionPill label="Show rebounds" onSend={sendMessage} />
            <SuggestionPill label="Highlight top scorer" onSend={sendMessage} />
            <SuggestionPill label="Sort by assists" onSend={sendMessage} />
            <SuggestionPill label="Use ISU red" onSend={sendMessage} />
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 pb-4 pt-2 flex-shrink-0 border-t border-slate-100">
        <div className="flex items-center gap-2 bg-slate-100 rounded-2xl px-3 py-2.5">
          <button className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0 text-slate-500 hover:text-slate-700 transition-colors">
            <StarIcon className="w-3.5 h-3.5" />
          </button>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="Ask the data assistant…"
            className="flex-1 bg-transparent text-slate-800 placeholder-slate-400 text-sm outline-none"
          />
          <button
            onClick={() => sendMessage(input)}
            className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center flex-shrink-0 text-slate-500 hover:text-slate-700 transition-colors"
          >
            <StarIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── helpers ──────────────────────────────────────────────────────────────────

function buildFallback(text: string, selectedWidget: WidgetContext | null): string {
  const ctx = selectedWidget ? ` for **${selectedWidget.label}**` : '';
  return (
    `I can't do "${text}"${ctx} yet — here's what I can help with:\n` +
    `• **Chart type** — "change to bar chart" / "switch to line chart"\n` +
    `• **Metric** — "show rebounds", "switch to assists"\n` +
    `• **Highlight** — "highlight Tamin Lipsey", "highlight top scorer"\n` +
    `• **Leaderboard** — "sort by rebounds", "show top 5 players"\n` +
    `• **Colors** — "use ISU red", "use green theme"\n` +
    `• **Rename** — select a widget, then "rename to My Chart"`
  );
}

function SuggestionPill({ label, onSend }: { label: string; onSend: (t: string) => void }) {
  return (
    <button
      onClick={() => onSend(label)}
      className="inline-flex items-center px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-full transition-colors"
    >
      {label}
    </button>
  );
}

function MiniChartSVG() {
  return (
    <svg viewBox="0 0 200 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <path
        d="M0 46 C30 40 55 32 80 28 C110 23 150 21 200 16 L200 56 L0 56 Z"
        fill="#c0392b"
        fillOpacity="0.08"
      />
      <path
        d="M0 46 C30 40 55 32 80 28 C110 23 150 21 200 16"
        stroke="#c0392b"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M0 51 C40 50 80 49 120 49 C150 49 175 50 200 51"
        stroke="#94a3b8"
        strokeWidth="1.5"
        strokeDasharray="5 3"
        strokeLinecap="round"
      />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0.5L9.8 6.2L15.5 8L9.8 9.8L8 15.5L6.2 9.8L0.5 8L6.2 6.2L8 0.5Z" />
    </svg>
  );
}

function PaperclipIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
      />
    </svg>
  );
}

function DotsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </svg>
  );
}

function FormattedText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*|\n•[^\n]+)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
        }
        if (part.startsWith('\n•')) {
          return <div key={i} className="mt-1 pl-2 opacity-75">{part.slice(1)}</div>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}
