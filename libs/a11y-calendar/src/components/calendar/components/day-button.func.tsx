import { CalendarDay } from '../model/calendar-day';
import { FunctionalComponent, h } from '@stencil/core';
import { format } from 'date-fns';


export interface FnDayButtonProps {
  calendarDay: CalendarDay;
  onDateClicked: () => void;
}

export const FnDayButton: FunctionalComponent<FnDayButtonProps> = ({ calendarDay, onDateClicked }) => {

  return (
    <button aria-label={format(calendarDay.date, 'PPPP', {})}
            class={{
              'selected': calendarDay.selected
            }}
            onClick={() => {
              onDateClicked();
            }}>
      <span>&nbsp;</span>
      <span>
        {calendarDay.day}
      </span>
    </button>
  );
};
