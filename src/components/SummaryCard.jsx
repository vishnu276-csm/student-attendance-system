export default function SummaryCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue',
  badge,
  onClick
}) {
  const colorMap = {
    blue: {
      bg: 'rgba(14, 165, 233, 0.12)',
      text: '#0284c7',
      border: 'rgba(14, 165, 233, 0.25)'
    },
    indigo: {
      bg: 'var(--primary-light)',
      text: 'var(--primary)',
      border: 'rgba(99, 102, 241, 0.25)'
    },
    green: {
      bg: 'var(--status-present-bg)',
      text: 'var(--status-present)',
      border: 'var(--status-present-border)'
    },
    red: {
      bg: 'var(--status-absent-bg)',
      text: 'var(--status-absent)',
      border: 'var(--status-absent-border)'
    },
    amber: {
      bg: 'var(--status-late-bg)',
      text: 'var(--status-late)',
      border: 'var(--status-late-border)'
    },
    purple: {
      bg: 'var(--status-leave-bg)',
      text: 'var(--status-leave)',
      border: 'var(--status-leave-border)'
    }
  };

  const scheme = colorMap[color] || colorMap.blue;

  return (
    <div
      className="card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        padding: '20px 22px',
        position: 'relative',
        overflow: 'hidden'
      }}
      onClick={onClick}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
        <div>
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {title}
          </span>
          <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-main)', marginTop: 4, letterSpacing: '-0.02em' }}>
            {value}
          </div>
        </div>

        {Icon && (
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: 'var(--radius-md)',
              backgroundColor: scheme.bg,
              color: scheme.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1px solid ${scheme.border}`
            }}
          >
            <Icon size={24} />
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
        <span>{subtitle}</span>
        {badge && (
          <span className={`badge ${badge.type || 'badge-neutral'}`} style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
            {badge.text}
          </span>
        )}
      </div>
    </div>
  );
}
