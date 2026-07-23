/**
 * The dim behind the slide-in menu — tap it to close.
 *
 * Fills the screen behind the panel and fades in with the menu (its opacity is
 * driven from the same animation as the panel's slide, passed in by NavMenu).
 * Pressing anywhere on it closes the menu, which is why the whole thing is a
 * Pressable rather than a plain view.
 */
import { Animated, Pressable, StyleSheet } from 'react-native';

export function MenuBackdrop({
  opacity,
  onPress,
  label,
}: {
  /** Animated 0→0.6 fade, shared with the panel's slide. */
  opacity: Animated.AnimatedInterpolation<number>;
  onPress: () => void;
  label: string;
}) {
  return (
    <Pressable style={StyleSheet.absoluteFill} onPress={onPress} accessibilityLabel={label}>
      <Animated.View style={[styles.backdrop, { opacity }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
  },
});
