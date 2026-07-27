import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, screen, waitFor } from '@testing-library/react-native';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Provider SDKs are native modules — mocked so the tree is importable. Apple
// reporting unavailable matches what web and Android actually see.
jest.mock('expo-apple-authentication', () => ({
  isAvailableAsync: jest.fn(async () => false),
  signInAsync: jest.fn(),
  AppleAuthenticationScope: { FULL_NAME: 0, EMAIL: 1 },
}));
jest.mock('expo-auth-session', () => ({
  makeRedirectUri: jest.fn(() => 'carot://redirect'),
  AuthRequest: jest.fn(),
  ResponseType: { Token: 'token' },
}));
jest.mock('expo-web-browser', () => ({ maybeCompleteAuthSession: jest.fn() }));

import { NavMenu } from '@/components/NavMenu';
import { AuthProvider } from '@/lib/auth';
import { KEYS } from '@/lib/dailyCard';
import { LangProvider } from '@/lib/lang';
import { MenuProvider, useMenu } from '@/lib/menu';
import { storage } from '@/lib/storage';
import type { Session } from '@/lib/account';

const DANI: Session = {
  provider: 'apple',
  id: 'apple:001402.abc',
  name: 'Dani',
  email: 'dani@privaterelay.appleid.com',
};

// The menu renders nothing until the shared state is open, so the tree has to
// open it the way the header star does.
function Opener() {
  const { openMenu } = useMenu();
  useEffect(() => {
    openMenu();
  }, [openMenu]);
  return null;
}

// The panel insets itself against the notch, so the safe-area context has to
// be present with concrete metrics — there is no window to measure under jest.
const METRICS = {
  frame: { x: 0, y: 0, width: 393, height: 852 },
  insets: { top: 59, left: 0, right: 0, bottom: 34 },
};

function renderMenu(): void {
  render(
    <SafeAreaProvider initialMetrics={METRICS}>
      <AuthProvider>
        <LangProvider>
          <MenuProvider>
            <Opener />
            <NavMenu />
          </MenuProvider>
        </LangProvider>
      </AuthProvider>
    </SafeAreaProvider>,
  );
}

beforeEach(async () => {
  await storage.remove(KEYS.session);
});

describe('NavMenu account rows', () => {
  // Signed out — the state a fresh install is in — offers the way in and
  // must not show a sign-out for a session that does not exist.
  it('offers Iniciar sesión when no account is signed in', async () => {
    renderMenu();
    await waitFor(() => expect(screen.getByText('Iniciar sesión')).toBeTruthy());
    expect(screen.queryByText('Cerrar sesión')).toBeNull();
  });

  // Signed in, the same rows become who you are plus the way out. This pair of
  // assertions is what catches a capture rendering the wrong menu — the exact
  // failure a scenario inheriting another scenario's session produced.
  it('shows the account name and Cerrar sesión when signed in', async () => {
    await storage.set(KEYS.session, DANI);
    renderMenu();
    await waitFor(() => expect(screen.getByText('Dani')).toBeTruthy());
    expect(screen.getByText('Cerrar sesión')).toBeTruthy();
    expect(screen.queryByText('Iniciar sesión')).toBeNull();
  });

  // Apple withholds the name on every sign-in after the first, so the row
  // falls back to a neutral label rather than rendering an empty row.
  it('falls back to a neutral label when the account has no name', async () => {
    await storage.set(KEYS.session, { ...DANI, name: null });
    renderMenu();
    await waitFor(() => expect(screen.getByText('Cerrar sesión')).toBeTruthy());
    expect(screen.getByText('Tu cuenta')).toBeTruthy();
  });

  // The ways to read are always present — signing in adds to the menu, it
  // never takes anything away.
  it('keeps every reading entry available whether signed in or out', async () => {
    renderMenu();
    await waitFor(() => expect(screen.getByText('Iniciar sesión')).toBeTruthy());
    for (const label of [
      'Carta del día',
      'Quiero recibir un mensaje',
      'Tengo una pregunta específica',
      'Ver todas las cartas',
      'Historial',
    ]) {
      expect(screen.getByText(label)).toBeTruthy();
    }
  });
});
