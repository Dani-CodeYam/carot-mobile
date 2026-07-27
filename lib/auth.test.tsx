import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { renderHook, waitFor, act } from '@testing-library/react-native';
import type { ReactNode } from 'react';

// The three provider SDKs are native modules — importable under jest only when
// mocked. Apple reports unavailable, which is exactly what the web preview and
// Android see, so the resting state under test is the real one.
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

import { AuthProvider, useAuth } from '@/lib/auth';
import { KEYS } from '@/lib/dailyCard';
import { storage } from '@/lib/storage';
import type { Session } from '@/lib/account';

const DANI: Session = {
  provider: 'apple',
  id: 'apple:001402.abc',
  name: 'Dani',
  email: 'dani@privaterelay.appleid.com',
};

function wrapper({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}

beforeEach(async () => {
  await storage.remove(KEYS.session);
});

describe('AuthProvider', () => {
  // The production default: a fresh install has no session and the app is
  // fully usable in that state.
  it('settles signed out when storage holds no session', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.session).toBeNull();
  });

  // A session written on a previous launch is picked back up.
  it('restores a stored session', async () => {
    await storage.set(KEYS.session, DANI);
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.session).not.toBeNull());
    expect(result.current.session?.name).toBe('Dani');
    expect(result.current.session?.id).toBe('apple:001402.abc');
  });

  // Signing out must clear the session from BOTH memory and storage —
  // a session left on disk would come back on the next launch.
  it('clears the session from memory and storage on sign out', async () => {
    await storage.set(KEYS.session, DANI);
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.session).not.toBeNull());

    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.session).toBeNull();
    expect(await storage.get(KEYS.session, null)).toBeNull();
  });

  // Signing out is never destructive: the cards stay on disk, so signing
  // back in finds the trail exactly as it was left.
  it('leaves stored cards untouched when signing out', async () => {
    const trail = [{ date: '2026-07-19', n: 2 }];
    await storage.set(KEYS.session, DANI);
    await storage.set(`${KEYS.history}.${DANI.id}`, trail);
    await storage.set(KEYS.history, []);

    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.session).not.toBeNull());
    await act(async () => {
      await result.current.signOut();
    });

    expect(await storage.get(`${KEYS.history}.${DANI.id}`, null)).toEqual(trail);
  });

  // Availability is data, not an error: the UI reads these to explain why a
  // provider can't be used rather than offering a button that dies on tap.
  it('reports Apple unavailable where the platform does not support it', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.appleUnavailable).toBe('platform');
  });

  // Google needs client ids that live outside the repo; with none set the
  // button reports unconfigured instead of failing on tap.
  it('reports Google unconfigured when no client id is set', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.googleUnavailable).toBe('unconfigured');
  });

  // Corrupt or hand-edited storage must not crash the app into a broken
  // session — it degrades to signed out, which always works.
  it('ignores a stored value that is not a session', async () => {
    await storage.set(KEYS.session, { garbage: true });
    const { result } = renderHook(() => useAuth(), { wrapper });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.session).toBeNull();
  });
});
