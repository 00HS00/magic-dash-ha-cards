/**
 * magic-clock-card — Magic Dash clock as a Home Assistant custom card.
 * Big gradient time, seconds, uppercase spaced date with accent ticks, on a
 * dark-glass panel so the sky background shows through.
 *
 * Config:
 *   type: custom:magic-clock-card
 *   use24h: true        # optional (default true)
 *   seconds: true       # optional (default true)
 */

import { VARS } from './common.js'

const CSS = `
${VARS}
.clock {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  min-height: 190px; padding: 24px 20px; gap: 2px;
  color: var(--text-hi);
}
.clock-time {
  font-size: clamp(48px, 7vw, 108px);
  font-weight: 200; letter-spacing: 0.02em; line-height: 1;
  font-variant-numeric: tabular-nums; display: flex; align-items: baseline;
  background: linear-gradient(180deg, #ffffff 0%, #cdd8ff 55%, #8aa7ff 100%);
  -webkit-background-clip: text; background-clip: text; color: transparent;
  filter: drop-shadow(0 0 26px rgba(138,167,255,0.35));
}
.clock-seconds { font-size: 0.45em; -webkit-text-fill-color: rgba(233,238,251,0.52); margin-left: 0.12em; }
.clock-ampm { font-size: 0.32em; font-weight: 500; -webkit-text-fill-color: rgba(233,238,251,0.74); margin-left: 0.28em; letter-spacing: 0.08em; }
.clock-date {
  margin-top: 0.6em; font-size: clamp(11px, 1.3vw, 17px); color: var(--text-mid);
  font-weight: 500; text-transform: uppercase; letter-spacing: 0.22em;
  display: flex; align-items: center; gap: 0.7em;
}
.clock-date:before, .clock-date:after {
  content: ''; width: clamp(14px, 2vw, 34px); height: 1px;
  background: linear-gradient(90deg, transparent, rgba(138,167,255,0.7));
}
.clock-date:after { background: linear-gradient(90deg, rgba(138,167,255,0.7), transparent); }
`

class MagicClockCard extends HTMLElement {
  constructor() { super(); this.attachShadow({ mode: 'open' }); this._timer = 0 }
  setConfig(config) {
    this._config = { use24h: true, seconds: true, ...config }
    this._render()
  }
  set hass(_) {}
  connectedCallback() { this._render(); this._timer = setInterval(() => this._tick(), 1000) }
  disconnectedCallback() { if (this._timer) clearInterval(this._timer) }
  _render() {
    this.shadowRoot.innerHTML = `<style>${CSS}</style>
      <div class="glass"><div class="clock">
        <div class="clock-time"><span class="hm"></span><span class="clock-seconds"></span><span class="clock-ampm"></span></div>
        <div class="clock-date"></div>
      </div></div>`
    this._tick()
  }
  _tick() {
    if (!this._config || !this.shadowRoot) return
    const now = new Date()
    let hours = now.getHours()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    if (!this._config.use24h) hours = hours % 12 || 12
    const hh = this._config.use24h ? String(hours).padStart(2, '0') : String(hours)
    const mm = String(now.getMinutes()).padStart(2, '0')
    const ss = String(now.getSeconds()).padStart(2, '0')
    const date = now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
    const q = (s) => this.shadowRoot.querySelector(s)
    const hm = q('.hm'), sec = q('.clock-seconds'), ap = q('.clock-ampm'), dt = q('.clock-date')
    if (!hm) return
    hm.textContent = `${hh}:${mm}`
    sec.textContent = this._config.seconds ? `:${ss}` : ''
    ap.textContent = this._config.use24h ? '' : ampm
    dt.textContent = date
  }
  getCardSize() { return 3 }
  static getStubConfig() { return { use24h: true, seconds: true } }
}

if (!customElements.get('magic-clock-card')) customElements.define('magic-clock-card', MagicClockCard)
window.customCards = window.customCards || []
window.customCards.push({ type: 'magic-clock-card', name: 'Magic Clock', description: 'Magic Dash clock' })
