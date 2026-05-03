import {
  Toast as KeystoneToast,
  toaster,
  type ToastActionProps as KeystoneToastActionProps,
  type ToastCloseProps as KeystoneToastCloseProps,
  type ToastData,
  type ToastDescriptionProps as KeystoneToastDescriptionProps,
  type ToastInput,
  type ToastManager,
  type ToastProviderProps as KeystoneToastProviderProps,
  type ToastRootProps as KeystoneToastRootProps,
  type ToastTitleProps as KeystoneToastTitleProps,
  type ToastViewportProps as KeystoneToastViewportProps,
} from "@keystone-ui/keystone/toast";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type ToastProviderProps = KeystoneToastProviderProps;
export type ToastViewportProps = KeystoneToastViewportProps;
export type ToastProps = KeystoneToastRootProps;
export type ToastTitleProps = KeystoneToastTitleProps;
export type ToastDescriptionProps = KeystoneToastDescriptionProps;
export type ToastActionProps = KeystoneToastActionProps;
export type ToastCloseProps = KeystoneToastCloseProps;
export type { ToastData, ToastInput, ToastManager };

export { toaster };

export function ToastProvider(props: ToastProviderProps) {
  return <KeystoneToast.Provider {...props} />;
}

export function ToastViewport(props: ToastViewportProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneToast.Viewport {...rest} class={cn("mason-toast-viewport", local.class)} />;
}

export function Toast(props: ToastProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneToast.Root {...rest} class={cn("mason-toast", local.class)} />;
}

export function ToastTitle(props: ToastTitleProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneToast.Title {...rest} class={cn("mason-toast-title", local.class)} />;
}

export function ToastDescription(props: ToastDescriptionProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneToast.Description {...rest} class={cn("mason-toast-description", local.class)} />;
}

export function ToastAction(props: ToastActionProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneToast.Action {...rest} class={cn("mason-toast-action", local.class)} />;
}

export function ToastClose(props: ToastCloseProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <KeystoneToast.Close {...rest} class={cn("mason-toast-close", local.class)} />;
}

export function Toaster(props: ToastProviderProps & { viewport?: ToastViewportProps }) {
  const [local, providerProps] = splitProps(props, ["viewport"]);
  return (
    <ToastProvider {...providerProps}>
      <ToastViewport {...local.viewport}>
        {(toast: ToastData) => (
          <Toast toast={toast}>
            <ToastTitle />
            <ToastDescription />
            <ToastAction />
            <ToastClose>Close</ToastClose>
          </Toast>
        )}
      </ToastViewport>
    </ToastProvider>
  );
}
