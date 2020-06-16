import React, { useState, useEffect } from "react";
import { CardComponent } from "./card";
import produce from "immer";
import { Player } from "./player";
import PlayingDeck from "../tt-cards-game/playing-cards";
import { plainToClass } from "class-transformer";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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
    
  const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: 2,
    margin: `0 2px 0 0`,

    // change background colour if dragging
    background: isDragging ? 'transparent' : 'transparent',

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
  const reorder = (list:string[], startIndex: number, endIndex: number) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  /**
   * Moves an item from one list to another list.
   */
  const move = (source: any, destination: any, droppableSource: any, droppableDestination: any) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result: any = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
  };

  const getCardList = (droppableId: string) => {
    // TODO: extract playerIndex and rack (top3/middle5/bottom5) from droppable id
    console.log(droppableId);
  }

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
        return;
    }

    if (source.droppableId === destination.droppableId) {
        // const items = reorder(
        //     this.getCardList(source.droppableId),
        //     source.index,
        //     destination.index
        // );

        // let state = { items };

        // if (source.droppableId === 'droppable2') {
        //     state = { selected: items };
        // }

        // this.setState(state);
    } else {
        // const result = move(
        //     this.getCardList(source.droppableId),
        //     this.getCardList(destination.droppableId),
        //     source,
        //     destination
        // );

        // this.setState({
        //     items: result.droppable,
        //     selected: result.droppable2
        // });
    }
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
                    { [
                        {cards: player.top3Cards, type: 'top3'},
                        {cards: player.middle5Cards, type: 'middle5'},
                        {cards: player.bottom5Cards, type: 'bottom5'},
                      ].map((rack: {
                        cards: string[], 
                        type: string
                      }, rackIndex: number) => {
                      return (
                        <div className="row draggable-rack">
                          <Droppable droppableId={`${playerIndex}-${rack.type}`} direction="horizontal">
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                style={getCardListStyle(snapshot.isDraggingOver)}
                                {...provided.droppableProps}
                              >
                                {rack.cards.map((cardCode: string, cardIndex: number) => (
                                  <Draggable 
                                    key={`${props.roundIndex}-${cardCode}`} 
                                    draggableId={`${props.roundIndex}-${cardCode}`} 
                                    index={cardIndex}>
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className="col s2"
                                        style={getItemStyle(
                                          snapshot.isDragging,
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