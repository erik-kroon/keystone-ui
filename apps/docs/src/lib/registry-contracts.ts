import accordion from "../../../../registry/default/items/accordion.json";
import accountSettings from "../../../../registry/default/items/account-settings.json";
import autocomplete from "../../../../registry/default/items/autocomplete.json";
import badge from "../../../../registry/default/items/badge.json";
import button from "../../../../registry/default/items/button.json";
import card from "../../../../registry/default/items/card.json";
import checkbox from "../../../../registry/default/items/checkbox.json";
import cn from "../../../../registry/default/items/cn.json";
import collapsible from "../../../../registry/default/items/collapsible.json";
import combobox from "../../../../registry/default/items/combobox.json";
import commandMenu from "../../../../registry/default/items/command-menu.json";
import contextMenu from "../../../../registry/default/items/context-menu.json";
import dataTableTanstackRouter from "../../../../registry/default/items/data-table-tanstack-router.json";
import dataTable from "../../../../registry/default/items/data-table.json";
import datePicker from "../../../../registry/default/items/date-picker.json";
import dialog from "../../../../registry/default/items/dialog.json";
import dropdownMenu from "../../../../registry/default/items/dropdown-menu.json";
import field from "../../../../registry/default/items/field.json";
import hoverCard from "../../../../registry/default/items/hover-card.json";
import input from "../../../../registry/default/items/input.json";
import label from "../../../../registry/default/items/label.json";
import menu from "../../../../registry/default/items/menu.json";
import menubar from "../../../../registry/default/items/menubar.json";
import navigationMenu from "../../../../registry/default/items/navigation-menu.json";
import popover from "../../../../registry/default/items/popover.json";
import radioGroup from "../../../../registry/default/items/radio-group.json";
import selectField from "../../../../registry/default/items/select-field.json";
import separator from "../../../../registry/default/items/separator.json";
import sheet from "../../../../registry/default/items/sheet.json";
import slider from "../../../../registry/default/items/slider.json";
import switchItem from "../../../../registry/default/items/switch.json";
import tabs from "../../../../registry/default/items/tabs.json";
import textField from "../../../../registry/default/items/text-field.json";
import textarea from "../../../../registry/default/items/textarea.json";
import toast from "../../../../registry/default/items/toast.json";
import toolbar from "../../../../registry/default/items/toolbar.json";
import tooltip from "../../../../registry/default/items/tooltip.json";

export type RegistryFileContract = {
  path: string;
  type: string;
  target: string;
};

export type RegistryItemContract = {
  name: string;
  title: string;
  description: string;
  type: string;
  install: string;
  dependencies: readonly string[];
  registryDependencies: readonly string[];
  customization: string;
  caveats: string;
  files: readonly RegistryFileContract[];
  parity: Readonly<Record<string, string>>;
};

const rawItems = [
  accordion,
  accountSettings,
  autocomplete,
  badge,
  button,
  card,
  checkbox,
  cn,
  collapsible,
  combobox,
  commandMenu,
  contextMenu,
  dataTableTanstackRouter,
  dataTable,
  datePicker,
  dialog,
  dropdownMenu,
  field,
  hoverCard,
  input,
  label,
  menu,
  menubar,
  navigationMenu,
  popover,
  radioGroup,
  selectField,
  separator,
  sheet,
  slider,
  switchItem,
  tabs,
  textField,
  textarea,
  toast,
  toolbar,
  tooltip,
] as const;

export const registryItemContracts = rawItems
  .map((item) => ({
    name: item.name,
    title: item.title,
    description: item.description,
    type: item.type,
    install: String(item.meta.install),
    dependencies: item.dependencies ?? [],
    registryDependencies: item.registryDependencies ?? [],
    customization: String(item.meta.customization ?? item.meta.limitations ?? ""),
    caveats: String(
      item.meta.limitations ??
        "Generated output is user-owned source. Mason may plan future diffs and updates, but app teams can edit the installed files.",
    ),
    files: item.files.map((file) => ({
      path: file.path,
      type: file.type,
      target: file.target ?? deriveTarget(file.path, file.type),
    })),
    parity: item.meta.parity as Readonly<Record<string, string>>,
  }))
  .sort((left, right) =>
    left.name.localeCompare(right.name),
  ) satisfies readonly RegistryItemContract[];

export function getRegistryItemContract(name: string): RegistryItemContract {
  const item = registryItemContracts.find((candidate) => candidate.name === name);

  if (!item) {
    throw new Error(`Missing registry docs contract for ${name}`);
  }

  return item;
}

function deriveTarget(sourcePath: string, type: string): string {
  if (type === "registry:block") {
    return sourcePath.replace(/^blocks\//, "src/components/blocks/");
  }

  if (type === "registry:lib") {
    return sourcePath.replace(/^lib\//, "src/lib/");
  }

  if (sourcePath.startsWith("components/")) {
    return `src/${sourcePath}`;
  }

  return sourcePath.replace(/^ui\//, "src/components/ui/");
}
