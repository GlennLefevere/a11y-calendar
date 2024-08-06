import { MonthView } from '../model/month-view';
import { FunctionalComponent, h } from '@stencil/core';

export interface FnMonthViewProps {
  monthView: MonthView;
  onMonthClicked: () => void;
}

export const FnMonthView: FunctionalComponent<FnMonthViewProps> = ({monthView, onMonthClicked}) => {

  return (
    <button aria-label={monthView.monthName}
            class={{'selected': monthView.selected}}
            onClick={() => onMonthClicked()}>
      {monthView.monthShortName}
    </button>
  )
}
