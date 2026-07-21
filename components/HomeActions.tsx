/**
 * The three ways in, in the order the web app puts them: the two draws you come
 * for lead as filled bars, and the daily card follows as the outlined one — it
 * is the habit, not the ask.
 */
import { StyleSheet, View } from 'react-native';
import { ActionButton } from '@/components/ActionButton';
import { theme } from '@/lib/theme';

export function HomeActions({
  messageLabel,
  questionLabel,
  dailyLabel,
  onMessage,
  onQuestion,
  onDaily,
}: {
  messageLabel: string;
  questionLabel: string;
  dailyLabel: string;
  onMessage: () => void;
  onQuestion: () => void;
  onDaily: () => void;
}) {
  return (
    <View style={styles.actions}>
      <ActionButton label={messageLabel} onPress={onMessage} />
      <ActionButton label={questionLabel} onPress={onQuestion} />
      <ActionButton label={dailyLabel} variant="outline" onPress={onDaily} />
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    alignSelf: 'stretch',
    maxWidth: 420,
    marginTop: theme.spacing['3xl'],
    gap: theme.spacing.md,
  },
});
