/**
 * Returns a deterministic color for a given user ID.
 * The same ID always maps to the same color across all routes and components.
 */

const USER_COLORS = [
  "#2563eb", // blue
  "#16a34a", // green
  "#dc2626", // red
  "#9333ea", // purple
  "#ea580c", // orange
  "#0891b2", // cyan
  "#be185d", // pink
  "#ca8a04", // yellow-600
  "#0f766e", // teal
  "#7c3aed", // violet
  "#b45309", // amber
  "#1d4ed8", // indigo
];

export function colorForUser(userId: string): string {
  const hash = userId
    .split("")
    .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  return USER_COLORS[hash % USER_COLORS.length];
}
