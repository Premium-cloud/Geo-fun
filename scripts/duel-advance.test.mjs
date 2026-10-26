import assert from 'node:assert/strict'
import { clampedRemaining, decideAdvance } from '../src/duel/roundAdvance.ts'

assert.equal(clampedRemaining(12, 5), 5)
assert.equal(clampedRemaining(3, 5), 3)
assert.equal(clampedRemaining(0, 5), 0)
assert.equal(clampedRemaining(Number.NaN, 5), 5)

assert.deepEqual(decideAdvance(2, 3, null), { pending: 3, arm: true })
assert.deepEqual(decideAdvance(3, 3, null), { pending: null, arm: false })
assert.deepEqual(decideAdvance(4, 3, null), { pending: null, arm: false })
assert.deepEqual(decideAdvance(2, 3, 3), { pending: 3, arm: false })
assert.deepEqual(decideAdvance(2, 4, 3), { pending: 4, arm: true })

console.log('duel-advance ok')
