import { getDay, getDaysInMonth, getMonth, getYear, setDate, setMonth } from 'date-fns';
import { CalendarDay } from './model/calendar-day';
import { YearsView } from './model/years-view';
import { MonthView } from './model/month-view';

export const yearsPerPage = 24;

export const yearsPerRow = 4;

export function buildYearsView(activeDate: Date, minDate?: Date, maxDate?: Date): YearsView[] {
  const activeYear= getYear(activeDate);
  const minYearOfPage = activeYear - euclideanModulo(activeYear - getStartingYear(minDate, maxDate), yearsPerPage)
  const _years: YearsView[][] = [];
  for (let i = 0, row: YearsView[] = []; i < yearsPerPage; i++) {
    const year = minYearOfPage + i;
    row.push({ year, selected: year === activeYear });
    if (row.length == yearsPerRow) {
      _years.push(row);
      row = [];
    }
  }
  return _years.flat();
}

export function getStartingYear(
  minDate: Date | null,
  maxDate: Date | null,
): number {
  let startingYear = 0;
  if (maxDate) {
    const maxYear = getYear(maxDate);
    startingYear = maxYear - yearsPerPage + 1;
  } else if (minDate) {
    startingYear = getYear(minDate);
  }
  return startingYear;
}

export function euclideanModulo(a: number, b: number): number {
  return ((a % b) + b) % b;
}

export function buildMonthArray(date: Date): CalendarDay[] {
  let calendarDays = buildMonthDays(date);

  const startOfMonthWeekDay = getDay(calendarDays[0].date);
  const endOfMonthWeekDay = getDay(calendarDays[calendarDays.length -1].date);

  calendarDays = [
    ...getDaysOfLastMonthPrefixed(date, startOfMonthWeekDay),
    ...calendarDays,
    ...getDaysOfNextMonth(date, 6 - endOfMonthWeekDay)
  ];

  return calendarDays;
}


export function buildMonthDays(date: Date): CalendarDay[] {
  const days = getDaysInMonth(date);

  let calendarDays: CalendarDay[] = [];

  for(let i = 1; i <= days; i++) {
    calendarDays = [...calendarDays, {
      day: i,
      date: setDate(date, i),
      currentMonth: true,
      selected: false
    }]
  }

  return calendarDays;
}

export function getDaysOfLastMonthPrefixed(date: Date, limit: number): CalendarDay[] {
  let dayDate = cloneDate(date);
  dayDate = setMonth(dayDate,getMonth(dayDate) - 1);
  const days = getDaysInMonth(dayDate);
  let result = [];


  if(limit !== 0) {
    for(let i = 0; i < limit - 1; i++) {
      const day = days - i;
      result = [
        {
          day,
          date: setDate(dayDate, day),
          currentMonth: false,
          selected: false
        },
        ...result,
      ]
    }
  }

  return result;
}

export function getDaysOfNextMonth(date: Date, limit: number): CalendarDay[] {
  let result = [];

  if(limit !== 0) {
    for(let i = 0; i <= limit; i++) {
      const day = i + 1;
      let dayDate = cloneDate(date);
      dayDate = setMonth(date,getMonth(dayDate) + 1);
      result = [
        ...result,
        {
          day,
          date: setDate(dayDate, day),
          currentMonth: false,
          selected: false
        },
      ]
    }
  }

  return result;
}

export function cloneDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDay(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
}


export function buildMonthView(date: Date, locale: string): MonthView[] {
  const result: MonthView[] = [];
  for(let i = 0; i < 12; i++) {
    const month = new Date(date.getFullYear(), i, 1);
    result.push({
      month: i,
      selected: date.getMonth() === i,
      monthName: month.toLocaleString(locale, { month: 'long' }),
      monthShortName: month.toLocaleString(locale, { month: 'short' }),
    })
  }
  return result;
}

export function getDateMonthName(date: Date, locale: string, length: "numeric" | "2-digit" | "long" | "short" | "narrow" | undefined = 'short'): string {
  return date.toLocaleString(locale, { month: length });
}
