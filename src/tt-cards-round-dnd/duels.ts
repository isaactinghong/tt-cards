import { Player } from "./player";
import { HandType } from "./hand";
const Poker = require('pokersolver');

export interface Duel {
  // playerId: string;
  // targetPlayerId: string;
  compareSpecial?: number;
  compareTop3?: number;
  compareMiddle5?: number;
  compareBottom5?: number;
  compareTotal?: number;
}

export interface Duels {
  [duelKey: string]: Duel;
}

export const DuelKey = (player: Player, anotherPlayer: Player) => {
  if (player.playerIndex > anotherPlayer.playerIndex) {
    return `${anotherPlayer.playerIndex}-${player.playerIndex}`;
  }
  return `${player.playerIndex}-${anotherPlayer.playerIndex}`;
}

export const Top3HandScore = (hand: any) => {
  
  switch (hand.constructor) {
    case HandType.ThreeOfAKind:
      return 3;
    default:
      return 1;
  }
};

export const Middle5HandScore = (hand: any) => {
  
  switch (hand.constructor) {
    case HandType.WildRoyalFlush:
      return 10;
    case HandType.NaturalRoyalFlush:
      return 10;
    case HandType.RoyalFlush:
      return 10;
    case HandType.StraightFlush:
      return 10;
    case HandType.FourOfAKind:
      return 8;
    case HandType.FullHouse:
      return 2;
    default:
      return 1;
  }
};


export const Bottom5HandScore = (hand: any) => {
  
  switch (hand.constructor) {
    case HandType.WildRoyalFlush:
      return 5;
    case HandType.NaturalRoyalFlush:
      return 5;
    case HandType.RoyalFlush:
      return 5;
    case HandType.StraightFlush:
      return 5;
    case HandType.FourOfAKind:
      return 4;
    default:
      return 1;
  }
};