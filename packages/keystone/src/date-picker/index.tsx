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
import {
  callEventHandler,
  createControllableBooleanSignal,
  createControllableSignal,
  dataBoolean,
  partDataAttributes,
} from "../utils/index";

export type CalendarValue = string;
export type CalendarMonth = string;
export type CalendarValueChangeReason = "cell" | "keyboard" | "programmatic";
export type CalendarValueChangeDetail = {
  event?: Event;
  reason: CalendarValueChangeReason;
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
    defaultValue?: CalendarValue;
    disabled?: boolean;
    locale?: string;
    maxValue?: CalendarValue;
    minValue?: CalendarValue;
    month?: CalendarMonth;
    onMonthChange?: (month: CalendarMonth, detail: CalendarMonthChangeDetail) => void;
    onValueChange?: (value: CalendarValue, detail: CalendarValueChangeDetail) => void;
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
  defaultValue?: CalendarValue;
  disabled?: () => boolean | undefined;
  locale?: () => string | undefined;
  maxValue?: () => CalendarValue | undefined;
  minValue?: () => CalendarValue | undefined;
  month?: () => CalendarMonth | undefined;
  onMonthChange?: (month: CalendarMonth, detail: CalendarMonthChangeDetail) => void;
  onValueChange?: (value: CalendarValue, detail: CalendarValueChangeDetail) => void;
  value?: () => CalendarValue | undefined;
  weekStartsOn?: () => number | undefined;
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
  outsideMonth: boolean;
  selected: boolean;
  today: boolean;
};

export type CalendarApi = {
  disabled: () => boolean;
  focusedValue: () => CalendarValue;
  formattedHeading: () => string;
  locale: () => string;
  maxValue: () => CalendarValue | undefined;
  minValue: () => CalendarValue | undefined;
  month: () => CalendarMonth;
  moveFocus: (value: CalendarValue, amount: number, detail: CalendarMonthChangeDetail) => void;
  nextMonth: (detail: CalendarMonthChangeDetail) => CalendarMonth;
  previousMonth: (detail: CalendarMonthChangeDetail) => CalendarMonth;
  selectDate: (value: CalendarValue, detail: CalendarValueChangeDetail) => CalendarValue;
  setFocusedValue: (value: CalendarValue, detail: CalendarMonthChangeDetail) => void;
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
  let pendingMonthDetail: CalendarMonthChangeDetail | undefined;
  const today = todayValue();
  const initialValue = options.defaultValue ?? options.value?.();
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
  const disabled = createMemo(() => options.disabled?.() ?? false);
  const locale = createMemo(() => options.locale?.() ?? "en-US");
  const minValue = createMemo(() => options.minValue?.());
  const maxValue = createMemo(() => options.maxValue?.());
  const weekStartsOn = createMemo(() => clampWeekStart(options.weekStartsOn?.() ?? 0));

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
    locale,
    maxValue,
    minValue,
    month,
    moveFocus: (currentValue, amount, detail) => focusDate(addDays(currentValue, amount), detail),
    nextMonth: (detail) => setMonth(addMonths(month(), 1), detail),
    previousMonth: (detail) => setMonth(addMonths(month(), -1), detail),
    selectDate: (nextValue, detail) => {
      if (disabled() || isDateDisabled(nextValue, minValue(), maxValue()))
        return value() ?? nextValue;
      pendingValueDetail = detail;
      const result = setValueState(nextValue);
      pendingValueDetail = undefined;
      focusDate(nextValue, { event: detail.event, reason: "focus" });
      return result ?? nextValue;
    },
    setFocusedValue: focusDate,
    value,
    weekDayLabels: () => getWeekDayLabels(locale(), weekStartsOn()),
    weeks: () => getMonthWeeks(month(), value(), today, minValue(), maxValue(), weekStartsOn()),
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
    "defaultValue",
    "disabled",
    "locale",
    "maxValue",
    "minValue",
    "month",
    "onMonthChange",
    "onValueChange",
    "value",
    "weekStartsOn",
  ]);
  const calendar = createCalendar({
    defaultMonth: local.defaultMonth,
    defaultValue: local.defaultValue,
    disabled: () => local.disabled,
    locale: () => local.locale,
    maxValue: () => local.maxValue,
    minValue: () => local.minValue,
    month: () => local.month,
    onMonthChange: local.onMonthChange,
    onValueChange: local.onValueChange,
    value: () => local.value,
    weekStartsOn: () => local.weekStartsOn,
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
      aria-label={others["aria-label"] ?? "Previous month"}
      disabled={calendar.disabled() || others.disabled}
      data-disabled={dataBoolean(calendar.disabled() || others.disabled)}
      onClick={(event) => {
        callEventHandler(local.onClick, event);
        if (!event.defaultPrevented) calendar.previousMonth({ event, reason: "navigation" });
      }}
      {...partDataAttributes("calendar", "prev-trigger")}
    >
      {local.children ?? "Previous"}
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
      aria-label={others["aria-label"] ?? "Next month"}
      disabled={calendar.disabled() || others.disabled}
      data-disabled={dataBoolean(calendar.disabled() || others.disabled)}
      onClick={(event) => {
        callEventHandler(local.onClick, event);
        if (!event.defaultPrevented) calendar.nextMonth({ event, reason: "navigation" });
      }}
      {...partDataAttributes("calendar", "next-trigger")}
    >
      {local.children ?? "Next"}
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
                    data-outside-month={dataBoolean(day.outsideMonth)}
                    data-selected={dataBoolean(day.selected)}
                    data-today={dataBoolean(day.today)}
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
                      data-outside-month={dataBoolean(day.outsideMonth)}
                      data-selected={dataBoolean(day.selected)}
                      data-today={dataBoolean(day.today)}
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
    "defaultValue",
    "disabled",
    "locale",
    "maxValue",
    "minValue",
    "month",
    "onMonthChange",
    "onOpenChange",
    "onValueChange",
    "open",
    "value",
    "weekStartsOn",
  ]);
  const datePicker = createDatePicker({
    defaultMonth: local.defaultMonth,
    defaultOpen: local.defaultOpen,
    defaultValue: local.defaultValue,
    disabled: () => local.disabled,
    locale: () => local.locale,
    maxValue: () => local.maxValue,
    minValue: () => local.minValue,
    month: () => local.month,
    onMonthChange: local.onMonthChange,
    onOpenChange: local.onOpenChange,
    onValueChange: local.onValueChange,
    open: () => local.open,
    value: () => local.value,
    weekStartsOn: () => local.weekStartsOn,
  });

  return (
    <DatePickerContext.Provider value={datePicker}>
      <CalendarContext.Provider value={datePicker.calendar}>
        <div
          {...others}
          data-disabled={dataBoolean(datePicker.calendar.disabled())}
          data-state={datePicker.open() ? "open" : "closed"}
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

  return (
    <button
      {...others}
      type={local.type ?? "button"}
      aria-controls={datePicker.contentId}
      aria-expanded={datePicker.open()}
      aria-haspopup="dialog"
      disabled={datePicker.calendar.disabled() || others.disabled}
      data-disabled={dataBoolean(datePicker.calendar.disabled() || others.disabled)}
      data-placeholder={dataBoolean(!selectedValue())}
      data-state={datePicker.open() ? "open" : "closed"}
      data-value={selectedValue()}
      onClick={(event) => {
        callEventHandler(local.onClick, event);
        if (!event.defaultPrevented)
          datePicker.setOpen(!datePicker.open(), { event, reason: "trigger" });
      }}
      {...partDataAttributes("date-picker", "trigger")}
    >
      {local.children ?? selectedValue() ?? local.placeholder ?? "Select date"}
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
        data-state={datePicker.open() ? "open" : "closed"}
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
  today: CalendarValue,
  minValue: CalendarValue | undefined,
  maxValue: CalendarValue | undefined,
  weekStartsOn: number,
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
      week.push({
        date,
        day: parsed.getUTCDate(),
        disabled: isDateDisabled(date, minValue, maxValue),
        outsideMonth: valueToMonth(date) !== monthValue,
        selected: selectedValue === date,
        today: today === date,
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

function isDateDisabled(
  value: CalendarValue,
  minValue: CalendarValue | undefined,
  maxValue: CalendarValue | undefined,
) {
  return (
    (minValue !== undefined && value < minValue) || (maxValue !== undefined && value > maxValue)
  );
}

function focusDayButton(value: CalendarValue) {
  queueMicrotask(() => {
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
