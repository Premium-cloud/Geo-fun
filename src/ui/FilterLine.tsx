import { useEffect, useRef } from 'react'
import './FilterLine.css'

export function FilterLine<T extends string>({
  value,
  options,
  open,
  onOpen,
  onPick,
  quiet = false,
  active = false,
}: {
  value: T
  options: readonly { id: T; label: string }[]
  open: boolean
  onOpen: () => void
  onPick: (id: T) => void
  /** Ligne secondaire, plus petite, en bas de pile. */
  quiet?: boolean
  /** La section discrète est en cours. */
  active?: boolean
}) {
  const scroller = useRef<HTMLDivElement>(null)
  const current = options.find((option) => option.id === value) ?? options[0]
  const rest = options.filter((option) => option.id !== value)
  const optionKey = options.map((option) => option.id).join('|')

  useEffect(() => {
    const el = scroller.current
    if (!el) return
    el.scrollTo({ left: 0 })
    const mark = () => {
      el.classList.toggle('has-before', el.scrollLeft > 4)
      el.classList.toggle('has-more', el.scrollWidth - el.clientWidth - el.scrollLeft > 4)
    }
    mark()
    el.addEventListener('scroll', mark, { passive: true })
    const observer = new ResizeObserver(mark)
    observer.observe(el)
    return () => {
      el.removeEventListener('scroll', mark)
      observer.disconnect()
    }
  }, [value, open, optionKey])

  if (!current) return null

  return (
    <div className={`filter-line${quiet ? ' is-quiet' : ''}${active ? ' is-active' : ''}`} ref={scroller}>
      <button type="button" className="is-on" onClick={onOpen}>
        {current.label}
      </button>
      {open
        ? rest.map((option) => (
            <button key={option.id} type="button" className="is-off" onClick={() => onPick(option.id)}>
              {option.label}
            </button>
          ))
        : null}
    </div>
  )
}
