import { Player } from "./player";
import { compareTwoHands } from "./hand";

export const checkOwnGoal = (player: Player) => {

  if (!!player.top3Hand && !!player.middle5Hand && !!player.bottom5Hand) {
    if (compareTwoHands(player.top3Hand, player.middle5Hand) === -1)
      return true;
    if (compareTwoHands(player.middle5Hand, player.bottom5Hand) === -1)
      return true;
  }
  return false;
}