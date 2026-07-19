/** Shared Magic Dash design tokens + glass primitive for all custom cards. */
export const VARS = `
:host {
  --glass-bg: rgba(15,19,40,0.58);
  --glass-bg-strong: rgba(20,24,46,0.82);
  --glass-border: rgba(255,255,255,0.16);
  --glass-blur: 18px;
  --shadow-card: 0 8px 32px rgba(0,0,0,0.38);
  --radius-lg: 20px; --radius-md: 12px; --radius-sm: 8px;
  --text-hi: #f4f6fb; --text-mid: rgba(233,238,251,0.74); --text-low: rgba(233,238,251,0.52);
  --accent: #8aa7ff; --accent-soft: rgba(138,167,255,0.18);
  --positive: #5eead4; --danger: #ff7b8f;
  display: block;
}
.glass {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)); -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  box-shadow: var(--shadow-card);
  border-radius: var(--radius-lg);
  color: var(--text-hi);
  overflow: hidden;
}
`
