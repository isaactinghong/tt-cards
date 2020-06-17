import React, { useState } from "react";
import { CardCodeToImage, IsPlayingCard } from "../tt-cards-game/playing-cards";


export const CardComponent = (props: {
  // compareRound: CompareRound,
  cardId: string,
  style?: string,
  handIndex: number,
  cardIndex: number,
  cardCode: string,
  setCard: any,
}) => {

  // const [compareRound, setCompareRound] = useState(props.compareRound);
  // const [cardId] = useState(props.cardId);
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
    <div className={`playing-card ${props.style ?? ''}`}>
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