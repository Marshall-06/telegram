export function parseWithdrawDays(raw: string): number[] {
  return raw
    .split(",")
    .map((d) => parseInt(d.trim(), 10))
    .filter((d) => d >= 1 && d <= 31)
    .sort((a, b) => a - b);
}

export function formatWithdrawDays(days: number[]): string {
  return days.map((d) => `${d}.`).join(", ");
}

export function isWithdrawDay(date: Date, days: number[]): boolean {
  return days.includes(date.getDate());
}

export function getNextWithdrawDate(from: Date, days: number[]): Date {
  if (days.length === 0) {
    return from;
  }

  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);

  for (let i = 0; i < 62; i++) {
    if (days.includes(cursor.getDate())) {
      return cursor;
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  return cursor;
}
