export const W = (s: string) => String(s).toLowerCase().replace(/[^a-z]/g, '');
export const fmtPop = (m: number) => (m >= 1000 ? (m / 1000).toFixed(2) + 'B' : m + 'M');
export const ord = (n: number) =>
  n + (['th', 'st', 'nd', 'rd'][n % 100 > 10 && n % 100 < 14 ? 0 : n % 10 < 4 ? n % 10 : 0] || 'th');
export const mmss = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
};
export const shuffled = <T,>(a: T[]) => a.slice().sort(() => Math.random() - 0.5);
export const initialsOf = (name: string) => name.replace(/[^a-z0-9]/gi, '').slice(0, 2).toUpperCase();

/** Local calendar date, YYYY-MM-DD. The daily stack resets at local midnight. */
export const todayKey = (d = new Date()) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// Daily #214 falls on 2026-11-12, matching the design.
const DAILY_EPOCH = new Date(2026, 3, 13);
export const dailyNumber = (d = new Date()) =>
  Math.round((new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() - DAILY_EPOCH.getTime()) / 86400000) + 1;

const DOW = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MON = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
export const dateLabel = (d = new Date()) => `${DOW[d.getDay()]} · ${MON[d.getMonth()]} ${d.getDate()}`;
