import { GAMES } from "@/modules/history/data/games";

export const wins   = GAMES.filter((g) => g.result === "1-0").length;
export const losses = GAMES.filter((g) => g.result === "0-1").length;
export const draws  = GAMES.filter((g) => g.result === "1/2-1/2").length;
export const total  = GAMES.length;
export const winPct = Math.round((wins / total) * 100);
export const avgMoves = Math.round(GAMES.reduce((s, g) => s + g.moves.length, 0) / total);

const openingCount: Record<string, number> = {};
for (const g of GAMES) openingCount[g.opening] = (openingCount[g.opening] ?? 0) + 1;
export const topOpenings = Object.entries(openingCount).sort((a, b) => b[1] - a[1]).slice(0, 3);
