import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent as RPointerEvent,
  type WheelEvent as RWheelEvent,
} from 'react'

type Props = {
  children: ReactNode
  className?: string
  minScale?: number
  maxScale?: number
  /** Remet le zoom à zéro quand cette clé change (nouvelle question). */
  resetKey?: string | number
}

export function ZoomableMap({
  children,
  className = '',
  minScale = 1,
  maxScale = 4.5,
  resetKey,
}: Props) {
  const [scale, setScale] = useState(1)
  const [tx, setTx] = useState(0)
  const [ty, setTy] = useState(0)
  const drag = useRef<{
    x: number
    y: number
    tx: number
    ty: number
    moved: boolean
  } | null>(null)
  const pinch = useRef<{ dist: number; scale: number; tx: number; ty: number } | null>(
    null,
  )
  const boxRef = useRef<HTMLDivElement>(null)

  const reset = useCallback(() => {
    setScale(1)
    setTx(0)
    setTy(0)
  }, [])

  useEffect(() => {
    if (resetKey !== undefined) reset()
  }, [resetKey, reset])

  const zoomBy = useCallback(
    (factor: number, cx?: number, cy?: number) => {
      setScale((s) => {
        const next = Math.min(maxScale, Math.max(minScale, s * factor))
        if (cx != null && cy != null && boxRef.current) {
          const rect = boxRef.current.getBoundingClientRect()
          const px = cx - rect.left
          const py = cy - rect.top
          setTx((t) => px - ((px - t) * next) / s)
          setTy((t) => py - ((py - t) * next) / s)
        }
        return next
      })
    },
    [maxScale, minScale],
  )

  function onWheel(e: RWheelEvent) {
    e.preventDefault()
    zoomBy(e.deltaY < 0 ? 1.12 : 0.9, e.clientX, e.clientY)
  }

  function onPointerDown(e: RPointerEvent) {
    if (e.pointerType === 'touch' && e.isPrimary === false) return
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    drag.current = { x: e.clientX, y: e.clientY, tx, ty, moved: false }
  }

  function onPointerMove(e: RPointerEvent) {
    if (!drag.current || pinch.current) return
    const dx = e.clientX - drag.current.x
    const dy = e.clientY - drag.current.y
    if (!drag.current.moved && Math.hypot(dx, dy) < 6) return
    drag.current.moved = true
    setTx(drag.current.tx + dx)
    setTy(drag.current.ty + dy)
  }

  function onPointerUp() {
    drag.current = null
  }

  function onTouchStart(e: React.TouchEvent) {
    if (e.touches.length === 2) {
      const a = e.touches[0]!
      const b = e.touches[1]!
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
      pinch.current = { dist, scale, tx, ty }
      drag.current = null
    }
  }

  function onTouchMove(e: React.TouchEvent) {
    if (e.touches.length === 2 && pinch.current) {
      e.preventDefault()
      const a = e.touches[0]!
      const b = e.touches[1]!
      const dist = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY)
      const factor = dist / pinch.current.dist
      const next = Math.min(maxScale, Math.max(minScale, pinch.current.scale * factor))
      if (boxRef.current) {
        const rect = boxRef.current.getBoundingClientRect()
        const cx = (a.clientX + b.clientX) / 2 - rect.left
        const cy = (a.clientY + b.clientY) / 2 - rect.top
        const prev = pinch.current.scale
        setTx(cx - ((cx - pinch.current.tx) * next) / prev)
        setTy(cy - ((cy - pinch.current.ty) * next) / prev)
      }
      setScale(next)
    }
  }

  function onTouchEnd() {
    pinch.current = null
  }

  return (
    <div className={`zoom-map ${className}`}>
      <div className="zoom-map-tools">
        <button
          type="button"
          className="zoom-btn"
          onClick={() => zoomBy(1.25)}
          aria-label="Zoom +"
        >
          +
        </button>
        <button
          type="button"
          className="zoom-btn"
          onClick={() => zoomBy(0.8)}
          aria-label="Zoom −"
        >
          −
        </button>
        <button type="button" className="zoom-btn" onClick={reset} aria-label="Réinitialiser">
          ↺
        </button>
      </div>
      <div
        ref={boxRef}
        className="zoom-map-viewport"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="zoom-map-stage"
          style={{ transform: `translate(${tx}px, ${ty}px) scale(${scale})` }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
