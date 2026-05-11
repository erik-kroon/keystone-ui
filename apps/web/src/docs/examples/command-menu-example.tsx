import {
  CommandMenu,
  createCommandMenuStore,
  type CommandMenuItemData,
} from "@/components/ui/command-menu";

const items = [
  {
    value: "open-dashboard",
    label: "Open dashboard",
    description: "Jump to the workspace overview.",
    group: "Navigation",
    shortcutLabel: "⌘D",
  },
  {
    value: "review-registry",
    label: "Review registry item",
    description: "Open the current component QA checklist.",
    group: "Actions",
    shortcutLabel: "⌘R",
  },
  {
    value: "copy-install",
    label: "Copy install command",
    description: "Copy the shadcn registry add command.",
    group: "Actions",
    shortcutLabel: "⌘⇧C",
  },
] satisfies readonly CommandMenuItemData[];

export function Component() {
  const commandMenuStore = createCommandMenuStore({ open: true });

  return (
    <CommandMenu
      hotkeys={false}
      inline
      inputPlaceholder="Search workspace commands"
      items={items}
      showBackdrop={false}
      store={commandMenuStore}
    />
  );
}
