import type { Country } from '../data/countries'
import { isObscureCode, sameFlagCluster } from './difficulty'

/** Tags vérifiables — pools prêts à grossir (10–30 plus tard). */
export type RoastTag =
  | 'wrongContinent'
  | 'farCluster'
  | 'nearMiss'
  | 'obscurePick'
  | 'luckyFar'
  | 'nearMissAvoided'
  | 'timeout'

type RoastTone = 'roast' | 'joke' | 'soft' | 'compliment'

type Template = {
  tone: RoastTone
  text: string
}

const POOLS: Record<RoastTag, Template[]> = {
  wrongContinent: [
    {
      tone: 'roast',
      text: '3 d’un côté, 1 de l’autre… et tu prends l’intrus ({picked}). Bravo.',
    },
    {
      tone: 'joke',
      text: 'GPS en vacances : {pickedContinent} au lieu de {answerContinent}.',
    },
    {
      tone: 'roast',
      text: 'T’as réussi à viser le seul pays du mauvais continent. Classique.',
    },
    {
      tone: 'soft',
      text: 'Mauvais continent — c’était {answer} ({answerContinent}).',
    },
    {
      tone: 'joke',
      text: '{picked} ? On a changé de planisphère ou quoi ?',
    },
  ],
  farCluster: [
    { tone: 'roast', text: 'Vraiment ?? {picked}…' },
    { tone: 'joke', text: 'Même de loin, ça se ressemble pas. {picked}, sérieux ?' },
    { tone: 'roast', text: 'Tu cliques au feeling et le feeling a dit n’importe quoi.' },
    { tone: 'soft', text: 'À côté — la bonne était {answer}.' },
    { tone: 'joke', text: 'Ce drapeau-là et la réponse, c’est pas la même galaxie.' },
  ],
  nearMiss: [
    { tone: 'soft', text: 'Presque… {picked} et {answer}, le duo piège.' },
    { tone: 'joke', text: 'Jumeau malicieux : tu vises {picked}, c’était {answer}.' },
    { tone: 'roast', text: 'Le cousin collé t’a eu. C’était {answer}.' },
    { tone: 'soft', text: 'Classique famille de drapeaux — {answer}, pas {picked}.' },
    { tone: 'compliment', text: 'Mauvais jumeau, bon réflexe. La suite sera bonne.' },
  ],
  obscurePick: [
    { tone: 'roast', text: 'Le micro-pays random ({picked}). Toujours lui.' },
    { tone: 'joke', text: 'Ah, {picked}. Le piège à touristes de la géo.' },
    { tone: 'roast', text: 'Tu as choisi le plus petit du lot. Audacieux. Faux.' },
    { tone: 'soft', text: '{picked} était le leurre — réponse : {answer}.' },
    { tone: 'joke', text: 'Quand tu doutes, prends le plus obscur… mauvaise idée.' },
  ],
  luckyFar: [
    { tone: 'joke', text: 'Le hasard marche bien, on dirait.' },
    { tone: 'roast', text: 'Dans ce bazar de drapeaux, tu as touché juste. OK.' },
    { tone: 'joke', text: 'Coup de bol premium. On prend.' },
    { tone: 'soft', text: 'Exact — et pourtant le QCM était sale.' },
    { tone: 'compliment', text: 'Bon œil, même avec des pièges absurdes.' },
  ],
  nearMissAvoided: [
    { tone: 'compliment', text: 'Tu as évité le jumeau. Respect.' },
    { tone: 'soft', text: 'Bien vu — le piège collé était pas loin.' },
    { tone: 'joke', text: 'Le cousin ressemblant est rentré chez lui. Toi non.' },
    { tone: 'compliment', text: 'Là, c’est plus du hasard. Clean.' },
    { tone: 'soft', text: 'Exact. Et sans tomber dans la famille visuelle.' },
  ],
  timeout: [
    { tone: 'joke', text: 'Temps écoulé. La réponse attendait : {answer}.' },
    { tone: 'roast', text: 'L’horloge a gagné. C’était {answer}.' },
    { tone: 'soft', text: 'Trop tard — {answer}.' },
    { tone: 'joke', text: 'Chrono KO. Spoiler : {answer}.' },
    { tone: 'soft', text: 'Temps mort. Réponse : {answer}.' },
  ],
}

const SPEAK_CHANCE = 0.68

type SessionMem = {
  recentTexts: string[]
  lastTone: RoastTone | null
}

const mem: SessionMem = {
  recentTexts: [],
  lastTone: null,
}

function fill(
  template: string,
  vars: {
    answer: string
    picked: string
    answerContinent: string
    pickedContinent: string
  },
): string {
  return template
    .replaceAll('{answer}', vars.answer)
    .replaceAll('{picked}', vars.picked)
    .replaceAll('{answerContinent}', vars.answerContinent)
    .replaceAll('{pickedContinent}', vars.pickedContinent)
}

function pickTemplate(tag: RoastTag): Template {
  const pool = POOLS[tag]
  const avoidTone = mem.lastTone
  const ranked = [...pool].sort((a, b) => {
    const aRecent = mem.recentTexts.includes(a.text) ? 1 : 0
    const bRecent = mem.recentTexts.includes(b.text) ? 1 : 0
    if (aRecent !== bRecent) return aRecent - bRecent
    const aTone = avoidTone && a.tone === avoidTone ? 1 : 0
    const bTone = avoidTone && b.tone === avoidTone ? 1 : 0
    if (aTone !== bTone) return aTone - bTone
    return Math.random() - 0.5
  })
  return ranked[0] ?? pool[0]!
}

function remember(text: string, tone: RoastTone) {
  mem.lastTone = tone
  mem.recentTexts = [text, ...mem.recentTexts.filter((t) => t !== text)].slice(0, 12)
}

function resolveCountry(all: Country[], value: string): Country | null {
  if (!value || value === '__timeout__' || value === '__miss__') return null
  const byCode = all.find((x) => x.code === value)
  if (byCode) return byCode
  const byName = all.find((x) => x.name === value || x.shortName === value)
  if (byName) return byName
  const byCapital = all.find((x) => x.capital === value)
  if (byCapital) return byCapital
  return null
}

function choiceCountries(all: Country[], choices: string[]): Country[] {
  const out: Country[] = []
  for (const ch of choices) {
    const c = resolveCountry(all, ch)
    if (c && !out.some((x) => x.code === c.code)) out.push(c)
  }
  return out
}

export function classifyRoast(input: {
  correct: boolean
  picked: string
  answerCode: string
  answerLabel: string
  choices: string[]
  countries: Country[]
}): RoastTag | null {
  const { correct, picked, answerCode, choices, countries } = input
  if (picked === '__timeout__') return 'timeout'

  const answer = countries.find((c) => c.code === answerCode)
  if (!answer) return null

  const distractors = choiceCountries(countries, choices).filter(
    (c) => c.code !== answer.code,
  )
  const hasClusterTrap = distractors.some((c) => sameFlagCluster(answer.code, c.code))

  if (correct) {
    if (hasClusterTrap) return 'nearMissAvoided'
    const allFar =
      distractors.length > 0 &&
      distractors.every(
        (c) =>
          c.continent !== answer.continent && !sameFlagCluster(answer.code, c.code),
      )
    if (allFar) return 'luckyFar'
    return null
  }

  const pickedCountry = resolveCountry(countries, picked)
  if (!pickedCountry) return null

  if (sameFlagCluster(answer.code, pickedCountry.code)) return 'nearMiss'
  if (pickedCountry.continent !== answer.continent) return 'wrongContinent'
  if (isObscureCode(pickedCountry.code)) return 'obscurePick'
  return 'farCluster'
}

/**
 * Punchline roast, ou null → garder le feedback classique.
 * ON par défaut côté options ; ici `enabled` + chance ~2/3.
 */
export function pickRoastLine(input: {
  enabled: boolean
  correct: boolean
  picked: string
  answerCode: string
  answerLabel: string
  choices: string[]
  countries: Country[]
}): string | null {
  if (!input.enabled) return null
  if (input.picked !== '__timeout__' && Math.random() > SPEAK_CHANCE) return null

  const tag = classifyRoast(input)
  if (!tag) return null

  const answer =
    input.countries.find((c) => c.code === input.answerCode) ?? null
  const pickedCountry = resolveCountry(input.countries, input.picked)
  const vars = {
    answer: answer?.name ?? input.answerLabel,
    picked: pickedCountry?.name ?? input.picked,
    answerContinent: answer?.continent ?? '…',
    pickedContinent: pickedCountry?.continent ?? '…',
  }

  const tpl = pickTemplate(tag)
  const line = fill(tpl.text, vars)
  remember(tpl.text, tpl.tone)
  return line
}
