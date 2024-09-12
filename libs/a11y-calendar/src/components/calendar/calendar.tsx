import { Component, Element, h, Host, Prop, State, Watch } from '@stencil/core';
import { CalendarDay } from './model/calendar-day';
import { FnDayButton } from './components/day-button.func';
import { FnMultiYear } from './components/multi-year.func';
import { YearsView } from './model/years-view';
import {
  buildMonthArray,
  buildMonthView,
  buildYearsView,
  cloneDate,
  getDateMonthName
} from './utils';
import { MonthView } from './model/month-view';
import { FnMonthView } from './components/month-view.func';
import { addMonths, isBefore, isSameDay, isWithinInterval, setDefaultOptions, subMonths } from 'date-fns';
import * as locales from 'date-fns/locale';

interface DateRange {
  start: Date;
  end: Date;
}

type CalendarType = 'range' | 'default' | 'month' | 'year';

type CalendarValue = Date | DateRange;

@Component({
  tag: 'a11y-calendar',
  styleUrl: ' calendar.scss',
  shadow: true,
})
export class Calendar {
  @Prop() value: CalendarValue;

  @Prop() type: CalendarType = 'default';

  @Prop() locale: string = navigator.language;

  @State() activeDate: Date;

  @State() activeDateRange: DateRange;

  @State() dayElements: CalendarDay[];

  @State() yearElements: YearsView[];

  @State() monthElements: MonthView[];

  @State() viewMode: 'day' | 'month' | 'year' = 'day';

  @State() baseDate: Date = new Date();

  @State() focusIn: boolean = false;

  @Element() element: HTMLElement;

  @Watch('baseDate')
  activeDateChanged() {
    this.buildElements();
    this.syncDayElementsWithActiveDates();
  }

  @Watch('locale')
  localeChanged() {
    this.setActiveLocale();
  }

  componentWillLoad() {
    this.setActiveLocale();
    this.element.addEventListener('focusin', () => (this.focusIn = true));
    this.element.addEventListener('focusout', () => (this.focusIn = false));
    this.element.addEventListener('mouseenter', () => (this.focusIn = true));
    this.element.addEventListener('mouseleave', () => (this.focusIn = false));

    if (this.value) {
      switch (this.type) {
        case 'range':
          this.activeDateRange = this.value as DateRange;
          break;
        default:
          this.activeDate = this.value as Date;
      }
    } else {
      this.activeDateRange = {
        start: null,
        end: null,
      };
      this.activeDate = null;
    }
    this.buildElements();
  }

  render() {
    return (
      <Host>
        <div class={'calendar-wrapper'}>
          <div class={'calendar-header'}>
            <button onClick={() => this.onViewChangeClicked()}>
              <span>{getDateMonthName(this.baseDate)}</span>
              <span>{this.baseDate.getFullYear()}</span>
              <span
                class={{
                  'arrow-down': this.viewMode === 'day',
                  'arrow-up': this.viewMode !== 'day',
                }}
              ></span>
            </button>

            <div class={'previous-next-month'}>
              <button onClick={() => this.onChangeMonthClicked(false)}>
                <span class={'angle-left'}></span>
              </button>
              <button onClick={() => this.onChangeMonthClicked(true)}>
                <span class={'angle-right'}></span>
              </button>
            </div>
          </div>
          {this.calendarView()}
        </div>
      </Host>
    );
  }

  onDateClicked(date: CalendarDay) {
    if (this.type === 'range') {
      if (this.activeDateRange.start === null) {
        this.activeDateRange = {
          ...this.activeDateRange,
          start: date.date,
        };
      } else if (this.activeDateRange.end === null) {
        this.activeDateRange = {
          ...this.activeDateRange,
          end: date.date,
        };
      } else {
        this.activeDateRange = {
          ...this.activeDateRange,
          start: date.date,
          end: null,
        };
      }
    } else {
      this.activeDate = date.date;
    }
    this.syncDayElementsWithActiveDates();
  }

  onYearClicked(year: YearsView) {
    this.yearElements = this.yearElements.map((el) => {
      if (el === year) {
        return {
          ...el,
          selected: !el.selected,
        };
      }
      return el;
    });
    this.baseDate.setFullYear(year.year, this.baseDate.getMonth());
    this.baseDate = cloneDate(this.baseDate);
    this.viewMode = 'month';
  }

  onMonthClicked(month: MonthView) {
    this.monthElements = this.monthElements.map((el) => {
      if (el.month === month.month) {
        return {
          ...el,
          selected: !el.selected,
        };
      }
      return el;
    });
    this.baseDate.setMonth(month.month);
    this.baseDate = cloneDate(this.baseDate);
    this.viewMode = 'day';
  }

  onViewChangeClicked() {
    if (this.viewMode === 'day') {
      this.viewMode = 'year';
    } else {
      this.viewMode = 'day';
    }
  }

  private calendarView() {
    switch (this.viewMode) {
      case 'day':
        return (
          <div
            class={{
              'day-grid': true,
              selecting: this.isSelecting,
              ...this.getSelectionClasses(),
            }}
          >
            <div>Ma</div>
            <div>Di</div>
            <div>Wo</div>
            <div>Do</div>
            <div>Vr</div>
            <div>Za</div>
            <div>Zo</div>
            {this.dayElements.map((m) => (
              <FnDayButton
                calendarDay={m}
                onDateClicked={() => this.onDateClicked(m)}
              />
            ))}
          </div>
        );
      case 'month':
        return (
          <div class={'month-grid'}>
            {this.monthElements.map((m) => (
              <FnMonthView
                monthView={m}
                onMonthClicked={() => this.onMonthClicked(m)}
              />
            ))}
          </div>
        );
      case 'year':
        return (
          <div class={'year-grid'}>
            {this.yearElements.map((y) => (
              <FnMultiYear
                yearView={y}
                onYearClicked={() => this.onYearClicked(y)}
              />
            ))}
          </div>
        );
    }
  }

  private buildElements(): void {
    this.dayElements = buildMonthArray(this.baseDate);
    this.yearElements = buildYearsView(this.baseDate);
    this.monthElements = buildMonthView(this.baseDate);
  }

  private get isSelecting(): boolean {
    return this.type === 'range'
      ? this.isDateRangeSelected()
      : this.activeDate === null;
  }

  private isDateRangeSelected(): boolean {
    return (
      (this.activeDateRange.start === null &&
        this.activeDateRange.end === null) ||
      (this.activeDateRange.start !== null &&
        this.activeDateRange.end === null &&
        this.focusIn)
    );
  }

  private onChangeMonthClicked(add: boolean) {
    this.baseDate =  add? addMonths(this.baseDate, 1) : subMonths(this.baseDate, 1);
  }

  private syncDayElementsWithActiveDates() {
    if(this.type === 'range') {
      this.dayElements = this.dayElements.map((el) => ({
        ...el,
        selected:
          isSameDay(el.date, this.activeDateRange.start) ||
          isSameDay(el.date, this.activeDateRange.end),
      }));

    } else {
      this.dayElements = this.dayElements.map((el) => ({
        ...el,
        selected: el.date === this.activeDate,
      }));
    }
  }

  private getSelectionClasses() {
    let classes =  {};
    if(this.type === 'range' && this.activeDateRange.start !== null) {
      const start = this.dayElements[0].date;
      const end = this.dayElements[this.dayElements.length - 1].date;
      if(this.activeDateRange.end === null && !isWithinInterval(this.activeDateRange.start, {start, end})) {
        if(isBefore(this.activeDateRange.start, start)) {
          classes = {
            ...classes,
            'selected-before-visible': true,
          };
        } else {
          classes = {
            ...classes,
            'selected-after-visible': true,
          }
        }
      } else if(this.activeDateRange.end !== null) {
        if(isWithinInterval(this.activeDateRange.end, {start, end}) && !isWithinInterval(this.activeDateRange.start, {start, end})) {
          classes = {
            ...classes,
            'start-outside-view': true,
          };
        } else if(!isWithinInterval(this.activeDateRange.end, {start, end}) && !isWithinInterval(this.activeDateRange.start, {start, end})) {
          classes = {
            ...classes,
            'start-and-end-outside-view': isWithinInterval(this.baseDate, this.activeDateRange),
          }
        } else if(!isWithinInterval(this.activeDateRange.end, {start, end}) && isWithinInterval(this.activeDateRange.start, {start, end})) {
          classes = {
            ...classes,
            'end-outside-view': true,
          };
        }
      }
    }

    return classes;
  }

  private setActiveLocale() {
    let locale = locales.enGB;
    const foundLocale = Object.values(locales).find(l => l.code === this.locale);
    if(foundLocale) {
      locale = foundLocale;
    }
    setDefaultOptions({locale})
  }

}
