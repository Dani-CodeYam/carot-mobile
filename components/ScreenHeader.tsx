/**
 * The bar every screen below Home wears: back, the wordmark, a star.
 *
 * No language toggle here — that lives on Home, as on the web. A reading is
 * meant to be read, and a control that reshuffles the words mid-card competes
 * with the card.
 */
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { StarLink } from '@/components/StarLink';
import { goBackTo } from '@/lib/nav';
import { theme } from '@/lib/theme';

export function ScreenHeader({ back = '/' }: { back?: string }) {
  return (
    <View style={styles.bar}>
      <View style={styles.side}>
        <Pressable
          onPress={() => goBackTo(back)}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Volver"
        >
          <Text style={styles.arrow}>←</Text>
        </Pressable>
      </View>

      <Text style={styles.wordmark}>EL CAROT</Text>

      {/* Balances the back arrow so the wordmark sits optically centred. */}
      <View style={[styles.side, styles.right]}>
        <StarLink />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginBottom: theme.spacing.xl,
  },
  side: {
    flex: 1,
  },
  right: {
    alignItems: 'flex-end',
  },
  arrow: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.xl,
  },
  wordmark: {
    color: theme.colors.sageLight,
    fontFamily: theme.fontFamily.display,
    fontSize: theme.fontSize.lg,
    letterSpacing: 2,
  },
});
