/**
 * The app's one button. A full-width bar in the display face — filled sage for
 * the thing you came to do, outlined for the quieter alternative.
 *
 * Every screen used to roll its own pill, which drifted: different radii, font
 * and padding on Home versus inside a reading. One component keeps them
 * identical, so the button reads the same wherever it turns up.
 */
import { Pressable, StyleSheet, Text } from 'react-native';
import { theme } from '@/lib/theme';

export function ActionButton({
  label,
  onPress,
  variant = 'filled',
  disabled = false,
}: {
  label: string;
  onPress: () => void;
  /** `outline` is the secondary option beside a filled one. */
  variant?: 'filled' | 'outline';
  disabled?: boolean;
}) {
  const outline = variant === 'outline';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      style={[
        styles.base,
        outline ? styles.outline : styles.filled,
        disabled ? (outline ? styles.disabledOutline : styles.disabledFilled) : null,
      ]}
    >
      <Text
        style={[
          styles.label,
          outline && styles.labelOutline,
          disabled && styles.labelDisabled,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.xl,
  },
  filled: {
    backgroundColor: theme.colors.accent,
  },
  outline: {
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  // Spelled out as colours rather than an opacity: a translucent sage over the
  // charcoal ground composites to mud, and the button stops reading as a
  // button at all. Sitting the disabled fill between the ground and the live
  // sage keeps the shape legible while making it obviously not for tapping.
  disabledFilled: {
    backgroundColor: theme.colors.textMuted,
  },
  disabledOutline: {
    borderColor: theme.colors.bgInverse,
  },
  label: {
    color: theme.colors.textOnCream,
    fontFamily: theme.fontFamily.display,
    fontSize: theme.fontSize.lg,
  },
  labelOutline: {
    color: theme.colors.textPrimary,
  },
  labelDisabled: {
    color: theme.colors.textSecondary,
  },
});
