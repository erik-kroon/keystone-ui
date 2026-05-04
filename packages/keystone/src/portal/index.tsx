import { Show, type JSX } from "solid-js";
import { Portal as SolidPortal } from "solid-js/web";

export type PortalProps = {
  children?: JSX.Element;
  forceMount?: boolean;
  mount?: Node;
  present?: boolean;
};

export function Portal(props: PortalProps) {
  const shouldMount = () => {
    const present = props.present !== false;
    const forceMount = props.forceMount === true;

    return present || forceMount;
  };

  return (
    <Show when={shouldMount()}>
      <SolidPortal mount={props.mount}>{props.children}</SolidPortal>
    </Show>
  );
}
