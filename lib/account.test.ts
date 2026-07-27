import { describe, expect, it } from '@jest/globals';
import {
  accountId,
  displayName,
  firstName,
  fullName,
  greeting,
  scopedKey,
  sessionFromApple,
  sessionFromGoogleProfile,
  type Session,
} from '@/lib/account';

const dani: Session = {
  provider: 'apple',
  id: 'apple:001402.abc',
  name: 'Dani',
  email: 'dani@privaterelay.appleid.com',
};

describe('accountId', () => {
  // The provider prefix is what makes the id unique.
  it('namespaces the subject by provider', () => {
    expect(accountId('apple', '001402.abc')).toBe('apple:001402.abc');
    expect(accountId('google', '118217459')).toBe('google:118217459');
  });

  // Apple and Google mint subjects independently, so the same string can
  // legitimately arrive from both — they must not collide.
  it('keeps the same subject distinct across providers', () => {
    expect(accountId('apple', 'same-subject')).not.toBe(accountId('google', 'same-subject'));
  });
});

describe('scopedKey', () => {
  // Signed out is the default and must use the untouched original key —
  // this is what makes login non-destructive for existing readers.
  it('returns the bare key when no account is signed in', () => {
    expect(scopedKey('elcarot.history', null)).toBe('elcarot.history');
  });

  // Signed in, each account gets its own drawer.
  it('suffixes the key with the account id when signed in', () => {
    expect(scopedKey('elcarot.history', 'apple:001402.abc')).toBe(
      'elcarot.history.apple:001402.abc',
    );
  });

  // Two accounts on one phone must never read each other's cards.
  it('gives different accounts different keys', () => {
    const a = scopedKey('elcarot.history', 'apple:001402.abc');
    const b = scopedKey('elcarot.history', 'google:118217459');
    expect(a).not.toBe(b);
  });
});

describe('displayName', () => {
  // The ordinary case.
  it('returns the name when there is one', () => {
    expect(displayName(dani)).toBe('Dani');
  });

  // Signed out — no session at all.
  it('returns null when there is no session', () => {
    expect(displayName(null)).toBeNull();
  });

  // Apple withholds the name on every sign-in after the first.
  it('returns null when the provider withheld the name', () => {
    expect(displayName({ ...dani, name: null })).toBeNull();
  });

  // Providers hand back empty and whitespace-only strings rather than
  // omitting the field; both must read as "no name", not as a blank greeting.
  it('treats empty and whitespace-only names as no name', () => {
    expect(displayName({ ...dani, name: '' })).toBeNull();
    expect(displayName({ ...dani, name: '   ' })).toBeNull();
  });

  // Stray whitespace should not reach the greeting.
  it('trims and collapses internal whitespace', () => {
    expect(displayName({ ...dani, name: '  María   Fernanda  ' })).toBe('María Fernanda');
  });
});

describe('fullName', () => {
  // Apple hands the name over in two parts.
  it('joins the given and family names', () => {
    expect(fullName('María', 'Etcheverry')).toBe('María Etcheverry');
  });

  // Either part may be missing on its own.
  it('returns whichever single part is present', () => {
    expect(fullName('María', null)).toBe('María');
    expect(fullName(null, 'Etcheverry')).toBe('Etcheverry');
  });

  // Nothing usable left means no name, not an empty string.
  it('returns null when both parts are missing or blank', () => {
    expect(fullName(null, null)).toBeNull();
    expect(fullName(undefined, undefined)).toBeNull();
    expect(fullName('  ', '')).toBeNull();
  });
});

describe('firstName', () => {
  // A four-part name is ordinary in Spanish; a greeting uses the first.
  it('takes only the given name from a long full name', () => {
    expect(firstName({ ...dani, name: 'María Fernanda Etcheverry Balcarce' })).toBe('María');
  });

  // A single-word name is already the given name.
  it('returns a one-word name unchanged', () => {
    expect(firstName(dani)).toBe('Dani');
  });

  // No session and no name both mean no greeting name.
  it('returns null when there is no usable name', () => {
    expect(firstName(null)).toBeNull();
    expect(firstName({ ...dani, name: null })).toBeNull();
  });
});

describe('greeting', () => {
  // Signed in with a name: the personalised line, name substituted.
  it('uses the named greeting when a name is available', () => {
    expect(greeting(dani, '¡Bienvenida!', '¡Bienvenida, {name}!')).toBe('¡Bienvenida, Dani!');
  });

  // Signed out: the greeting El Carot has always shown.
  it('falls back to the plain welcome when signed out', () => {
    expect(greeting(null, '¡Bienvenida!', '¡Bienvenida, {name}!')).toBe('¡Bienvenida!');
  });

  // Signed in but nameless must look exactly like signed out — never
  // "¡Bienvenida, !" with a hole where a person should be.
  it('falls back to the plain welcome when the name was withheld', () => {
    expect(greeting({ ...dani, name: null }, '¡Bienvenida!', '¡Bienvenida, {name}!')).toBe(
      '¡Bienvenida!',
    );
  });

  // Greets by the given name, so a long name cannot overrun the header.
  it('greets a long full name by its first name only', () => {
    const long = { ...dani, name: 'María Fernanda Etcheverry Balcarce' };
    expect(greeting(long, '¡Bienvenida!', '¡Bienvenida, {name}!')).toBe('¡Bienvenida, María!');
  });

  // The copy arrives already localised; this picks, it does not translate.
  it('works the same in the other language', () => {
    expect(greeting(dani, 'Welcome!', 'Welcome, {name}!')).toBe('Welcome, Dani!');
  });
});

describe('sessionFromApple', () => {
  // First authorization ever: Apple sends everything.
  it('builds a session from a first-time credential', () => {
    const session = sessionFromApple({
      user: '001402.abc',
      fullName: { givenName: 'Dani', familyName: 'Raskovsky' },
      email: 'dani@privaterelay.appleid.com',
    });
    expect(session).toEqual({
      provider: 'apple',
      id: 'apple:001402.abc',
      name: 'Dani Raskovsky',
      email: 'dani@privaterelay.appleid.com',
    });
  });

  // The rule this function exists for: every sign-in after the first comes
  // back with name and email null, and must NOT blank out what we know.
  it('keeps the remembered name when Apple omits it on a later sign-in', () => {
    const previous: Session = {
      provider: 'apple',
      id: 'apple:001402.abc',
      name: 'Dani Raskovsky',
      email: 'dani@privaterelay.appleid.com',
    };
    const session = sessionFromApple({ user: '001402.abc', fullName: null, email: null }, previous);
    expect(session.name).toBe('Dani Raskovsky');
    expect(session.email).toBe('dani@privaterelay.appleid.com');
  });

  // A remembered name belongs to ONE account — a different Apple account
  // signing in on the same phone must not inherit the first person's name.
  it('does not borrow a name from a different account', () => {
    const previous: Session = {
      provider: 'apple',
      id: 'apple:999999.zzz',
      name: 'Dani Raskovsky',
      email: 'dani@privaterelay.appleid.com',
    };
    const session = sessionFromApple({ user: '001402.abc', fullName: null, email: null }, previous);
    expect(session.id).toBe('apple:001402.abc');
    expect(session.name).toBeNull();
    expect(session.email).toBeNull();
  });

  // Nothing remembered and nothing offered — a nameless account is ordinary.
  it('yields a nameless session when nothing is offered or remembered', () => {
    const session = sessionFromApple({ user: '001402.abc' });
    expect(session.name).toBeNull();
    expect(session.email).toBeNull();
  });

  // The user may hide their name while still sharing an email.
  it('accepts a partial credential', () => {
    const session = sessionFromApple({
      user: '001402.abc',
      fullName: { givenName: null, familyName: null },
      email: 'hidden@privaterelay.appleid.com',
    });
    expect(session.name).toBeNull();
    expect(session.email).toBe('hidden@privaterelay.appleid.com');
  });

  // A fresh name always wins over a remembered one.
  it('prefers a newly offered name over the remembered one', () => {
    const previous: Session = {
      provider: 'apple',
      id: 'apple:001402.abc',
      name: 'Old Name',
      email: null,
    };
    const session = sessionFromApple(
      { user: '001402.abc', fullName: { givenName: 'New', familyName: 'Name' } },
      previous,
    );
    expect(session.name).toBe('New Name');
  });
});

describe('sessionFromGoogleProfile', () => {
  // Google returns the profile on every sign-in.
  it('builds a session from a full profile', () => {
    expect(
      sessionFromGoogleProfile({
        sub: '118217459',
        name: 'Malena Figueroa',
        email: 'malena.figueroa@gmail.com',
      }),
    ).toEqual({
      provider: 'google',
      id: 'google:118217459',
      name: 'Malena Figueroa',
      email: 'malena.figueroa@gmail.com',
    });
  });

  // Absent fields normalise to null so a stored session keeps one shape.
  it('normalises missing fields to null', () => {
    const session = sessionFromGoogleProfile({ sub: '118217459' });
    expect(session.name).toBeNull();
    expect(session.email).toBeNull();
  });
});
