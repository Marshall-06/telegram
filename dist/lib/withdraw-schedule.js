export function parseWithdrawDays(raw) {
    return raw
        .split(",")
        .map((d) => parseInt(d.trim(), 10))
        .filter((d) => d >= 1 && d <= 31)
        .sort((a, b) => a - b);
}
export function formatWithdrawDays(days) {
    return days.map((d) => `${d}.`).join(", ");
}
export function isWithdrawDay(date, days) {
    return days.includes(date.getDate());
}
export function getNextWithdrawDate(from, days) {
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
//# sourceMappingURL=withdraw-schedule.js.map