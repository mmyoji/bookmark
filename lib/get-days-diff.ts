export function getDaysDiff(base: Date, target: Date): number {
  const diff = Math.abs(base.getTime() - target.getTime());
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
