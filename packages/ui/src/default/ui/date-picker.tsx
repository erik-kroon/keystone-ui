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

export function Calendar(props: CalendarProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreCalendar.Root {...rest} class={cn("ui-calendar", local.class)} />;
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
      class={cn("ui-calendar-navigation-trigger cursor-pointer", local.class)}
    />
  );
}

export function CalendarNextTrigger(props: CalendarNavigationTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreCalendar.NextTrigger
      {...rest}
      class={cn("ui-calendar-navigation-trigger cursor-pointer", local.class)}
    />
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

  return <CoreDatePicker.Root {...rest} class={cn("ui-date-picker", local.class)} />;
}

export function DatePickerTrigger(props: DatePickerTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <CoreDatePicker.Trigger
      {...rest}
      class={cn("ui-date-picker-trigger cursor-pointer", local.class)}
    />
  );
}

export function DatePickerContent(props: DatePickerContentProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreDatePicker.Content {...rest} class={cn("ui-date-picker-content", local.class)} />;
}

export function DatePickerCalendar(props: DatePickerCalendarProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <CoreDatePicker.Calendar {...rest} class={cn("ui-calendar", local.class)} />;
}
