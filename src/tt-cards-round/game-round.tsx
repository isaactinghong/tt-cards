import React, { useState, useEffect } from "react";
import { CardComponent } from "./card";
import produce from "immer";
import { Player } from "./player";
import PlayingDeck from "../tt-cards-game/playing-cards";
import { plainToClass } from "class-transformer";
const Hand = require('pokersolver').Hand;

function hasDuplicates(array: any[]) {
  return (new Set(array)).size !== array.length;
}

export interface RoundState {
  deck: any;
  players: Player[];
  // solvedHands: any[];
  hasDuplicateCard: boolean
}

export const GameRoundComponent = (props: { 
  numOfPlayersInRound: number,
  roundIndex: number
}) => {

  let deck = PlayingDeck();
  const initialPlayers = [];

  for (let j = 0; j < props.numOfPlayersInRound; j++) {

    const top3Cards = deck.draw(3);
    const middle5Cards = deck.draw(5);
    const bottom5Cards = deck.draw(5);

    const dealtCards = top3Cards.concat(middle5Cards, bottom5Cards);

    const player = plainToClass(Player, {
      playerIndex: j,
      dealtCards: dealtCards,
      playedCards: Object.assign([], dealtCards),
    });
    
    initialPlayers.push(player);
  }

  const [players, setPlayers] = useState(initialPlayers);

  // const solveHands = (players: Player[]) => {
  //   const solvedHands: any[] = [];
  //   let playerIndex = 1;

  //   players.map((player: Player) => {
  //     const solvedHand = Hand.solve(player.top3?.cards);

  //     solvedHand.playerIndex = playerIndex;
  //     solvedHands.push(solvedHand);
  //     playerIndex++;
  //   });
  //   return solvedHands;
  // }

  // const determineWinner = (solvedHands: any[]) => {

  //   const winnerHands = Hand.winners(solvedHands);
  //   const winnerplayerIndexs = winnerHands.map((hand: any) => hand.playerIndex);
  //   for (const solvedHand of solvedHands) {
  //     if (winnerplayerIndexs.some((winnerplayerIndex: any) => winnerplayerIndex === solvedHand.playerIndex)) {
  //       solvedHand.isWinner = true;
  //     }
  //   }
  // }
  
  const checkDuplicateCards = (players: Player[]) => {
    
    const reducer = (acc: any, player: Player) => { acc.push(player.playedCards); return acc; };
    const allCards = [].concat(...players.reduce(reducer, []));
    console.log('allCards:', allCards);
    return hasDuplicates(allCards)
  }

  const [hasDuplicateCard, setHasDuplicateCard] = useState(checkDuplicateCards(players));

  const setCard = (
    playerIndex: number,
    cardIndex: number, 
    cardCode: string
    ) => {
    // console.log('hands:',hands);
    // console.log('setCard:', handIndex, cardIndex, cardCode);

    const newPlayers = produce(players, (players: Player[]) => {
      if (players[playerIndex].playedCards !== undefined) {
        players[playerIndex].playedCards[cardIndex] = cardCode;
      }
    });

    // set the card to hands
    setPlayers(newPlayers)

    setHasDuplicateCard(checkDuplicateCards(newPlayers));

    // solveHands
    // const solvedHands = solveHands(newHands);
    
    // setSolvedHands(solvedHands);
    // determineWinner
    // determineWinner(solvedHands);
  }

  // determineWinner(solvedHands);
  

  return (
    <div className="row">
      <div className="col s2">
        <div className="row">
          <div>#{ props.roundIndex + 1 }</div>
          
          <div className="col s12"><div className='red-text'>{ hasDuplicateCard ? '卡有重覆' : ''}</div></div>
        </div>
      </div>
      <div className="col s10">
        <div className="row">
          { players.map((player: Player, playerIndex: number) => {
              return (
                <div className="col s6" key={playerIndex}>
                  
                  <div className="row top3">
                    <div className="row cards">
                      {player.top3Cards.map((cardCode: string, cardIndex: number) => {
                        return (
                          <CardComponent 
                            handIndex={playerIndex}
                            cardIndex={cardIndex}
                            cardCode={cardCode} 
                            setCard={setCard}
                          />
                        );
                      })}
                    </div>
                    <div className="row desc">
                        { player.top3Hand }
                    </div>
                  </div>
                  <div className="row top3">
                    <div className="row cards">
                      {player.middle5Cards.map((cardCode: string, cardIndex: number) => {
                        return (
                          <CardComponent 
                            handIndex={playerIndex}
                            cardIndex={cardIndex}
                            cardCode={cardCode} 
                            setCard={setCard}
                          />
                        );
                      })}
                    </div>
                    <div className="row desc">
                        { player.middle5Hand }
                    </div>
                  </div>
                  
                  <div className="row top3">
                    <div className="row cards">
                      {player.bottom5Cards.map((cardCode: string, cardIndex: number) => {
                        return (
                          <CardComponent 
                            handIndex={playerIndex}
                            cardIndex={cardIndex}
                            cardCode={cardCode} 
                            setCard={setCard}
                          />
                        );
                      })}
                    </div>
                    <div className="row desc">
                        { player.bottom5Hand }
                    </div>
                  </div>
                  <div className="row">
                    <div className="col s12 player-title">Player {player.playerIndex + 1}</div>
                  </div>
                </div>
              );
            }) }
        </div>
      </div>
    </div>
  );

}