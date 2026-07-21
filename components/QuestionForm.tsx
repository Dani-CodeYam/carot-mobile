/**
 * Where the question gets written. Nothing is drawn until it is — the asking is
 * half the ritual, so the button stays disabled on an empty field rather than
 * quietly drawing for a question you never posed.
 *
 * Whitespace doesn't count as a question, which is why the parent trims before
 * deciding; this component only reports what was typed.
 */
import { StyleSheet, TextInput, View } from 'react-native';
import { ActionButton } from '@/components/ActionButton';
import { ActionBar } from '@/components/ActionBar';
import { Lede } from '@/components/Lede';
import { theme } from '@/lib/theme';

export function QuestionForm({
  value,
  onChange,
  onSubmit,
  canSubmit,
  lede,
  placeholder,
  label,
  submitLabel,
}: {
  value: string;
  onChange: (next: string) => void;
  onSubmit: () => void;
  canSubmit: boolean;
  lede: string;
  placeholder: string;
  label: string;
  submitLabel: string;
}) {
  return (
    <View style={styles.form}>
      <Lede>{lede}</Lede>

      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.textMuted}
        multiline
        numberOfLines={3}
        textAlignVertical="top"
        accessibilityLabel={label}
        onSubmitEditing={onSubmit}
      />

      <ActionBar>
        <ActionButton label={submitLabel} onPress={onSubmit} disabled={!canSubmit} />
      </ActionBar>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    alignItems: 'center',
    alignSelf: 'stretch',
    maxWidth: 420,
    marginTop: theme.spacing.xl,
  },
  input: {
    alignSelf: 'stretch',
    minHeight: 96,
    marginTop: theme.spacing.xl,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.accentLight,
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.sans,
    fontSize: theme.fontSize.base,
    lineHeight: theme.fontSize.base * 1.5,
  },
});
