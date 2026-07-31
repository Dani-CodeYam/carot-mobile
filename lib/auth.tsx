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
import Constants from 'expo-constants';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import {
  googleRedirectScheme,
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
 * Google client ids are public identifiers by design — the OAuth flow on a
 * mobile client never uses a client secret — so they are not kept out of the
 * repo for secrecy.
 *
 * iOS reads its id from app.json rather than the environment, because the
 * REVERSED form of that same id has to appear there anyway as a URL scheme (see
 * `redirectFor`). Keeping the id in the environment and the scheme in app.json
 * would be two copies of one value in two files, and nothing would notice when
 * they drifted. Android and web still read the environment, where no such
 * coupling exists.
 */
const IOS_CLIENT_ID =
  (Constants.expoConfig?.extra?.googleIosClientId as string | undefined) ??
  process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

const GOOGLE_CLIENT_ID =
  Platform.select({
    ios: IOS_CLIENT_ID,
    android: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    default: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  }) ?? null;

/**
 * Where Google sends the reader back to.
 *
 * An iOS OAuth client accepts exactly ONE redirect shape: the client id with
 * its dot-separated parts reversed, used as a URL scheme. `carot://` — the
 * app's own scheme, and what this used to send — is rejected outright with
 * `redirect_uri_mismatch`, which is why the button had never worked even once
 * the ids were supplied. The scheme is derived here rather than written out
 * again so the only place it is spelled by hand is app.json's `scheme` array.
 */
function redirectFor(clientId: string): string {
  if (Platform.OS !== 'ios') return AuthSession.makeRedirectUri({ scheme: 'carot' });
  return AuthSession.makeRedirectUri({
    native: `${googleRedirectScheme(clientId)}:/oauth2redirect`,
  });
}

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
      const redirectUri = redirectFor(GOOGLE_CLIENT_ID);
      // Authorization-code flow with PKCE. An earlier version asked for a token
      // directly, reasoning that a public client has no secret to exchange a
      // code with — which is the thing PKCE exists to solve: the verifier below
      // stands in for the secret. Google rejects the implicit flow outright for
      // installed apps now (`code_challenge_method` is not allowed alongside
      // `response_type=token`), so this is not a preference, it is the only
      // flow that works.
      const request = new AuthSession.AuthRequest({
        clientId: GOOGLE_CLIENT_ID,
        scopes: ['openid', 'profile', 'email'],
        redirectUri,
        responseType: AuthSession.ResponseType.Code,
        usePKCE: true,
      });

      const result = await request.promptAsync(GOOGLE_DISCOVERY);
      if (result.type !== 'success') return; // dismissed or cancelled

      const code = result.params.code;
      if (!code || !request.codeVerifier) {
        setError('google');
        return;
      }

      const exchanged = await AuthSession.exchangeCodeAsync(
        {
          clientId: GOOGLE_CLIENT_ID,
          code,
          redirectUri,
          extraParams: { code_verifier: request.codeVerifier },
        },
        GOOGLE_DISCOVERY,
      );

      const token = exchanged.accessToken;
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
