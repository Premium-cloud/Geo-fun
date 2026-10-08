export type DuelCategory = 'departements' | 'pays' | 'capitale' | 'mixte'
export type DuelAnswerMode = 'qcm' | 'saisie'
export type DuelVenue = 'local' | 'online'
/** Formats écran local. Online = toujours course. */
export type DuelLocalFormat = 'bombe' | 'split' | 'tours'

export type DuelKind = 'chiffre' | 'flagToName' | 'nameToCapital'

export type DuelRound = {
  id: string
  kind: DuelKind
  prompt: string
  show: 'code' | 'flag' | 'name'
  showValue?: string
  showCode?: string
  answer: string
  choices: string[]
  answerLabel: string
}

export type DuelConfig = {
  category: DuelCategory
  answerMode: DuelAnswerMode
  venue: DuelVenue
  localFormat: DuelLocalFormat
  /** Questions par manche (course / tours). */
  rounds: number
  /** Explosions pour gagner en mode bombe. */
  bombTarget: number
  /** Secondes de base (course / tours / fuse bombe). */
  timerSec: number
}

export const DUEL_CATEGORY_LABEL: Record<DuelCategory, string> = {
  departements: 'Départements',
  pays: 'Pays',
  capitale: 'Capitales',
  mixte: 'Mixte',
}

export const DEFAULT_DUEL_CONFIG: DuelConfig = {
  category: 'mixte',
  answerMode: 'qcm',
  venue: 'local',
  localFormat: 'bombe',
  rounds: 10,
  bombTarget: 5,
  timerSec: 15,
}

/** Split portrait : largeur mini pour proposer l’option. */
export const SPLIT_MIN_WIDTH = 720
