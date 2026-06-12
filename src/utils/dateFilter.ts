import dayjs from 'dayjs';

export function isDateInRange(dateStr: string, filter: string): boolean {
  if (!filter) return true;

  const target = dayjs(dateStr).startOf('day');
  const today = dayjs().startOf('day');

  switch (filter) {
    case '今天':
      return target.isSame(today, 'day');
    case '明天':
      return target.isSame(today.add(1, 'day'), 'day');
    case '周末': {
      const saturday = today.day(6);
      const sunday = today.day(0).add(1, 'week');
      return (
        (target.isSame(saturday, 'day') || target.isSame(sunday, 'day')) &&
        target.isAfter(today.subtract(1, 'day'))
      );
    }
    case '本周': {
      const startOfWeek = today.startOf('week');
      const endOfWeek = today.endOf('week');
      return (
        (target.isSame(startOfWeek, 'day') || target.isAfter(startOfWeek)) &&
        (target.isSame(endOfWeek, 'day') || target.isBefore(endOfWeek))
      );
    }
    default:
      return true;
  }
}
