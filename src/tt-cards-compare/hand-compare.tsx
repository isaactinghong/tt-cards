
import React from 'react';
import PlayingDeck, { CardCodeToImage, CardCodeFromCard } from '../tt-cards-game/playing-cards';
const Hand = require('pokersolver').Hand;

interface HandCompareState {
  compares: any[];
}

class Props {
  
}

class HandCompare extends React.Component<Props, HandCompareState> {
  
  constructor(props: any) {
    super(props);
    // Don't call this.setState() here!
    // this.state = { compares: [] };
    
    const compares: any[] = [];
    const numOfCompares = 2;
    const numOfHandsToCompares = 2;
    const numOfCardsDrawn = 5;

    for (let i = 0; i < numOfCompares; i++) {

      let deck = PlayingDeck();
      let playerIndex = 1;
      let solvedHands = [];

      for (let j = 0; j < numOfHandsToCompares; j++) {
        const hand = deck.draw(numOfCardsDrawn);
        console.log(hand);
        const solvedHand = Hand.solve(hand);
        solvedHand.playerId = playerIndex;
        solvedHands.push(solvedHand);
        playerIndex++;
      }

      const winnerHands = Hand.winners(solvedHands);
      const winnerPlayerIds = winnerHands.map((hand: any) => hand.playerId);
      for (const solvedHand of solvedHands) {
        if (winnerPlayerIds.some((winnerPlayerId: any) => winnerPlayerId === solvedHand.playerId)) {
          solvedHand.isWinner = true;
        }
      }
      compares.push(solvedHands);
    }
    this.state = {
      compares: compares
    };
  }

  render() {
      
    
    return (
      <div>
        <div>
          <h5 className="page-title teal-text text-darken-3">Compare Hands</h5>

          <div>
            { 
              this.state.compares.map((solvedHands:any, compareIndex: number) => {
                
                const displayHands = solvedHands.map((solvedHand: any) => {
                  return printHand(solvedHand);
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
}



function printHand(solvedHand: any) {

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
                <input id="card1" type="text" className="validate" onChange={changeCard} value={ CardCodeFromCard(card) } />
              </div>
            );
          })
        }
      </div>
    </div>
  );

}

function changeCard(event: any) {
  console.log(event.target.value);
}

export default HandCompare;