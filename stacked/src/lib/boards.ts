import { BOARDS, GAMES } from './data';
import type { Result } from './store';
import type { DailyKey } from './data';

export type Row = { name: string; score: number; you?: boolean };

export const totalOf = (done: Partial<Record<DailyKey, Result>>) => GAMES.reduce((a, g) => a + (done[g.key]?.score ?? 0), 0);

/** Leaderboard for a tab (0 friends, 1 school, 2 global). You appear once today's stack is done. */
export function boardFor(tab: number, total: number | null): Row[] {
  const rows: Row[] = BOARDS[tab].map(([name, score]) => ({ name, score }));
  if (total != null) rows.push({ name: 'you', score: total, you: true });
  return rows.sort((a, b) => b.score - a.score);
}
