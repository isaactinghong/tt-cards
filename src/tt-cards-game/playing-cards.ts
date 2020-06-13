const Deck = require('card-deck');


export const CardCodeToImageFilename = new Map<string, string>([
  ['Ad', 'card_1_1.png'],
  ['2d', 'card_1_2.png'],
  ['3d', 'card_1_3.png'],
  ['4d', 'card_1_4.png'],
  ['5d', 'card_1_5.png'],
  ['6d', 'card_1_6.png'],
  ['7d', 'card_1_7.png'],
  ['8d', 'card_1_8.png'],
  ['9d', 'card_1_9.png'],
  ['Td', 'card_1_10.png'],
  ['Jd', 'card_1_11.png'],
  ['Qd', 'card_1_12.png'],
  ['Kd', 'card_1_13.png'],
  ['Ac', 'card_2_1.png'],
  ['2c', 'card_2_2.png'],
  ['3c', 'card_2_3.png'],
  ['4c', 'card_2_4.png'],
  ['5c', 'card_2_5.png'],
  ['6c', 'card_2_6.png'],
  ['7c', 'card_2_7.png'],
  ['8c', 'card_2_8.png'],
  ['9c', 'card_2_9.png'],
  ['Tc', 'card_2_10.png'],
  ['Jc', 'card_2_11.png'],
  ['Qc', 'card_2_12.png'],
  ['Kc', 'card_2_13.png'],
  ['Ah', 'card_3_1.png'],
  ['2h', 'card_3_2.png'],
  ['3h', 'card_3_3.png'],
  ['4h', 'card_3_4.png'],
  ['5h', 'card_3_5.png'],
  ['6h', 'card_3_6.png'],
  ['7h', 'card_3_7.png'],
  ['8h', 'card_3_8.png'],
  ['9h', 'card_3_9.png'],
  ['Th', 'card_3_10.png'],
  ['Jh', 'card_3_11.png'],
  ['Qh', 'card_3_12.png'],
  ['Kh', 'card_3_13.png'],
  ['As', 'card_4_1.png'],
  ['2s', 'card_4_2.png'],
  ['3s', 'card_4_3.png'],
  ['4s', 'card_4_4.png'],
  ['5s', 'card_4_5.png'],
  ['6s', 'card_4_6.png'],
  ['7s', 'card_4_7.png'],
  ['8s', 'card_4_8.png'],
  ['9s', 'card_4_9.png'],
  ['Ts', 'card_4_10.png'],
  ['Js', 'card_4_11.png'],
  ['Qs', 'card_4_12.png'],
  ['Ks', 'card_4_13.png'],
]);

const playingCards = [
  'Ad',
  '2d',
  '3d',
  '4d',
  '5d',
  '6d',
  '7d',
  '8d',
  '9d',
  'Td',
  'Jd',
  'Qd',
  'Kd',
  'Ac',
  '2c',
  '3c',
  '4c',
  '5c',
  '6c',
  '7c',
  '8c',
  '9c',
  'Tc',
  'Jc',
  'Qc',
  'Kc',
  'Ah',
  '2h',
  '3h',
  '4h',
  '5h',
  '6h',
  '7h',
  '8h',
  '9h',
  'Th',
  'Jh',
  'Qh',
  'Kh',
  'As',
  '2s',
  '3s',
  '4s',
  '5s',
  '6s',
  '7s',
  '8s',
  '9s',
  'Ts',
  'Js',
  'Qs',
  'Ks',
]

export function CardCodeToImage(cardCode: string) {
  
  return require('./assets/cards/'+ CardCodeToImageFilename.get(cardCode));
}

export default function PlayingDeck() {

  const deck = new Deck(playingCards);
  deck.shuffle();
  
  return deck;

}

export function CardCodeFromCard(card: any) {
  return card.value + card.suit;
}