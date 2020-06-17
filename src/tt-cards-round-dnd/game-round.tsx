import React, { useState, useEffect } from "react";
import { CardComponent } from "./card";
import produce from "immer";
import { Player, RACK_TYPE } from "./player";
import PlayingDeck from "../tt-cards-game/playing-cards";
import { plainToClass } from "class-transformer";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
const Hand = require('pokersolver').Hand;

const RackBaseIndex = (rackType: RACK_TYPE) => { 
  switch (rackType) {
    case RACK_TYPE.MIDDLE5: 
      return 3;
    case RACK_TYPE.BOTTOM5: 
      return 8;
    default: 
      return 0;
  }
}

const RackLastIndex = (rackType: RACK_TYPE) => { 
  switch (rackType) {
    case RACK_TYPE.MIDDLE5: 
      return 7;
    case RACK_TYPE.BOTTOM5: 
      return 12;
    default: 
      return 2;
  }
}

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
    // console.log('allCards:', allCards);
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
      players[playerIndex].playedCards[cardIndex] = cardCode;
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
    
  const getItemStyle = (snapshot: any, draggableStyle: any) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: 2,
    margin: `0 2px 0 0`,

    // change background colour if dragging
    background: snapshot.isDragging ? 'transparent' : 'transparent',

    // styles we need to apply on draggables
    ...draggableStyle,
  });

  const getCardListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? 'transparent' : 'transparent',
    display: 'flex',
    padding: 2,
    overflow: 'auto',
  });

  // a little function to help us with reordering the result
  const reorder = (source: any, destination: any) => {

    let {
      sourceDroppableId = source.droppableId,
      sourceIndex = source.index,
     } = source

     let {
       destinationDroppableId = destination.droppableId,
       destinationIndex = destination.index,
      } = destination;

    console.log('sourceDroppableId sourceIndex destinationDroppableId destinationIndex:', 
      sourceDroppableId, sourceIndex, destinationDroppableId, destinationIndex);

    // extract playerIndex and rack (top3/middle5/bottom5) from droppable id
    const [playerIndexStr, sourceRackType] = sourceDroppableId.split('-');
    const [, destinationRackType] = destinationDroppableId.split('-');
    const playerIndex: number = +playerIndexStr;
    console.log('playerIndex sourceRackType destinationRackType:', playerIndex, sourceRackType, destinationRackType);

    const newPlayers = produce(players, (players: Player[]) => {
      // just swap if both in same rack
      if (sourceRackType === destinationRackType) {
        const [removed] = players[playerIndex].playedCards.splice(sourceIndex, 1);
        players[playerIndex].playedCards.splice(destinationIndex, 0, removed);
      }
      else {
        const [removed] = players[playerIndex].playedCards.splice(sourceIndex, 1);

        if (destinationIndex > sourceIndex) {
          destinationIndex--;
        }

        players[playerIndex].playedCards.splice(destinationIndex, 0, removed);

        // put destinationRackType's last extra to sourceRackType's last
        let destinationRackLastIndex = RackLastIndex(destinationRackType);
        const sourceRackTypeLastIndex = RackLastIndex(sourceRackType);

        if (destinationRackLastIndex < sourceRackTypeLastIndex) {
          destinationRackLastIndex++;
        }

        const [removed2] = players[playerIndex].playedCards.splice(destinationRackLastIndex, 1);
        players[playerIndex].playedCards.splice(sourceRackTypeLastIndex, 0, removed2);
      }
    });

    console.log(newPlayers);
    
    // set the card to hands
    setPlayers(newPlayers)
  };

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    if (source == null || destination == null)
      return;

    const items = reorder(
      source,
      destination
    );
  }


  return (
    <DragDropContext onDragEnd={onDragEnd}>
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
                    <div className="row">
                      <div className="player-title">Player {player.playerIndex + 1}</div>
                    </div>
                    { player.racks.map((rack, rackIndex: number) => {
                      return (
                        <div className="row draggable-rack" key={rackIndex}>
                          <Droppable 
                            droppableId={`${playerIndex}-${rack.type}`} 
                            direction="horizontal"
                            // isCombineEnabled={true}
                            >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                style={getCardListStyle(snapshot.isDraggingOver)}
                                {...provided.droppableProps}
                              >
                                {rack.cards().map((cardCode: string, cardIndex: number) => (
                                  <Draggable 
                                    key={`${props.roundIndex}-${cardCode}`} 
                                    draggableId={`${props.roundIndex}-${cardCode}`} 
                                    index={ RackBaseIndex(rack.type) + cardIndex }>
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="col s2"
                                        style={getItemStyle(
                                          snapshot,
                                          provided.draggableProps.style
                                        )}
                                      >
                                        
                                        <CardComponent 
                                          cardId={`${playerIndex}-${cardCode}`}
                                          handIndex={playerIndex}
                                          cardIndex={cardIndex}
                                          cardCode={cardCode} 
                                          setCard={setCard}
                                        />
                                      </div>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </div>
                            )}
                          </Droppable>
                        </div>
                      );
                      })
                    }
                  </div>
                );
              }) }
          </div>
        </div>
      </div>
    </DragDropContext>
  );

}