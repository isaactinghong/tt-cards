import React, { useState } from "react";
import { CardCodeFromCard, CardCodeToImage } from "../tt-cards-game/playing-cards";
import { CompareRound } from "./main-compares";


export const Card = (props: {
  compareRound: CompareRound,
  card: any
}) => {

  const [compareRound, setCompareRound] = useState(props.compareRound);
  const [card, setCard] = useState(props.card);

  const changeCard = (event: any) => {
    console.log(event.target.value);
    setCard(event.target.value)
    // this.setState(produce(this.state, state => {
    //   const compareIndex = this.state.compares.findIndex(compare => compare === compareRound);
    //   state.compares.splice(compareIndex, 1);

    //   console.log(solvedHand.cardPool);

    //   // change the card in compareRound
    //   // compareRound.hands

    //   state.compares = [
    //     ...state.compares,
    //     compareRound
    //   ]
    // }))
  }
  
  return (
    <div className="playing-card">
      <img alt={CardCodeFromCard(card)} className="z-depth-2" src={ CardCodeToImage(CardCodeFromCard(card)) } />
      
      <div className="input-field">
        <input id="card1" type="text" className="validate"
         onChange={changeCard} 
        value={ CardCodeFromCard(card) } 
        />
      </div>
    </div>
  );
}