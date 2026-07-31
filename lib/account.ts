/**
 * Who is reading — and which drawer their cards live in.
 *
 * Signing in is optional in El Carot and always will be: every function here
 * accepts `null` for "nobody is signed in" and returns the signed-out answer,
 * so the calling screen never has to branch on it. That is the whole reason
 * this file is pure and React-free — the rule "a reader without an account
 * loses nothing" is a property you can assert in a unit test, not a behaviour
 * you have to click through.
 */

export type Provider = 'apple' | 'google';

/** The account currently reading, or `null` while signed out. */
export interface Session {
  provider: Provider;
  /** Namespaced account id — see `accountId`. */
  id: string;
  /** Display name, or null when the provider withheld it. */
  name: string | null;
  email: string | null;
}

/**
 * A provider's subject id, namespaced by the provider that issued it.
 *
 * Apple and Google mint their subjects independently, so the same string could
 * in principle arrive from both. Prefixing makes a collision impossible, and
 * makes a stored key legible at a glance when you're staring at localStorage
 * wondering whose history you're looking at.
 */
export function accountId(provider: Provider, subject: string): string {
  return `${provider}:${subject}`;
}

/**
 * Where a given piece of per-reader data lives.
 *
 * Signed out, this is the bare key the app has always used — which is what
 * makes signing in non-destructive: an account writes to its OWN suffixed key
 * and never touches the signed-out one, so signing out reveals the original
 * trail exactly as it was left.
 */
export function scopedKey(base: string, account: string | null): string {
  return account ? `${base}.${account}` : base;
}

/**
 * The name to actually show, or null if there isn't a usable one.
 *
 * Apple returns the full name ONLY on the very first authorization, and lets
 * the user hide it outright; every later sign-in hands back null. Providers
 * also hand back empty or whitespace-only strings rather than omitting the
 * field. Treating all of those as "no name" in one place keeps the greeting
 * from rendering "¡Bienvenida, !" with a hole where a person should be.
 */
export function displayName(session: Session | null): string | null {
  const raw = session?.name;
  if (typeof raw !== 'string') return null;
  const trimmed = raw.trim().replace(/\s+/g, ' ');
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Apple hands the name over in parts, and any part may be missing.
 * Returns null when nothing usable is left, so it feeds `Session.name`
 * directly.
 */
export function fullName(
  givenName?: string | null,
  familyName?: string | null,
): string | null {
  const joined = [givenName, familyName]
    .filter((part): part is string => typeof part === 'string' && part.trim().length > 0)
    .join(' ')
    .trim();
  return joined.length > 0 ? joined : null;
}

/**
 * Just the given name.
 *
 * Apple hands back whatever the account holds, which in Spanish-speaking
 * countries is routinely four parts — "María Fernanda Etcheverry Balcarce".
 * A greeting is a greeting, not an identity document: you greet someone by
 * the name their friends use.
 */
export function firstName(session: Session | null): string | null {
  const name = displayName(session);
  return name ? (name.split(' ')[0] ?? null) : null;
}

/**
 * The home greeting: personalised when we have a name, the generic welcome
 * otherwise.
 *
 * Greets by the given name only — see `firstName`. Both copy strings arrive
 * already localised; this decides WHICH one, it does not know about languages.
 * `named` carries a `{name}` placeholder.
 */
export function greeting(
  session: Session | null,
  welcome: string,
  named: string,
): string {
  const name = firstName(session);
  return name ? named.replace('{name}', name) : welcome;
}

/** The shape `expo-apple-authentication` hands back, narrowed to what we read. */
export interface AppleCredentialLike {
  user: string;
  fullName?: { givenName?: string | null; familyName?: string | null } | null;
  email?: string | null;
}

/**
 * Build a session from an Apple credential, keeping what Apple no longer tells us.
 *
 * Apple returns the name and email ONLY on the very first authorization a user
 * ever grants this app. Every sign-in after that comes back with both null —
 * so taking the credential at face value would blank out a name we already
 * know the moment someone signs out and back in. `previous` is the session we
 * last held for this same account; anything the credential omits falls back to
 * it, and only then to null.
 */
export function sessionFromApple(
  credential: AppleCredentialLike,
  previous: Session | null = null,
): Session {
  const id = accountId('apple', credential.user);
  // Only a session for the SAME account may donate a remembered name.
  const remembered = previous?.id === id ? previous : null;
  const offered = fullName(credential.fullName?.givenName, credential.fullName?.familyName);

  return {
    provider: 'apple',
    id,
    name: offered ?? remembered?.name ?? null,
    email: credential.email ?? remembered?.email ?? null,
  };
}

/** The fields we read off Google's userinfo response. */
export interface GoogleProfileLike {
  sub: string;
  name?: string | null;
  email?: string | null;
}

/**
 * Build a session from Google's userinfo response.
 *
 * Simpler than Apple's: Google returns the profile on every sign-in, so there
 * is nothing to remember. Absent fields still normalise to null rather than
 * undefined, so a stored session always has the same shape.
 */
export function sessionFromGoogleProfile(profile: GoogleProfileLike): Session {
  return {
    provider: 'google',
    id: accountId('google', profile.sub),
    name: profile.name ?? null,
    email: profile.email ?? null,
  };
}

/**
 * The URL scheme an iOS OAuth client has to hand Google as its redirect.
 *
 * Google issues client ids ending in `.apps.googleusercontent.com`, and an
 * installed-app client accepts a redirect on exactly one scheme: those parts
 * reversed. Handing it the app's own scheme instead — which El Carot did, and
 * which looks perfectly reasonable — is answered with `redirect_uri_mismatch`
 * every time, and only ever on a device, mid-sign-in.
 *
 * Kept here, pure, so the derivation is a property you can assert rather than a
 * failure you have to reproduce by hand on a phone.
 */
export function googleRedirectScheme(clientId: string): string {
  const bare = clientId.replace(/\.apps\.googleusercontent\.com$/, '');
  return `com.googleusercontent.apps.${bare}`;
}
