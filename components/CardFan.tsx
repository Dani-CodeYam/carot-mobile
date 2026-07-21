/**
 * Home's hero: three cards fanned face-up.
 *
 * Fixed faces, not a random draw — Home should look identical every launch, and
 * a shuffling hero reads as a bug rather than as magic. The outer two hang
 * lower and tilt away so the middle one is plainly the card on top.
 */
import { Image, StyleSheet, View } from 'react-native';
import { CAROT_CARDS } from '@/data/cards';
import { cardImage } from '@/lib/cardImages';
import { theme } from '@/lib/theme';

const CARD_W = 148;
const CARD_H = CARD_W / theme.cardAspect;
/** Horizontal step between the three cards. */
const SPREAD = CARD_W * 0.52;
/** How far the outer two hang below the middle one. */
const DROP = 26;

const FAN = [
  { card: CAROT_CARDS[14], left: 0, top: DROP, rotate: '-12deg', z: 1 },
  { card: CAROT_CARDS[18], left: SPREAD, top: 0, rotate: '0deg', z: 2 },
  { card: CAROT_CARDS[8], left: SPREAD * 2, top: DROP, rotate: '12deg', z: 1 },
];

const FAN_W = SPREAD * 2 + CARD_W;

export function CardFan() {
  return (
    <View style={styles.fan}>
      {FAN.map((f) => (
        <View
          key={f.card.n}
          style={[
            styles.card,
            { left: f.left, top: f.top, zIndex: f.z, transform: [{ rotate: f.rotate }] },
          ]}
        >
          <Image
            source={cardImage(f.card.img)}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
            style={styles.image}
          />
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  fan: {
    width: FAN_W,
    height: CARD_H + DROP,
    maxWidth: '100%',
    marginTop: theme.spacing['2xl'],
  },
  card: {
    position: 'absolute',
    width: CARD_W,
    height: CARD_H,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
