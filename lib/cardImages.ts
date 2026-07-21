/**
 * Static image map for the deck. React Native's bundler needs literal
 * require() calls (it can't resolve dynamic string paths), so every card
 * artwork and the card back are registered here by their `img` filename.
 *
 * Keyed by Card.img (see data/cards.ts). Note the intentional Justice/Strength
 * image swap lives in the data, not here — this map is purely filename → asset.
 */
import type { ImageSourcePropType } from 'react-native';

export const CARD_BACK: ImageSourcePropType = require('../assets/card-back.png');

export const CARD_IMAGES: Record<string, ImageSourcePropType> = {
  '00-el-loco.png': require('../assets/cards/00-el-loco.png'),
  '01-el-mago.png': require('../assets/cards/01-el-mago.png'),
  '02-la-sacerdotisa.png': require('../assets/cards/02-la-sacerdotisa.png'),
  '03-la-emperatriz.png': require('../assets/cards/03-la-emperatriz.png'),
  '04-el-emperador.png': require('../assets/cards/04-el-emperador.png'),
  '05-el-papa.png': require('../assets/cards/05-el-papa.png'),
  '06-los-enamorados.png': require('../assets/cards/06-los-enamorados.png'),
  '07-el-carro.png': require('../assets/cards/07-el-carro.png'),
  '08-la-justicia.png': require('../assets/cards/08-la-justicia.png'),
  '09-el-ermitano.png': require('../assets/cards/09-el-ermitano.png'),
  '10-la-rueda.png': require('../assets/cards/10-la-rueda.png'),
  '11-la-fuerza.png': require('../assets/cards/11-la-fuerza.png'),
  '12-el-colgado.png': require('../assets/cards/12-el-colgado.png'),
  '13-la-muerte.png': require('../assets/cards/13-la-muerte.png'),
  '14-la-templanza.png': require('../assets/cards/14-la-templanza.png'),
  '15-el-diablo.png': require('../assets/cards/15-el-diablo.png'),
  '16-la-torre.png': require('../assets/cards/16-la-torre.png'),
  '17-la-estrella.png': require('../assets/cards/17-la-estrella.png'),
  '18-la-luna.png': require('../assets/cards/18-la-luna.png'),
  '19-el-sol.png': require('../assets/cards/19-el-sol.png'),
  '20-el-juicio.png': require('../assets/cards/20-el-juicio.png'),
  '21-el-mundo.png': require('../assets/cards/21-el-mundo.png'),
};

export function cardImage(img: string): ImageSourcePropType {
  return CARD_IMAGES[img] ?? CARD_BACK;
}
