import { Player } from "./player";
import { HandType } from "./hand";

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

export const DuelAgainst = (player: Player, againstPlayer: Player, duels: Duels) => {
  const duelKey = DuelKey(player, againstPlayer);
  const duel = duels[duelKey];
  const matchLeft = duelKey[0] === player.playerIndex.toString();
  if (matchLeft) {
    return duel;
  }
  else {
    const newDuel = {...duel};
    newDuel.compareSpecial = (duel.compareSpecial ?? 0) * -1;
    newDuel.compareTop3 = (duel.compareTop3 ?? 0) * -1;
    newDuel.compareMiddle5 = (duel.compareMiddle5 ?? 0) * -1;
    newDuel.compareBottom5 = (duel.compareBottom5 ?? 0) * -1;
    newDuel.compareTotal = (duel.compareTotal ?? 0) * -1;
    return newDuel;
  }
}

export const DuelKey = (player: Player, againstPlayer: Player) => {
  if (player.playerIndex > againstPlayer.playerIndex) {
    return `${againstPlayer.playerIndex}-${player.playerIndex}`;
  }
  return `${player.playerIndex}-${againstPlayer.playerIndex}`;
}

export const Top3HandScore = (hand: any): number => {
  
  switch (hand.constructor) {
    case HandType.ThreeOfAKind:
      return 3;
    default:
      return 1;
  }
};

export const Middle5HandScore = (hand: any): number => {
  
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


export const Bottom5HandScore = (hand: any): number => {
  
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