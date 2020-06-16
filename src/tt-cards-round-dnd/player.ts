export class Player {
  playerIndex: number = -1;
  roundScore?: number;
  dealtCards?: string[];
  playedCards: string[] = [];
  // SpecialHand?: SpecialHand
  
  top3Hand?: any;
  middle5Hand?: any;
  bottom5Hand?: any;

  get top3Cards() {
    return this.playedCards?.slice(0, 3);
  }
  get middle5Cards() {
    return this.playedCards?.slice(3, 8);
  }
  get bottom5Cards() {
    return this.playedCards?.slice(8);
  }
}