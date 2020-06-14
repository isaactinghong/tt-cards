import React, { useState } from "react";
import { CompareRound } from "./main-compares";
import { Card } from "./card";


export const CompareHand = (props: { compareRound: CompareRound}) => {

  const [compareRound, setCompareRound] = useState(props.compareRound);

  const { 
    deck, 
    hands, 
    solvedHands 
  } = compareRound;
  
  

  const printHand = (solvedHand: any) => {
  
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
                  <Card card={card} compareRound={compareRound} />
                </div>
              )
            })
          }
        </div>
      </div>
    );
    
  }
  return (
    <div>
      { solvedHands.map((solvedHand) => printHand(solvedHand)) }
    </div>
  );

}