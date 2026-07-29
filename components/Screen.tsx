/**
 * The page frame: dark ground, scrollable, centred column with room to breathe
 * at the bottom.
 *
 * Every screen below Home wants exactly this, and each was carrying its own
 * copy of the same ScrollView and content style. Scrolling is always on because
 * a revealed meaning runs long on a phone even when the resting screen fits.
 */
import { createContext, useContext, useState, type ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { theme } from '@/lib/theme';

/**
 * Lets a child suspend the page's vertical scrolling while it needs the finger
 * for a sideways gesture of its own.
 *
 * This exists because on iOS the argument cannot be won any other way. The
 * ScrollView is a real UIScrollView, and once it decides a drag is a scroll it
 * cancels the touches in its content — no PanResponder threshold, capture
 * handler or `onShouldBlockNativeResponder` (Android-only) changes that. So the
 * child says "not now" instead of trying to out-argue it.
 *
 * Defaults to a no-op, so a component using it outside a Screen — an isolated
 * component page, say — still renders.
 */
const ScrollLock = createContext<(enabled: boolean) => void>(() => {});

/** Call with `false` while you own the gesture, `true` when you let go. */
export function useScrollLock() {
  return useContext(ScrollLock);
}

export function Screen({
  children,
  /** Set on screens with a text field, so a tap outside can dismiss it. */
  keyboardAware = false,
  /**
   * Centre the content in the viewport instead of starting at the top. Home
   * wants this — it's a short screen that should sit balanced; the reading
   * screens do not, because their content outgrows the viewport once a card
   * opens and centring would push the card off the top.
   */
  centered = false,
}: {
  children: ReactNode;
  keyboardAware?: boolean;
  centered?: boolean;
}) {
  const [scrollEnabled, setScrollEnabled] = useState(true);

  return (
    <ScrollLock.Provider value={setScrollEnabled}>
      <ScrollView
        style={styles.screen}
        contentContainerStyle={[styles.content, centered && styles.centered]}
        keyboardShouldPersistTaps={keyboardAware ? 'handled' : undefined}
        scrollEnabled={scrollEnabled}
      >
        {children}
      </ScrollView>
    </ScrollLock.Provider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.bgBase,
  },
  content: {
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing['3xl'],
    alignItems: 'center',
  },
  centered: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
