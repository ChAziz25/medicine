/**
 * Class-name utility — a tiny `clsx` replacement.
 *
 * Joins any number of class values, filtering out falsy ones.
 * Sufficient for the testing UI; replace with `clsx` + `tailwind-merge`
 * during the design-refinement stage if you need conflict resolution.
 */
export function cn(
  ...classes: (string | undefined | null | false | number)[]
): string {
  return classes.filter(Boolean).join(' ')
}
