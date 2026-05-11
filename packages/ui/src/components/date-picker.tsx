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
import { Popper, type PopperRootProps as CorePopperRootProps } from "@keystone-ui/core/popper";
import { Portal, type PortalProps as CorePortalProps } from "@keystone-ui/core/portal";
import { ChevronLeft, ChevronRight } from "lucide-solid";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type CalendarProps = CoreCalendarRootProps;
export type CalendarHeaderProps = CoreCalendarHeaderProps;
export type CalendarHeadingProps = CoreCalendarHeadingProps;
export type CalendarNavigationTriggerProps = CoreCalendarNavigationTriggerProps;
export type CalendarGridProps = CoreCalendarGridProps;
export type DatePickerPopperProps = Omit<CorePopperRootProps, "anchor" | "children">;
export type DatePickerPortalProps = CorePortalProps;
export type DatePickerProps = CoreDatePickerRootProps & {
  popper?: DatePickerPopperProps;
};
export type DatePickerTriggerProps = CoreDatePickerTriggerProps;
export type DatePickerContentProps = CoreDatePickerContentProps & {
  portal?: DatePickerPortalProps;
  positionerClass?: string;
};
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
  "[--cell-size:--spacing(8)]",
  "[&_[data-part=header]]:relative",
  "[&_[data-part=header]]:z-2",
  "[&_[data-part=header]]:mb-2",
  "[&_[data-part=header]]:flex",
  "[&_[data-part=header]]:h-(--cell-size)",
  "[&_[data-part=header]]:items-center",
  "[&_[data-part=header]]:justify-between",
  "[&_[data-part=heading]]:m-0",
  "[&_[data-part=heading]]:flex",
  "[&_[data-part=heading]]:h-full",
  "[&_[data-part=heading]]:items-center",
  "[&_[data-part=heading]]:gap-2",
  "[&_[data-part=heading]]:font-medium",
  "[&_[data-part=heading]]:text-sm",
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
  "[&_[data-part=cell-trigger]]:rounded-md",
  "[&_[data-part=cell-trigger]]:text-sm",
  "[&_[data-part=cell-trigger]]:outline-none",
  "[&_[data-part=cell-trigger]]:transition-[color,background-color,border-radius,box-shadow]",
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
      class={cn("ui-calendar-navigation-trigger", navigationTriggerClass, local.class)}
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
      class={cn("ui-calendar-navigation-trigger", navigationTriggerClass, local.class)}
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
  const [local, rest] = splitProps(props, ["class", "popper"]);

  return (
    <Popper.Root
      collisionPadding={local.popper?.collisionPadding ?? 8}
      fitViewport={local.popper?.fitViewport ?? true}
      gutter={local.popper?.gutter ?? 8}
      placement={local.popper?.placement ?? "bottom"}
      rootBoundary={local.popper?.rootBoundary}
      sameWidth={local.popper?.sameWidth}
      sticky={local.popper?.sticky}
      strategy={local.popper?.strategy ?? "fixed"}
    >
      <CoreDatePicker.Root
        {...rest}
        data-slot="date-picker"
        class={cn("ui-date-picker relative inline-flex", local.class)}
      />
    </Popper.Root>
  );
}

export function DatePickerTrigger(props: DatePickerTriggerProps) {
  const [local, rest] = splitProps(props, ["class"]);
  const dataSlot = () => (props as Record<string, unknown>)["data-slot"] as string | undefined;

  return (
    <Popper.Anchor class="ui-date-picker-anchor inline-flex">
      <CoreDatePicker.Trigger
        {...rest}
        data-slot={dataSlot() ?? "date-picker-trigger"}
        class={cn(
          classes(
            "ui-date-picker-trigger",
            "relative",
            "inline-flex",
            "h-8.5",
            "w-48",
            "cursor-pointer",
            "items-center",
            "justify-between",
            "gap-2",
            "rounded-lg",
            "border",
            "border-input",
            "bg-background",
            "px-3",
            "text-sm",
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
            "hover:bg-accent",
            "focus-visible:ring-2",
            "focus-visible:ring-ring",
            "focus-visible:ring-offset-1",
            "focus-visible:ring-offset-background",
            "disabled:pointer-events-none",
            "disabled:opacity-64",
            "data-placeholder:text-muted-foreground",
            "dark:bg-input/32",
            "dark:hover:bg-input/64",
            "dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
            "[&_svg:not([class*='opacity-'])]:opacity-80",
            "[&_svg:not([class*='size-'])]:size-4",
            "[&_svg]:pointer-events-none",
            "[&_svg]:shrink-0",
          ),
          local.class,
        )}
      />
    </Popper.Anchor>
  );
}

export function DatePickerContent(props: DatePickerContentProps) {
  const [local, rest] = splitProps(props, ["children", "class", "portal", "positionerClass"]);

  return (
    <Portal {...local.portal}>
      <Popper.Positioner
        data-slot="date-picker-positioner"
        class={cn(
          classes("ui-date-picker-positioner", "z-50", "w-fit", "max-w-(--available-width)"),
          local.positionerClass,
        )}
      >
        <CoreDatePicker.Content
          {...rest}
          data-slot="date-picker-content"
          class={cn(
            classes(
              "ui-date-picker-content",
              "relative",
              "w-fit",
              "max-h-(--available-height)",
              "overflow-auto",
              "rounded-lg",
              "border",
              "bg-popover",
              "p-3",
              "text-popover-foreground",
              "shadow-lg/5",
              "outline-none",
              "not-dark:bg-clip-padding",
              "before:pointer-events-none",
              "before:absolute",
              "before:inset-0",
              "before:rounded-[calc(var(--radius-lg)-1px)]",
              "before:shadow-[0_1px_--theme(--color-black/4%)]",
              "dark:before:shadow-[0_-1px_--theme(--color-white/6%)]",
            ),
            local.class,
          )}
        >
          {local.children ?? <DatePickerCalendar />}
        </CoreDatePicker.Content>
      </Popper.Positioner>
    </Portal>
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
