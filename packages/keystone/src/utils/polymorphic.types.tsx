import type { JSX } from "solid-js";
import { Dialog, type DialogTriggerProps } from "../dialog/index";
import { Select, type SelectTriggerProps } from "../select/index";
import { renderPolymorphic, type KeystoneAs, type PolymorphicProps } from "./index";

export const anchorRenderer: KeystoneAs<JSX.HTMLAttributes<HTMLAnchorElement>> = (
  props: JSX.HTMLAttributes<HTMLAnchorElement>,
) => <a href="/settings" {...props} />;

const renderTriggerAsButton = (props: JSX.HTMLAttributes<HTMLButtonElement>) => (
  <button {...props} />
);

export const anchorPolymorphicProps = {
  as: anchorRenderer,
} satisfies PolymorphicProps<HTMLAnchorElement>;

export const dialogTriggerProps = {
  as: renderTriggerAsButton,
  children: "Settings",
} satisfies DialogTriggerProps;

export const selectTriggerProps = {
  as: renderTriggerAsButton,
  children: "Filters",
} satisfies SelectTriggerProps;

export function DialogTriggerAsPolymorphicCallback() {
  return (
    <Dialog.Root>
      <Dialog.Trigger as={renderTriggerAsButton}>Settings</Dialog.Trigger>
    </Dialog.Root>
  );
}

export function SelectTriggerAsPolymorphicCallback() {
  return (
    <Select.Root>
      <Select.Trigger as={renderTriggerAsButton}>Filters</Select.Trigger>
    </Select.Root>
  );
}

export const renderedAnchor = renderPolymorphic(anchorRenderer, "button", {
  children: "Settings",
  "data-scope": "kernel",
  "data-part": "trigger",
});
