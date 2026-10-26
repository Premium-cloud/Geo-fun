/** Temps restant après une bonne réponse : le chrono tombe à `cap` secondes au plus. */
export function clampedRemaining(remainSec: number, cap = 5): number {
  if (!Number.isFinite(remainSec)) return Math.max(0, cap)
  return Math.max(0, Math.min(remainSec, cap))
}

/**
 * Prochaine manche à afficher.
 * On ignore un retour en arrière et un doublon déjà armé.
 */
export function decideAdvance(
  currentIdx: number,
  nextIdx: number,
  pending: number | null,
): { pending: number | null; arm: boolean } {
  if (!Number.isFinite(nextIdx)) return { pending, arm: false }
  if (nextIdx <= currentIdx) return { pending, arm: false }
  if (pending != null && pending >= nextIdx) return { pending, arm: false }
  return { pending: nextIdx, arm: true }
}
