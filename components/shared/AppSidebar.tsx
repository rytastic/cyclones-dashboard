'use client';

export interface NavItem {
  id: string;
  label: string;
  isPlaceholder?: boolean;
}

export interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
}

interface Props {
  sections: NavSection[];
  activeId?: string;
  collapsed?: boolean;
  onItemClick?: (id: string) => void;
  onNewDash?: () => void;
  onToggleCollapse?: () => void;
}

function TeamIcon({ active, isPlaceholder }: { active: boolean; isPlaceholder?: boolean }) {
  return (
    <div
      className="rounded-full flex-shrink-0 flex items-center justify-center transition-all"
      style={
        isPlaceholder
          ? { width: 22, height: 22, border: '1.5px solid #cbd5e1' }
          : active
          ? { width: 22, height: 22, background: 'var(--md-primary)' }
          : { width: 22, height: 22, border: '1.5px solid #94a3b8' }
      }
    >
      {!isPlaceholder && (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          style={{ width: 11, height: 11, color: active ? 'white' : '#94a3b8' }}
        >
          <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
        </svg>
      )}
    </div>
  );
}

export default function AppSidebar({
  sections,
  activeId,
  collapsed = false,
  onItemClick,
  onNewDash,
  onToggleCollapse,
}: Props) {
  return (
    <aside
      className="flex flex-col h-full flex-shrink-0 overflow-hidden"
      style={{
        width: collapsed ? 60 : 200,
        background: '#f1f5f9',
        borderRight: '1px solid #e2e8f0',
        transition: 'width 220ms ease-out',
      }}
    >
      {/* Hamburger */}
      <div className={`flex pt-4 pb-3 ${collapsed ? 'justify-center px-0' : 'px-4'}`}>
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded hover:bg-black/5 transition-colors"
          aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
        >
          <svg
            className="text-slate-500"
            style={{ width: 18, height: 18 }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* New dash button */}
      <div className={`pb-4 ${collapsed ? 'flex justify-center px-0' : 'px-3'}`}>
        {collapsed ? (
          <button
            onClick={onNewDash}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-opacity hover:opacity-90"
            style={{ background: 'var(--md-primary)', color: 'var(--md-on-primary)' }}
            aria-label="New dashboard"
          >
            <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        ) : (
          <button
            onClick={onNewDash}
            className="w-full flex items-center justify-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-90"
            style={{
              padding: '9px 16px',
              borderRadius: 9999,
              background: 'var(--md-primary)',
              color: 'var(--md-on-primary)',
            }}
          >
            <svg style={{ width: 16, height: 16 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            New dash
          </button>
        )}
      </div>

      {/* Nav sections */}
      <nav className={`flex-1 overflow-y-auto pb-4 ${collapsed ? 'px-0' : 'px-2'} space-y-3`}>
        {sections.map((section) => (
          <div key={section.id}>
            {/* Section label — hidden when collapsed */}
            {!collapsed && (
              <p className="px-2 pb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400 truncate">
                {section.label}
              </p>
            )}

            <ul className={`${collapsed ? 'flex flex-col items-center gap-1' : 'space-y-0.5'}`}>
              {section.items.map((item) => {
                const isActive = item.id === activeId;
                return (
                  <li key={item.id}>
                    {collapsed ? (
                      /* Icon-only item */
                      <button
                        onClick={() => !item.isPlaceholder && onItemClick?.(item.id)}
                        title={item.label}
                        className="w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
                        style={
                          isActive
                            ? { background: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
                            : item.isPlaceholder
                            ? { cursor: 'default', opacity: 0.4 }
                            : {}
                        }
                        onMouseEnter={(e) => {
                          if (!isActive && !item.isPlaceholder)
                            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.04)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive)
                            (e.currentTarget as HTMLButtonElement).style.background = '';
                        }}
                      >
                        <TeamIcon active={isActive} isPlaceholder={item.isPlaceholder} />
                      </button>
                    ) : (
                      /* Full item */
                      <button
                        onClick={() => !item.isPlaceholder && onItemClick?.(item.id)}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors"
                        style={
                          isActive
                            ? { background: 'white', color: '#1e293b', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
                            : item.isPlaceholder
                            ? { color: '#cbd5e1', cursor: 'default' }
                            : { color: '#64748b' }
                        }
                        onMouseEnter={(e) => {
                          if (!isActive && !item.isPlaceholder)
                            (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.04)';
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive)
                            (e.currentTarget as HTMLButtonElement).style.background = '';
                        }}
                      >
                        <TeamIcon active={isActive} isPlaceholder={item.isPlaceholder} />
                        <span className="truncate text-[13px] font-medium">{item.label}</span>
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
