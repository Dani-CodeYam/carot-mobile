/**
 * Language preference (ES/EN) for card text.
 *
 * The deck is already bilingual (see `cardText` in data/cards.ts) — this just
 * decides which half to show and remembers the choice across launches. Lives in
 * a context so the toggle on one screen updates every screen at once.
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
import type { Lang } from '@/data/cards';
import { KEYS } from '@/lib/dailyCard';
import { storage } from '@/lib/storage';

export const DEFAULT_LANG: Lang = 'es';

interface LangValue {
  lang: Lang;
  setLang: (next: Lang) => void;
  toggle: () => void;
}

const LangContext = createContext<LangValue>({
  lang: DEFAULT_LANG,
  setLang: () => {},
  toggle: () => {},
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  // Render immediately in the default language, then correct once storage
  // answers — the preview should never blank waiting on a preference.
  useEffect(() => {
    let active = true;
    storage.get<Lang>(KEYS.lang, DEFAULT_LANG).then((stored) => {
      if (active && (stored === 'es' || stored === 'en')) setLangState(stored);
    });
    return () => {
      active = false;
    };
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    storage.set(KEYS.lang, next);
  }, []);

  const toggle = useCallback(() => {
    setLangState((current) => {
      const next: Lang = current === 'es' ? 'en' : 'es';
      storage.set(KEYS.lang, next);
      return next;
    });
  }, []);

  const value = useMemo(() => ({ lang, setLang, toggle }), [lang, setLang, toggle]);

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang(): LangValue {
  return useContext(LangContext);
}

/** UI copy for the new screens, kept beside the language it belongs to. */
const COPY = {
  es: {
    dailyTitle: 'Carta del día',
    tapToReveal: 'Tocá la carta para revelarla',
    comeBackTomorrow: 'Mañana te espera una carta nueva.',
    seeHistory: 'Ver cartas anteriores',
    historyTitle: 'Cartas anteriores',
    historyEmpty: 'Todavía no hay cartas anteriores.',
    historyEmptyHint: 'Tu primera carta aparecerá acá mañana.',
    dailyEntry: 'Carta del día',
    back: '‹ El Carot',
    today: 'Hoy',

    // Home
    welcome: '¡Bienvenida!',
    messageEntry: 'Quiero recibir un mensaje',
    questionEntry: 'Tengo una pregunta específica',

    // Quiero recibir un mensaje
    messageTitle: '¿Sobre qué querés recibir un mensaje?',
    pickIntro: 'Conectá con ese tema.\nRespirá hondo.\nElegí tu carta.',
    drawAnother: 'Elegir otra carta',

    // Tengo una pregunta específica
    questionTitle: 'Tu pregunta',
    questionIntro: 'Escribí lo que querés preguntarle a las cartas.',
    questionPlaceholder: '¿Qué necesito saber sobre…?',
    askCards: 'Consultar a las cartas',
    youAsked: 'Preguntaste',
    askAnother: 'Hacer otra pregunta',

    // Gallery
    galleryTitle: 'Todas las cartas',
    galleryIntro: 'Los 22 arcanos mayores. Tocá una carta para leerla.',

    // Menu
    menuLabel: 'Menú',
    menuClose: 'Cerrar menú',
    galleryEntry: 'Ver todas las cartas',
    historyEntry: 'Historial',
  },
  en: {
    dailyTitle: 'Card of the day',
    tapToReveal: 'Tap the card to reveal it',
    comeBackTomorrow: 'A new card awaits you tomorrow.',
    seeHistory: 'See past cards',
    historyTitle: 'Past cards',
    historyEmpty: 'No past cards yet.',
    historyEmptyHint: 'Your first card will show up here tomorrow.',
    dailyEntry: 'Card of the day',
    back: '‹ El Carot',
    today: 'Today',

    // Home
    welcome: 'Welcome!',
    messageEntry: 'I want to receive a message',
    questionEntry: 'I have a specific question',

    // I want to receive a message
    messageTitle: 'What would you like a message about?',
    pickIntro: 'Connect with that theme.\nTake a deep breath.\nChoose your card.',
    drawAnother: 'Draw another card',

    // I have a specific question
    questionTitle: 'Your question',
    questionIntro: 'Write what you want to ask the cards.',
    questionPlaceholder: 'What do I need to know about…?',
    askCards: 'Ask the cards',
    youAsked: 'You asked',
    askAnother: 'Ask another question',

    // Gallery
    galleryTitle: 'All the cards',
    galleryIntro: 'The 22 major arcana. Tap a card to read it.',

    // Menu
    menuLabel: 'Menu',
    menuClose: 'Close menu',
    galleryEntry: 'See all cards',
    historyEntry: 'History',
  },
} as const;

export function t(lang: Lang, key: keyof (typeof COPY)['es']): string {
  return COPY[lang][key];
}

/** "sábado, 19 de julio" / "Saturday, July 19" — the day a card belonged to. */
export function formatDay(date: string, lang: Lang): string {
  const [y, m, d] = date.split('-').map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  const text = dt.toLocaleDateString(lang === 'en' ? 'en-US' : 'es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  // Spanish lowercases weekday and month names; we only want the sentence to
  // start with a capital. (CSS `capitalize` would give us "Lunes, 20 De Julio".)
  return text.charAt(0).toUpperCase() + text.slice(1);
}
