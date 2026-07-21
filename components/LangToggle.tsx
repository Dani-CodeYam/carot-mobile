/**
 * ES / EN switch for card text — "ES / EN" with the inactive half dimmed.
 *
 * Home is the only screen that carries it: the reading screens wear
 * ScreenHeader instead, on the reasoning that a reading should be read rather
 * than reconfigured. Deliberately typographic and quiet, since it sits beside
 * the wordmark where a filled control would fight the artwork.
 */
import { Fragment } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { Lang } from '@/data/cards';
import { useLang } from '@/lib/lang';
import { theme } from '@/lib/theme';

const OPTIONS: Lang[] = ['es', 'en'];

export function LangToggle() {
  const { lang, setLang } = useLang();

  return (
    <View style={styles.row}>
      {OPTIONS.map((option, i) => (
        <Fragment key={option}>
          {i > 0 ? <Text style={styles.separator}>/</Text> : null}
          <Pressable
            onPress={() => setLang(option)}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityState={{ selected: option === lang }}
          >
            <Text style={[styles.label, option === lang && styles.labelActive]}>
              {option.toUpperCase()}
            </Text>
          </Pressable>
        </Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  separator: {
    color: theme.colors.textMuted,
    fontFamily: theme.fontFamily.sans,
    fontSize: theme.fontSize.sm,
  },
  label: {
    color: theme.colors.textMuted,
    fontFamily: theme.fontFamily.sans,
    fontSize: theme.fontSize.sm,
    letterSpacing: 2,
  },
  labelActive: {
    color: theme.colors.textPrimary,
  },
});
