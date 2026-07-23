/**
 * Open/closed state for the app menu.
 *
 * The menu is opened by the ✳ in the header, which appears on every screen, and
 * the overlay itself is mounted once at the app root. Those two live in
 * different parts of the tree, so the open state has to sit in context between
 * them — a Provider, like the language preference, rather than per-screen state.
 */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

interface MenuValue {
  open: boolean;
  openMenu: () => void;
  closeMenu: () => void;
}

const MenuContext = createContext<MenuValue>({
  open: false,
  openMenu: () => {},
  closeMenu: () => {},
});

export function MenuProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const openMenu = useCallback(() => setOpen(true), []);
  const closeMenu = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ open, openMenu, closeMenu }), [open, openMenu, closeMenu]);

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu(): MenuValue {
  return useContext(MenuContext);
}
