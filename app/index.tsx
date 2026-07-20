/**
 * Home — El Carot landing. A warm welcome, the wordmark, three fanned card
 * backs, and the primary action to draw a card. Keeps the web app's mystical,
 * handmade feel. (Standalone/incremental: gallery, spreads, daily card and the
 * question flows come next.)
 */
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { CARD_BACK } from '@/lib/cardImages';
import { theme } from '@/lib/theme';

const FAN = [
  { rotate: '-14deg', translateX: -46, translateY: 12 },
  { rotate: '0deg', translateX: 0, translateY: 0 },
  { rotate: '14deg', translateX: 46, translateY: 12 },
];

export default function HomeScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.welcome}>¡Bienvenida!</Text>
      <Text style={styles.wordmark}>El Carot</Text>

      <View style={styles.fan}>
        {FAN.map((f, i) => (
          <Image
            key={i}
            source={CARD_BACK}
            resizeMode="cover"
            style={[
              styles.fanCard,
              {
                transform: [
                  { translateX: f.translateX },
                  { translateY: f.translateY },
                  { rotate: f.rotate },
                ],
                zIndex: i === 1 ? 2 : 1,
              },
            ]}
          />
        ))}
      </View>

      <Text style={styles.tagline}>
        Un mensaje de las cartas, cuando lo necesites.
      </Text>

      <Pressable style={styles.button} onPress={() => router.push('/reading')}>
        <Text style={styles.buttonText}>Sacar una carta</Text>
      </Pressable>
    </View>
  );
}

const CARD_W = 96;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.bgBase,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.xl,
  },
  welcome: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.base,
    letterSpacing: 1,
  },
  wordmark: {
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.display,
    fontSize: theme.fontSize['4xl'],
    marginTop: theme.spacing.xs,
  },
  fan: {
    height: CARD_W / theme.cardAspect + 24,
    width: CARD_W * 2.6,
    marginTop: theme.spacing['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  fanCard: {
    position: 'absolute',
    width: CARD_W,
    height: CARD_W / theme.cardAspect,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  tagline: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.lg,
    textAlign: 'center',
    marginTop: theme.spacing['2xl'],
    opacity: 0.9,
  },
  button: {
    marginTop: theme.spacing.xl,
    backgroundColor: theme.colors.accent,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing['3xl'],
    borderRadius: theme.borderRadius.full,
  },
  buttonText: {
    color: theme.colors.textOnCream,
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.medium,
  },
});
