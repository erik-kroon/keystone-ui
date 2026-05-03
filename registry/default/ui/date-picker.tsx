import {
  Calendar as KeystoneCalendar,
  DatePicker as KeystoneDatePicker,
  type CalendarGridProps as KeystoneCalendarGridProps,
  type CalendarHeaderProps as KeystoneCalendarHeaderProps,
  type CalendarHeadingProps as KeystoneCalendarHeadingProps,
  type CalendarNavigationTriggerProps as KeystoneCalendarNavigationTriggerProps,
  type CalendarRootProps as KeystoneCalendarRootProps,
  type DatePickerCalendarProps as KeystoneDatePickerCalendarProps,
  type DatePickerContentProps as KeystoneDatePickerContentProps,
  type DatePickerRootProps as KeystoneDatePickerRootProps,
  type DatePickerTriggerProps as KeystoneDatePickerTriggerProps,
} from "@keystone-ui/keystone/date-picker";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type CalendarProps = KeystoneCalendarRootProps;
export type CalendarHeaderProps = KeystoneCalendarHeaderProps;
export type CalendarHeadingProps = KeystoneCalendarHeadingProps;
export type CalendarNavigationTriggerProps = KeystoneCalendarNavigationTriggerProps;
export type CalendarGridProps = KeystoneCalendarGridProps;
export type DatePickerProps = KeystoneDatePickerRootProps;
export type DatePickerTriggerProps = KeystoneDatePickerTriggerProps;
export type DatePickerContentProps = KeystoneDatePickerContentProps;
export type DatePickerCalendarProps = KeystoneDatePickerCalendarProps;

export function Calendar(props: CalendarProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <KeystoneCalendar.Root {...rest} class={cn("mason-calendar", local.class)} />;
}

export function CalendarHeader(props: CalendarHeaderProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <KeystoneCalendar.Header {...rest} class={cn("mason-calendar-header", local.class)} />;
}

export function CalendarPreviousTrigger(props: CalendarNavigationTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <KeystoneCalendar.PreviousTrigger
      {...rest}
      class={cn("mason-calendar-navigation-trigger", local.class)}
    />
  );
}

export function CalendarNextTrigger(props: CalendarNavigationTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <KeystoneCalendar.NextTrigger
      {...rest}
      class={cn("mason-calendar-navigation-trigger", local.class)}
    />
  );
}

export function CalendarHeading(props: CalendarHeadingProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <KeystoneCalendar.Heading {...rest} class={cn("mason-calendar-heading", local.class)} />;
}

export function CalendarGrid(props: CalendarGridProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <KeystoneCalendar.Grid {...rest} class={cn("mason-calendar-grid", local.class)} />;
}

export function DatePicker(props: DatePickerProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <KeystoneDatePicker.Root {...rest} class={cn("mason-date-picker", local.class)} />;
}

export function DatePickerTrigger(props: DatePickerTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <KeystoneDatePicker.Trigger {...rest} class={cn("mason-date-picker-trigger", local.class)} />
  );
}

export function DatePickerContent(props: DatePickerContentProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return (
    <KeystoneDatePicker.Content {...rest} class={cn("mason-date-picker-content", local.class)} />
  );
}

export function DatePickerCalendar(props: DatePickerCalendarProps) {
  const [local, rest] = splitProps(props, ["class"]);

  return <KeystoneDatePicker.Calendar {...rest} class={cn("mason-calendar", local.class)} />;
}
