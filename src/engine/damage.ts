/**
 * Damage types and armour: what a blow is, and how much of it a body lets through.
 *
 *   Type      Every blow is one of three: melee (a fist, a blade, a body thrown into something), ranged (a round, a
 *             bolt) or explosive (a blast, a slam). What sort of blow a game has (its own kinds of hit) it maps onto
 *             these.
 *   Armour    A share of each type a body shrugs off, as a fraction: 0.15 takes 15% off every blow of that type; a
 *             negative share is a weakness (-0.25: a quarter more). What gets through is `amount * (1 - armour)`.
 *             Never more than ARMOUR_MAX of a type is stopped: no body is proof against anything.
 *
 * Plain data (a table of armours, one per kind of body), worked through in one place for each kind of thing that is
 * hurt: `armoured` below.
 */

export type DamageType = 'melee' | 'ranged' | 'explosive'
export const DAMAGE_TYPES: readonly DamageType[] = ['melee', 'ranged', 'explosive']

/** A body's armour against each type of damage, as a share stopped (negative: a weakness). */
export type Armour = Record<DamageType, number>

/** No armour at all: every blow lands whole. */
export const NO_ARMOUR: Readonly<Armour> = Object.freeze({ melee: 0, ranged: 0, explosive: 0 })

/** The most of any type armour stops. */
export const ARMOUR_MAX = 0.95

/** What `amount` of damage of `type` comes to through `armour`. No type (a blow of no known sort): all of it. */
export function armoured(amount: number, type: DamageType | undefined, armour: Readonly<Armour>): number {
  if (!type) return amount
  return amount * (1 - Math.min(ARMOUR_MAX, armour[type]))
}

/** The blow of `type` that would come through `armour` as `dealt`: what it takes to do that much (armoured's inverse). */
export function unarmoured(dealt: number, type: DamageType, armour: Readonly<Armour>): number {
  return dealt / (1 - Math.min(ARMOUR_MAX, armour[type]))
}

/** `out` set to `a` (and, given, `b` added on: a base armour and what improves it). */
export function setArmour(out: Armour, a: Readonly<Armour>, b?: Readonly<Armour>): Armour {
  out.melee = a.melee + (b ? b.melee : 0)
  out.ranged = a.ranged + (b ? b.ranged : 0)
  out.explosive = a.explosive + (b ? b.explosive : 0)
  return out
}
