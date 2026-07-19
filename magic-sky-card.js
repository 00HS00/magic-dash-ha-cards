/**
 * magic-sky-card — the Magic Dash weather-reactive ambient background as a
 * Home Assistant custom Lovelace card.
 *
 * Renders a full-screen backdrop behind the whole dashboard: a time-of-day
 * gradient (from the sun entity) plus a weather mood (from a weather entity) —
 * drifting clouds, a veil, storm dimming, lightning, and canvas rain/snow.
 *
 * Config:
 *   type: custom:magic-sky-card
 *   entity: weather.your_weather      # required
 *   sun: sun.sun                      # optional (default sun.sun)
 *
 * Ported from Magic Dash's SkyBackground.tsx + sky CSS. Purely decorative:
 * pointer-events off, sits behind every card.
 */

const CSS = `
:host {
  position: fixed; inset: 0; z-index: -1;
  pointer-events: none; display: block; overflow: hidden;
}
.sky { position: absolute; inset: 0; overflow: hidden; }
.sky > * { position: absolute; inset: 0; }

.sky-gradient { transition: background 2000ms ease, filter 2000ms ease; }
.sky[data-phase='dawn'] .sky-gradient {
  background: radial-gradient(140% 92% at 78% 118%, rgba(255,186,122,0.55), transparent 55%),
    linear-gradient(180deg,#33507f 0%,#8a76ad 40%,#e79f79 82%,#ffc78f 100%);
}
.sky[data-phase='day'] .sky-gradient {
  background: radial-gradient(120% 82% at 50% -25%, #eaf7ff 0%, transparent 55%),
    linear-gradient(180deg,#2f7fc4 0%,#57a5da 45%,#a9d8f0 100%);
}
.sky[data-phase='dusk'] .sky-gradient {
  background: radial-gradient(150% 96% at 22% 120%, rgba(255,138,86,0.62), transparent 55%),
    linear-gradient(180deg,#16224a 0%,#573874 40%,#bd5a7d 74%,#ff8a5a 100%);
}
.sky[data-phase='night'] .sky-gradient {
  background: radial-gradient(120% 92% at 50% 122%, rgba(40,58,120,0.5), transparent 60%),
    linear-gradient(180deg,#060a1e 0%,#0a1130 55%,#12173a 100%);
}
.sky[data-weather='partly'] .sky-gradient { filter: saturate(0.92) brightness(0.97); }
.sky[data-weather='cloudy'] .sky-gradient,
.sky[data-weather='drizzle'] .sky-gradient { filter: saturate(0.6) brightness(0.82); }
.sky[data-weather='rain'] .sky-gradient { filter: saturate(0.45) brightness(0.66); }
.sky[data-weather='thunder'] .sky-gradient { filter: saturate(0.4) brightness(0.5); }
.sky[data-weather='fog'] .sky-gradient { filter: saturate(0.5) brightness(0.8) contrast(0.9); }
.sky[data-weather='snow'] .sky-gradient { filter: saturate(0.7) brightness(0.92); }

.sky-glow { opacity: 0; mix-blend-mode: screen; transition: opacity 1800ms ease, background 2000ms ease; }
.sky[data-phase='dawn'] .sky-glow { background: radial-gradient(125% 78% at 78% 116%, rgba(255,194,128,0.5), transparent 60%); }
.sky[data-phase='day'] .sky-glow { background: radial-gradient(135% 95% at 50% -22%, rgba(232,247,255,0.5), transparent 60%); }
.sky[data-phase='dusk'] .sky-glow { background: radial-gradient(125% 80% at 22% 118%, rgba(255,150,96,0.52), transparent 60%); }
.sky[data-phase='night'] .sky-glow { background: radial-gradient(120% 80% at 50% 122%, rgba(96,126,224,0.26), transparent 62%); }
.sky[data-weather='clear'] .sky-glow { opacity: 1; }
.sky[data-weather='partly'] .sky-glow { opacity: 0.55; }
.sky[data-weather='snow'] .sky-glow { opacity: 0.3; }

.sky-clouds { opacity: 0; transition: opacity 1500ms ease; }
.sky-clouds span { position: absolute; border-radius: 50%; filter: blur(34px); background: rgba(240,244,255,0.5); }
.sky-clouds span:nth-child(1) { width: 48vw; height: 20vw; top: 7%; left: -32%; animation: cloud-drift 90s linear infinite; }
.sky-clouds span:nth-child(2) { width: 62vw; height: 24vw; top: 24%; left: -52%; opacity: 0.8; animation: cloud-drift 128s linear infinite; animation-delay: -46s; }
.sky-clouds span:nth-child(3) { width: 40vw; height: 16vw; top: 1%; left: -24%; opacity: 0.6; animation: cloud-drift 108s linear infinite; animation-delay: -82s; }
@keyframes cloud-drift { from { transform: translateX(0); } to { transform: translateX(172vw); } }
.sky[data-weather='partly'] .sky-clouds { opacity: 0.7; }
.sky[data-weather='cloudy'] .sky-clouds,
.sky[data-weather='drizzle'] .sky-clouds,
.sky[data-weather='rain'] .sky-clouds,
.sky[data-weather='thunder'] .sky-clouds { opacity: 1; }
.sky[data-weather='cloudy'] .sky-clouds span { background: rgba(150,162,190,0.55); }
.sky[data-weather='drizzle'] .sky-clouds span,
.sky[data-weather='rain'] .sky-clouds span,
.sky[data-weather='thunder'] .sky-clouds span { background: rgba(70,80,104,0.62); }
.sky[data-phase='night'] .sky-clouds span { background: rgba(38,46,78,0.6); }

.sky-veil { opacity: 0; transition: opacity 1800ms ease, background 2000ms ease; }
.sky[data-weather='cloudy'] .sky-veil { opacity: 1; background: linear-gradient(180deg, rgba(140,150,175,0.16), rgba(120,130,158,0.28)); }
.sky[data-weather='drizzle'] .sky-veil { opacity: 1; background: linear-gradient(180deg, rgba(78,88,112,0.24), rgba(58,68,92,0.36)); }
.sky[data-weather='rain'] .sky-veil { opacity: 1; background: linear-gradient(180deg, rgba(58,68,94,0.3), rgba(38,48,72,0.44)); }
.sky[data-weather='thunder'] .sky-veil { opacity: 1; background: linear-gradient(180deg, rgba(26,30,52,0.44), rgba(14,18,36,0.62)); }
.sky[data-weather='snow'] .sky-veil { opacity: 1; background: linear-gradient(180deg, rgba(182,192,212,0.16), rgba(160,172,196,0.26)); }
.sky[data-weather='fog'] .sky-veil { opacity: 1; background: linear-gradient(180deg, rgba(198,204,218,0.34) 0%, rgba(172,180,198,0.55) 100%); background-size: 220% 100%; animation: fog-drift 70s linear infinite; }
.sky[data-phase='night'][data-weather='fog'] .sky-veil { background: linear-gradient(180deg, rgba(60,68,92,0.34) 0%, rgba(44,52,76,0.56) 100%); background-size: 220% 100%; }
@keyframes fog-drift { from { background-position: 0% 0; } to { background-position: 220% 0; } }

.sky-flash { opacity: 0; background: rgba(228,236,255,0.55); animation: lightning 9s linear infinite; }
@keyframes lightning { 0%,91%,100% { opacity: 0; } 92% { opacity: 0.55; } 93% { opacity: 0.06; } 94.5% { opacity: 0.5; } 96% { opacity: 0; } }

.sky-canvas { width: 100%; height: 100%; }

@media (prefers-reduced-motion: reduce) {
  .sky-clouds span, .sky-veil, .sky-flash { animation: none !important; }
}
`

/** HA weather state -> Magic Dash sky weather family */
function weatherFamily(state) {
  switch (state) {
    case 'sunny': case 'clear-night': return 'clear'
    case 'partlycloudy': return 'partly'
    case 'cloudy': case 'windy': case 'windy-variant': case 'exceptional': return 'cloudy'
    case 'fog': return 'fog'
    case 'rainy': case 'hail': return 'rain'
    case 'pouring': return 'rain'
    case 'lightning': case 'lightning-rainy': return 'thunder'
    case 'snowy': case 'snowy-rainy': return 'snow'
    default: return 'clear'
  }
}

/** sun entity -> time-of-day phase */
function phaseFromSun(sun) {
  if (!sun) return 'day'
  const el = Number(sun.attributes?.elevation)
  const rising = sun.attributes?.rising
  if (!Number.isFinite(el)) return sun.state === 'below_horizon' ? 'night' : 'day'
  if (el < -6) return 'night'
  if (el < 6) return rising ? 'dawn' : 'dusk'
  return 'day'
}

class MagicSkyCard extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this._weather = ''
    this._phase = ''
    this._raf = 0
  }

  setConfig(config) {
    if (!config.entity) throw new Error('magic-sky-card: "entity" (a weather entity) is required')
    this._config = { sun: 'sun.sun', ...config }
    this._render()
  }

  set hass(hass) {
    this._hass = hass
    const w = hass.states[this._config?.entity]
    const sun = hass.states[this._config?.sun]
    if (!w) return
    const family = weatherFamily(w.state)
    const phase = phaseFromSun(sun)
    if (family === this._weather && phase === this._phase) return
    this._weather = family
    this._phase = phase
    this._apply()
  }

  _render() {
    this.shadowRoot.innerHTML = `<style>${CSS}</style>
      <div class="sky" data-phase="day" data-weather="clear">
        <div class="sky-gradient"></div>
        <div class="sky-glow"></div>
        <div class="sky-clouds"><span></span><span></span><span></span><span></span></div>
        <div class="sky-veil"></div>
        <div class="sky-flash"></div>
        <canvas class="sky-canvas"></canvas>
      </div>`
    this._skyEl = this.shadowRoot.querySelector('.sky')
    this._canvas = this.shadowRoot.querySelector('.sky-canvas')
    this._apply()
  }

  _apply() {
    if (!this._skyEl) return
    this._skyEl.dataset.phase = this._phase || 'day'
    this._skyEl.dataset.weather = this._weather || 'clear'
    const flash = this.shadowRoot.querySelector('.sky-flash')
    if (flash) flash.style.display = this._weather === 'thunder' ? 'block' : 'none'
    const precip = ['drizzle', 'rain', 'snow', 'thunder'].includes(this._weather)
    if (precip) this._startPrecip(this._weather === 'snow' ? 'snow' : 'rain', this._weather === 'thunder')
    else this._stopPrecip()
  }

  _stopPrecip() {
    if (this._raf) cancelAnimationFrame(this._raf)
    this._raf = 0
    const ctx = this._canvas?.getContext('2d')
    if (ctx) ctx.clearRect(0, 0, this._canvas.width, this._canvas.height)
  }

  _startPrecip(kind, heavy) {
    this._stopPrecip()
    const canvas = this._canvas
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0, h = 0
    const resize = () => { w = canvas.width = Math.floor(window.innerWidth * dpr); h = canvas.height = Math.floor(window.innerHeight * dpr) }
    resize()
    this._resize = resize
    window.addEventListener('resize', resize)
    const base = kind === 'snow' ? 130 : 220
    const count = heavy ? Math.round(base * 1.4) : base
    const drops = Array.from({ length: count }, () => ({ x: Math.random() * w, y: Math.random() * h, z: Math.random(), sway: Math.random() * Math.PI * 2 }))
    let last = performance.now()
    const draw = (t) => {
      const dt = Math.min((t - last) / 16.7, 3); last = t
      ctx.clearRect(0, 0, w, h)
      if (kind === 'rain') {
        ctx.strokeStyle = heavy ? 'rgba(200,214,240,0.36)' : 'rgba(200,220,255,0.32)'
        ctx.lineWidth = dpr
        const wind = (heavy ? 3.4 : 2.1) * dpr
        for (const d of drops) {
          const speed = (heavy ? 12 : 8.5) * (0.5 + d.z) * dpr
          const len = (11 + d.z * 17) * dpr
          ctx.beginPath(); ctx.moveTo(d.x, d.y); ctx.lineTo(d.x - wind, d.y - len); ctx.stroke()
          d.y += speed * dt; d.x += wind * 0.4 * dt
          if (d.y > h) { d.y = -len; d.x = Math.random() * w }
        }
      } else {
        ctx.fillStyle = 'rgba(255,255,255,0.9)'
        for (const d of drops) {
          const r = (1 + d.z * 2.4) * dpr
          const speed = (0.6 + d.z * 1.3) * dpr
          ctx.beginPath(); ctx.arc(d.x + Math.sin(t / 900 + d.sway) * 1.5 * dpr, d.y, r, 0, Math.PI * 2); ctx.fill()
          d.y += speed * dt
          if (d.y > h) { d.y = -r; d.x = Math.random() * w }
        }
      }
      this._raf = requestAnimationFrame(draw)
    }
    this._raf = requestAnimationFrame(draw)
  }

  disconnectedCallback() {
    this._stopPrecip()
    if (this._resize) window.removeEventListener('resize', this._resize)
  }

  getCardSize() { return 0 }
  static getConfigElement() { return null }
  static getStubConfig() { return { entity: 'weather.home' } }
}

if (!customElements.get('magic-sky-card')) customElements.define('magic-sky-card', MagicSkyCard)
window.customCards = window.customCards || []
window.customCards.push({ type: 'magic-sky-card', name: 'Magic Sky', description: 'Weather-reactive ambient background from Magic Dash' })
console.info('%c MAGIC-SKY-CARD %c loaded ', 'background:#2f7fc4;color:#fff;border-radius:3px 0 0 3px;padding:2px 4px', 'background:#0a1130;color:#fff;border-radius:0 3px 3px 0;padding:2px 4px')
