import type { JSX } from "solid-js";
import type { CodeExample } from "./registry-doc-types";

import singleAccordionCodeSource from "./examples/single-accordion.tsx?raw";
import { Component as SingleAccordionExampleSourceComponent } from "./examples/single-accordion";
import multipleAccordionCodeSource from "./examples/multiple-accordion.tsx?raw";
import { Component as MultipleAccordionExampleSourceComponent } from "./examples/multiple-accordion";
import controlledAccordionCodeSource from "./examples/controlled-accordion.tsx?raw";
import { Component as ControlledAccordionExampleSourceComponent } from "./examples/controlled-accordion";
import disabledAccordionCodeSource from "./examples/disabled-accordion.tsx?raw";
import { Component as DisabledItemAccordionExampleSourceComponent } from "./examples/disabled-accordion";
import collapsibleExampleCodeSource from "./examples/collapsible-example.tsx?raw";
import { Component as CollapsibleExampleSourceComponent } from "./examples/collapsible-example";
import comboboxExampleCodeSource from "./examples/combobox-example.tsx?raw";
import { Component as ComboboxExampleSourceComponent } from "./examples/combobox-example";
import radioGroupExampleCodeSource from "./examples/radio-group-example.tsx?raw";
import { Component as RadioGroupExampleSourceComponent } from "./examples/radio-group-example";
import datePickerExampleCodeSource from "./examples/date-picker-example.tsx?raw";
import { Component as DatePickerExampleSourceComponent } from "./examples/date-picker-example";
import alertWarningExampleCodeSource from "./examples/alert-warning-example.tsx?raw";
import { Component as WarningAlertExampleSourceComponent } from "./examples/alert-warning-example";
import alertErrorExampleCodeSource from "./examples/alert-error-example.tsx?raw";
import { Component as ErrorAlertExampleSourceComponent } from "./examples/alert-error-example";
import alertActionExampleCodeSource from "./examples/alert-action-example.tsx?raw";
import { Component as AlertActionExampleSourceComponent } from "./examples/alert-action-example";
import alertInfoExampleCodeSource from "./examples/alert-info-example.tsx?raw";
import { Component as AlertExampleSourceComponent } from "./examples/alert-info-example";
import buttonExampleCodeSource from "./examples/button-example.tsx?raw";
import { Component as ButtonExampleSourceComponent } from "./examples/button-example";
import badgeExampleCodeSource from "./examples/badge-example.tsx?raw";
import { Component as BadgeExampleSourceComponent } from "./examples/badge-example";
import badgeSizeExampleCodeSource from "./examples/badge-size-example.tsx?raw";
import { Component as BadgeSizeExampleSourceComponent } from "./examples/badge-size-example";
import cardExampleCodeSource from "./examples/card-example.tsx?raw";
import { Component as CardExampleSourceComponent } from "./examples/card-example";
import checkboxExampleCodeSource from "./examples/checkbox-example.tsx?raw";
import { Component as CheckboxExampleSourceComponent } from "./examples/checkbox-example";
import labelExampleCodeSource from "./examples/label-example.tsx?raw";
import { Component as LabelExampleSourceComponent } from "./examples/label-example";
import labelRequiredExampleCodeSource from "./examples/label-required-example.tsx?raw";
import { Component as LabelRequiredExampleSourceComponent } from "./examples/label-required-example";
import inputExampleCodeSource from "./examples/input-example.tsx?raw";
import { Component as InputExampleSourceComponent } from "./examples/input-example";
import inputSizesExampleCodeSource from "./examples/input-sizes-example.tsx?raw";
import { Component as InputSizesExampleSourceComponent } from "./examples/input-sizes-example";
import inputInvalidExampleCodeSource from "./examples/input-invalid-example.tsx?raw";
import { Component as InputInvalidExampleSourceComponent } from "./examples/input-invalid-example";
import inputFileExampleCodeSource from "./examples/input-file-example.tsx?raw";
import { Component as InputFileExampleSourceComponent } from "./examples/input-file-example";
import switchExampleCodeSource from "./examples/switch-example.tsx?raw";
import { Component as SwitchExampleSourceComponent } from "./examples/switch-example";
import switchDisabledExampleCodeSource from "./examples/switch-disabled-example.tsx?raw";
import { Component as SwitchDisabledExampleSourceComponent } from "./examples/switch-disabled-example";
import switchCompositionExampleCodeSource from "./examples/switch-composition-example.tsx?raw";
import { Component as SwitchCompositionExampleSourceComponent } from "./examples/switch-composition-example";
import dialogExampleCodeSource from "./examples/dialog-example.tsx?raw";
import { Component as DialogExampleSourceComponent } from "./examples/dialog-example";
import popoverExampleCodeSource from "./examples/popover-example.tsx?raw";
import { Component as PopoverExampleSourceComponent } from "./examples/popover-example";
import selectExampleCodeSource from "./examples/select-example.tsx?raw";
import { Component as SelectExampleSourceComponent } from "./examples/select-example";
import tabsExampleCodeSource from "./examples/tabs-example.tsx?raw";
import { Component as TabsExampleSourceComponent } from "./examples/tabs-example";
import tooltipExampleCodeSource from "./examples/tooltip-example.tsx?raw";
import { Component as TooltipExampleSourceComponent } from "./examples/tooltip-example";
import separatorExampleCodeSource from "./examples/separator-example.tsx?raw";
import { Component as SeparatorExampleSourceComponent } from "./examples/separator-example";
import kbdExampleCodeSource from "./examples/kbd-example.tsx?raw";
import { Component as KbdExampleSourceComponent } from "./examples/kbd-example";
import scrollAreaExampleCodeSource from "./examples/scroll-area-example.tsx?raw";
import { Component as ScrollAreaExampleSourceComponent } from "./examples/scroll-area-example";
import breadcrumbExampleCodeSource from "./examples/breadcrumb-example.tsx?raw";
import { Component as BreadcrumbExampleSourceComponent } from "./examples/breadcrumb-example";
import breadcrumbCollapsedExampleCodeSource from "./examples/breadcrumb-collapsed-example.tsx?raw";
import { Component as BreadcrumbCollapsedExampleSourceComponent } from "./examples/breadcrumb-collapsed-example";
import tableExampleCodeSource from "./examples/table-example.tsx?raw";
import { Component as TableExampleSourceComponent } from "./examples/table-example";
import cardFrameTableExampleCodeSource from "./examples/card-frame-table-example.tsx?raw";
import { Component as CardFrameTableExampleSourceComponent } from "./examples/card-frame-table-example";
import fieldExampleCodeSource from "./examples/field-example.tsx?raw";
import { Component as FieldExampleSourceComponent } from "./examples/field-example";
import fieldInvalidExampleCodeSource from "./examples/field-invalid-example.tsx?raw";
import { Component as FieldInvalidExampleSourceComponent } from "./examples/field-invalid-example";
import tanstackFormExampleCodeSource from "./examples/tanstack-form-example.tsx?raw";
import { Component as TanStackFormExampleSourceComponent } from "./examples/tanstack-form-example";
import commandMenuExampleCodeSource from "./examples/command-menu-example.tsx?raw";
import { Component as CommandMenuExampleSourceComponent } from "./examples/command-menu-example";
import toastExampleCodeSource from "./examples/toast-example.tsx?raw";
import { Component as ToastExampleSourceComponent } from "./examples/toast-example";

type DocsExampleOptions = Omit<CodeExample, "preview"> & {
  component: () => JSX.Element;
};

function defineCodeExample(options: DocsExampleOptions): CodeExample {
  const Component = options.component;

  return {
    code: options.code,
    description: options.description,
    id: options.id,
    preview: () => <Component />,
    title: options.title,
    variant: options.variant,
    ...(options.align ? { align: options.align } : {}),
  };
}

export const singleAccordionExample = defineCodeExample({
  code: singleAccordionCodeSource,
  component: SingleAccordionExampleSourceComponent,
  description: "A single-open accordion that starts closed.",
  id: "single",
  title: "Single Accordion",
  variant: "centered",
});

export const multipleAccordionExample = defineCodeExample({
  code: multipleAccordionCodeSource,
  component: MultipleAccordionExampleSourceComponent,
  description: "Open more than one item at a time.",
  id: "multiple",
  title: "Multiple Accordion",
  variant: "centered",
});

export const controlledAccordionExample = defineCodeExample({
  code: controlledAccordionCodeSource,
  component: ControlledAccordionExampleSourceComponent,
  description: "Drive open items from parent state.",
  id: "controlled",
  title: "Controlled Accordion",
  variant: "centered",
});

export const disabledAccordionExample = defineCodeExample({
  code: disabledAccordionCodeSource,
  component: DisabledItemAccordionExampleSourceComponent,
  description: "Disable specific items while keeping keyboard navigation.",
  id: "disabled",
  title: "Disabled Item",
  variant: "centered",
});

export const accordionExamples = [
  singleAccordionExample,
  multipleAccordionExample,
  controlledAccordionExample,
  disabledAccordionExample,
] satisfies readonly CodeExample[];

export const accordionUsageCode = `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Component() {
  return (
    <Accordion class="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is this?</AccordionTrigger>
        <AccordionContent>Accordion is a Core-backed UI disclosure pattern.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`;

export const collapsibleExample = defineCodeExample({
  align: "start",
  code: collapsibleExampleCodeSource,
  component: CollapsibleExampleSourceComponent,
  description: "A simple Core-backed disclosure region with UI-owned trigger and panel styling.",
  id: "basic",
  title: "Basic Collapsible",
  variant: "inline",
});

export const collapsibleExamples = [collapsibleExample] satisfies readonly CodeExample[];

export const collapsibleUsageCode = `import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function Component() {
  return (
    <Collapsible>
      <CollapsibleTrigger>Toggle details</CollapsibleTrigger>
      <CollapsibleContent>Hidden details render when open.</CollapsibleContent>
    </Collapsible>
  );
}`;

export const comboboxExample = defineCodeExample({
  code: comboboxExampleCodeSource,
  component: ComboboxExampleSourceComponent,
  description: "A searchable listbox popup with fruit options.",
  id: "fruit-list",
  title: "Fruit List",
  variant: "inline",
});

export const comboboxExamples = [comboboxExample] satisfies readonly CodeExample[];

export const comboboxUsageCode = `import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxListbox,
} from "@/components/ui/combobox";

export function Component() {
  return (
    <Combobox>
      <ComboboxInput aria-label="Select a fruit" placeholder="Select a fruit..." />
      <ComboboxContent>
        <ComboboxListbox>
          <ComboboxItem value="apple">Apple</ComboboxItem>
          <ComboboxItem value="banana">Banana</ComboboxItem>
          <ComboboxItem value="orange">Orange</ComboboxItem>
          <ComboboxItem value="grape">Grape</ComboboxItem>
        </ComboboxListbox>
      </ComboboxContent>
    </Combobox>
  );
}`;

export const radioGroupExample = defineCodeExample({
  code: radioGroupExampleCodeSource,
  component: RadioGroupExampleSourceComponent,
  description: "Single selection with hidden native inputs and roving focus behavior.",
  id: "basic",
  title: "Basic Radio Group",
  variant: "inline",
});

export const radioGroupExamples = [radioGroupExample] satisfies readonly CodeExample[];

export const radioGroupUsageCode = `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function Component() {
  return (
    <RadioGroup defaultValue="email">
      <RadioGroupItem value="email">Email</RadioGroupItem>
      <RadioGroupItem value="sms">SMS</RadioGroupItem>
      <RadioGroupItem value="none">None</RadioGroupItem>
    </RadioGroup>
  );
}`;

export const datePickerExample = defineCodeExample({
  code: datePickerExampleCodeSource,
  component: DatePickerExampleSourceComponent,
  description: "A date picker trigger with a selected date and calendar popup.",
  id: "basic",
  title: "Basic Date Picker",
  variant: "inline",
});

export const datePickerExamples = [datePickerExample] satisfies readonly CodeExample[];

export const datePickerUsageCode = `import {
  DatePicker,
  DatePickerContent,
  DatePickerTrigger,
} from "@/components/ui/date-picker";

export function Component() {
  return (
    <DatePicker>
      <DatePickerTrigger placeholder="Select date" />
      <DatePickerContent />
    </DatePicker>
  );
}`;

export const alertWarningExample = defineCodeExample({
  code: alertWarningExampleCodeSource,
  component: WarningAlertExampleSourceComponent,
  description: "Warning alert for important guidance that needs attention.",
  id: "warning-alert",
  title: "Warning Alert",
  variant: "inline",
});

export const alertErrorExample = defineCodeExample({
  code: alertErrorExampleCodeSource,
  component: ErrorAlertExampleSourceComponent,
  description: "Error alert for failed or blocked states.",
  id: "error-alert",
  title: "Error Alert",
  variant: "inline",
});

export const alertActionExample = defineCodeExample({
  code: alertActionExampleCodeSource,
  component: AlertActionExampleSourceComponent,
  description: "Alert composition with an icon and app-owned action buttons.",
  id: "with-icon-and-action-buttons",
  title: "With Icon and Action Buttons",
  variant: "inline",
});

export const alertInfoExample = defineCodeExample({
  code: alertInfoExampleCodeSource,
  component: AlertExampleSourceComponent,
  description: "Informational alert for neutral contextual feedback.",
  id: "info-alert",
  title: "Info Alert",
  variant: "inline",
});

export const alertExamples = [
  alertWarningExample,
  alertErrorExample,
  alertActionExample,
  alertInfoExample,
] satisfies readonly CodeExample[];

export const alertUsageCode = `import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function Component() {
  return (
    <Alert>
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>Use alerts for important contextual feedback.</AlertDescription>
    </Alert>
  );
}`;

export const buttonExample = defineCodeExample({
  code: buttonExampleCodeSource,
  component: ButtonExampleSourceComponent,
  description: "Common button variants rendered from the installable UI source.",
  id: "variants",
  title: "Variants",
  variant: "inline",
});

export const buttonExamples = [buttonExample] satisfies readonly CodeExample[];

export const buttonUsageCode = `import { Button } from "@/components/ui/button";

export function Component() {
  return <Button type="submit">Save changes</Button>;
}`;

export const badgeExample = defineCodeExample({
  code: badgeExampleCodeSource,
  component: BadgeExampleSourceComponent,
  description: "Common badge variants rendered from the installable UI source.",
  id: "variants",
  title: "Variants",
  variant: "inline",
});

export const badgeSizeExample = defineCodeExample({
  code: badgeSizeExampleCodeSource,
  component: BadgeSizeExampleSourceComponent,
  description: "Badge sizes for compact labels and slightly larger metadata chips.",
  id: "sizes",
  title: "Sizes",
  variant: "inline",
});

export const badgeExamples = [badgeExample, badgeSizeExample] satisfies readonly CodeExample[];

export const badgeUsageCode = `import { Badge } from "@/components/ui/badge";

export function Component() {
  return <Badge variant="success">Published</Badge>;
}`;

export const cardExample = defineCodeExample({
  code: cardExampleCodeSource,
  component: CardExampleSourceComponent,
  description: "A project creation card with inputs, select, and footer action.",
  id: "project-card",
  title: "Project Card",
  variant: "centered",
});

export const cardExamples = [cardExample] satisfies readonly CodeExample[];

export const cardUsageCode = `import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";

export function Component() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Configure a new workspace.</CardDescription>
      </CardHeader>
      <CardPanel>Project settings go here.</CardPanel>
      <CardFooter>Actions go here.</CardFooter>
    </Card>
  );
}`;

export const checkboxExample = defineCodeExample({
  code: checkboxExampleCodeSource,
  component: CheckboxExampleSourceComponent,
  description: "Controlled checkbox with a visible label.",
  id: "controlled",
  title: "Controlled Checkbox",
  variant: "inline",
});

export const checkboxExamples = [checkboxExample] satisfies readonly CodeExample[];

export const checkboxUsageCode = `import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function Component() {
  return (
    <Label>
      <Checkbox />
      Accept terms and conditions
    </Label>
  );
}`;

export const labelExample = defineCodeExample({
  code: labelExampleCodeSource,
  component: LabelExampleSourceComponent,
  description: "Native label associated with an input by id.",
  id: "with-input",
  title: "With Input",
  variant: "inline",
});

export const labelRequiredExample = defineCodeExample({
  code: labelRequiredExampleCodeSource,
  component: LabelRequiredExampleSourceComponent,
  description: "Compose label text, required marker, helper copy, and a control.",
  id: "required-field",
  title: "Required Field",
  variant: "inline",
});

export const labelExamples = [labelExample, labelRequiredExample] satisfies readonly CodeExample[];

export const labelUsageCode = `import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Component() {
  return (
    <div class="grid gap-2">
      <Label for="email">Email</Label>
      <Input id="email" type="email" />
    </div>
  );
}`;

export const inputExample = defineCodeExample({
  code: inputExampleCodeSource,
  component: InputExampleSourceComponent,
  description: "Text input with an associated label.",
  id: "basic",
  title: "Basic Input",
  variant: "inline",
});

export const inputSizesExample = defineCodeExample({
  code: inputSizesExampleCodeSource,
  component: InputSizesExampleSourceComponent,
  description: "Small, default, and large input sizes.",
  id: "sizes",
  title: "Sizes",
  variant: "inline",
});

export const inputInvalidExample = defineCodeExample({
  code: inputInvalidExampleCodeSource,
  component: InputInvalidExampleSourceComponent,
  description: "Invalid state mirrored to aria-invalid and wrapper data attributes.",
  id: "invalid",
  title: "Invalid State",
  variant: "inline",
});

export const inputFileExample = defineCodeExample({
  code: inputFileExampleCodeSource,
  component: InputFileExampleSourceComponent,
  description: "Native file input using the same wrapper contract.",
  id: "file",
  title: "File Input",
  variant: "inline",
});

export const inputExamples = [
  inputExample,
  inputSizesExample,
  inputInvalidExample,
  inputFileExample,
] satisfies readonly CodeExample[];

export const inputUsageCode = `import { Input } from "@/components/ui/input";

export function Component() {
  return <Input placeholder="Email" type="email" />;
}`;

export const switchExample = defineCodeExample({
  code: switchExampleCodeSource,
  component: SwitchExampleSourceComponent,
  description: "Controlled switch composed with a visible label.",
  id: "controlled",
  title: "Controlled Switch",
  variant: "inline",
});

export const switchDisabledExample = defineCodeExample({
  code: switchDisabledExampleCodeSource,
  component: SwitchDisabledExampleSourceComponent,
  description: "Disabled switches preserve checked state while blocking interaction.",
  id: "disabled",
  title: "Disabled",
  variant: "inline",
});

export const switchCompositionExample = defineCodeExample({
  code: switchCompositionExampleCodeSource,
  component: SwitchCompositionExampleSourceComponent,
  description: "Switch placed in a settings row with label and helper copy.",
  id: "settings-row",
  title: "Settings Row",
  variant: "inline",
});

export const switchExamples = [
  switchExample,
  switchDisabledExample,
  switchCompositionExample,
] satisfies readonly CodeExample[];

export const switchUsageCode = `import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function Component() {
  return (
    <Label>
      <Switch name="notifications" />
      Enable notifications
    </Label>
  );
}`;

export const dialogExample = defineCodeExample({
  code: dialogExampleCodeSource,
  component: DialogExampleSourceComponent,
  description: "A modal dialog with title, description, body, and footer action.",
  id: "basic",
  title: "Basic Dialog",
  variant: "centered",
});

export const dialogExamples = [dialogExample] satisfies readonly CodeExample[];

export const dialogUsageCode = `import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Component() {
  return (
    <Dialog>
      <DialogTrigger type="button">Open dialog</DialogTrigger>
      <DialogContent class="sm:w-96">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <DialogPanel class="grid gap-4">
          <label class="grid gap-2 text-sm font-medium">
            Name
            <Input defaultValue="Margaret Welsh" />
          </label>
          <label class="grid gap-2 text-sm font-medium">
            Username
            <Input defaultValue="@maggie.welsh" />
          </label>
        </DialogPanel>
        <DialogFooter>
          <DialogClose as={Button} type="button" variant="ghost">
            Cancel
          </DialogClose>
          <Button type="button">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`;

export const popoverExample = defineCodeExample({
  code: popoverExampleCodeSource,
  component: PopoverExampleSourceComponent,
  description: "Contextual panel with title, description, content, and footer action.",
  id: "basic",
  title: "Basic Popover",
  variant: "centered",
});

export const popoverExamples = [popoverExample] satisfies readonly CodeExample[];

export const popoverUsageCode = `import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Component() {
  return (
    <Popover>
      <PopoverTrigger type="button">Open</PopoverTrigger>
      <PopoverContent>Contextual controls.</PopoverContent>
    </Popover>
  );
}`;

export const selectExample = defineCodeExample({
  code: selectExampleCodeSource,
  component: SelectExampleSourceComponent,
  description: "Single value select with three options.",
  id: "basic",
  title: "Basic Select",
  variant: "centered",
});

export const selectExamples = [selectExample] satisfies readonly CodeExample[];

export const selectUsageCode = `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Component() {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Choose a framework" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="solid">Solid</SelectItem>
      </SelectContent>
    </Select>
  );
}`;

export const tabsExample = defineCodeExample({
  code: tabsExampleCodeSource,
  component: TabsExampleSourceComponent,
  description: "Horizontal tabs with three panels.",
  id: "basic",
  title: "Basic Tabs",
  variant: "centered",
});

export const tabsExamples = [tabsExample] satisfies readonly CodeExample[];

export const tabsUsageCode = `import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export function Component() {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Track the current workspace state.</TabsContent>
    </Tabs>
  );
}`;

export const toastExampleCode = toastExampleCodeSource;

export const ToastExample = ToastExampleSourceComponent;

export const toastUsageCode = `import { toaster, Toaster } from "@/components/ui/toast";`;

export const tooltipExample = defineCodeExample({
  code: tooltipExampleCodeSource,
  component: TooltipExampleSourceComponent,
  description: "Tooltip attached to a focusable trigger.",
  id: "basic",
  title: "Basic Tooltip",
  variant: "inline",
});

export const tooltipExamples = [tooltipExample] satisfies readonly CodeExample[];

export const tooltipUsageCode = `import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Component() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger type="button">Hover</TooltipTrigger>
        <TooltipContent>Useful context.</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}`;

export const separatorExample = defineCodeExample({
  code: separatorExampleCodeSource,
  component: SeparatorExampleSourceComponent,
  description: "Horizontal and vertical separators dividing a compact resource group.",
  id: "basic",
  title: "Basic Separator",
  variant: "centered",
});

export const separatorExamples = [separatorExample] satisfies readonly CodeExample[];

export const separatorUsageCode = `import { Separator } from "@/components/ui/separator";

export function Component() {
  return <Separator />;
}`;

export const kbdExample = defineCodeExample({
  code: kbdExampleCodeSource,
  component: KbdExampleSourceComponent,
  description: "Display-only shortcut tokens with grouped keycaps.",
  id: "shortcuts",
  title: "Shortcut Tokens",
  variant: "centered",
});

export const kbdExamples = [kbdExample] satisfies readonly CodeExample[];

export const kbdUsageCode = `import { Kbd, KbdGroup, KbdSeparator } from "@/components/ui/kbd";

export function Component() {
  return (
    <KbdGroup>
      <Kbd>⌘</Kbd>
      <KbdSeparator />
      <Kbd>K</Kbd>
    </KbdGroup>
  );
}`;

export const scrollAreaExample = defineCodeExample({
  code: scrollAreaExampleCodeSource,
  component: ScrollAreaExampleSourceComponent,
  description: "A bounded native scroll region for dense panel content.",
  id: "panel",
  title: "Scrollable Panel",
  variant: "centered",
});

export const scrollAreaExamples = [scrollAreaExample] satisfies readonly CodeExample[];

export const scrollAreaUsageCode = `import { ScrollArea } from "@/components/ui/scroll-area";

export function Component() {
  return (
    <ScrollArea class="h-48 w-full">
      <div>Scrollable content</div>
    </ScrollArea>
  );
}`;

export const breadcrumbExamples = [
  defineCodeExample({
    code: breadcrumbExampleCodeSource,
    component: BreadcrumbExampleSourceComponent,
    description: "Route-generated breadcrumb items with current page semantics.",
    id: "items",
    title: "Items",
    variant: "centered",
  }),
  defineCodeExample({
    code: breadcrumbCollapsedExampleCodeSource,
    component: BreadcrumbCollapsedExampleSourceComponent,
    description: "Composed breadcrumb parts with an ellipsis affordance.",
    id: "collapsed",
    title: "Collapsed Trail",
    variant: "centered",
  }),
] satisfies readonly CodeExample[];

export const breadcrumbUsageCode = `import { Breadcrumb } from "@/components/ui/breadcrumb";

export function Component() {
  return (
    <Breadcrumb
      items={[
        { href: "/", label: "Home" },
        { label: "Current page", current: true },
      ]}
    />
  );
}`;

export const tableExample = defineCodeExample({
  code: tableExampleCodeSource,
  component: TableExampleSourceComponent,
  description: "Presentational native table anatomy for readable data.",
  id: "basic",
  title: "Basic Table",
  variant: "full",
});

export const cardFrameTableExample = defineCodeExample({
  code: cardFrameTableExampleCodeSource,
  component: CardFrameTableExampleSourceComponent,
  description: "Card table inside CardFrame with the existing table-container clipping hook.",
  id: "card-frame",
  title: "CardFrame Table",
  variant: "full",
});

export const tableExamples = [tableExample, cardFrameTableExample] satisfies readonly CodeExample[];

export const tableUsageCode = `import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function Component() {
  return (
    <TableContainer>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Registry source</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}`;

export const fieldExamples = [
  defineCodeExample({
    code: fieldExampleCodeSource,
    component: FieldExampleSourceComponent,
    description: "Label, control, and description wired through Keystone Core field semantics.",
    id: "basic",
    title: "Basic Field",
    variant: "centered",
  }),
  defineCodeExample({
    code: fieldInvalidExampleCodeSource,
    component: FieldInvalidExampleSourceComponent,
    description: "Invalid field state with error messaging.",
    id: "invalid",
    title: "Invalid Field",
    variant: "centered",
  }),
] satisfies readonly CodeExample[];

export const fieldUsageCode = `import { Field, FieldControl, FieldLabel } from "@/components/ui/field";

export function Component() {
  return (
    <Field>
      <FieldLabel>Email</FieldLabel>
      <FieldControl type="email" />
    </Field>
  );
}`;

export const tanstackFormExample = defineCodeExample({
  code: tanstackFormExampleCodeSource,
  component: TanStackFormExampleSourceComponent,
  description: "Native form shell that delegates submission and state to TanStack Form.",
  id: "basic",
  title: "Form Shell",
  variant: "centered",
});

export const tanstackFormExamples = [tanstackFormExample] satisfies readonly CodeExample[];

export const tanstackFormUsageCode = `import { TanStackForm, TanStackFormSubmit } from "@/components/ui/tanstack-form";

export function Component(props: { form: unknown }) {
  return (
    <TanStackForm form={props.form}>
      {/* form fields */}
      <TanStackFormSubmit form={props.form}>Submit</TanStackFormSubmit>
    </TanStackForm>
  );
}`;

export const commandMenuExample = defineCodeExample({
  code: commandMenuExampleCodeSource,
  component: CommandMenuExampleSourceComponent,
  description: "Command menu trigger with grouped searchable actions.",
  id: "basic",
  title: "Basic Command Menu",
  variant: "centered",
});

export const commandMenuExamples = [commandMenuExample] satisfies readonly CodeExample[];

export const commandMenuUsageCode = `import { CommandMenu } from "@/components/ui/command-menu";

export function Component() {
  return (
    <CommandMenu
      hotkeys={false}
      items={[
        { value: "open-dashboard", label: "Open dashboard" },
        { value: "copy-link", label: "Copy link" },
      ]}
      trigger={<span>Open command menu</span>}
    />
  );
}`;
