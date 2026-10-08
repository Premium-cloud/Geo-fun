import type { DuelRound } from './types'

export function DuelPrompt({ round }: { round: DuelRound }) {
  return (
    <div className="duel-prompt">
      <p className="duel-prompt-q">{round.prompt}</p>
      {round.show === 'code' ? (
        <p className="duel-prompt-big">{round.showValue}</p>
      ) : null}
      {round.show === 'name' ? (
        <p className="duel-prompt-name">{round.showValue}</p>
      ) : null}
      {round.show === 'flag' && round.showCode ? (
        <img
          className="duel-prompt-flag"
          src={`/flags/${round.showCode.toLowerCase()}.svg`}
          alt=""
          onError={(e) => {
            const img = e.currentTarget
            if (img.src.endsWith('.svg')) {
              img.src = `/flags/${round.showCode!.toLowerCase()}.png`
            }
          }}
        />
      ) : null}
    </div>
  )
}
