/**
 * Reading screen — the core El Carot experience.
 *
 * Draws a card (random, or the `n` index passed in), shows it face-down, and
 * flips it face-up on tap to reveal the arcana, an inspirational quote, and the
 * full meaning. "Elegir otra carta" draws again. Standalone: the draw is local,
 * no backend. Spanish by default (the deck is bilingual — see cardText).
 */
import { useMemo, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { CAROT_CARDS, cardText, type Card, type Lang } from '@/data/cards';
import { TarotCard } from '@/components/TarotCard';
import { theme } from '@/lib/theme';

const LANG: Lang = 'es';

function drawRandom(exclude?: number): Card {
  let pick = CAROT_CARDS[Math.floor(Math.random() * CAROT_CARDS.length)];
  if (exclude !== undefined && CAROT_CARDS.length > 1) {
    while (pick.n === exclude) {
      pick = CAROT_CARDS[Math.floor(Math.random() * CAROT_CARDS.length)];
    }
  }
  return pick;
}

export default function ReadingScreen() {
  const { n } = useLocalSearchParams<{ n?: string }>();
  const initial = useMemo<Card>(() => {
    const idx = n !== undefined ? Number(n) : NaN;
    return Number.isInteger(idx) && CAROT_CARDS[idx] ? CAROT_CARDS[idx] : drawRandom();
  }, [n]);

  const [card, setCard] = useState<Card>(initial);
  const [flipped, setFlipped] = useState(false);

  const drawAnother = () => {
    setFlipped(false);
    // brief beat so the card flips back down before swapping the artwork
    setTimeout(() => setCard(drawRandom(card.n)), 250);
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: theme.colors.bgBase }}
      contentContainerStyle={styles.content}
    >
      <Pressable onPress={() => router.back()} hitSlop={12}>
        <Text style={styles.back}>‹ El Carot</Text>
      </Pressable>

      <View style={styles.cardWrap}>
        <TarotCard
          card={card}
          flipped={flipped}
          onPress={() => setFlipped(true)}
          width={230}
        />
        {!flipped ? (
          <Text style={styles.hint}>Tocá la carta para revelarla</Text>
        ) : null}
      </View>

      {flipped ? (
        <View style={styles.reveal}>
          <Text style={styles.roman}>{card.rom}</Text>
          <Text style={styles.arcana}>{card.arcana}</Text>
          <Text style={styles.name}>{card.name}</Text>

          <View style={styles.divider} />

          <Text style={styles.quote}>“{cardText(card, 'quote', LANG)}”</Text>
          <Text style={styles.meaning}>{cardText(card, 'meaning', LANG)}</Text>

          <Pressable style={styles.button} onPress={drawAnother}>
            <Text style={styles.buttonText}>Elegir otra carta</Text>
          </Pressable>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: theme.spacing.xl,
    paddingBottom: theme.spacing['3xl'],
    alignItems: 'center',
  },
  back: {
    alignSelf: 'flex-start',
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.base,
    marginBottom: theme.spacing.lg,
  },
  cardWrap: {
    alignItems: 'center',
    marginTop: theme.spacing.md,
  },
  hint: {
    color: theme.colors.textMuted,
    fontSize: theme.fontSize.sm,
    marginTop: theme.spacing.lg,
  },
  reveal: {
    marginTop: theme.spacing['2xl'],
    alignItems: 'center',
    maxWidth: 520,
  },
  roman: {
    color: theme.colors.sage,
    fontSize: theme.fontSize.base,
    letterSpacing: 3,
  },
  arcana: {
    color: theme.colors.textPrimary,
    fontFamily: theme.fontFamily.display,
    fontSize: theme.fontSize['3xl'],
    marginTop: theme.spacing.xs,
    textAlign: 'center',
  },
  name: {
    color: theme.colors.sageLight,
    fontSize: theme.fontSize.lg,
    marginTop: theme.spacing.xs,
  },
  divider: {
    width: 48,
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.xl,
  },
  quote: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.xl,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: theme.fontSize.xl * 1.4,
  },
  meaning: {
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.base,
    lineHeight: theme.fontSize.base * 1.7,
    textAlign: 'left',
    marginTop: theme.spacing.xl,
    opacity: 0.92,
  },
  button: {
    marginTop: theme.spacing['2xl'],
    backgroundColor: theme.colors.accent,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing['2xl'],
    borderRadius: theme.borderRadius.full,
  },
  buttonText: {
    color: theme.colors.textOnCream,
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium,
  },
});
