import React, { useState } from "react";
import { CardCodeFromCard, CardCodeToImage, IsPlayingCard } from "../../tt-cards-game/playing-cards";
import { GameRoundComponent } from "./game-round";
const PokerCard = require('pokersolver').Card;


export const CardComponent = (props: {
  // compareRound: CompareRound,
  handIndex: number,
  cardIndex: number,
  cardCode: string,
  setCard: any,
}) => {

  // const [compareRound, setCompareRound] = useState(props.compareRound);
  const [card, setCard] = useState(props.cardCode);
  const [cardInput, setCardInput] = useState(props.cardCode.toUpperCase());

  const changeCard = (event: any) => {
    const newCardCodeInput: string = event.target.value;
    console.log('newCardCodeInput:', newCardCodeInput);
    
    setCardInput(newCardCodeInput);

    const newCardCode = newCardCodeInput.charAt(0).toUpperCase() + newCardCodeInput.charAt(1).toLowerCase();
    if (IsPlayingCard(newCardCode)) {
      
      setCard(newCardCode)

      props.setCard(props.handIndex, props.cardIndex, newCardCode);
    }
  }

  
  return (
    <div className="playing-card col s2">
      <img alt={card} className="z-depth-2" src={ CardCodeToImage(card) } />
      
      <div className="input-field">
        <input type="text" className="validate"
         onChange={changeCard} 
        value={ cardInput } 
        />
      </div>
    </div>
  );
}