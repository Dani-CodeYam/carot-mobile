/**
 * A single tarot card with a 3D flip. Shows the card back until `flipped`
 * becomes true, then rotates to reveal the artwork — mirroring the web app's
 * face-up flip. Built on the React Native Animated API so it also runs under
 * react-native-web (the CodeYam editor preview).
 */
import { useEffect, useRef } from 'react';
import { Animated, Image, Pressable, StyleSheet, View } from 'react-native';
import type { Card } from '@/data/cards';
import { CARD_BACK, cardImage } from '@/lib/cardImages';
import { theme } from '@/lib/theme';

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
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: flipped ? 1 : 0,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, [flipped, progress]);

  const height = width / theme.cardAspect;

  const backRotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const frontRotate = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <Pressable onPress={onPress} disabled={!onPress}>
      <View style={[styles.frame, { width, height }]}>
        <Animated.View
          style={[
            styles.face,
            { transform: [{ perspective: 1000 }, { rotateY: backRotate }] },
          ]}
        >
          <Image source={CARD_BACK} style={styles.image} resizeMode="cover" />
        </Animated.View>
        <Animated.View
          style={[
            styles.face,
            { transform: [{ perspective: 1000 }, { rotateY: frontRotate }] },
          ]}
        >
          <Image
            source={card ? cardImage(card.img) : CARD_BACK}
            style={styles.image}
            resizeMode="cover"
          />
        </Animated.View>
      </View>
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
    backfaceVisibility: 'hidden',
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
