/**
 * Home's top line: the language switch, the greeting, a star.
 *
 * Home is the only screen with the language switch — every other screen wears
 * ScreenHeader instead, on the reasoning that a reading should be read, not
 * reconfigured.
 */
import { StyleSheet, Text, View } from 'react-native';
import { LangToggle } from '@/components/LangToggle';
import { StarLink } from '@/components/StarLink';
import { theme } from '@/lib/theme';

export function HomeHeader({ welcome }: { welcome: string }) {
  return (
    <View style={styles.bar}>
      <View style={styles.side}>
        <LangToggle />
      </View>
      <Text style={styles.welcome}>{welcome}</Text>
      {/* Balances the toggle so the greeting sits optically centred whichever
          language is showing. */}
      <View style={[styles.side, styles.right]}>
        <StarLink size={theme.fontSize.xl} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
  },
  side: {
    flex: 1,
  },
  right: {
    alignItems: 'flex-end',
  },
  welcome: {
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.display,
    fontSize: theme.fontSize.lg,
    textAlign: 'center',
  },
});
