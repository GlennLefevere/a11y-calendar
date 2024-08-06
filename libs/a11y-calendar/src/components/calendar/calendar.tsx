import { Component, h, Host, Prop, State, Watch } from '@stencil/core';
import { CalendarDay } from './model/calendar-day';
import { FnDayButton } from './components/day-button.func';
import { FnMultiYear } from './components/multi-year.func';
import { YearsView } from './model/years-view';
import { buildMonthArray, buildMonthView, buildYearsView, cloneDate, getDateMonthName } from './utils';
import { MonthView } from './model/month-view';
import { FnMonthView } from './components/month-view.func';

type CalendarType = 'range' | 'default' | 'month' | 'year';

@Component({
  tag: 'a11y-calendar',
  styleUrl: ' calendar.scss',
  shadow: true
})
export class Calendar {

  @Prop() type: CalendarType = 'default';

  @Prop() locale: string = 'default';

  @State() activeDate: Date = new Date();

  @State() dayElements: CalendarDay[];

  @State() yearElements: YearsView[];

  @State() monthElements: MonthView[];

  @State() viewMode: 'day' | 'month' | 'year' = 'day';

  @Watch('activeDate')
  activeDateChanged() {
    this.buildElements();
  }

  componentWillLoad() {
    console.log();
    this.buildElements();
  }

  render() {
    return (
      <Host>
        <div class={'calendar-wrapper'}>
          <div class={'calendar-header'}>
            <button onClick={() => this.onViewChangeClicked()}>
              <span>{getDateMonthName(this.activeDate, this.locale)}</span>
              <span>{this.activeDate.getFullYear()}</span>
              <span class={{
                'arrow-down' : this.viewMode === 'day',
                'arrow-up' : this.viewMode !== 'day'
              }}></span>
            </button>
          </div>
          {this.calendarView()}
        </div>
      </Host>
    )
  }

  onDateClicked(date: CalendarDay) {
      this.dayElements = this.dayElements.map(el => {
        if(el === date) {
          return {
            ...el,
            selected: !el.selected
          }
        }
        return el;
      });
  }

  onYearClicked(year: YearsView) {
    this.yearElements = this.yearElements.map(el => {
      if(el === year) {
        return {
          ...el,
          selected: !el.selected
        }
      }
      return el;
    });
    this.activeDate.setFullYear(year.year, this.activeDate.getMonth() + 1);
    this.activeDate = cloneDate(this.activeDate);
    this.viewMode = 'month';
  }

  onMonthClicked(month: MonthView) {
    this.monthElements = this.monthElements.map(el => {
      if(el.month === month.month) {
        return {
          ...el,
          selected: !el.selected
        }
      }
      return el;
    });
    this.activeDate.setMonth(month.month);
    this.activeDate = cloneDate(this.activeDate);
    this.viewMode = 'day';
  }

  onViewChangeClicked() {
    if(this.viewMode === 'day') {
      this.viewMode = 'year';
    } else {
      this.viewMode = 'day';
    }
  }

  private calendarView() {
    switch (this.viewMode) {
      case 'day':
        return (
          <div class={'day-grid'}>
            {this.dayElements.map(m => (<FnDayButton calendarDay={m} onDateClicked={() => this.onDateClicked(m)} />))}
          </div>
        );
      case 'month':
        return (
          <div class={'month-grid'}>
            {this.monthElements.map(m => (<FnMonthView monthView={m} onMonthClicked={() => this.onMonthClicked(m)} />))}
          </div>
        );
      case 'year':
        return (
          <div class={'year-grid'}>
            {this.yearElements.map(y => (<FnMultiYear yearView={y} onYearClicked={() => this.onYearClicked(y)} />))}
          </div>
        );
    }

  }

  private buildElements() {
    this.dayElements = buildMonthArray(this.activeDate);
    this.yearElements = buildYearsView(this.activeDate);
    this.monthElements = buildMonthView(this.activeDate, this.locale);
  }

}
