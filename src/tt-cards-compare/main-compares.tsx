
import React from 'react';
import PlayingDeck, { CardCodeToImage, CardCodeFromCard } from '../tt-cards-game/playing-cards';
import { produce } from 'immer';
import { CompareHand } from './compare-round';
const Hand = require('pokersolver').Hand;

export interface CompareRound {
  deck: any;
  hands: any[];
  solvedHands: any[];
}

interface MainComparesState {
  compares: CompareRound[];
  numOfCompares: number;
  numOfHandsToCompares: number;
  numOfCardsDrawn: number;
}

class Props {
  
}

class MainCompares extends React.Component<Props, MainComparesState> {
  
  constructor(props: any) {
    super(props);
    // Don't call this.setState() here!
    
    this.state = {
      numOfCompares: 2,
      numOfHandsToCompares: 2,
      numOfCardsDrawn: 5,
      compares: [],
    };
    
    const comparesArray: any[] = [];

    for (let i = 0; i < this.state.numOfCompares; i++) {

      let deck = PlayingDeck();

      const hands = [];
      for (let j = 0; j < this.state.numOfHandsToCompares; j++) {
        hands.push(deck.draw(this.state.numOfCardsDrawn));
      }

      const solvedHands: any[] = this.solveHands(hands);

      this.determineWinner(solvedHands);

      comparesArray.push({
        deck,
        hands,
        solvedHands
      });
    }

    this.state = {
      ...this.state,
      compares: comparesArray,
    };
  }

  solveHands(hands: any[]) {
    const solvedHands: any[] = [];
    let playerIndex = 1;
    hands.map((hand: any) => {
      console.log(hand);
      const solvedHand = Hand.solve(hand);
      solvedHand.playerId = playerIndex;
      solvedHands.push(solvedHand);
      playerIndex++;
    });
    return solvedHands;
  }

  determineWinner(solvedHands: any[]) {
    
    const winnerHands = Hand.winners(solvedHands);
    const winnerPlayerIds = winnerHands.map((hand: any) => hand.playerId);
    for (const solvedHand of solvedHands) {
      if (winnerPlayerIds.some((winnerPlayerId: any) => winnerPlayerId === solvedHand.playerId)) {
        solvedHand.isWinner = true;
      }
    }
  }

  render() {
      
    
    return (
      <div>
        <div>
          <h5 className="page-title teal-text text-darken-3">Compare Hands</h5>

          <div>
            { 
              this.state.compares.map((compareRound:CompareRound, compareIndex: number) => {
                
                // const displayHands = compareRound.solvedHands.map((solvedHand: any) => {
                //   return this.printHand(solvedHand, compareRound);
                // })

                return (
                  <div className="row">
                    <div className="col s2">
                      #{ compareIndex + 1 }
                    </div>
                    {/* {displayHands} */}

                    <CompareHand compareRound={compareRound}  />
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    )
  }

}

export default MainCompares;