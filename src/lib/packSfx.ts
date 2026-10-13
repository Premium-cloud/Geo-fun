/**
 * SFX packs — Web Audio synth (pas de fichiers).
 * Silence si autoplay bloqué / prefers-reduced-motion.
 */

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null
  try {
    if (!ctx) ctx = new AudioContext()
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function tone(
  ac: AudioContext,
  opts: {
    freq: number
    dur: number
    type?: OscillatorType
    gain?: number
    slide?: number
    delay?: number
  },
) {
  const t0 = ac.currentTime + (opts.delay ?? 0)
  const osc = ac.createOscillator()
  const g = ac.createGain()
  osc.type = opts.type ?? 'triangle'
  osc.frequency.setValueAtTime(opts.freq, t0)
  if (opts.slide) {
    osc.frequency.exponentialRampToValueAtTime(
      Math.max(40, opts.freq * opts.slide),
      t0 + opts.dur,
    )
  }
  const peak = opts.gain ?? 0.08
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(peak, t0 + 0.02)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + opts.dur)
  osc.connect(g)
  g.connect(ac.destination)
  osc.start(t0)
  osc.stop(t0 + opts.dur + 0.02)
}

/** Déchirure / ouverture du scellé */
export function playPackTear() {
  const ac = getCtx()
  if (!ac) return
  tone(ac, { freq: 180, dur: 0.12, type: 'sawtooth', gain: 0.05, slide: 0.35 })
  tone(ac, { freq: 420, dur: 0.18, type: 'triangle', gain: 0.06, slide: 2.2, delay: 0.05 })
  tone(ac, { freq: 90, dur: 0.22, type: 'square', gain: 0.03, slide: 0.5, delay: 0.08 })
}

/** Carte normale révélée */
export function playCardReveal() {
  const ac = getCtx()
  if (!ac) return
  tone(ac, { freq: 520, dur: 0.1, type: 'sine', gain: 0.055, slide: 1.4 })
  tone(ac, { freq: 780, dur: 0.12, type: 'triangle', gain: 0.04, delay: 0.04 })
}

/** Foil — plus “shiny” */
export function playFoilReveal() {
  const ac = getCtx()
  if (!ac) return
  tone(ac, { freq: 660, dur: 0.14, type: 'sine', gain: 0.07, slide: 1.6 })
  tone(ac, { freq: 990, dur: 0.18, type: 'triangle', gain: 0.055, delay: 0.05 })
  tone(ac, { freq: 1320, dur: 0.22, type: 'sine', gain: 0.035, delay: 0.1, slide: 1.3 })
}
