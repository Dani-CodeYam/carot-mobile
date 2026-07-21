/**
 * The page frame: dark ground, scrollable, centred column with room to breathe
 * at the bottom.
 *
 * Every screen below Home wants exactly this, and each was carrying its own
 * copy of the same ScrollView and content style. Scrolling is always on because
 * a revealed meaning runs long on a phone even when the resting screen fits.
 */
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { theme } from '@/lib/theme';

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
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={[styles.content, centered && styles.centered]}
      keyboardShouldPersistTaps={keyboardAware ? 'handled' : undefined}
    >
      {children}
    </ScrollView>
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
