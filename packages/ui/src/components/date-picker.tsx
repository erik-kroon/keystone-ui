import {
  Calendar as CoreCalendar,
  DatePicker as CoreDatePicker,
  type CalendarGridProps as CoreCalendarGridProps,
  type CalendarHeaderProps as CoreCalendarHeaderProps,
  type CalendarHeadingProps as CoreCalendarHeadingProps,
  type CalendarNavigationTriggerProps as CoreCalendarNavigationTriggerProps,
  type CalendarRootProps as CoreCalendarRootProps,
  type DatePickerCalendarProps as CoreDatePickerCalendarProps,
  type DatePickerContentProps as CoreDatePickerContentProps,
  type DatePickerRootProps as CoreDatePickerRootProps,
  type DatePickerTriggerProps as CoreDatePickerTriggerProps,
} from "@keystone-ui/core/date-picker";
import { ChevronLeft, ChevronRight } from "lucide-solid";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type CalendarProps = CoreCalendarRootProps;
export type CalendarHeaderProps = CoreCalendarHeaderProps;
export type CalendarHeadingProps = CoreCalendarHeadingProps;
export type CalendarNavigationTriggerProps = CoreCalendarNavigationTriggerProps;
export type CalendarGridProps = CoreCalendarGridProps;
export type DatePickerProps = CoreDatePickerRootProps;
export type DatePickerTriggerProps = CoreDatePickerTriggerProps;
export type DatePickerContentProps = CoreDatePickerContentProps;
export type DatePickerCalendarProps = CoreDatePickerCalendarProps;

const classes = (...tokens: string[]) => tokens.join(" ");

const navigationTriggerClass = classes(
  "flex",
  "size-(--cell-size)",
  "cursor-pointer",
  "items-center",
  "justify-center",
  "rounded-lg",
  "text-foreground",
  "outline-none",
  "transition-colors",
  "hover:bg-accent",
  "focus-visible:ring-[3px]",
  "focus-visible:ring-ring/50",
  "disabled:pointer-events-none",
  "disabled:opacity-64",
  "[&_svg:not([class*='opacity-'])]:opacity-80",
  "[&_svg:not([class*='size-'])]:size-4.5",
  "sm:[&_svg:not([class*='size-'])]:size-4",
  "[&_svg]:pointer-events-none",
  "[&_svg]:shrink-0",
);

const calendarClass = classes(
  "ui-calendar",
  "w-fit",
  "[--cell-size:--spacing(10)]",
  "sm:[--cell-size:--spacing(9)]",
  "[&_[data-part=header]]:relative",
  "[&_[data-part=header]]:z-2",
  "[&_[data-part=header]]:mb-1",
  "[&_[data-part=header]]:flex",
  "[&_[data-part=header]]:h-(--cell-size)",
  "[&_[data-part=header]]:items-center",
  "[&_[data-part=header]]:justify-center",
  "[&_[data-part=header]]:px-1",
  "[&_[data-part=heading]]:m-0",
  "[&_[data-part=heading]]:flex",
  "[&_[data-part=heading]]:h-full",
  "[&_[data-part=heading]]:items-center",
  "[&_[data-part=heading]]:gap-2",
  "[&_[data-part=heading]]:px-(--cell-size)",
  "[&_[data-part=heading]]:font-medium",
  "[&_[data-part=heading]]:text-base",
  "sm:[&_[data-part=heading]]:text-sm",
  "[&_[data-part=grid]]:w-full",
  "[&_[data-part=grid]]:border-collapse",
  "[&_[data-part=column-header]]:size-(--cell-size)",
  "[&_[data-part=column-header]]:p-0",
  "[&_[data-part=column-header]]:font-medium",
  "[&_[data-part=column-header]]:text-muted-foreground/72",
  "[&_[data-part=column-header]]:text-xs",
  "[&_[data-part=cell]]:size-(--cell-size)",
  "[&_[data-part=cell]]:p-0",
  "[&_[data-part=cell]]:text-center",
  "[&_[data-part=cell][data-in-range]:not([data-range-start]):not([data-range-end])]:bg-accent",
  "[&_[data-part=cell][data-range-end]:not([data-range-start])>button]:rounded-s-none",
  "[&_[data-part=cell][data-range-start]:not([data-range-end])>button]:rounded-e-none",
  "[&_[data-part=cell-trigger]]:relative",
  "[&_[data-part=cell-trigger]]:flex",
  "[&_[data-part=cell-trigger]]:size-(--cell-size)",
  "[&_[data-part=cell-trigger]]:items-center",
  "[&_[data-part=cell-trigger]]:justify-center",
  "[&_[data-part=cell-trigger]]:rounded-lg",
  "[&_[data-part=cell-trigger]]:text-base",
  "[&_[data-part=cell-trigger]]:outline-none",
  "[&_[data-part=cell-trigger]]:transition-[color,background-color,border-radius,box-shadow]",
  "sm:[&_[data-part=cell-trigger]]:text-sm",
  "[&_[data-part=cell-trigger]:not([data-selected]):hover]:bg-accent",
  "[&_[data-part=cell-trigger]:focus-visible]:z-1",
  "[&_[data-part=cell-trigger]:focus-visible]:ring-[3px]",
  "[&_[data-part=cell-trigger]:focus-visible]:ring-ring/50",
  "[&_[data-part=cell-trigger][data-disabled]]:pointer-events-none",
  "[&_[data-part=cell-trigger][data-disabled]]:text-muted-foreground/72",
  "[&_[data-part=cell-trigger][data-disabled]]:line-through",
  "[&_[data-part=cell-trigger][data-outside-month]]:text-muted-foreground/72",
  "[&_[data-part=cell-trigger][data-selected]]:bg-primary",
  "[&_[data-part=cell-trigger][data-selected]]:text-primary-foreground",
  "[&_[data-part=cell-trigger][data-in-range]:not([data-range-start]):not([data-range-end])]:rounded-none",
  "[&_[data-part=cell-trigger][data-in-range]:not([data-range-start]):not([data-range-end])]:bg-accent",
  "[&_[data-part=cell-trigger][data-in-range]:not([data-range-start]):not([data-range-end])]:text-foreground",
  "[&_[data-part=cell-trigger][data-today]]:after:pointer-events-none",
  "[&_[data-part=cell-trigger][data-today]]:after:absolute",
  "[&_[data-part=cell-trigger][data-today]]:after:bottom-1",
  "[&_[data-part=cell-trigger][data-today]]:after:start-1/2",
  "[&_[data-part=cell-trigger][data-today]]:after:z-1",
  "[&_[data-part=cell-trigger][data-today]]:after:size-[3px]",
  "[&_[data-part=cell-trigger][data-today]]:after:-translate-x-1/2",
  "[&_[data-part=cell-trigger][data-today]]:after:rounded-full",
  "[&_[data-part=cell-trigger][data-today]]:after:bg-primary",
  "[&_[data-part=cell-trigger][data-today][data-selected]]:after:bg-background",
  "[&_[data-part=cell-trigger][data-today][data-disabled]]:after:bg-foreground/30",
);

export function Calendar(props: CalendarProps) {
  const [local, rest] = splitProps(props, ["children", "class"]);

  return (
    <CoreCalendar.Root {...rest} data-slot="calendar" class={cn(calendarClass, local.class)}>
      {local.children ?? defaultCalendarChildren()}
    </CoreCalendar.Root>
  );
}

export function CalendarHeader(props: CalendarHeaderProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreCalendar.Header {...rest} class={cn("ui-calendar-header", local.class)} />;
}

export function CalendarPreviousTrigger(props: CalendarNavigationTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreCalendar.PreviousTrigger
      {...rest}
      class={cn(
        "ui-calendar-navigation-trigger absolute top-0 start-0",
        navigationTriggerClass,
        local.class,
      )}
    >
      <ChevronLeft aria-hidden="true" class="rtl:rotate-180" />
    </CoreCalendar.PreviousTrigger>
  );
}

export function CalendarNextTrigger(props: CalendarNavigationTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreCalendar.NextTrigger
      {...rest}
      class={cn(
        "ui-calendar-navigation-trigger absolute top-0 end-0",
        navigationTriggerClass,
        local.class,
      )}
    >
      <ChevronRight aria-hidden="true" class="rtl:rotate-180" />
    </CoreCalendar.NextTrigger>
  );
}

export function CalendarHeading(props: CalendarHeadingProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreCalendar.Heading {...rest} class={cn("ui-calendar-heading", local.class)} />;
}

export function CalendarGrid(props: CalendarGridProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreCalendar.Grid {...rest} class={cn("ui-calendar-grid", local.class)} />;
}

export function DatePicker(props: DatePickerProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreDatePicker.Root
      {...rest}
      data-slot="date-picker"
      class={cn("ui-date-picker relative inline-flex", local.class)}
    />
  );
}

export function DatePickerTrigger(props: DatePickerTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreDatePicker.Trigger
      {...rest}
      data-slot="date-picker-trigger"
      class={cn(
        classes(
          "ui-date-picker-trigger",
          "relative",
          "inline-flex",
          "h-9",
          "w-56",
          "cursor-pointer",
          "items-center",
          "justify-between",
          "gap-2",
          "rounded-lg",
          "border",
          "border-input",
          "bg-popover",
          "px-[calc(--spacing(3)-1px)]",
          "text-base",
          "text-foreground",
          "shadow-xs/5",
          "outline-none",
          "transition-colors",
          "not-dark:bg-clip-padding",
          "before:pointer-events-none",
          "before:absolute",
          "before:inset-0",
          "before:rounded-[calc(var(--radius-lg)-1px)]",
          "before:shadow-[0_1px_--theme(--color-black/4%)]",
          "hover:bg-accent/50",
          "focus-visible:ring-2",
          "focus-visible:ring-ring",
          "focus-visible:ring-offset-1",
          "focus-visible:ring-offset-background",
          "disabled:pointer-events-none",
          "disabled:opacity-64",
          "data-placeholder:text-muted-foreground",
          "sm:h-8",
          "sm:text-sm",
          "dark:bg-input/32",
          "dark:hover:bg-input/64",
          "dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
          "[&_svg:not([class*='opacity-'])]:opacity-80",
          "[&_svg:not([class*='size-'])]:size-4.5",
          "sm:[&_svg:not([class*='size-'])]:size-4",
          "[&_svg]:pointer-events-none",
          "[&_svg]:shrink-0",
        ),
        local.class,
      )}
    />
  );
}

export function DatePickerContent(props: DatePickerContentProps) {
  const [local, rest] = splitProps(props, ["children", "class"]);

  return (
    <CoreDatePicker.Content
      {...rest}
      data-slot="date-picker-content"
      class={cn(
        classes(
          "ui-date-picker-content",
          "absolute",
          "top-full",
          "left-1/2",
          "z-50",
          "mt-2",
          "w-fit",
          "-translate-x-1/2",
          "rounded-xl",
          "border",
          "bg-popover",
          "p-2",
          "text-popover-foreground",
          "shadow-lg/5",
          "outline-none",
          "not-dark:bg-clip-padding",
          "before:pointer-events-none",
          "before:absolute",
          "before:inset-0",
          "before:rounded-[calc(var(--radius-xl)-1px)]",
          "before:shadow-[0_1px_--theme(--color-black/4%)]",
          "dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
        ),
        local.class,
      )}
    >
      {local.children ?? <DatePickerCalendar />}
    </CoreDatePicker.Content>
  );
}

export function DatePickerCalendar(props: DatePickerCalendarProps) {
  const [local, rest] = splitProps(props, ["children", "class"]);

  return (
    <CoreDatePicker.Calendar {...rest} data-slot="calendar" class={cn(calendarClass, local.class)}>
      {local.children ?? defaultCalendarChildren()}
    </CoreDatePicker.Calendar>
  );
}

function defaultCalendarChildren() {
  return (
    <>
      <CalendarHeader>
        <CalendarPreviousTrigger />
        <CalendarHeading />
        <CalendarNextTrigger />
      </CalendarHeader>
      <CalendarGrid />
    </>
  );
}
