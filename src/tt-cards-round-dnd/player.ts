
export enum RACK_TYPE {
  TOP3 = 'TOP3',
  MIDDLE5='MIDDLE3',
  BOTTOM5='BOTTOM5',
}

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
  get racks(): {
    cards: () => string[], 
    hand: () => any;
    type: RACK_TYPE
  }[] {
    return [
      {cards: () => this.top3Cards, hand: () => this.top3Hand, type: RACK_TYPE.TOP3},
      {cards: () => this.middle5Cards, hand: () => this.middle5Hand, type: RACK_TYPE.MIDDLE5},
      {cards: () => this.bottom5Cards, hand: () => this.bottom5Hand, type: RACK_TYPE.BOTTOM5},
    ]
  }
}
