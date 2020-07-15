import { Player } from "./player";
import produce from "immer";

const Poker = require('pokersolver');
const Hand = require('pokersolver').Hand;

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


export const getWinnerHands = (solvedHands: any[]) => {

  const winnerHands = Hand.winners(solvedHands);
  
  return winnerHands;
}


export const solveHandsForPlayers = (iPlayers: Player[]) => {

  return produce(iPlayers, draftPlayers => {

    draftPlayers.map((draftPlayer: Player, playerIndex: number) => {
      draftPlayer.top3Hand = Hand.solve(draftPlayer.top3Cards);
      draftPlayer.top3Hand.playerIndex = playerIndex;
      draftPlayer.middle5Hand = Hand.solve(draftPlayer.middle5Cards);
      draftPlayer.middle5Hand.playerIndex = playerIndex;
      draftPlayer.bottom5Hand = Hand.solve(draftPlayer.bottom5Cards);
      draftPlayer.bottom5Hand.playerIndex = playerIndex;
      return true;
    });
  });
}