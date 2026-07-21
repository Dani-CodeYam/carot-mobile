/**
 * A single tarot card with a 3D flip. Shows the card back until `flipped`
 * becomes true, then rotates to reveal the artwork — mirroring the web app's
 * face-up flip. Built on the React Native Animated API so it also runs under
 * react-native-web (the CodeYam editor preview).
 *
 * Implementation note: this deliberately does NOT stack two faces and rely on
 * `backfaceVisibility: 'hidden'` to hide the one facing away. react-native-web
 * flattens the 3D context, so the hidden face bled through and the card read as
 * face-up before it was ever tapped. Instead a SINGLE face rotates a half turn
 * and swaps its image at the midpoint, when the card is edge-on and the swap
 * can't be seen. The face that isn't showing is simply not rendered, so there is
 * nothing to bleed through.
 */
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, View } from 'react-native';
import type { Card } from '@/data/cards';
import { CARD_BACK, cardImage } from '@/lib/cardImages';
import { theme } from '@/lib/theme';

const FLIP_MS = 700;

export function TarotCard({
  card,
  flipped,
  onPress,
  width = 220,
}: {
  /** The card to reveal. Null shows a plain back (e.g. while drawing). */
  card: Card | null;
  /** When true, the card rotates face-up. */
  flipped: boolean;
  /** Tap handler (e.g. to flip, or to draw). Optional. */
  onPress?: () => void;
  /** Rendered width in px; height derives from the deck aspect ratio. */
  width?: number;
}) {
  const progress = useRef(new Animated.Value(flipped ? 1 : 0)).current;
  // Which image is currently painted. Trails `flipped` by half the animation so
  // the swap lands while the card is edge-on.
  const [showingFront, setShowingFront] = useState(flipped);

  useEffect(() => {
    Animated.timing(progress, {
      toValue: flipped ? 1 : 0,
      duration: FLIP_MS,
      useNativeDriver: true,
    }).start();

    const swap = setTimeout(() => setShowingFront(flipped), FLIP_MS / 2);
    return () => clearTimeout(swap);
  }, [flipped, progress]);

  const height = width / theme.cardAspect;

  const rotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={showingFront && card ? card.arcana : 'Carta boca abajo'}
    >
      <Animated.View
        style={[
          styles.frame,
          { width, height, transform: [{ perspective: 1000 }, { rotateY: rotate }] },
        ]}
      >
        {/* Past the half-turn the whole frame is mirrored, so the artwork is
            flipped back on itself to read the right way round. */}
        <View style={[styles.face, showingFront && styles.faceMirrored]}>
          <Image
            source={showingFront && card ? cardImage(card.img) : CARD_BACK}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.bgInverse,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
  },
  face: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  faceMirrored: {
    transform: [{ scaleX: -1 }],
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
