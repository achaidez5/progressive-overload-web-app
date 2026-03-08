export const T = {
  bg: '#0f0f13',
  surface: '#14141e',
  border: '#1e1e2e',
  borderSubtle: '#1a1a24',
  textMuted: '#5a5a72',
  textDimmer: '#3a3a52',
  accent: '#00f096',
  accentBlue: '#0090ff',
  error: '#ff5555',
  text: '#f0f0ff',
  gradient: 'linear-gradient(135deg, #00f096, #0090ff)',
  r: {
    card: '20px',
    button: '16px',
    input: '8px',
    pill: '100px',
  },
  maxW: '430px',
}

export const gradientStyle = {
  background: T.gradient,
  color: T.bg,
  fontWeight: '700',
  borderRadius: T.r.button,
  fontSize: '15px',
  letterSpacing: '0.2px',
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
}

export const cardStyle = {
  backgroundColor: T.surface,
  borderRadius: T.r.card,
  border: `1px solid ${T.border}`,
}

export const streakPillStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '7px',
  padding: '6px 14px',
  borderRadius: T.r.pill,
  background: 'rgba(0, 240, 150, 0.08)',
  border: '1px solid rgba(0, 240, 150, 0.2)',
  color: T.accent,
  fontSize: '13px',
  fontWeight: '600',
  boxShadow: '0 0 20px rgba(0, 240, 150, 0.08)',
}

export const setPillStyle = {
  padding: '3px 10px',
  borderRadius: T.r.pill,
  background: 'rgba(0, 240, 150, 0.08)',
  border: '1px solid rgba(0, 240, 150, 0.15)',
  color: T.accent,
  fontSize: '11px',
  fontWeight: '600',
}

export const prBadgeStyle = {
  padding: '2px 7px',
  borderRadius: T.r.pill,
  background: 'rgba(0, 240, 150, 0.12)',
  border: '1px solid rgba(0, 240, 150, 0.3)',
  color: T.accent,
  fontSize: '10px',
  fontWeight: '700',
  letterSpacing: '0.5px',
}
