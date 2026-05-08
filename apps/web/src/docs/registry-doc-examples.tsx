import { createSignal, type JSX } from "solid-js";
import { CalendarDays, CircleAlert, Info, TriangleAlert } from "lucide-solid";
import { createToastManager } from "@keystone-ui/core/toast";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@keystone-ui/ui/accordion";
import { Alert, AlertAction, AlertDescription, AlertIcon, AlertTitle } from "@keystone-ui/ui/alert";
import { Badge } from "@keystone-ui/ui/badge";
import { Button } from "@keystone-ui/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@keystone-ui/ui/card";
import { Checkbox } from "@keystone-ui/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@keystone-ui/ui/collapsible";
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxListbox,
} from "@keystone-ui/ui/combobox";
import { DatePicker, DatePickerContent, DatePickerTrigger } from "@keystone-ui/ui/date-picker";
import { Label } from "@keystone-ui/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPanel,
  DialogTitle,
  DialogTrigger,
} from "@keystone-ui/ui/dialog";
import { Input } from "@keystone-ui/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverFooter,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@keystone-ui/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@keystone-ui/ui/select";
import { RadioGroup, RadioGroupItem } from "@keystone-ui/ui/radio-group";
import { Switch } from "@keystone-ui/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@keystone-ui/ui/tabs";
import { Textarea } from "@keystone-ui/ui/textarea";
import { Toaster } from "@keystone-ui/ui/toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@keystone-ui/ui/tooltip";
import type { CodeExample } from "./registry-doc-types";

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

const accordionItems = [
  {
    content:
      "Keystone UI is a source-owned Solid component system for design systems and web apps.",
    id: "item-1",
    title: "What is Keystone UI?",
  },
  {
    content:
      "Install components with the shadcn CLI, then own the generated source in your application.",
    id: "item-2",
    title: "How do I get started?",
  },
  {
    content: "Yes. Components are copy-paste source backed by Keystone Core.",
    id: "item-3",
    title: "Can I use it for my project?",
  },
];

function AccordionItemList() {
  return (
    <>
      {accordionItems.map((item) => (
        <AccordionItem value={item.id}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </>
  );
}

const alertPreviewClass = "w-full max-w-xl";

export function SingleAccordionExample() {
  return (
    <Accordion class="w-full">
      <AccordionItemList />
    </Accordion>
  );
}

export function MultipleAccordionExample() {
  return (
    <Accordion defaultValue={["item-1", "item-2"]} class="w-full" multiple>
      <AccordionItemList />
    </Accordion>
  );
}

export function ControlledAccordionExample() {
  const [value, setValue] = createSignal<string[]>([]);

  return (
    <div class="flex w-full flex-col gap-4">
      <Accordion value={value()} class="w-full" onValueChange={setValue}>
        <AccordionItemList />
      </Accordion>
      <div class="flex flex-col items-start gap-4">
        <Button onClick={() => setValue(["item-1", "item-2"])} type="button" variant="outline">
          Open first two
        </Button>
        <p class="m-0 text-muted-foreground text-sm">
          Open items: {value().length > 0 ? value().join(", ") : "None"}
        </p>
      </div>
    </div>
  );
}

export function DisabledItemAccordionExample() {
  return (
    <Accordion defaultValue={["item-2"]} class="w-full">
      <AccordionItem value="item-1" disabled>
        <AccordionTrigger>Unavailable item</AccordionTrigger>
        <AccordionContent>
          Disabled items keep focus order and ignore activation until enabled.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Available item</AccordionTrigger>
        <AccordionContent>This item remains interactive.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export const singleAccordionCode = `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Component() {
  const items = [
    {
      content:
        "Keystone UI is a source-owned Solid component system for design systems and web apps.",
      id: "item-1",
      title: "What is Keystone UI?",
    },
    {
      content:
        "Install components with the shadcn CLI, then own the generated source in your application.",
      id: "item-2",
      title: "How do I get started?",
    },
    {
      content: "Yes. Components are copy-paste source backed by Keystone Core.",
      id: "item-3",
      title: "Can I use it for my project?",
    },
  ];

  return (
    <Accordion class="w-full">
      {items.map((item) => (
        <AccordionItem value={item.id}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}`;

export const multipleAccordionCode = `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Component() {
  const items = [
    {
      content:
        "Keystone UI is a source-owned Solid component system for design systems and web apps.",
      id: "item-1",
      title: "What is Keystone UI?",
    },
    {
      content:
        "Install components with the shadcn CLI, then own the generated source in your application.",
      id: "item-2",
      title: "How do I get started?",
    },
    {
      content: "Yes. Components are copy-paste source backed by Keystone Core.",
      id: "item-3",
      title: "Can I use it for my project?",
    },
  ];

  return (
    <Accordion defaultValue={["item-1", "item-2"]} class="w-full" multiple>
      {items.map((item) => (
        <AccordionItem value={item.id}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}`;

export const controlledAccordionCode = `import { createSignal } from "solid-js";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

export function Component() {
  const [value, setValue] = createSignal<string[]>([]);
  const items = [
    {
      content:
        "Keystone UI is a source-owned Solid component system for design systems and web apps.",
      id: "item-1",
      title: "What is Keystone UI?",
    },
    {
      content:
        "Install components with the shadcn CLI, then own the generated source in your application.",
      id: "item-2",
      title: "How do I get started?",
    },
    {
      content: "Yes. Components are copy-paste source backed by Keystone Core.",
      id: "item-3",
      title: "Can I use it for my project?",
    },
  ];

  return (
    <div class="flex w-full flex-col gap-4">
      <Accordion value={value()} class="w-full" onValueChange={setValue}>
        {items.map((item) => (
          <AccordionItem value={item.id}>
            <AccordionTrigger>{item.title}</AccordionTrigger>
            <AccordionContent>{item.content}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <div class="flex flex-col items-start gap-4">
        <Button onClick={() => setValue(["item-1", "item-2"])} type="button" variant="outline">
          Open first two
        </Button>
        <p class="m-0 text-muted-foreground text-sm">
          Open items: {value().length > 0 ? value().join(", ") : "None"}
        </p>
      </div>
    </div>
  );
}`;

export const disabledAccordionCode = `import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function Component() {
  return (
    <Accordion defaultValue={["item-2"]} class="w-full">
      <AccordionItem value="item-1" disabled>
        <AccordionTrigger>Unavailable item</AccordionTrigger>
        <AccordionContent>Disabled items keep focus order and ignore activation until enabled.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Available item</AccordionTrigger>
        <AccordionContent>This item remains interactive.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}`;

export const singleAccordionExample = defineCodeExample({
  code: singleAccordionCode,
  component: SingleAccordionExample,
  description: "A single-open accordion that starts closed.",
  id: "single",
  title: "Single Accordion",
  variant: "centered",
});

export const multipleAccordionExample = defineCodeExample({
  code: multipleAccordionCode,
  component: MultipleAccordionExample,
  description: "Open more than one item at a time.",
  id: "multiple",
  title: "Multiple Accordion",
  variant: "centered",
});

export const controlledAccordionExample = defineCodeExample({
  code: controlledAccordionCode,
  component: ControlledAccordionExample,
  description: "Drive open items from parent state.",
  id: "controlled",
  title: "Controlled Accordion",
  variant: "centered",
});

export const disabledAccordionExample = defineCodeExample({
  code: disabledAccordionCode,
  component: DisabledItemAccordionExample,
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

export function CollapsibleExample() {
  return (
    <Collapsible defaultOpen class="w-full max-w-md rounded-lg border bg-card p-4 shadow-xs">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h3 class="m-0 font-medium text-foreground text-sm">Registry details</h3>
          <p class="mt-1 text-muted-foreground text-sm">Inspect source-owned install metadata.</p>
        </div>
        <CollapsibleTrigger class="inline-flex h-8 items-center rounded-md border px-3 text-sm shadow-xs transition-colors hover:bg-accent">
          Toggle
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent class="pt-2">
        <div class="rounded-md bg-muted/60 p-3 text-muted-foreground text-sm">
          Includes files, dependencies, parity notes, and Core-backed disclosure behavior.
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export const collapsibleExampleCode = `import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function Component() {
  return (
    <Collapsible defaultOpen class="w-full max-w-md rounded-lg border bg-card p-4 shadow-xs">
      <div class="flex items-center justify-between gap-3">
        <div>
          <h3 class="m-0 font-medium text-foreground text-sm">Registry details</h3>
          <p class="mt-1 text-muted-foreground text-sm">Inspect source-owned install metadata.</p>
        </div>
        <CollapsibleTrigger class="inline-flex h-8 items-center rounded-md border px-3 text-sm shadow-xs transition-colors hover:bg-accent">
          Toggle
        </CollapsibleTrigger>
      </div>
      <CollapsibleContent class="pt-2">
        <div class="rounded-md bg-muted/60 p-3 text-muted-foreground text-sm">
          Includes files, dependencies, parity notes, and Core-backed disclosure behavior.
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}`;

export const collapsibleExample = defineCodeExample({
  code: collapsibleExampleCode,
  component: CollapsibleExample,
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

const comboboxOptions = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Orange", value: "orange" },
  { label: "Grape", value: "grape" },
  { label: "Strawberry", value: "strawberry" },
  { label: "Mango", value: "mango" },
  { label: "Pineapple", value: "pineapple" },
  { label: "Kiwi", value: "kiwi" },
  { label: "Peach", value: "peach" },
  { label: "Pear", value: "pear" },
];

export function ComboboxExample() {
  return (
    <Combobox>
      <ComboboxInput aria-label="Select a fruit" class="w-64" placeholder="Select a fruit..." />
      <ComboboxContent>
        <ComboboxListbox>
          {comboboxOptions.map((option) => (
            <ComboboxItem value={option.value}>{option.label}</ComboboxItem>
          ))}
        </ComboboxListbox>
      </ComboboxContent>
    </Combobox>
  );
}

export const comboboxExampleCode = `import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxListbox,
} from "@/components/ui/combobox";

export function Component() {
  const options = [
    { label: "Apple", value: "apple" },
    { label: "Banana", value: "banana" },
    { label: "Orange", value: "orange" },
    { label: "Grape", value: "grape" },
    { label: "Strawberry", value: "strawberry" },
    { label: "Mango", value: "mango" },
    { label: "Pineapple", value: "pineapple" },
    { label: "Kiwi", value: "kiwi" },
    { label: "Peach", value: "peach" },
    { label: "Pear", value: "pear" },
  ];

  return (
    <Combobox>
      <ComboboxInput
        aria-label="Select a fruit"
        class="w-64"
        placeholder="Select a fruit..."
      />
      <ComboboxContent>
        <ComboboxListbox>
          {options.map((option) => (
            <ComboboxItem value={option.value}>{option.label}</ComboboxItem>
          ))}
        </ComboboxListbox>
      </ComboboxContent>
    </Combobox>
  );
}`;

export const comboboxExample = defineCodeExample({
  code: comboboxExampleCode,
  component: ComboboxExample,
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

export function RadioGroupExample() {
  return (
    <RadioGroup
      defaultValue="email"
      class="w-fit max-w-full rounded-lg border bg-card p-4 shadow-xs"
    >
      <RadioGroupItem value="email">Email notifications</RadioGroupItem>
      <RadioGroupItem value="sms">SMS notifications</RadioGroupItem>
      <RadioGroupItem value="none">No notifications</RadioGroupItem>
    </RadioGroup>
  );
}

export const radioGroupExampleCode = `import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function Component() {
  return (
    <RadioGroup defaultValue="email" class="w-fit max-w-full rounded-lg border bg-card p-4 shadow-xs">
      <RadioGroupItem value="email">Email notifications</RadioGroupItem>
      <RadioGroupItem value="sms">SMS notifications</RadioGroupItem>
      <RadioGroupItem value="none">No notifications</RadioGroupItem>
    </RadioGroup>
  );
}`;

export const radioGroupExample = defineCodeExample({
  code: radioGroupExampleCode,
  component: RadioGroupExample,
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

export function DatePickerExample() {
  return (
    <DatePicker defaultMonth="2026-05" defaultValue="2026-05-15">
      <DatePickerTrigger
        class="inline-flex h-8.5 w-48 items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 text-sm shadow-xs transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        placeholder="Select date"
      >
        <span>2026-05-15</span>
        <CalendarDays class="size-4 opacity-70" />
      </DatePickerTrigger>
      <DatePickerContent class="mt-2 rounded-lg border bg-popover p-3 shadow-lg/5 [&_[data-part=cell-trigger]]:size-8 [&_[data-part=cell-trigger]]:rounded-md [&_[data-part=cell-trigger]]:text-sm [&_[data-part=cell-trigger]]:hover:bg-accent [&_[data-part=cell-trigger][data-outside-month]]:text-muted-foreground/50 [&_[data-part=cell-trigger][data-selected]]:bg-primary [&_[data-part=cell-trigger][data-selected]]:text-primary-foreground [&_[data-part=column-header]]:h-7 [&_[data-part=column-header]]:text-muted-foreground [&_[data-part=column-header]]:text-xs [&_[data-part=heading]]:m-0 [&_[data-part=heading]]:font-medium [&_[data-part=heading]]:text-sm [&_[data-part=header]]:mb-2 [&_[data-part=header]]:flex [&_[data-part=header]]:items-center [&_[data-part=header]]:justify-between [&_[data-part=next-trigger]]:rounded-md [&_[data-part=next-trigger]]:px-2 [&_[data-part=next-trigger]]:py-1 [&_[data-part=next-trigger]]:text-sm [&_[data-part=prev-trigger]]:rounded-md [&_[data-part=prev-trigger]]:px-2 [&_[data-part=prev-trigger]]:py-1 [&_[data-part=prev-trigger]]:text-sm [&_table]:border-collapse" />
    </DatePicker>
  );
}

export const datePickerExampleCode = `import { CalendarDays } from "lucide-solid";
import {
  DatePicker,
  DatePickerContent,
  DatePickerTrigger,
} from "@/components/ui/date-picker";

export function Component() {
  return (
    <DatePicker defaultMonth="2026-05" defaultValue="2026-05-15">
      <DatePickerTrigger
        class="inline-flex h-8.5 w-48 items-center justify-between gap-2 rounded-lg border border-input bg-background px-3 text-sm shadow-xs transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        placeholder="Select date"
      >
        <span>2026-05-15</span>
        <CalendarDays class="size-4 opacity-70" />
      </DatePickerTrigger>
      <DatePickerContent class="mt-2 rounded-lg border bg-popover p-3 shadow-lg/5 [&_[data-part=cell-trigger]]:size-8 [&_[data-part=cell-trigger]]:rounded-md [&_[data-part=cell-trigger]]:text-sm [&_[data-part=cell-trigger]]:hover:bg-accent [&_[data-part=cell-trigger][data-outside-month]]:text-muted-foreground/50 [&_[data-part=cell-trigger][data-selected]]:bg-primary [&_[data-part=cell-trigger][data-selected]]:text-primary-foreground [&_[data-part=column-header]]:h-7 [&_[data-part=column-header]]:text-muted-foreground [&_[data-part=column-header]]:text-xs [&_[data-part=heading]]:m-0 [&_[data-part=heading]]:font-medium [&_[data-part=heading]]:text-sm [&_[data-part=header]]:mb-2 [&_[data-part=header]]:flex [&_[data-part=header]]:items-center [&_[data-part=header]]:justify-between [&_[data-part=next-trigger]]:rounded-md [&_[data-part=next-trigger]]:px-2 [&_[data-part=next-trigger]]:py-1 [&_[data-part=next-trigger]]:text-sm [&_[data-part=prev-trigger]]:rounded-md [&_[data-part=prev-trigger]]:px-2 [&_[data-part=prev-trigger]]:py-1 [&_[data-part=prev-trigger]]:text-sm [&_table]:border-collapse" />
    </DatePicker>
  );
}`;

export const datePickerExample = defineCodeExample({
  code: datePickerExampleCode,
  component: DatePickerExample,
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

export function AlertExample() {
  return (
    <Alert variant="info" class={alertPreviewClass}>
      <AlertIcon>
        <Info />
      </AlertIcon>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>Describe what can be done about it here.</AlertDescription>
    </Alert>
  );
}

export function WarningAlertExample() {
  return (
    <Alert variant="warning" class={alertPreviewClass}>
      <AlertIcon>
        <TriangleAlert />
      </AlertIcon>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>Describe what can be done about it here.</AlertDescription>
    </Alert>
  );
}

export function ErrorAlertExample() {
  return (
    <Alert variant="error" class={alertPreviewClass}>
      <AlertIcon>
        <CircleAlert />
      </AlertIcon>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>Describe what can be done about it here.</AlertDescription>
    </Alert>
  );
}

export function AlertActionExample() {
  return (
    <Alert class={alertPreviewClass}>
      <AlertIcon>
        <Info />
      </AlertIcon>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>Describe what can be done about it here.</AlertDescription>
      <AlertAction>
        <Button size="sm" type="button" variant="ghost">
          Dismiss
        </Button>
        <Button size="sm" type="button">
          Ok
        </Button>
      </AlertAction>
    </Alert>
  );
}

export const alertWarningExampleCode = `import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@/components/ui/alert";
import { TriangleAlert } from "lucide-solid";

export function Component() {
  return (
    <Alert variant="warning" class="w-full max-w-xl">
      <AlertIcon>
        <TriangleAlert />
      </AlertIcon>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>Describe what can be done about it here.</AlertDescription>
    </Alert>
  );
}`;

export const alertErrorExampleCode = `import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@/components/ui/alert";
import { CircleAlert } from "lucide-solid";

export function Component() {
  return (
    <Alert variant="error" class="w-full max-w-xl">
      <AlertIcon>
        <CircleAlert />
      </AlertIcon>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>Describe what can be done about it here.</AlertDescription>
    </Alert>
  );
}`;

export const alertActionExampleCode = `import { Info } from "lucide-solid";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function Component() {
  return (
    <Alert class="w-full max-w-xl">
      <AlertIcon>
        <Info />
      </AlertIcon>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>Describe what can be done about it here.</AlertDescription>
      <AlertAction>
        <Button size="sm" type="button" variant="ghost">
          Dismiss
        </Button>
        <Button size="sm" type="button">
          Ok
        </Button>
      </AlertAction>
    </Alert>
  );
}`;

export const alertInfoExampleCode = `import { Info } from "lucide-solid";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@/components/ui/alert";

export function Component() {
  return (
    <Alert variant="info" class="w-full max-w-xl">
      <AlertIcon>
        <Info />
      </AlertIcon>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>Describe what can be done about it here.</AlertDescription>
    </Alert>
  );
}`;

export const alertWarningExample = defineCodeExample({
  code: alertWarningExampleCode,
  component: WarningAlertExample,
  description: "Warning alert for important guidance that needs attention.",
  id: "warning-alert",
  title: "Warning Alert",
  variant: "inline",
});

export const alertErrorExample = defineCodeExample({
  code: alertErrorExampleCode,
  component: ErrorAlertExample,
  description: "Error alert for failed or blocked states.",
  id: "error-alert",
  title: "Error Alert",
  variant: "inline",
});

export const alertActionExample = defineCodeExample({
  code: alertActionExampleCode,
  component: AlertActionExample,
  description: "Alert composition with an icon and app-owned action buttons.",
  id: "with-icon-and-action-buttons",
  title: "With Icon and Action Buttons",
  variant: "inline",
});

export const alertInfoExample = defineCodeExample({
  code: alertInfoExampleCode,
  component: AlertExample,
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

export function ButtonExample() {
  return (
    <div class="flex flex-wrap items-center justify-center gap-3">
      <Button>Save changes</Button>
      <Button variant="outline">Preview</Button>
      <Button variant="secondary">Cancel</Button>
      <Button disabled>Disabled</Button>
    </div>
  );
}

export const buttonExampleCode = `import { Button } from "@/components/ui/button";

export function Component() {
  return (
    <div class="flex flex-wrap items-center justify-center gap-3">
      <Button>Save changes</Button>
      <Button variant="outline">Preview</Button>
      <Button variant="secondary">Cancel</Button>
      <Button disabled>Disabled</Button>
    </div>
  );
}`;

export const buttonExample = defineCodeExample({
  code: buttonExampleCode,
  component: ButtonExample,
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

export function BadgeExample() {
  return (
    <div class="flex flex-wrap items-center justify-center gap-2.5 p-1">
      <Badge>Default</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="muted">Muted</Badge>
    </div>
  );
}

export function BadgeSizeExample() {
  return (
    <div class="flex flex-wrap items-center justify-center gap-2.5 p-1">
      <Badge size="sm" variant="outline">
        Small
      </Badge>
      <Badge variant="outline">Default</Badge>
      <Badge size="lg" variant="outline">
        Large
      </Badge>
    </div>
  );
}

export const badgeExampleCode = `import { Badge } from "@/components/ui/badge";

export function Component() {
  return (
    <div class="flex flex-wrap items-center justify-center gap-2.5 p-1">
      <Badge>Default</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="muted">Muted</Badge>
    </div>
  );
}`;

export const badgeSizeExampleCode = `import { Badge } from "@/components/ui/badge";

export function Component() {
  return (
    <div class="flex flex-wrap items-center justify-center gap-2.5 p-1">
      <Badge size="sm" variant="outline">
        Small
      </Badge>
      <Badge variant="outline">Default</Badge>
      <Badge size="lg" variant="outline">
        Large
      </Badge>
    </div>
  );
}`;

export const badgeExample = defineCodeExample({
  code: badgeExampleCode,
  component: BadgeExample,
  description: "Common badge variants rendered from the installable UI source.",
  id: "variants",
  title: "Variants",
  variant: "inline",
});

export const badgeSizeExample = defineCodeExample({
  code: badgeSizeExampleCode,
  component: BadgeSizeExample,
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

export function CardExample() {
  return (
    <Card class="w-[22rem] max-w-full">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardPanel class="grid gap-5">
        <label class="grid gap-2 text-sm">
          <span class="font-medium text-foreground">Name</span>
          <Input placeholder="Name of your project" />
        </label>
        <label class="grid gap-2 text-sm">
          <span class="font-medium text-foreground">Framework</span>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Next.js" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="next">Next.js</SelectItem>
              <SelectItem value="solid">SolidStart</SelectItem>
              <SelectItem value="vite">Vite</SelectItem>
            </SelectContent>
          </Select>
        </label>
      </CardPanel>
      <CardFooter class="grid gap-5">
        <Button class="w-full" type="button">
          Deploy
        </Button>
        <p class="m-0 flex items-center gap-2 text-muted-foreground text-sm">
          <Info aria-hidden="true" class="size-4 shrink-0 text-muted-foreground/80" />
          <span>This will take a few seconds to complete.</span>
        </p>
      </CardFooter>
    </Card>
  );
}

export const cardExampleCode = `import { Button } from "@/components/ui/button";
import { Info } from "lucide-solid";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Component() {
  return (
    <Card class="w-[22rem] max-w-full">
      <CardHeader>
        <CardTitle>Create project</CardTitle>
        <CardDescription>Deploy your new project in one-click.</CardDescription>
      </CardHeader>
      <CardPanel class="grid gap-5">
        <label class="grid gap-2 text-sm">
          <span class="font-medium text-foreground">Name</span>
          <Input placeholder="Name of your project" />
        </label>
        <label class="grid gap-2 text-sm">
          <span class="font-medium text-foreground">Framework</span>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Next.js" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="next">Next.js</SelectItem>
              <SelectItem value="solid">SolidStart</SelectItem>
              <SelectItem value="vite">Vite</SelectItem>
            </SelectContent>
          </Select>
        </label>
      </CardPanel>
      <CardFooter class="grid gap-5">
        <Button class="w-full" type="button">
          Deploy
        </Button>
        <p class="m-0 flex items-center gap-2 text-muted-foreground text-sm">
          <Info aria-hidden="true" class="size-4 shrink-0 text-muted-foreground/80" />
          <span>This will take a few seconds to complete.</span>
        </p>
      </CardFooter>
    </Card>
  );
}`;

export const cardExample = defineCodeExample({
  code: cardExampleCode,
  component: CardExample,
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

export function CheckboxExample() {
  const [checked, setChecked] = createSignal(true);
  return (
    <Label class="gap-3">
      <Checkbox checked={checked()} onCheckedChange={setChecked} />
      Enable weekly digest
    </Label>
  );
}

export const checkboxExampleCode = `import { createSignal } from "solid-js";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export function Component() {
  const [checked, setChecked] = createSignal(true);

  return (
    <Label class="gap-3">
      <Checkbox checked={checked()} onCheckedChange={setChecked} />
      Enable weekly digest
    </Label>
  );
}`;

export const checkboxExample = defineCodeExample({
  code: checkboxExampleCode,
  component: CheckboxExample,
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

export function LabelExample() {
  return (
    <div class="grid w-full max-w-64 gap-2">
      <Label for="preview-email">Email</Label>
      <Input id="preview-email" placeholder="name@example.com" type="email" />
    </div>
  );
}

export function LabelRequiredExample() {
  return (
    <div class="grid w-full max-w-64 gap-2">
      <Label for="preview-workspace">
        Workspace name
        <span class="text-destructive" aria-hidden="true">
          *
        </span>
      </Label>
      <Input id="preview-workspace" placeholder="Acme Studio" required />
      <p class="m-0 text-muted-foreground text-sm">Shown in navigation and billing emails.</p>
    </div>
  );
}

export const labelExampleCode = `import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Component() {
  return (
    <div class="grid w-full max-w-64 gap-2">
      <Label for="email">Email</Label>
      <Input id="email" placeholder="name@example.com" type="email" />
    </div>
  );
}`;

export const labelRequiredExampleCode = `import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Component() {
  return (
    <div class="grid w-full max-w-64 gap-2">
      <Label for="workspace">
        Workspace name
        <span class="text-destructive" aria-hidden="true">
          *
        </span>
      </Label>
      <Input id="workspace" placeholder="Acme Studio" required />
      <p class="m-0 text-muted-foreground text-sm">Shown in navigation and billing emails.</p>
    </div>
  );
}`;

export const labelExample = defineCodeExample({
  code: labelExampleCode,
  component: LabelExample,
  description: "Native label associated with an input by id.",
  id: "with-input",
  title: "With Input",
  variant: "inline",
});

export const labelRequiredExample = defineCodeExample({
  code: labelRequiredExampleCode,
  component: LabelRequiredExample,
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

export function InputExample() {
  return (
    <div class="grid w-full max-w-64 gap-2">
      <Label for="preview-search">Search</Label>
      <Input id="preview-search" placeholder="Search components..." type="search" />
    </div>
  );
}

export function InputSizesExample() {
  return (
    <div class="grid w-full max-w-64 gap-3">
      <Input aria-label="Small input" placeholder="Small" size="sm" />
      <Input aria-label="Default input" placeholder="Default" />
      <Input aria-label="Large input" placeholder="Large" size="lg" />
    </div>
  );
}

export function InputInvalidExample() {
  return (
    <div class="grid w-full max-w-64 gap-2">
      <Label for="preview-invalid-email">Email</Label>
      <Input id="preview-invalid-email" defaultValue="not-an-email" invalid type="email" />
      <p class="m-0 text-destructive text-sm">Enter a valid email address.</p>
    </div>
  );
}

export function InputFileExample() {
  return (
    <div class="grid w-full max-w-64 gap-2">
      <Label for="preview-file">Avatar</Label>
      <Input id="preview-file" type="file" />
    </div>
  );
}

export const inputExampleCode = `import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Component() {
  return (
    <div class="grid w-full max-w-64 gap-2">
      <Label for="search">Search</Label>
      <Input id="search" placeholder="Search components..." type="search" />
    </div>
  );
}`;

export const inputSizesExampleCode = `import { Input } from "@/components/ui/input";

export function Component() {
  return (
    <div class="grid w-full max-w-64 gap-3">
      <Input aria-label="Small input" placeholder="Small" size="sm" />
      <Input aria-label="Default input" placeholder="Default" />
      <Input aria-label="Large input" placeholder="Large" size="lg" />
    </div>
  );
}`;

export const inputInvalidExampleCode = `import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Component() {
  return (
    <div class="grid w-full max-w-64 gap-2">
      <Label for="email">Email</Label>
      <Input id="email" defaultValue="not-an-email" invalid type="email" />
      <p class="m-0 text-destructive text-sm">Enter a valid email address.</p>
    </div>
  );
}`;

export const inputFileExampleCode = `import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function Component() {
  return (
    <div class="grid w-full max-w-64 gap-2">
      <Label for="avatar">Avatar</Label>
      <Input id="avatar" type="file" />
    </div>
  );
}`;

export const inputExample = defineCodeExample({
  code: inputExampleCode,
  component: InputExample,
  description: "Text input with an associated label.",
  id: "basic",
  title: "Basic Input",
  variant: "inline",
});

export const inputSizesExample = defineCodeExample({
  code: inputSizesExampleCode,
  component: InputSizesExample,
  description: "Small, default, and large input sizes.",
  id: "sizes",
  title: "Sizes",
  variant: "inline",
});

export const inputInvalidExample = defineCodeExample({
  code: inputInvalidExampleCode,
  component: InputInvalidExample,
  description: "Invalid state mirrored to aria-invalid and wrapper data attributes.",
  id: "invalid",
  title: "Invalid State",
  variant: "inline",
});

export const inputFileExample = defineCodeExample({
  code: inputFileExampleCode,
  component: InputFileExample,
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

export function SwitchExample() {
  const [checked, setChecked] = createSignal(false);
  return (
    <Label class="gap-3">
      <Switch checked={checked()} onCheckedChange={setChecked} name="notifications" />
      Enable notifications
    </Label>
  );
}

export function SwitchDisabledExample() {
  return (
    <div class="grid gap-3">
      <Label class="gap-3">
        <Switch defaultChecked disabled name="email-digest" />
        Email digest
      </Label>
      <Label class="gap-3 text-muted-foreground">
        <Switch disabled name="desktop-alerts" />
        Desktop alerts
      </Label>
    </div>
  );
}

export function SwitchCompositionExample() {
  return (
    <div class="grid w-full max-w-md gap-3 rounded-lg border border-border bg-card p-4">
      <Label class="flex items-start justify-between gap-4">
        <div class="grid gap-1">
          <span class="leading-5">Background sync</span>
          <p class="m-0 text-muted-foreground text-sm">
            Keep workspace data fresh while the app is open.
          </p>
        </div>
        <Switch defaultChecked name="background-sync" />
      </Label>
    </div>
  );
}

export const switchExampleCode = `import { createSignal } from "solid-js";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function Component() {
  const [checked, setChecked] = createSignal(false);

  return (
    <Label class="gap-3">
      <Switch checked={checked()} onCheckedChange={setChecked} name="notifications" />
      Enable notifications
    </Label>
  );
}`;

export const switchDisabledExampleCode = `import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function Component() {
  return (
    <div class="grid gap-3">
      <Label class="gap-3">
        <Switch defaultChecked disabled name="email-digest" />
        Email digest
      </Label>
      <Label class="gap-3 text-muted-foreground">
        <Switch disabled name="desktop-alerts" />
        Desktop alerts
      </Label>
    </div>
  );
}`;

export const switchCompositionExampleCode = `import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export function Component() {
  return (
    <div class="grid w-full max-w-md gap-3 rounded-lg border border-border bg-card p-4">
      <Label class="flex items-start justify-between gap-4">
        <div class="grid gap-1">
          <span class="leading-5">Background sync</span>
          <p class="m-0 text-muted-foreground text-sm">
            Keep workspace data fresh while the app is open.
          </p>
        </div>
        <Switch defaultChecked name="background-sync" />
      </Label>
    </div>
  );
}`;

export const switchExample = defineCodeExample({
  code: switchExampleCode,
  component: SwitchExample,
  description: "Controlled switch composed with a visible label.",
  id: "controlled",
  title: "Controlled Switch",
  variant: "inline",
});

export const switchDisabledExample = defineCodeExample({
  code: switchDisabledExampleCode,
  component: SwitchDisabledExample,
  description: "Disabled switches preserve checked state while blocking interaction.",
  id: "disabled",
  title: "Disabled",
  variant: "inline",
});

export const switchCompositionExample = defineCodeExample({
  code: switchCompositionExampleCode,
  component: SwitchCompositionExample,
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

export function DialogExample() {
  return (
    <Dialog>
      <DialogTrigger
        class="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md border border-primary bg-primary px-3 text-primary-foreground text-sm font-medium leading-none shadow-xs/5 outline-none transition-colors hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/24 sm:min-h-8"
        type="button"
      >
        Open dialog
      </DialogTrigger>
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
}

export const dialogExampleCode = `import { Button } from "@/components/ui/button";
import {
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
import { Input } from "@/components/ui/input";

export function Component() {
  return (
    <Dialog>
      <DialogTrigger
        class="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md border border-primary bg-primary px-3 text-primary-foreground text-sm font-medium leading-none shadow-xs/5 outline-none transition-colors hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/24 sm:min-h-8"
        type="button"
      >
        Open dialog
      </DialogTrigger>
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

export const dialogExample = defineCodeExample({
  code: dialogExampleCode,
  component: DialogExample,
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

export function PopoverExample() {
  const [open, setOpen] = createSignal(false);
  return (
    <Popover open={open()} onOpenChange={setOpen}>
      <PopoverTrigger
        class="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md border border-input bg-popover px-3 text-foreground text-sm font-medium leading-none shadow-xs/5 outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring/24 sm:min-h-8"
        type="button"
      >
        Open Popover
      </PopoverTrigger>
      <PopoverContent class="w-[18rem] sm:w-[20rem]">
        <PopoverHeader>
          <PopoverTitle>Send us feedback</PopoverTitle>
          <PopoverDescription>Let us know how we can improve.</PopoverDescription>
        </PopoverHeader>
        <Textarea
          aria-label="Feedback"
          class="min-h-20"
          placeholder="How can we improve?"
          size="lg"
        />
        <PopoverFooter>
          <Button class="w-full" onClick={() => setOpen(false)} type="button">
            Send feedback
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}

export const popoverExampleCode = `import { createSignal } from "solid-js";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverFooter,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";

export function Component() {
  const [open, setOpen] = createSignal(false);

  return (
    <Popover open={open()} onOpenChange={setOpen}>
      <PopoverTrigger
        class="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md border border-input bg-popover px-3 text-foreground text-sm font-medium leading-none shadow-xs/5 outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring/24 sm:min-h-8"
        type="button"
      >
        Open Popover
      </PopoverTrigger>
      <PopoverContent class="w-[18rem] sm:w-[20rem]">
        <PopoverHeader>
          <PopoverTitle>Send us feedback</PopoverTitle>
          <PopoverDescription>Let us know how we can improve.</PopoverDescription>
        </PopoverHeader>
        <Textarea
          aria-label="Feedback"
          class="min-h-20"
          placeholder="How can we improve?"
          size="lg"
        />
        <PopoverFooter>
          <Button class="w-full" onClick={() => setOpen(false)} type="button">
            Send feedback
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}`;

export const popoverExample = defineCodeExample({
  code: popoverExampleCode,
  component: PopoverExample,
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

export function SelectExample() {
  return (
    <Select>
      <SelectTrigger class="w-56">
        <SelectValue placeholder="Choose a framework" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="solid">Solid</SelectItem>
        <SelectItem value="react">React</SelectItem>
        <SelectItem value="vue">Vue</SelectItem>
      </SelectContent>
    </Select>
  );
}

export const selectExampleCode = `import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Component() {
  return (
    <Select>
      <SelectTrigger class="w-56">
        <SelectValue placeholder="Choose a framework" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="solid">Solid</SelectItem>
        <SelectItem value="react">React</SelectItem>
        <SelectItem value="vue">Vue</SelectItem>
      </SelectContent>
    </Select>
  );
}`;

export const selectExample = defineCodeExample({
  code: selectExampleCode,
  component: SelectExample,
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

export function TabsExample() {
  return (
    <Tabs defaultValue="overview" class="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" class="rounded-lg border border-border p-4 text-sm">
        Track the current workspace state.
      </TabsContent>
      <TabsContent value="activity" class="rounded-lg border border-border p-4 text-sm">
        Review recent changes.
      </TabsContent>
      <TabsContent value="settings" class="rounded-lg border border-border p-4 text-sm">
        Configure defaults and permissions.
      </TabsContent>
    </Tabs>
  );
}

export const tabsExampleCode = `import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

export function Component() {
  return (
    <Tabs defaultValue="overview" class="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" class="rounded-lg border border-border p-4 text-sm">
        Track the current workspace state.
      </TabsContent>
      <TabsContent value="activity" class="rounded-lg border border-border p-4 text-sm">
        Review recent changes.
      </TabsContent>
      <TabsContent value="settings" class="rounded-lg border border-border p-4 text-sm">
        Configure defaults and permissions.
      </TabsContent>
    </Tabs>
  );
}`;

export const tabsExample = defineCodeExample({
  code: tabsExampleCode,
  component: TabsExample,
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

export function ToastExample() {
  const toastManager = createToastManager();
  return (
    <div class="flex min-h-72 w-full flex-col items-center justify-center gap-3">
      <Button
        type="button"
        onClick={() =>
          toastManager.success({ title: "Saved", description: "Your changes were synced." })
        }
      >
        Show toast
      </Button>
      <Toaster manager={toastManager} />
    </div>
  );
}

export const toastExampleCode = `import { toaster, Toaster } from "@/components/ui/toast";`;
export const toastUsageCode = toastExampleCode;

export function TooltipExample() {
  return (
    <TooltipProvider delayDuration={120}>
      <Tooltip>
        <TooltipTrigger
          class="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md border border-input bg-popover px-3 text-foreground text-sm font-medium leading-none shadow-xs/5 outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring/24 sm:min-h-8"
          type="button"
        >
          Hover or focus
        </TooltipTrigger>
        <TooltipContent>Tooltip content follows the trigger.</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export const tooltipExampleCode = `import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Component() {
  return (
    <TooltipProvider delayDuration={120}>
      <Tooltip>
        <TooltipTrigger
          class="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md border border-input bg-popover px-3 text-foreground text-sm font-medium leading-none shadow-xs/5 outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-3 focus-visible:ring-ring/24 sm:min-h-8"
          type="button"
        >
          Hover or focus
        </TooltipTrigger>
        <TooltipContent>Tooltip content follows the trigger.</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}`;

export const tooltipExample = defineCodeExample({
  code: tooltipExampleCode,
  component: TooltipExample,
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
