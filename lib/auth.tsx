/**
 * Signing in — the one file that knows how.
 *
 * El Carot is usable in full without an account and stays that way: this
 * provider's resting state is `session: null`, every screen renders fine in it,
 * and nothing here ever gates a route. Signing in only ADDS things — a name in
 * the greeting, a private drawer for your cards.
 *
 * Everything provider-specific is walled in behind `signInWithApple` /
 * `signInWithGoogle`. Consumers see a session and two functions; they never
 * import expo-apple-authentication or expo-auth-session themselves, so swapping
 * a provider later touches this file alone.
 *
 * Availability is a first-class part of the value, not an error case. Apple's
 * button exists only on iOS, and Google's needs client ids that live outside
 * the repo — so the UI is told plainly what can and can't be used right now
 * rather than being handed a button that fails when tapped.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import {
  sessionFromApple,
  sessionFromGoogleProfile,
  type GoogleProfileLike,
  type Session,
} from '@/lib/account';
import { KEYS } from '@/lib/dailyCard';
import { storage } from '@/lib/storage';

// Lets the auth popup hand control back to the app when it closes.
WebBrowser.maybeCompleteAuthSession();

/**
 * Google client ids come from the environment, not the repo — they are issued
 * per Google Cloud project and differ per platform. `EXPO_PUBLIC_` is the
 * prefix Expo inlines into the client bundle; these are public identifiers by
 * design (the OAuth flow never uses a client secret on a mobile client).
 */
const GOOGLE_CLIENT_ID =
  Platform.select({
    ios: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    android: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    default: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  }) ?? null;

const GOOGLE_DISCOVERY: AuthSession.DiscoveryDocument = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

/** Why a sign-in button can't be used, or null when it can. */
export type Unavailable = 'platform' | 'unconfigured' | null;

interface AuthValue {
  session: Session | null;
  /** True until storage has answered. Screens render signed-out meanwhile. */
  loading: boolean;
  /** Set when the last attempt failed for a reason worth showing. */
  error: string | null;
  appleUnavailable: Unavailable;
  googleUnavailable: Unavailable;
  signInWithApple: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthValue>({
  session: null,
  loading: false,
  error: null,
  appleUnavailable: 'platform',
  googleUnavailable: 'unconfigured',
  signInWithApple: async () => {},
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appleSupported, setAppleSupported] = useState(false);

  // Same pattern as the language preference: render immediately signed-out,
  // then correct once storage answers. The preview must never blank waiting on
  // a session, and "signed out" is a perfectly valid thing to show meanwhile.
  useEffect(() => {
    let active = true;
    storage.get<Session | null>(KEYS.session, null).then((stored) => {
      if (!active) return;
      if (stored && typeof stored.id === 'string') setSession(stored);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  // Apple's button may only be shown where Apple actually supports it — iOS,
  // and only on new enough versions. Everywhere else (Android, and the web
  // preview) this stays false and the UI says so.
  useEffect(() => {
    let active = true;
    AppleAuthentication.isAvailableAsync()
      .then((available) => {
        if (active) setAppleSupported(available);
      })
      .catch(() => {
        // Not available on this platform at all — the default already says so.
      });
    return () => {
      active = false;
    };
  }, []);

  const persist = useCallback(async (next: Session | null) => {
    setSession(next);
    if (next) await storage.set(KEYS.session, next);
    else await storage.remove(KEYS.session);
  }, []);

  const signInWithApple = useCallback(async () => {
    setError(null);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      // The name-preservation rule lives in `sessionFromApple` — Apple only
      // sends the name on the first authorization ever, so the session we
      // already hold is what fills the gap on every sign-in after that.
      await persist(sessionFromApple(credential, session));
    } catch (e) {
      // Backing out of the sheet is a choice, not a failure — don't scold.
      if ((e as { code?: string })?.code === 'ERR_REQUEST_CANCELED') return;
      setError('apple');
    }
  }, [persist, session]);

  const signInWithGoogle = useCallback(async () => {
    setError(null);
    if (!GOOGLE_CLIENT_ID) {
      setError('google');
      return;
    }
    try {
      const redirectUri = AuthSession.makeRedirectUri({ scheme: 'carot' });
      const request = new AuthSession.AuthRequest({
        clientId: GOOGLE_CLIENT_ID,
        scopes: ['openid', 'profile', 'email'],
        redirectUri,
        // Implicit flow: a mobile client is public and holds no client secret,
        // so there is nothing to exchange a code with.
        responseType: AuthSession.ResponseType.Token,
      });

      const result = await request.promptAsync(GOOGLE_DISCOVERY);
      if (result.type !== 'success') return; // dismissed or cancelled

      const token = result.authentication?.accessToken;
      if (!token) {
        setError('google');
        return;
      }

      const profile = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      }).then((r) => r.json() as Promise<GoogleProfileLike>);

      await persist(sessionFromGoogleProfile(profile));
    } catch {
      setError('google');
    }
  }, [persist]);

  // Only the session is dropped. Both the account's cards and the signed-out
  // reader's own cards stay exactly where they are on disk — signing out is
  // never destructive, and signing back in finds everything intact.
  const signOut = useCallback(async () => {
    setError(null);
    await persist(null);
  }, [persist]);

  const value = useMemo<AuthValue>(
    () => ({
      session,
      loading,
      error,
      appleUnavailable: appleSupported ? null : 'platform',
      googleUnavailable: GOOGLE_CLIENT_ID ? null : 'unconfigured',
      signInWithApple,
      signInWithGoogle,
      signOut,
    }),
    [session, loading, error, appleSupported, signInWithApple, signInWithGoogle, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  return useContext(AuthContext);
}
