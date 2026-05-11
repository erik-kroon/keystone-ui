import type { JSX } from "solid-js";

export type PreviewVariant = "centered" | "dense" | "full" | "inline";
export type PreviewAlign = "center" | "end" | "start";

export type CodeExample = {
  align?: PreviewAlign;
  code: string;
  description: string;
  id: string;
  preview: () => JSX.Element;
  title: string;
  variant?: PreviewVariant;
};

export type ApiReferenceItem = {
  description: string;
  examples?: readonly ApiReferenceExample[];
  name: string;
  props?: readonly ApiReferenceProp[];
};

export type ApiReferenceExample = {
  code: string;
  language?: string;
};

export type ApiReferenceProp = {
  default?: string;
  name: string;
  type: string;
};

export type ComponentDocsBlueprint = {
  apiItems?: readonly ApiReferenceItem[];
  accessibility?: readonly string[];
  dataAttributes?: readonly (readonly [string, string])[];
  dataAttributeDescription?: string;
  description?: string;
  examples?: readonly CodeExample[];
  heroVariant?: PreviewVariant;
  keyboardInteractions?: readonly string[];
  maturity?: string;
  previewAlign?: PreviewAlign;
  usageCode: string;
  cssVariables?: readonly (readonly [string, string])[];
};

export type HookTable = {
  columns: readonly string[];
  rows: readonly (readonly string[])[];
};

export type HookSubsection = {
  body?: JSX.Element;
  code?: string;
  id: string;
  table?: HookTable;
  title: string;
};

export type HookSection = HookSubsection & {
  children?: readonly HookSubsection[];
  demo?: () => JSX.Element;
};

export type HookDocsBlueprint = {
  intro: JSX.Element;
  sections: readonly HookSection[];
};
