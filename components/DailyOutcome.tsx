/**
 * How the daily card ends: a note that tomorrow brings another, and — only once
 * there is a trail worth looking at — the way into it.
 */
import { StyleSheet, Text } from 'react-native';
import { ActionBar } from '@/components/ActionBar';
import { ActionButton } from '@/components/ActionButton';
import { theme } from '@/lib/theme';

export function DailyOutcome({
  tomorrowNote,
  historyLabel,
  historyCount,
  onSeeHistory,
}: {
  tomorrowNote: string;
  historyLabel: string;
  /** No past cards yet means no reason to offer the list. */
  historyCount: number;
  onSeeHistory: () => void;
}) {
  return (
    <>
      <Text style={styles.tomorrow}>{tomorrowNote}</Text>

      {historyCount > 0 ? (
        <ActionBar>
          <ActionButton label={historyLabel} variant="outline" onPress={onSeeHistory} />
        </ActionBar>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  tomorrow: {
    color: theme.colors.textSecondary,
    fontFamily: theme.fontFamily.sansItalic,
    fontSize: theme.fontSize.sm,
    textAlign: 'center',
    marginTop: theme.spacing['2xl'],
  },
});
