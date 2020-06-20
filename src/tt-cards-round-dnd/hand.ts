const Poker = require('pokersolver');

export enum HandType {
  
  RoyalFlush = Poker.RoyalFlush,
  NaturalRoyalFlush = Poker.NaturalRoyalFlush,
  WildRoyalFlush = Poker.WildRoyalFlush,
  FiveOfAKind = Poker.FiveOfAKind,
  StraightFlush = Poker.StraightFlush,
  FourOfAKindPairPlus = Poker.FourOfAKindPairPlus,
  FourOfAKind = Poker.FourOfAKind,
  FourWilds = Poker.FourWilds,
  TwoThreeOfAKind = Poker.TwoThreeOfAKind,
  ThreeOfAKindTwoPair = Poker.ThreeOfAKindTwoPair,
  FullHouse = Poker.FullHouse,
  Flush = Poker.Flush,
  Straight = Poker.Straight,
  ThreeOfAKind = Poker.ThreeOfAKind,
  ThreePair = Poker.ThreePair,
  TwoPair = Poker.TwoPair,
  OnePair = Poker.OnePair,
  HighCard = Poker.HighCard,
}
