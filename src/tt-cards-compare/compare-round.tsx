import React, { useState } from "react";
import { CardCodeFromCard, CardCodeToImage } from "../tt-cards-game/playing-cards";
import { CompareRound } from "./main-compares";
import produce from "immer";
import { Card } from "./card";


export const CompareHand = (props: { compareRound: CompareRound}) => {

  const [formData, setFormData] = useState(props.compareRound);

  const { 
    deck, 
    hands, 
    solvedHands 
  } = formData;
  
  

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
                  <Card card={card} />
                  {/* <img alt={CardCodeFromCard(card)} className="z-depth-2" src={ CardCodeToImage(CardCodeFromCard(card)) } /> */}
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
                  <input id="card1" type="text" className="validate"
                  //  onChange={(e) => this.changeCard(compareRound, solvedHand, e)} 
                   value={ CardCodeFromCard(card) } 
                   />
                </div>
              );
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