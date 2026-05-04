import {
  Toast as CoreToast,
  toaster,
  type ToastActionProps as CoreToastActionProps,
  type ToastCloseProps as CoreToastCloseProps,
  type ToastData,
  type ToastDescriptionProps as CoreToastDescriptionProps,
  type ToastInput,
  type ToastManager,
  type ToastProviderProps as CoreToastProviderProps,
  type ToastRootProps as CoreToastRootProps,
  type ToastTitleProps as CoreToastTitleProps,
  type ToastViewportProps as CoreToastViewportProps,
} from "@keystone-ui/core/toast";
import { splitProps } from "solid-js";
import { cn } from "@/lib/cn";

export type ToastProviderProps = CoreToastProviderProps;
export type ToastViewportProps = CoreToastViewportProps;
export type ToastProps = CoreToastRootProps;
export type ToastTitleProps = CoreToastTitleProps;
export type ToastDescriptionProps = CoreToastDescriptionProps;
export type ToastActionProps = CoreToastActionProps;
export type ToastCloseProps = CoreToastCloseProps;
export type { ToastData, ToastInput, ToastManager };

export { toaster };

export function ToastProvider(props: ToastProviderProps) {
  return <CoreToast.Provider {...props} />;
}

export function ToastViewport(props: ToastViewportProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreToast.Viewport {...rest} class={cn("ui-toast-viewport", local.class)} />;
}

export function Toast(props: ToastProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreToast.Root {...rest} class={cn("ui-toast", local.class)} />;
}

export function ToastTitle(props: ToastTitleProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreToast.Title {...rest} class={cn("ui-toast-title", local.class)} />;
}

export function ToastDescription(props: ToastDescriptionProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreToast.Description {...rest} class={cn("ui-toast-description", local.class)} />;
}

export function ToastAction(props: ToastActionProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreToast.Action {...rest} class={cn("ui-toast-action", local.class)} />;
}

export function ToastClose(props: ToastCloseProps) {
  const [local, rest] = splitProps(props, ["class"]);
  return <CoreToast.Close {...rest} class={cn("ui-toast-close", local.class)} />;
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
