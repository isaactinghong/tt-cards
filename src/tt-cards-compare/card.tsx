import React, { useState } from "react";
import { CardCodeFromCard, CardCodeToImage } from "../tt-cards-game/playing-cards";
import { CompareRound } from "./main-compares";


export const Card = (props: {
  card: any
}) => {

  const [card, setCard] = useState(props.card);

  // const changeCard = (compareRound: CompareRound, solvedHand: any, event: any) => {
  //   // this.setState(produce(this.state, state => {
  //   //   const compareIndex = this.state.compares.findIndex(compare => compare === compareRound);
  //   //   state.compares.splice(compareIndex, 1);

  //   //   console.log(solvedHand.cardPool);

  //   //   // change the card in compareRound
  //   //   // compareRound.hands

  //   //   state.compares = [
  //   //     ...state.compares,
  //   //     compareRound
  //   //   ]
  //   // }))
  //   console.log(event.target.value);
  // }
  
  return (
    <img alt={CardCodeFromCard(card)} className="z-depth-2" src={ CardCodeToImage(CardCodeFromCard(card)) } />
  );
}