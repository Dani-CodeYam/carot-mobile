/**
 * "Elegí tu carta" — the lede and the spread, the step both draw flows share.
 */
import { StyleSheet, View } from 'react-native';
import { CardPicker } from '@/components/CardPicker';
import { Lede } from '@/components/Lede';
import type { Card } from '@/data/cards';
import { theme } from '@/lib/theme';

export function ChooseCardStep({
  deck,
  lede,
  onChoose,
}: {
  deck: Card[];
  lede: string;
  onChoose: (card: Card) => void;
}) {
  return (
    <View style={styles.step}>
      <Lede>{lede}</Lede>
      <View style={styles.picker}>
        <CardPicker deck={deck} onChoose={onChoose} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  step: {
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  picker: {
    alignSelf: 'stretch',
    marginTop: theme.spacing.xl,
  },
});
