import { answersMatch, isNearMiss } from './answerMatch'

/** Ligne de feedback après une réponse — claire, sans punchline. */
export type FeedbackLine = {
  kind: 'ok' | 'timeout' | 'near' | 'miss' | 'wrong'
  text: string
}

export function feedbackLine(input: {
  ok: boolean
  answerLabel: string
  picked: string
  /** Libellé humain de ce que le joueur a donné (QCM / saisie). */
  givenLabel?: string
}): FeedbackLine {
  const answer = input.answerLabel
  if (input.ok) {
    return { kind: 'ok', text: answer }
  }
  if (input.picked === '__timeout__') {
    return { kind: 'timeout', text: `Temps écoulé — c’était ${answer}` }
  }
  if (input.picked === '__miss__') {
    return { kind: 'miss', text: `À côté — c’était ${answer}` }
  }
  const probe = input.givenLabel ?? input.picked
  if (
    probe &&
    !probe.startsWith('__') &&
    !answersMatch(probe, answer, 'loose') &&
    isNearMiss(probe, answer)
  ) {
    return { kind: 'near', text: `Presque — c’était ${answer}` }
  }
  return { kind: 'wrong', text: `Non — c’était ${answer}` }
}
