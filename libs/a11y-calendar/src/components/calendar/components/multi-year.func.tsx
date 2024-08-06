import { FunctionalComponent, h } from '@stencil/core';
import { YearsView } from '../model/years-view';

export interface FnMultiYearProps {
  yearView: YearsView;
  onYearClicked: () => void;
}

export const FnMultiYear: FunctionalComponent<FnMultiYearProps> = ({
  yearView,
  onYearClicked
}) => {
  return (
    <button aria-label={yearView.year}
            onClick={() => onYearClicked()}
            class={{ 'selected': yearView.selected }}>
      {yearView.year}
    </button>
  )
}

