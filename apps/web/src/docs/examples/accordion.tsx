import { createSignal } from "solid-js";
import { Info } from "lucide-solid";
import { Button } from "@keystone-ui/ui/default/ui/button.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@keystone-ui/ui/default/ui/accordion.tsx";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardPanel,
  CardTitle,
} from "@keystone-ui/ui/default/ui/card.tsx";
import { Checkbox } from "@keystone-ui/ui/default/ui/checkbox.tsx";
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
} from "@keystone-ui/ui/default/ui/dialog.tsx";
import { Input } from "@keystone-ui/ui/default/ui/input.tsx";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverFooter,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@keystone-ui/ui/default/ui/popover.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@keystone-ui/ui/default/ui/select.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@keystone-ui/ui/default/ui/tabs.tsx";
import { Textarea } from "@keystone-ui/ui/default/ui/textarea.tsx";
import { toaster, Toaster } from "@keystone-ui/ui/default/ui/toast.tsx";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@keystone-ui/ui/default/ui/tooltip.tsx";

const accordionItems = [
  {
    content:
      "Keystone UI is a source-owned Solid component system for design systems and web apps.",
    id: "item-1",
    title: "What is Keystone UI?",
  },
  {
    content: "Install components with Mason, then own the generated source in your application.",
    id: "item-2",
    title: "How do I get started?",
  },
  {
    content: "Yes. Components are copy-paste source backed by Keystone Core.",
    id: "item-3",
    title: "Can I use it for my project?",
  },
];

export function SingleAccordionExample() {
  return (
    <Accordion class="w-full">
      {accordionItems.map((item) => (
        <AccordionItem value={item.id}>
          <AccordionTrigger>{item.title}</AccordionTrigger>
          <AccordionContent>{item.content}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

export function MultipleAccordionExample() {
  return (
    <Accordion defaultValue={["item-1", "item-2"]} class="w-full" multiple>
      <AccordionItem value="item-1">
        <AccordionTrigger>What is Keystone UI?</AccordionTrigger>
        <AccordionContent>
          Keystone UI is a source-owned Solid component system for design systems and web apps.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How do I get started?</AccordionTrigger>
        <AccordionContent>
          Install components with Mason, then own the generated source in your application.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Can I use it for my project?</AccordionTrigger>
        <AccordionContent>
          Yes. Components are copy-paste source backed by Keystone Core.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function ControlledAccordionExample() {
  const [value, setValue] = createSignal<string[]>([]);

  return (
    <div class="flex w-full flex-col gap-4">
      <Accordion value={value()} class="w-full" onValueChange={setValue}>
        <AccordionItem value="item-1">
          <AccordionTrigger>What is Keystone UI?</AccordionTrigger>
          <AccordionContent>
            Keystone UI is a source-owned Solid component system for design systems and web apps.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>How do I get started?</AccordionTrigger>
          <AccordionContent>
            Install components with Mason, then own the generated source in your application.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Can I use it for my project?</AccordionTrigger>
          <AccordionContent>
            Yes. Components are copy-paste source backed by Keystone Core.
          </AccordionContent>
        </AccordionItem>
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
        "Install components with Mason, then own the generated source in your application.",
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
  return (
    <Accordion defaultValue={["item-1", "item-2"]} class="w-full" multiple>
      <AccordionItem value="item-1">
        <AccordionTrigger>What is Keystone UI?</AccordionTrigger>
        <AccordionContent>
          Keystone UI is a source-owned Solid component system for design systems and web apps.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How do I get started?</AccordionTrigger>
        <AccordionContent>
          Install components with Mason, then own the generated source in your application.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Can I use it for my project?</AccordionTrigger>
        <AccordionContent>Yes. Components are copy-paste source backed by Keystone Core.</AccordionContent>
      </AccordionItem>
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

export function Component() {
  const [value, setValue] = createSignal<string[]>([]);

  return (
    <Accordion value={value()} class="w-full" onValueChange={setValue}>
      <AccordionItem value="item-1">
        <AccordionTrigger>What is Keystone UI?</AccordionTrigger>
        <AccordionContent>
          Keystone UI is a source-owned Solid component system for design systems and web apps.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How do I get started?</AccordionTrigger>
        <AccordionContent>
          Install components with Mason, then own the generated source in your application.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Can I use it for my project?</AccordionTrigger>
        <AccordionContent>Yes. Components are copy-paste source backed by Keystone Core.</AccordionContent>
      </AccordionItem>
    </Accordion>
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
    <div class="flex flex-wrap items-center gap-3">
      <Button>Save changes</Button>
      <Button variant="outline">Preview</Button>
      <Button variant="secondary">Cancel</Button>
      <Button disabled>Disabled</Button>
    </div>
  );
}`;

export const buttonUsageCode = `import { Button } from "@/components/ui/button";

export function Component() {
  return <Button type="submit">Save changes</Button>;
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

export function DialogExample() {
  return (
    <Dialog>
      <DialogTrigger
        class="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-md border border-primary bg-primary px-3 text-primary-foreground text-sm font-medium leading-none shadow-xs/5 outline-none transition-colors hover:bg-primary/90 focus-visible:ring-3 focus-visible:ring-ring/24 sm:min-h-8"
        type="button"
      >
        Open dialog
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite teammate</DialogTitle>
          <DialogDescription>Send an invitation to join this Keystone workspace.</DialogDescription>
        </DialogHeader>
        <DialogPanel>
          <p class="m-0 text-muted-foreground text-sm leading-6">
            Dialog content is rendered through Core overlay behavior with focus management,
            dismissal, and portal support.
          </p>
        </DialogPanel>
        <DialogFooter>
          <DialogClose as={Button} type="button">
            Send invite
          </DialogClose>
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

export function Component() {
  return (
    <Dialog>
      <DialogTrigger type="button">Open dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite teammate</DialogTitle>
          <DialogDescription>Send an invitation to join this Keystone workspace.</DialogDescription>
        </DialogHeader>
        <DialogPanel>Dialog content is rendered through Core overlay behavior.</DialogPanel>
        <DialogFooter>
          <DialogClose as={Button} type="button">
            Send invite
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`;

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

export function Component() {
  return (
    <Dialog>
      <DialogTrigger type="button">Open dialog</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite teammate</DialogTitle>
          <DialogDescription>Send an invitation.</DialogDescription>
        </DialogHeader>
        <DialogPanel>Review teammate details before sending.</DialogPanel>
        <DialogFooter>
          <DialogClose as={Button} type="button">
            Send invite
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}`;

export function CheckboxExample() {
  const [checked, setChecked] = createSignal(true);

  return (
    <label class="flex items-center gap-3 text-sm">
      <Checkbox checked={checked()} onCheckedChange={setChecked} />
      Enable weekly digest
    </label>
  );
}

export const checkboxExampleCode = `import { createSignal } from "solid-js";
import { Checkbox } from "@/components/ui/checkbox";

export function Component() {
  const [checked, setChecked] = createSignal(true);

  return (
    <label class="flex items-center gap-3 text-sm">
      <Checkbox checked={checked()} onCheckedChange={setChecked} />
      Enable weekly digest
    </label>
  );
}`;

export const checkboxUsageCode = `import { Checkbox } from "@/components/ui/checkbox";

export function Component() {
  return <Checkbox name="digest" defaultChecked />;
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
        <TooltipTrigger type="button">Hover or focus</TooltipTrigger>
        <TooltipContent>Tooltip content follows the trigger.</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}`;

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
      <PopoverTrigger type="button">Open Popover</PopoverTrigger>
      <PopoverContent class="w-[20rem]">
        <PopoverHeader>
          <PopoverTitle>Send us feedback</PopoverTitle>
          <PopoverDescription>Let us know how we can improve.</PopoverDescription>
        </PopoverHeader>
        <Textarea aria-label="Feedback" placeholder="How can we improve?" size="lg" />
        <PopoverFooter>
          <Button class="w-full" onClick={() => setOpen(false)} type="button">
            Send feedback
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
}`;

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
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="activity">Activity</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Track the current workspace state.</TabsContent>
      <TabsContent value="activity">Review recent changes.</TabsContent>
      <TabsContent value="settings">Configure defaults and permissions.</TabsContent>
    </Tabs>
  );
}`;

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
  return (
    <div class="flex flex-col items-center gap-3">
      <Button
        type="button"
        onClick={() =>
          toaster.success({
            title: "Saved",
            description: "Your changes were synced.",
          })
        }
      >
        Show toast
      </Button>
      <Toaster viewport={{ position: "bottom-center", offset: "32px" }} />
    </div>
  );
}

export const toastExampleCode = `<Button
  type="button"
  onClick={() =>
    toaster.success({
      title: "Saved",
      description: "Your changes were synced.",
    })
  }
>
  Show toast
</Button>
<Toaster viewport={{ position: "bottom-center" }} />`;

export const toastUsageCode = `import { toaster, Toaster } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

<Button
  type="button"
  onClick={() => toaster.success({ title: "Saved", description: "Your changes were synced." })}
>
  Show toast
</Button>
<Toaster />`;
