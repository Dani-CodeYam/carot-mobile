/**
 * "Quiero recibir un mensaje" — an open draw with nothing asked of it.
 *
 * The counterpart to the specific question (see app/question): you bring no
 * question, the deck answers anyway. The spread opens face-down and you choose
 * a card from it, as on the web — the card is never handed to you. Once chosen
 * it turns face-up on its own; "elegir otra carta" reshuffles and reopens the
 * spread, so a second message is a second real draw.
 *
 * `?n=` forces a specific card and skips the spread — the deep link the gallery
 * will use. Standalone: the draw is local, no backend.
 */
import { useMemo, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { ActionBar } from '@/components/ActionBar';
import { ActionButton } from '@/components/ActionButton';
import { CardReveal } from '@/components/CardReveal';
import { CardStage } from '@/components/CardStage';
import { ChooseCardStep } from '@/components/ChooseCardStep';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ScreenTitle } from '@/components/ScreenTitle';
import type { Card } from '@/data/cards';
import { cardFromParam, shuffledDeck } from '@/lib/draw';
import { t, useLang } from '@/lib/lang';
import { useTurnUp } from '@/lib/useTurnUp';

export default function ReadingScreen() {
  const { lang } = useLang();
  const { n } = useLocalSearchParams<{ n?: string }>();
  const linked = useMemo(() => cardFromParam(n), [n]);

  const [deck, setDeck] = useState(shuffledDeck);
  const [card, setCard] = useState<Card | null>(linked);
  const turned = useTurnUp(card);

  const drawAnother = () => {
    setCard(null);
    setDeck(shuffledDeck());
  };

  return (
    <Screen>
      <ScreenHeader />

      {!card ? (
        <>
          <ScreenTitle>{t(lang, 'messageTitle')}</ScreenTitle>
          <ChooseCardStep deck={deck} lede={t(lang, 'pickIntro')} onChoose={setCard} />
        </>
      ) : (
        <>
          <CardStage card={card} flipped={turned} />

          {turned ? (
            <CardReveal card={card} lang={lang}>
              <ActionBar>
                <ActionButton label={t(lang, 'drawAnother')} onPress={drawAnother} />
              </ActionBar>
            </CardReveal>
          ) : null}
        </>
      )}
    </Screen>
  );
}
