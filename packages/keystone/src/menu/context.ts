import { createContext, useContext } from "solid-js";
import type {
  MenuApi,
  MenuItemContextValue,
  RadioGroupContextValue,
  SubmenuContextValue,
} from "./types";

export const MenuContext = createContext<MenuApi>();
export const RadioGroupContext = createContext<RadioGroupContextValue>();
export const SubmenuContext = createContext<SubmenuContextValue>();
export const MenuItemContext = createContext<MenuItemContextValue>();

export function useMenu(part: string) {
  const menu = useContext(MenuContext);
  if (!menu) throw new Error(`Menu.${part} must be used within Menu.Root`);
  return menu;
}
