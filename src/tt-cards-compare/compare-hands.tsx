
import React from 'react';
import PlayingDeck, { CardCodeToImage, CardCodeFromCard } from '../tt-cards-game/playing-cards';
import { produce } from 'immer';
const Hand = require('pokersolver').Hand;

interface CompareRound {
  deck: any;
  hands: any[];
  solvedHands: any[];
}

interface CompareHandsState {
  compares: CompareRound[];
  numOfCompares: number;
  numOfHandsToCompares: number;
  numOfCardsDrawn: number;
}

class Props {
  
}

class CompareHands extends React.Component<Props, CompareHandsState> {
  
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
                
                const displayHands = compareRound.solvedHands.map((solvedHand: any) => {
                  return this.printHand(solvedHand, compareRound);
                })

                return (
                  <div className="row">
                    <div className="col s2">
                      #{ compareIndex + 1 }
                    </div>
                    {displayHands}
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    )
  }

  printHand(solvedHand: any, compareRound:CompareRound) {
  
    // const handInCardCode = solvedHand.cards.join(', ');
    
    const winner = solvedHand.isWinner ? <strong> wins! </strong> : '';
  
    return (
      <div className="col s5">
        {/* <div>Player { solvedHand.playerId }:</div> */}
        {/* <div>{ handInCardCode}</div> */}
  
        <div className="row">
          <div className={"col s5 player-title " + (solvedHand.isWinner ? 'winner' : '')}>Player {solvedHand.playerId} {winner} </div>
        </div>
        <div className="row">
          <div className="col s5">{ solvedHand.descr }</div>
        </div>
  
        <div className="row">
          {
            solvedHand.cards.map((card: any) => {
              // return null;
              return (
                <div className="col s2">
                  <img alt={CardCodeFromCard(card)} className="z-depth-2" src={ CardCodeToImage(CardCodeFromCard(card)) } />
                </div>
              )
            })
          }
        </div>
  
        <div className="row">
          {
            solvedHand.cards.map((card: any) => {
              // return null;
              return (
                <div className="input-field col s2">
                  <input id="card1" type="text" className="validate" onChange={(e) => this.changeCard(compareRound, solvedHand, e)} value={ CardCodeFromCard(card) } />
                </div>
              );
            })
          }
        </div>
      </div>
    );
  
  }
  
  changeCard(compareRound: CompareRound, solvedHand: any, event: any) {
    this.setState(produce(this.state, state => {
      const compareIndex = this.state.compares.findIndex(compare => compare === compareRound);
      state.compares.splice(compareIndex, 1);

      console.log(solvedHand.cardPool);

      // change the card in compareRound
      // compareRound.hands

      state.compares = [
        ...state.compares,
        compareRound
      ]
    }))
    console.log(event.target.value);
  }
}



export default CompareHands;