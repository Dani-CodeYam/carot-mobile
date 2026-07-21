/**
 * "Tengo una pregunta específica" — a draw with something asked of it.
 *
 * Three beats on one screen. First you write the question; nothing is drawn
 * until you do, because the asking is half the ritual. Then the spread opens
 * with your question kept above it. Then the card you chose turns over, and the
 * meaning is read against what was actually asked.
 *
 * "Hacer otra pregunta" returns to the blank field and reshuffles rather than
 * just redrawing — a new question deserves a new draw.
 *
 * Standalone: the question never leaves the device. It is not stored or sent
 * anywhere; it only frames the card.
 */
import { useState } from 'react';
import { ActionBar } from '@/components/ActionBar';
import { ActionButton } from '@/components/ActionButton';
import { AskedQuestion } from '@/components/AskedQuestion';
import { CardReveal } from '@/components/CardReveal';
import { CardStage } from '@/components/CardStage';
import { ChooseCardStep } from '@/components/ChooseCardStep';
import { QuestionForm } from '@/components/QuestionForm';
import { Screen } from '@/components/Screen';
import { ScreenHeader } from '@/components/ScreenHeader';
import { ScreenTitle } from '@/components/ScreenTitle';
import type { Card } from '@/data/cards';
import { shuffledDeck } from '@/lib/draw';
import { t, useLang } from '@/lib/lang';
import { useTurnUp } from '@/lib/useTurnUp';

export default function QuestionScreen() {
  const { lang } = useLang();
  const [draft, setDraft] = useState('');
  /** The question as asked — frozen once the spread opens. */
  const [asked, setAsked] = useState<string | null>(null);
  const [deck, setDeck] = useState(shuffledDeck);
  const [card, setCard] = useState<Card | null>(null);
  const turned = useTurnUp(card);

  // Whitespace is not a question.
  const question = draft.trim();

  const ask = () => {
    if (!question) return;
    setAsked(question);
  };

  const askAnother = () => {
    setAsked(null);
    setCard(null);
    setDraft('');
    setDeck(shuffledDeck());
  };

  return (
    <Screen keyboardAware>
      <ScreenHeader />

      <ScreenTitle>{t(lang, 'questionTitle')}</ScreenTitle>

      {asked === null ? (
        <QuestionForm
          value={draft}
          onChange={setDraft}
          onSubmit={ask}
          canSubmit={question.length > 0}
          lede={t(lang, 'questionIntro')}
          placeholder={t(lang, 'questionPlaceholder')}
          label={t(lang, 'questionTitle')}
          submitLabel={t(lang, 'askCards')}
        />
      ) : (
        <>
          <AskedQuestion label={t(lang, 'youAsked')} question={asked} />

          {!card ? (
            <ChooseCardStep deck={deck} lede={t(lang, 'pickIntro')} onChoose={setCard} />
          ) : (
            <CardStage card={card} flipped={turned} />
          )}

          {turned && card ? (
            <CardReveal card={card} lang={lang}>
              <ActionBar>
                <ActionButton label={t(lang, 'askAnother')} onPress={askAnother} />
              </ActionBar>
            </CardReveal>
          ) : null}
        </>
      )}
    </Screen>
  );
}
