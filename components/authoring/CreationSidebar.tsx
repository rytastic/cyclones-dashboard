'use client';

const NAV_SECTIONS = [
  {
    label: '26 Big 12 🏀 tournament',
    items: ['Kansas', 'TCU', 'Arizona', 'BYU', 'Houston'],
  },
  {
    label: '25 Big 12 🏀 tournament',
    items: ['Iowa State', 'Texas Tech'],
  },
];

export default function CreationSidebar({ onNewDash }: { onNewDash?: () => void }) {
  return (
    <aside
      className="flex flex-col h-full w-[200px] flex-shrink-0"
      style={{ background: '#1e293b', color: '#f1f5f9' }}
    >
      {/* Top row */}
      <div className="flex items-center px-4 pt-4 pb-3">
        <button
          className="p-1 rounded hover:bg-white/10 transition-colors"
          aria-label="Menu"
        >
          <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* New dash button */}
      <div className="px-3 pb-4">
        <button
          onClick={onNewDash}
          className="w-full flex items-center justify-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-90"
          style={{
            padding: '10px 16px',
            borderRadius: 9999,
            background: 'var(--md-primary)',
            color: 'var(--md-on-primary)',
          }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New dash
        </button>
      </div>

      {/* Nav sections */}
      <nav className="flex-1 overflow-y-auto px-2 space-y-4">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label}>
            <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              {section.label}
            </p>
            <ul className="space-y-0.5">
              {section.items.map((item) => (
                <li key={item}>
                  <button
                    className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-slate-300 hover:bg-white/10 transition-colors text-left"
                  >
                    <span className="w-5 h-5 flex items-center justify-center rounded-full border border-slate-500 text-slate-400 flex-shrink-0">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <circle cx="12" cy="12" r="4" />
                      </svg>
                    </span>
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Placeholder section */}
        <div>
          <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
            Section Header
          </p>
          {['Label', 'Label', 'Label'].map((label, i) => (
            <button
              key={i}
              className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-slate-500 hover:bg-white/10 transition-colors text-left"
            >
              <span className="w-5 h-5 flex items-center justify-center rounded-full border border-slate-600 flex-shrink-0">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </span>
              {label}
            </button>
          ))}
        </div>
      </nav>
    </aside>
  );
}
