import { Player } from "./player";
import { HandType, getWinnerHands } from "./hand";

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

export const duelAgainst = (player: Player, againstPlayer: Player, duels: Duels) => {
  const _duelKey = duelKey(player, againstPlayer);
  const duel = duels[_duelKey];
  const matchLeft = _duelKey[0] === player.playerIndex.toString();
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

export const duelKey = (player: Player, againstPlayer: Player) => {
  if (player.playerIndex > againstPlayer.playerIndex) {
    return `${againstPlayer.playerIndex}-${player.playerIndex}`;
  }
  return `${player.playerIndex}-${againstPlayer.playerIndex}`;
}

export const top3HandScore = (hand: any): number => {
  
  switch (hand.constructor) {
    case HandType.ThreeOfAKind:
      return 3;
    default:
      return 1;
  }
};

export const middle5HandScore = (hand: any): number => {
  
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


export const bottom5HandScore = (hand: any): number => {
  
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


export const calculateDuels = (iPlayers: Player[]) => {
  console.log('calculateDuels start');

  const duels = {} as Duels;

  for (let i = 0; i < iPlayers.length - 1; i++) {
    for (let j = i + 1; j < iPlayers.length; j++) {

      const _duelKey = duelKey(iPlayers[i], iPlayers[j]);
      console.log('duelKey',_duelKey);

      let duelResult = {
      } as Duel;

      // compare top3
      const top3Score = calculateScoreForRack(
        i,
        getWinnerHands([iPlayers[i].top3Hand, iPlayers[j].top3Hand]),
        top3HandScore
      );
      duelResult = {
        ...duelResult,
        compareTop3: top3Score,
      }
      
      // compare middle5
      const middle5Score = calculateScoreForRack(
        i, 
        getWinnerHands([iPlayers[i].middle5Hand, iPlayers[j].middle5Hand]),
        middle5HandScore
      );
      duelResult = {
        ...duelResult,
        compareMiddle5: middle5Score,
      }
      
      // compare bottom5
      const bottom5Score = calculateScoreForRack(
        i, 
        getWinnerHands([iPlayers[i].bottom5Hand, iPlayers[j].bottom5Hand]),
        bottom5HandScore
      );
      duelResult = {
        ...duelResult,
        compareBottom5: bottom5Score,
      }

      // TODO: compare special hand

      // TODO: check own goal if there are any report(s)
      
      // TODO: calculate total with special hand and own goal
      duelResult = {
        ...duelResult,
        compareTotal: top3Score + middle5Score + bottom5Score,
      }

      duels[_duelKey] = duelResult;
    }
  }
  console.log('duels become:', duels);

  return duels;
}

const calculateScoreForRack = (leftPlayerIndex: number, winningHands: any[], rackHandScoreFunc: (hand: any) => number) => {
  if (winningHands.length === 1) {
    const winningHand = winningHands[0];
    const winningScore = rackHandScoreFunc(winningHand);

    return winningHand.playerIndex === leftPlayerIndex ? winningScore : -winningScore;
  }
  return 0;
}