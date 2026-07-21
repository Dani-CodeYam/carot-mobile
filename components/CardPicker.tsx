/**
 * The spread — 22 face-down cards you move through and choose from.
 *
 * The deck arrives already shuffled (see lib/draw), so the position you land on
 * says nothing about which arcana it is. That's the point: the choice has to be
 * blind for it to feel like a draw rather than picking a number off a list. The
 * counter shows where you are in the spread, not what you're about to get.
 *
 * Movement is by arrow or by swipe, and the ends wrap — a spread has no edges
 * to get stuck against. Swiping is wired with PanResponder rather than a
 * gesture library so this stays dependency-free; the responder only claims the
 * gesture once it's clearly horizontal, which leaves taps free to reach the
 * card underneath.
 *
 * Moving is ANIMATED, and that is not decoration: every card is the same
 * face-down back, so changing the index alone repaints an identical frame and
 * the arrows read as broken. The animation is CONTINUOUS rather than a plain
 * slide — each slot interpolates its tilt, drop and dimming between "at the
 * side" and "in the centre" from the same driver. An earlier version only slid
 * the row, so the arriving card reached the middle still tilted and dim and
 * then snapped upright; here it straightens as it arrives, and the reset to the
 * new index lands on a frame identical to the one already on screen.
 */
import { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { Card } from '@/data/cards';
import { slotSamples, type SpreadGeometry } from '@/lib/cardPickerLayout';
import { CARD_BACK } from '@/lib/cardImages';
import { theme } from '@/lib/theme';

const CARD_W = 196;
const CARD_H = CARD_W / theme.cardAspect;

const GEOMETRY: SpreadGeometry = {
  /** Distance between card centres — wide enough to leave a gap either side. */
  peek: CARD_W * 1.25,
  /** How much lower the side cards hang than the one you're choosing. */
  drop: 34,
  tilt: 6,
  /** Side cards are dimmed to this; the centre one is always full strength. */
  dim: 0.7,
};

/** A swipe shorter than this is a wobble, not an intent to move. */
const SWIPE_MIN = 40;
const SLIDE_MS = 240;

/**
 * Slots either side of centre. Two-deep so that at the midpoint of a move
 * there is still a card waiting at the far edge — with one-deep the far side
 * empties out halfway through.
 */
const SLOTS = [-2, -1, 0, 1, 2];

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/**
 * Bind one slot's samples (see lib/cardPickerLayout) to the rail's position.
 */
function slotStyle(offset: number, slide: Animated.Value) {
  const samples = slotSamples(offset, GEOMETRY);
  const inputRange = [-GEOMETRY.peek, 0, GEOMETRY.peek];

  return {
    opacity: slide.interpolate({ inputRange, outputRange: samples.opacity }),
    transform: [
      { translateX: slide.interpolate({ inputRange, outputRange: samples.translateX }) },
      { translateY: slide.interpolate({ inputRange, outputRange: samples.translateY }) },
      { rotate: slide.interpolate({ inputRange, outputRange: samples.rotate }) },
    ],
  };
}

export function CardPicker({
  deck,
  onChoose,
}: {
  /** Pre-shuffled deck. Reshuffle by passing a new array. */
  deck: Card[];
  onChoose: (card: Card) => void;
}) {
  const [index, setIndex] = useState(0);
  const slide = useRef(new Animated.Value(0)).current;
  /** Ignore a second press mid-move, which would strand the rail off-centre. */
  const moving = useRef(false);

  const step = useMemo(
    () => (delta: number) => {
      if (moving.current) return;
      moving.current = true;
      Animated.timing(slide, {
        toValue: -delta * GEOMETRY.peek,
        duration: SLIDE_MS,
        useNativeDriver: true,
      }).start(() => {
        setIndex((i) => (i + delta + deck.length) % deck.length);
        slide.setValue(0);
        moving.current = false;
      });
    },
    [deck.length, slide],
  );

  const pan = useRef(
    PanResponder.create({
      // Claim only clearly-horizontal drags, so a tap still reaches the card.
      onMoveShouldSetPanResponder: (_, g) =>
        Math.abs(g.dx) > 12 && Math.abs(g.dx) > Math.abs(g.dy),
      onPanResponderRelease: (_, g) => {
        if (g.dx <= -SWIPE_MIN) step(1);
        else if (g.dx >= SWIPE_MIN) step(-1);
      },
    }),
  ).current;

  return (
    <View style={styles.wrap}>
      <View style={styles.stage} {...pan.panHandlers}>
        {SLOTS.map((offset) =>
          offset === 0 ? (
            <AnimatedPressable
              key={offset}
              onPress={() => onChoose(deck[index])}
              accessibilityRole="button"
              accessibilityLabel={`Carta ${index + 1} de ${deck.length}`}
              style={[styles.slot, slotStyle(offset, slide)]}
            >
              <Image source={CARD_BACK} resizeMode="cover" style={styles.image} />
            </AnimatedPressable>
          ) : (
            <Animated.View
              key={offset}
              pointerEvents="none"
              style={[styles.slot, slotStyle(offset, slide)]}
            >
              <Image source={CARD_BACK} resizeMode="cover" style={styles.image} />
            </Animated.View>
          ),
        )}

        <Pressable
          onPress={() => step(-1)}
          style={[styles.arrow, styles.arrowLeft]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Anterior"
        >
          <Text style={styles.arrowText}>‹</Text>
        </Pressable>

        <Pressable
          onPress={() => step(1)}
          style={[styles.arrow, styles.arrowRight]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Siguiente"
        >
          <Text style={styles.arrowText}>›</Text>
        </Pressable>
      </View>

      <Text style={styles.counter}>
        {index + 1} / {deck.length}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  stage: {
    alignSelf: 'stretch',
    // Room for the side cards to hang below the centre one.
    height: CARD_H + GEOMETRY.drop,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  // Every slot is styled identically — only the animated tilt, drop and opacity
  // tell the centre card apart, so nothing pops when one becomes the other.
  slot: {
    position: 'absolute',
    left: '50%',
    marginLeft: -CARD_W / 2,
    width: CARD_W,
    height: CARD_H,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 24,
    elevation: 8,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  arrow: {
    position: 'absolute',
    zIndex: 2,
    top: CARD_H / 2 - 20,
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowLeft: {
    right: '50%',
    marginRight: CARD_W / 2 + 14,
  },
  arrowRight: {
    left: '50%',
    marginLeft: CARD_W / 2 + 14,
  },
  // Symbol glyph — left on the system face deliberately, see app/index.
  arrowText: {
    color: theme.colors.textOnCream,
    fontSize: theme.fontSize.xl,
    lineHeight: theme.fontSize.xl * 1.1,
  },
  counter: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    letterSpacing: 3,
    marginTop: theme.spacing.xl,
    fontFamily: theme.fontFamily.sans,
  },
});
