/**
 * One way in — the provider's button, and the reason it can't be used.
 *
 * Apple and Google render identically, which is why this is its own component
 * rather than the same block written twice in the panel.
 *
 * A provider that isn't usable stays visible, dimmed, with the reason directly
 * underneath. Hiding it would read as a bug ("where did Apple go?"); a button
 * that says "available in the phone app" reads as an explanation, and the note
 * IS the disabled state — passing one disables the button.
 */
import { StyleSheet, Text, View } from 'react-native';
import { ActionButton } from '@/components/ActionButton';
import { theme } from '@/lib/theme';

export function ProviderOption({
  label,
  onPress,
  note = null,
}: {
  label: string;
  onPress: () => void;
  /** Why this provider can't be used here; null when it can. Disables the button. */
  note?: string | null;
}) {
  return (
    <View style={styles.option}>
      <ActionButton label={label} onPress={onPress} disabled={!!note} />
      {note ? <Text style={styles.note}>{note}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  option: {
    alignSelf: 'stretch',
    gap: theme.spacing.xs,
  },
  note: {
    color: theme.colors.textMuted,
    fontFamily: theme.fontFamily.sansLight,
    fontSize: theme.fontSize.xs,
    textAlign: 'center',
  },
});
