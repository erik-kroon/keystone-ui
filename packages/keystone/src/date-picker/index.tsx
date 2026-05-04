import {
  For,
  Show,
  createContext,
  createMemo,
  createUniqueId,
  splitProps,
  useContext,
  type JSX,
} from "solid-js";
import { useLocale, type LocaleApi, type LocaleMessageKey } from "../locale/index";
import {
  callEventHandler,
  createControllableBooleanSignal,
  createControllableSignal,
  dataBoolean,
  getOpenClosedState,
  partDataAttributes,
  scheduleMicrotask,
} from "../utils/index";

export type CalendarValue = string;
export type CalendarMonth = string;
export type CalendarRangeValue = {
  end?: CalendarValue;
  start?: CalendarValue;
};
export type CalendarSelectionMode = "single" | "range";
export type CalendarValueChangeReason = "cell" | "keyboard" | "programmatic";
export type CalendarValueChangeDetail = {
  event?: Event;
  reason: CalendarValueChangeReason;
};
export type CalendarRangeValueChangeDetail = CalendarValueChangeDetail & {
  complete: boolean;
};
export type CalendarMonthChangeDetail = {
  event?: Event;
  reason: "navigation" | "focus" | "programmatic";
};
export type DatePickerOpenChangeDetail = {
  event?: Event;
  reason: "trigger" | "select" | "programmatic";
};

export type CalendarPartProps<T extends HTMLElement = HTMLElement> = {
  children?: JSX.Element;
  class?: string;
  id?: string;
  ref?: T | ((element: T) => void);
  style?: JSX.CSSProperties | string;
};

export type CalendarRootProps = CalendarPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref"> & {
    defaultMonth?: CalendarMonth;
    defaultRangeValue?: CalendarRangeValue;
    defaultValue?: CalendarValue;
    disabled?: boolean;
    locale?: string;
    maxValue?: CalendarValue;
    minValue?: CalendarValue;
    month?: CalendarMonth;
    onMonthChange?: (month: CalendarMonth, detail: CalendarMonthChangeDetail) => void;
    onRangeValueChange?: (
      rangeValue: CalendarRangeValue,
      detail: CalendarRangeValueChangeDetail,
    ) => void;
    onValueChange?: (value: CalendarValue, detail: CalendarValueChangeDetail) => void;
    rangeValue?: CalendarRangeValue;
    selectionMode?: CalendarSelectionMode;
    unavailable?: (value: CalendarValue) => boolean;
    value?: CalendarValue;
    weekStartsOn?: number;
  };
export type CalendarHeaderProps = CalendarPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref">;
export type CalendarHeadingProps = CalendarPartProps<HTMLHeadingElement> &
  Omit<JSX.HTMLAttributes<HTMLHeadingElement>, "children" | "ref">;
export type CalendarNavigationTriggerProps = CalendarPartProps<HTMLButtonElement> &
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "ref">;
export type CalendarGridProps = CalendarPartProps<HTMLTableElement> &
  Omit<JSX.HTMLAttributes<HTMLTableElement>, "children" | "ref">;

export type DatePickerRootProps = CalendarRootProps & {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, detail: DatePickerOpenChangeDetail) => void;
  open?: boolean;
};
export type DatePickerTriggerProps = CalendarPartProps<HTMLButtonElement> &
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "ref"> & {
    placeholder?: JSX.Element;
  };
export type DatePickerContentProps = CalendarPartProps<HTMLDivElement> &
  Omit<JSX.HTMLAttributes<HTMLDivElement>, "children" | "ref"> & {
    forceMount?: boolean;
  };
export type DatePickerCalendarProps = Omit<
  CalendarRootProps,
  "defaultValue" | "onValueChange" | "value"
>;

export type CreateCalendarOptions = {
  defaultMonth?: CalendarMonth;
  defaultRangeValue?: CalendarRangeValue;
  defaultValue?: CalendarValue;
  disabled?: () => boolean | undefined;
  locale?: () => string | undefined;
  maxValue?: () => CalendarValue | undefined;
  minValue?: () => CalendarValue | undefined;
  month?: () => CalendarMonth | undefined;
  onMonthChange?: (month: CalendarMonth, detail: CalendarMonthChangeDetail) => void;
  onRangeValueChange?: (
    rangeValue: CalendarRangeValue,
    detail: CalendarRangeValueChangeDetail,
  ) => void;
  onValueChange?: (value: CalendarValue, detail: CalendarValueChangeDetail) => void;
  rangeValue?: () => CalendarRangeValue | undefined;
  selectionMode?: () => CalendarSelectionMode | undefined;
  unavailable?: (value: CalendarValue) => boolean;
  value?: () => CalendarValue | undefined;
  weekStartsOn?: () => number | undefined;
  localeContext?: LocaleApi;
};

export type CreateDatePickerOptions = CreateCalendarOptions & {
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, detail: DatePickerOpenChangeDetail) => void;
  open?: () => boolean | undefined;
};

export type CalendarDay = {
  date: CalendarValue;
  day: number;
  disabled: boolean;
  inRange: boolean;
  outsideMonth: boolean;
  rangeEnd: boolean;
  rangeStart: boolean;
  selected: boolean;
  today: boolean;
  unavailable: boolean;
};

export type CalendarApi = {
  disabled: () => boolean;
  focusedValue: () => CalendarValue;
  formattedHeading: () => string;
  getMessage: (key: LocaleMessageKey) => string;
  locale: () => string;
  maxValue: () => CalendarValue | undefined;
  minValue: () => CalendarValue | undefined;
  month: () => CalendarMonth;
  moveFocus: (value: CalendarValue, amount: number, detail: CalendarMonthChangeDetail) => void;
  nextMonth: (detail: CalendarMonthChangeDetail) => CalendarMonth;
  previousMonth: (detail: CalendarMonthChangeDetail) => CalendarMonth;
  rangeValue: () => CalendarRangeValue | undefined;
  selectDate: (value: CalendarValue, detail: CalendarValueChangeDetail) => CalendarValue;
  setFocusedValue: (value: CalendarValue, detail: CalendarMonthChangeDetail) => void;
  selectionMode: () => CalendarSelectionMode;
  value: () => CalendarValue | undefined;
  weekDayLabels: () => string[];
  weeks: () => CalendarDay[][];
};

export type DatePickerApi = {
  calendar: CalendarApi;
  contentId: string;
  open: () => boolean;
  setOpen: (open: boolean, detail: DatePickerOpenChangeDetail) => boolean;
};

const CalendarContext = createContext<CalendarApi>();
const DatePickerContext = createContext<DatePickerApi>();

export function createCalendar(options: CreateCalendarOptions = {}): CalendarApi {
  let pendingValueDetail: CalendarValueChangeDetail | undefined;
  let pendingRangeValueDetail: CalendarRangeValueChangeDetail | undefined;
  let pendingMonthDetail: CalendarMonthChangeDetail | undefined;
  const today = todayValue();
  const initialRangeValue = options.defaultRangeValue ?? options.rangeValue?.();
  const initialValue = options.defaultValue ?? options.value?.() ?? initialRangeValue?.start;
  const initialMonth = options.defaultMonth ?? valueToMonth(initialValue ?? today);
  const [value, setValueState] = createControllableSignal<CalendarValue | undefined>({
    value: options.value,
    defaultValue: initialValue,
    onChange: (nextValue) => {
      if (nextValue === undefined) return;
      options.onValueChange?.(nextValue, pendingValueDetail ?? { reason: "programmatic" });
      pendingValueDetail = undefined;
    },
  });
  const [month, setMonthState] = createControllableSignal<CalendarMonth>({
    value: options.month,
    defaultValue: initialMonth,
    onChange: (nextMonth) => {
      options.onMonthChange?.(nextMonth, pendingMonthDetail ?? { reason: "programmatic" });
      pendingMonthDetail = undefined;
    },
  });
  const [focusedValue, setFocusedValueState] = createControllableSignal<CalendarValue>({
    defaultValue: initialValue ?? today,
    value: () => undefined,
  });
  const [rangeValue, setRangeValueState] = createControllableSignal<CalendarRangeValue | undefined>(
    {
      value: options.rangeValue,
      defaultValue: initialRangeValue,
      onChange: (nextRangeValue) => {
        if (nextRangeValue === undefined) return;
        options.onRangeValueChange?.(
          nextRangeValue,
          pendingRangeValueDetail ?? {
            complete: isCompleteRange(nextRangeValue),
            reason: "programmatic",
          },
        );
        pendingRangeValueDetail = undefined;
      },
    },
  );
  const disabled = createMemo(() => options.disabled?.() ?? false);
  const locale = createMemo(() => options.locale?.() ?? options.localeContext?.locale() ?? "en-US");
  const minValue = createMemo(() => options.minValue?.());
  const maxValue = createMemo(() => options.maxValue?.());
  const selectionMode = createMemo(() => options.selectionMode?.() ?? "single");
  const weekStartsOn = createMemo(() =>
    clampWeekStart(options.weekStartsOn?.() ?? getLocaleWeekStart(locale())),
  );

  const setMonth = (nextMonth: CalendarMonth, detail: CalendarMonthChangeDetail) => {
    pendingMonthDetail = detail;
    const result = setMonthState(nextMonth);
    pendingMonthDetail = undefined;
    return result;
  };

  const focusDate = (nextValue: CalendarValue, detail: CalendarMonthChangeDetail) => {
    const nextMonth = valueToMonth(nextValue);
    setFocusedValueState(nextValue);
    if (nextMonth !== month()) setMonth(nextMonth, detail);
    focusDayButton(nextValue);
  };

  return {
    disabled,
    focusedValue,
    formattedHeading: () =>
      formatMonth(month(), locale(), { month: "long", year: "numeric", timeZone: "UTC" }),
    getMessage: (key) => options.localeContext?.getMessage(key) ?? defaultCalendarMessage(key),
    locale,
    maxValue,
    minValue,
    month,
    moveFocus: (currentValue, amount, detail) => focusDate(addDays(currentValue, amount), detail),
    nextMonth: (detail) => setMonth(addMonths(month(), 1), detail),
    previousMonth: (detail) => setMonth(addMonths(month(), -1), detail),
    rangeValue,
    selectDate: (nextValue, detail) => {
      if (disabled() || isDateDisabled(nextValue, minValue(), maxValue(), options.unavailable))
        return value() ?? nextValue;

      if (selectionMode() === "range") {
        const nextRangeValue = getNextRangeValue(rangeValue(), nextValue, options.unavailable);
        pendingRangeValueDetail = { ...detail, complete: isCompleteRange(nextRangeValue) };
        setRangeValueState(nextRangeValue);
        pendingRangeValueDetail = undefined;
        focusDate(nextValue, { event: detail.event, reason: "focus" });
        return nextValue;
      }

      pendingValueDetail = detail;
      const result = setValueState(nextValue);
      pendingValueDetail = undefined;
      focusDate(nextValue, { event: detail.event, reason: "focus" });
      return result ?? nextValue;
    },
    setFocusedValue: focusDate,
    selectionMode,
    value,
    weekDayLabels: () => getWeekDayLabels(locale(), weekStartsOn()),
    weeks: () =>
      getMonthWeeks(
        month(),
        value(),
        rangeValue(),
        today,
        minValue(),
        maxValue(),
        weekStartsOn(),
        options.unavailable,
      ),
  };
}

export function createDatePicker(options: CreateDatePickerOptions = {}): DatePickerApi {
  let pendingOpenDetail: DatePickerOpenChangeDetail | undefined;
  let calendar: CalendarApi;
  const [open, setOpenState] = createControllableBooleanSignal({
    value: options.open,
    defaultValue: options.defaultOpen ?? false,
    onChange: (nextOpen) =>
      options.onOpenChange?.(nextOpen, pendingOpenDetail ?? { reason: "programmatic" }),
  });
  const setOpen = (nextOpen: boolean, detail: DatePickerOpenChangeDetail) => {
    if (calendar.disabled() && detail.reason !== "programmatic") return open();
    pendingOpenDetail = detail;
    const result = setOpenState(nextOpen);
    pendingOpenDetail = undefined;
    return result;
  };
  calendar = createCalendar({
    ...options,
    onValueChange: (nextValue, detail) => {
      options.onValueChange?.(nextValue, detail);
      setOpen(false, { event: detail.event, reason: "select" });
    },
    onRangeValueChange: (nextRangeValue, detail) => {
      options.onRangeValueChange?.(nextRangeValue, detail);
      if (detail.complete) setOpen(false, { event: detail.event, reason: "select" });
    },
  });

  return {
    calendar,
    contentId: `keystone-date-picker-content-${createUniqueId()}`,
    open,
    setOpen,
  };
}

function useCalendar(part: string) {
  const calendar = useContext(CalendarContext);
  if (!calendar) throw new Error(`Calendar.${part} must be used within Calendar.Root`);
  return calendar;
}

function useDatePicker(part: string) {
  const datePicker = useContext(DatePickerContext);
  if (!datePicker) throw new Error(`DatePicker.${part} must be used within DatePicker.Root`);
  return datePicker;
}

function CalendarRoot(props: CalendarRootProps) {
  const [local, others] = splitProps(props, [
    "children",
    "defaultMonth",
    "defaultRangeValue",
    "defaultValue",
    "disabled",
    "locale",
    "maxValue",
    "minValue",
    "month",
    "onMonthChange",
    "onRangeValueChange",
    "onValueChange",
    "rangeValue",
    "selectionMode",
    "unavailable",
    "value",
    "weekStartsOn",
  ]);
  const calendar = createCalendar({
    defaultMonth: local.defaultMonth,
    defaultRangeValue: local.defaultRangeValue,
    defaultValue: local.defaultValue,
    disabled: () => local.disabled,
    locale: () => local.locale,
    maxValue: () => local.maxValue,
    minValue: () => local.minValue,
    month: () => local.month,
    onMonthChange: local.onMonthChange,
    onRangeValueChange: local.onRangeValueChange,
    onValueChange: local.onValueChange,
    rangeValue: () => local.rangeValue,
    selectionMode: () => local.selectionMode,
    unavailable: local.unavailable,
    value: () => local.value,
    weekStartsOn: () => local.weekStartsOn,
    localeContext: useLocale(),
  });

  return (
    <CalendarContext.Provider value={calendar}>
      <CalendarRootView {...others}>{local.children ?? defaultCalendarChildren()}</CalendarRootView>
    </CalendarContext.Provider>
  );
}

function CalendarRootView(
  props: CalendarPartProps<HTMLDivElement> & JSX.HTMLAttributes<HTMLDivElement>,
) {
  const calendar = useCalendar("Root");
  const [local, others] = splitProps(props, ["children"]);

  return (
    <div
      {...others}
      data-disabled={dataBoolean(calendar.disabled())}
      data-end-value={calendar.rangeValue()?.end}
      data-selection-mode={calendar.selectionMode()}
      data-start-value={calendar.rangeValue()?.start}
      data-value={calendar.value()}
      {...partDataAttributes("calendar", "root")}
    >
      {local.children}
    </div>
  );
}

function Header(props: CalendarHeaderProps) {
  const calendar = useCalendar("Header");
  const [local, others] = splitProps(props, ["children"]);

  return (
    <div
      {...others}
      data-disabled={dataBoolean(calendar.disabled())}
      {...partDataAttributes("calendar", "header")}
    >
      {local.children}
    </div>
  );
}

function PreviousTrigger(props: CalendarNavigationTriggerProps) {
  const calendar = useCalendar("PreviousTrigger");
  const [local, others] = splitProps(props, ["children", "onClick", "type"]);

  return (
    <button
      {...others}
      type={local.type ?? "button"}
      aria-label={others["aria-label"] ?? calendar.getMessage("calendar.previousMonth")}
      disabled={calendar.disabled() || others.disabled}
      data-disabled={dataBoolean(calendar.disabled() || others.disabled)}
      onClick={(event) => {
        callEventHandler(local.onClick, event);
        if (!event.defaultPrevented) calendar.previousMonth({ event, reason: "navigation" });
      }}
      {...partDataAttributes("calendar", "prev-trigger")}
    >
      {local.children ?? calendar.getMessage("calendar.previousMonth")}
    </button>
  );
}

function NextTrigger(props: CalendarNavigationTriggerProps) {
  const calendar = useCalendar("NextTrigger");
  const [local, others] = splitProps(props, ["children", "onClick", "type"]);

  return (
    <button
      {...others}
      type={local.type ?? "button"}
      aria-label={others["aria-label"] ?? calendar.getMessage("calendar.nextMonth")}
      disabled={calendar.disabled() || others.disabled}
      data-disabled={dataBoolean(calendar.disabled() || others.disabled)}
      onClick={(event) => {
        callEventHandler(local.onClick, event);
        if (!event.defaultPrevented) calendar.nextMonth({ event, reason: "navigation" });
      }}
      {...partDataAttributes("calendar", "next-trigger")}
    >
      {local.children ?? calendar.getMessage("calendar.nextMonth")}
    </button>
  );
}

function Heading(props: CalendarHeadingProps) {
  const calendar = useCalendar("Heading");
  const [local, others] = splitProps(props, ["children"]);

  return (
    <h2 {...others} {...partDataAttributes("calendar", "heading")}>
      {local.children ?? calendar.formattedHeading()}
    </h2>
  );
}

function Grid(props: CalendarGridProps) {
  const calendar = useCalendar("Grid");
  const [local, others] = splitProps(props, ["children", "onKeyDown"]);

  return (
    <table
      {...others}
      role="grid"
      aria-disabled={calendar.disabled()}
      {...partDataAttributes("calendar", "grid")}
    >
      <thead data-scope="calendar" data-part="grid-header">
        <tr data-scope="calendar" data-part="row">
          <For each={calendar.weekDayLabels()}>
            {(label) => (
              <th scope="col" role="columnheader" data-scope="calendar" data-part="column-header">
                {label}
              </th>
            )}
          </For>
        </tr>
      </thead>
      <tbody data-scope="calendar" data-part="grid-body">
        <For each={calendar.weeks()}>
          {(week) => (
            <tr data-scope="calendar" data-part="row">
              <For each={week}>
                {(day) => (
                  <td
                    role="gridcell"
                    aria-selected={day.selected}
                    data-disabled={dataBoolean(day.disabled)}
                    data-in-range={dataBoolean(day.inRange)}
                    data-outside-month={dataBoolean(day.outsideMonth)}
                    data-range-end={dataBoolean(day.rangeEnd)}
                    data-range-start={dataBoolean(day.rangeStart)}
                    data-selected={dataBoolean(day.selected)}
                    data-today={dataBoolean(day.today)}
                    data-unavailable={dataBoolean(day.unavailable)}
                    data-value={day.date}
                    {...partDataAttributes("calendar", "cell")}
                  >
                    <button
                      type="button"
                      disabled={calendar.disabled() || day.disabled}
                      tabIndex={calendar.focusedValue() === day.date ? 0 : -1}
                      aria-label={formatDate(day.date, calendar.locale())}
                      data-date={day.date}
                      data-disabled={dataBoolean(calendar.disabled() || day.disabled)}
                      data-in-range={dataBoolean(day.inRange)}
                      data-outside-month={dataBoolean(day.outsideMonth)}
                      data-range-end={dataBoolean(day.rangeEnd)}
                      data-range-start={dataBoolean(day.rangeStart)}
                      data-selected={dataBoolean(day.selected)}
                      data-today={dataBoolean(day.today)}
                      data-unavailable={dataBoolean(day.unavailable)}
                      data-value={day.date}
                      onClick={(event) => calendar.selectDate(day.date, { event, reason: "cell" })}
                      onKeyDown={(event) => {
                        callEventHandler(local.onKeyDown, event);
                        if (!event.defaultPrevented) handleDayKeyDown(event, calendar, day.date);
                      }}
                      {...partDataAttributes("calendar", "cell-trigger")}
                    >
                      {day.day}
                    </button>
                  </td>
                )}
              </For>
            </tr>
          )}
        </For>
      </tbody>
      {local.children}
    </table>
  );
}

function DatePickerRoot(props: DatePickerRootProps) {
  const [local, others] = splitProps(props, [
    "children",
    "defaultMonth",
    "defaultOpen",
    "defaultRangeValue",
    "defaultValue",
    "disabled",
    "locale",
    "maxValue",
    "minValue",
    "month",
    "onMonthChange",
    "onOpenChange",
    "onRangeValueChange",
    "onValueChange",
    "open",
    "rangeValue",
    "selectionMode",
    "unavailable",
    "value",
    "weekStartsOn",
  ]);
  const datePicker = createDatePicker({
    defaultMonth: local.defaultMonth,
    defaultOpen: local.defaultOpen,
    defaultRangeValue: local.defaultRangeValue,
    defaultValue: local.defaultValue,
    disabled: () => local.disabled,
    locale: () => local.locale,
    maxValue: () => local.maxValue,
    minValue: () => local.minValue,
    month: () => local.month,
    onMonthChange: local.onMonthChange,
    onOpenChange: local.onOpenChange,
    onRangeValueChange: local.onRangeValueChange,
    onValueChange: local.onValueChange,
    open: () => local.open,
    rangeValue: () => local.rangeValue,
    selectionMode: () => local.selectionMode,
    unavailable: local.unavailable,
    value: () => local.value,
    weekStartsOn: () => local.weekStartsOn,
    localeContext: useLocale(),
  });

  return (
    <DatePickerContext.Provider value={datePicker}>
      <CalendarContext.Provider value={datePicker.calendar}>
        <div
          {...others}
          data-disabled={dataBoolean(datePicker.calendar.disabled())}
          data-end-value={datePicker.calendar.rangeValue()?.end}
          data-selection-mode={datePicker.calendar.selectionMode()}
          data-start-value={datePicker.calendar.rangeValue()?.start}
          data-state={getOpenClosedState(datePicker.open())}
          data-value={datePicker.calendar.value()}
          {...partDataAttributes("date-picker", "root")}
        >
          {local.children}
        </div>
      </CalendarContext.Provider>
    </DatePickerContext.Provider>
  );
}

function Trigger(props: DatePickerTriggerProps) {
  const datePicker = useDatePicker("Trigger");
  const [local, others] = splitProps(props, ["children", "onClick", "placeholder", "type"]);
  const selectedValue = createMemo(() => datePicker.calendar.value());
  const rangeLabel = createMemo(() => formatRangeValue(datePicker.calendar.rangeValue()));

  return (
    <button
      {...others}
      type={local.type ?? "button"}
      aria-controls={datePicker.contentId}
      aria-expanded={datePicker.open()}
      aria-haspopup="dialog"
      disabled={datePicker.calendar.disabled() || others.disabled}
      data-disabled={dataBoolean(datePicker.calendar.disabled() || others.disabled)}
      data-end-value={datePicker.calendar.rangeValue()?.end}
      data-placeholder={dataBoolean(!selectedValue() && !rangeLabel())}
      data-selection-mode={datePicker.calendar.selectionMode()}
      data-start-value={datePicker.calendar.rangeValue()?.start}
      data-state={getOpenClosedState(datePicker.open())}
      data-value={selectedValue()}
      onClick={(event) => {
        callEventHandler(local.onClick, event);
        if (!event.defaultPrevented)
          datePicker.setOpen(!datePicker.open(), { event, reason: "trigger" });
      }}
      {...partDataAttributes("date-picker", "trigger")}
    >
      {local.children ??
        selectedValue() ??
        rangeLabel() ??
        local.placeholder ??
        datePicker.calendar.getMessage("datePicker.selectDate")}
    </button>
  );
}

function Content(props: DatePickerContentProps) {
  const datePicker = useDatePicker("Content");
  const [local, others] = splitProps(props, ["children", "forceMount"]);

  return (
    <Show when={local.forceMount || datePicker.open()}>
      <div
        {...others}
        id={datePicker.contentId}
        role="dialog"
        data-state={getOpenClosedState(datePicker.open())}
        {...partDataAttributes("date-picker", "content")}
      >
        {local.children ?? defaultCalendarChildren()}
      </div>
    </Show>
  );
}

function DatePickerCalendar(props: DatePickerCalendarProps) {
  const [local, others] = splitProps(props, ["children"]);

  return (
    <CalendarRootView {...others}>{local.children ?? defaultCalendarChildren()}</CalendarRootView>
  );
}

function defaultCalendarChildren() {
  return (
    <>
      <Header>
        <PreviousTrigger />
        <Heading />
        <NextTrigger />
      </Header>
      <Grid />
    </>
  );
}

function handleDayKeyDown(event: KeyboardEvent, calendar: CalendarApi, value: CalendarValue) {
  const keyMoves: Record<string, number> = {
    ArrowDown: 7,
    ArrowLeft: -1,
    ArrowRight: 1,
    ArrowUp: -7,
  };

  if (event.key in keyMoves) {
    event.preventDefault();
    calendar.moveFocus(value, keyMoves[event.key]!, { event, reason: "focus" });
    return;
  }

  if (event.key === "Home" || event.key === "End") {
    event.preventDefault();
    const day = parseDateValue(value).getUTCDay();
    const startDelta = -day;
    calendar.moveFocus(value, event.key === "Home" ? startDelta : startDelta + 6, {
      event,
      reason: "focus",
    });
    return;
  }

  if (event.key === "PageUp" || event.key === "PageDown") {
    event.preventDefault();
    const nextValue = addMonthsToValue(value, event.key === "PageUp" ? -1 : 1);
    calendar.setFocusedValue(nextValue, { event, reason: "focus" });
    return;
  }

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    calendar.selectDate(value, { event, reason: "keyboard" });
  }
}

function getMonthWeeks(
  monthValue: CalendarMonth,
  selectedValue: CalendarValue | undefined,
  rangeValue: CalendarRangeValue | undefined,
  today: CalendarValue,
  minValue: CalendarValue | undefined,
  maxValue: CalendarValue | undefined,
  weekStartsOn: number,
  unavailable: ((value: CalendarValue) => boolean) | undefined,
): CalendarDay[][] {
  const monthDate = parseMonthValue(monthValue);
  const startOffset = modulo(monthDate.getUTCDay() - weekStartsOn, 7);
  const gridStart = addDays(formatDateValue(monthDate), -startOffset);
  const weeks: CalendarDay[][] = [];

  for (let weekIndex = 0; weekIndex < 6; weekIndex += 1) {
    const week: CalendarDay[] = [];
    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const date = addDays(gridStart, weekIndex * 7 + dayIndex);
      const parsed = parseDateValue(date);
      const rangeStart = rangeValue?.start === date;
      const rangeEnd = rangeValue?.end === date;
      const inRange = isInRange(date, rangeValue);
      const isUnavailable = unavailable?.(date) ?? false;
      week.push({
        date,
        day: parsed.getUTCDate(),
        disabled: isDateDisabled(date, minValue, maxValue, unavailable),
        inRange,
        outsideMonth: valueToMonth(date) !== monthValue,
        rangeEnd,
        rangeStart,
        selected: selectedValue === date || rangeStart || rangeEnd,
        today: today === date,
        unavailable: isUnavailable,
      });
    }
    weeks.push(week);
  }

  return weeks;
}

function getWeekDayLabels(locale: string, weekStartsOn: number) {
  const baseSunday = Date.UTC(2026, 0, 4);
  return Array.from({ length: 7 }, (_, index) => {
    const day = new Date(baseSunday + modulo(index + weekStartsOn, 7) * 86_400_000);
    return new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" }).format(day);
  });
}

function getLocaleWeekStart(locale: string) {
  const Locale = (
    Intl as unknown as {
      Locale?: new (locale: string) => { weekInfo?: { firstDay?: number } };
    }
  ).Locale;

  try {
    const firstDay = Locale ? new Locale(locale).weekInfo?.firstDay : undefined;
    if (firstDay === undefined) return 0;
    return firstDay % 7;
  } catch {
    return 0;
  }
}

function isDateDisabled(
  value: CalendarValue,
  minValue: CalendarValue | undefined,
  maxValue: CalendarValue | undefined,
  unavailable: ((value: CalendarValue) => boolean) | undefined,
) {
  return (
    (minValue !== undefined && value < minValue) ||
    (maxValue !== undefined && value > maxValue) ||
    (unavailable?.(value) ?? false)
  );
}

function getNextRangeValue(
  currentRangeValue: CalendarRangeValue | undefined,
  nextValue: CalendarValue,
  unavailable: ((value: CalendarValue) => boolean) | undefined,
): CalendarRangeValue {
  if (!currentRangeValue?.start || currentRangeValue.end) {
    return { start: nextValue };
  }

  if (nextValue < currentRangeValue.start) {
    const nextRangeValue = { start: nextValue, end: currentRangeValue.start };
    return rangeContainsUnavailable(nextRangeValue, unavailable)
      ? { start: nextValue }
      : nextRangeValue;
  }

  const nextRangeValue = { start: currentRangeValue.start, end: nextValue };
  return rangeContainsUnavailable(nextRangeValue, unavailable)
    ? { start: nextValue }
    : nextRangeValue;
}

function isCompleteRange(rangeValue: CalendarRangeValue | undefined) {
  return rangeValue?.start !== undefined && rangeValue.end !== undefined;
}

function isInRange(value: CalendarValue, rangeValue: CalendarRangeValue | undefined) {
  return (
    rangeValue?.start !== undefined &&
    rangeValue.end !== undefined &&
    value >= rangeValue.start &&
    value <= rangeValue.end
  );
}

function rangeContainsUnavailable(
  rangeValue: Required<CalendarRangeValue>,
  unavailable: ((value: CalendarValue) => boolean) | undefined,
) {
  if (!unavailable) return false;

  let value = rangeValue.start;
  while (value <= rangeValue.end) {
    if (unavailable(value)) return true;
    value = addDays(value, 1);
  }

  return false;
}

function formatRangeValue(rangeValue: CalendarRangeValue | undefined) {
  if (!rangeValue?.start) return undefined;
  if (!rangeValue.end) return rangeValue.start;
  return `${rangeValue.start} - ${rangeValue.end}`;
}

function defaultCalendarMessage(key: LocaleMessageKey) {
  const messages = {
    "calendar.nextMonth": "Next month",
    "calendar.previousMonth": "Previous month",
    "datePicker.selectDate": "Select date",
  } as const satisfies Record<LocaleMessageKey, string>;

  return messages[key];
}

function focusDayButton(value: CalendarValue) {
  scheduleMicrotask(() => {
    if (typeof document === "undefined") {
      return;
    }

    document
      .querySelector<HTMLButtonElement>(
        `[data-scope="calendar"][data-part="cell-trigger"][data-date="${value}"]`,
      )
      ?.focus();
  });
}

function todayValue() {
  return formatDateValue(new Date());
}

function valueToMonth(value: CalendarValue) {
  return value.slice(0, 7);
}

function addMonths(month: CalendarMonth, amount: number) {
  const date = parseMonthValue(month);
  date.setUTCMonth(date.getUTCMonth() + amount);
  return formatMonthValue(date);
}

function addMonthsToValue(value: CalendarValue, amount: number) {
  const date = parseDateValue(value);
  const day = date.getUTCDate();
  date.setUTCDate(1);
  date.setUTCMonth(date.getUTCMonth() + amount);
  date.setUTCDate(Math.min(day, daysInMonth(date.getUTCFullYear(), date.getUTCMonth())));
  return formatDateValue(date);
}

function addDays(value: CalendarValue, amount: number) {
  const date = parseDateValue(value);
  date.setUTCDate(date.getUTCDate() + amount);
  return formatDateValue(date);
}

function parseMonthValue(value: CalendarMonth) {
  const [year = "1970", month = "01"] = value.split("-");
  return new Date(Date.UTC(Number(year), Number(month) - 1, 1));
}

function parseDateValue(value: CalendarValue) {
  const [year = "1970", month = "01", day = "01"] = value.split("-");
  return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
}

function formatMonth(value: CalendarMonth, locale: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(locale, options).format(parseMonthValue(value));
}

function formatDate(value: CalendarValue, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(parseDateValue(value));
}

function formatMonthValue(date: Date) {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}`;
}

function formatDateValue(date: Date) {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

function daysInMonth(year: number, monthIndex: number) {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

function clampWeekStart(value: number) {
  return Math.min(6, Math.max(0, Math.trunc(value)));
}

function modulo(value: number, divisor: number) {
  return ((value % divisor) + divisor) % divisor;
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export const Calendar = {
  Root: CalendarRoot,
  Header,
  PreviousTrigger,
  NextTrigger,
  Heading,
  Grid,
};

export const DatePicker = {
  Root: DatePickerRoot,
  Trigger,
  Content,
  Calendar: DatePickerCalendar,
};
