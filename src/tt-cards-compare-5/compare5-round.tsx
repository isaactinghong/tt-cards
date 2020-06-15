import React, { useState, useEffect } from "react";
import { CompareRound } from "./main-compare5";
import { Card } from "./card";
import produce from "immer";
const Hand = require('pokersolver').Hand;

function hasDuplicates(array: any[]) {
  return (new Set(array)).size !== array.length;
}

export const CompareHand = (props: { compareRound: CompareRound}) => {

  const [hands, setHands] = useState(props.compareRound.hands);

  const solveHands = (hands: any[]) => {
    const solvedHands: any[] = [];
    let playerIndex = 1;

    hands.map((hand: any) => {
      const solvedHand = Hand.solve(hand);

      solvedHand.playerId = playerIndex;
      solvedHands.push(solvedHand);
      playerIndex++;
    });
    return solvedHands;
  }

  const determineWinner = (solvedHands: any[]) => {

    const winnerHands = Hand.winners(solvedHands);
    const winnerPlayerIds = winnerHands.map((hand: any) => hand.playerId);
    for (const solvedHand of solvedHands) {
      if (winnerPlayerIds.some((winnerPlayerId: any) => winnerPlayerId === solvedHand.playerId)) {
        solvedHand.isWinner = true;
      }
    }
  }

  const printHand = (solvedHand: any, handIndex: number) => {
    
    const winner = solvedHand.isWinner ? <strong> wins! </strong> : '';
  
    return (
      <div className="col s6" key={handIndex}>
  
        <div className="row">
          {
            hands[handIndex].map((cardCode: any, cardIndex: number) => {
              return (
                <div className="col s2" key={cardIndex}>
                  <Card 
                    handIndex={handIndex}
                    cardIndex={cardIndex}
                    cardCode={cardCode} 
                    setCard={setCard}
                   />
                </div>
              )
            })
          }
        </div>
        <div className="row">
          <div className={"col s12 player-title " + (solvedHand.isWinner ? 'winner' : '')}>Player {solvedHand.playerId} {winner} </div>
        </div>
        <div className="row">
          <div className="col s12">{ solvedHand.descr }</div>
        </div>
      </div>
    );
  }

  
  const [solvedHands, setSolvedHands] = useState(solveHands(hands));

  const checkDuplicateCards = (hands: any[]) => {
    return (hasDuplicates([].concat(...hands))) 
  }


  const [hasDuplicateCard, setHasDuplicateCard] = useState(checkDuplicateCards(hands));

  const setCard = (handIndex: number, cardIndex: number, cardCode: string) => {
    // console.log('hands:',hands);
    // console.log('setCard:', handIndex, cardIndex, cardCode);

    const newHands = produce(hands, (hands: any) => {
      hands[handIndex][cardIndex] = cardCode;
    });

    // set the card to hands
    setHands(newHands)

    setHasDuplicateCard(checkDuplicateCards(newHands));

    // solveHands
    const solvedHands = solveHands(newHands);
    
    setSolvedHands(solvedHands);
    // determineWinner
    determineWinner(solvedHands);
  }

  determineWinner(solvedHands);
  

  return (
    <div className="col s10">
      <div className="row">
        { solvedHands.map((solvedHand: any, handIndex: number) => printHand(solvedHand, handIndex)) }
      </div>
      <div className="row">
        <div className="col s12">{ hasDuplicateCard ? 'Has Duplicate Cards...' : ''}</div>
      </div>
    </div>
  );

}