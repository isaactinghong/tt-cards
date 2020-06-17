import React, { useState } from "react";
import { CardComponent } from "./card";
import produce from "immer";
import { Player, RACK_TYPE } from "./player";
import PlayingDeck from "../tt-cards-game/playing-cards";
import { plainToClass } from "class-transformer";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
const Hand = require('pokersolver').Hand;

// export interface RoundState {
//   deck: any;
//   players: Player[];
//   // solvedHands: any[];
//   duplicateCards: string[]
// }

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

  const solveHands = (iPlayers: Player[]) => {

    return produce(iPlayers, draftPlayers => {

      draftPlayers.map((draftPlayer: Player) => {
        draftPlayer.top3Hand = Hand.solve(draftPlayer.top3Cards);
        draftPlayer.middle5Hand = Hand.solve(draftPlayer.middle5Cards);
        draftPlayer.bottom5Hand = Hand.solve(draftPlayer.bottom5Cards);
        return true;
      });
    });
  }

  const [players, setPlayers] = useState(solveHands(initialPlayers));

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
  
  const findDuplicateCards = (players: Player[]) => {
    
    const reducer = (acc: any, player: Player) => { acc.push(player.playedCards); return acc; };
    const allCards = [].concat(...players.reduce(reducer, []));
    // console.log('allCards:', allCards);
    return findDuplicates(allCards);
  }

  const [duplicateCards, setDuplicateCards] = useState(findDuplicateCards(players));

  const setCard = (
      playerIndex: number,
      cardIndex: number, 
      cardCode: string
    ) => {
    // console.log('hands:',hands);
    // console.log('setCard playerIndex, cardIndex, cardCode:', playerIndex, cardIndex, cardCode);

    let newPlayers = produce(players, (players: Player[]) => {
      players[playerIndex].playedCards[cardIndex] = cardCode;
    });

    newPlayers = solveHands(newPlayers);

    // set the card to hands
    setPlayers([...newPlayers]);
    
    setDuplicateCards(findDuplicateCards(newPlayers));


    // solveHands
    // const solvedHands = solveHands(newHands);
    
    // setSolvedHands(solvedHands);
    // determineWinner
    // determineWinner(solvedHands);
  }

  // determineWinner(solvedHands);
    

  // a little function to help us with reordering the result
  const reorder = (iPlayers: Player[], source: any, destination: any) => {

    let {
      sourceDroppableId = source.droppableId,
      sourceIndex = source.index,
     } = source

     let {
       destinationDroppableId = destination.droppableId,
       destinationIndex = destination.index,
      } = destination;

    // console.log('sourceDroppableId sourceIndex destinationDroppableId destinationIndex:', 
    //   sourceDroppableId, sourceIndex, destinationDroppableId, destinationIndex);

    // extract playerIndex and rack (top3/middle5/bottom5) from droppable id
    const [playerIndexStr, sourceRackType] = sourceDroppableId.split('-');
    const [, destinationRackType] = destinationDroppableId.split('-');
    const playerIndex: number = +playerIndexStr;
    // console.log('playerIndex sourceRackType destinationRackType:', playerIndex, sourceRackType, destinationRackType);

    return produce(iPlayers, (draftPlayers: Player[]) => {
      // just swap if both in same rack
      if (sourceRackType === destinationRackType) {
        const [removed] = draftPlayers[playerIndex].playedCards.splice(sourceIndex, 1);
        draftPlayers[playerIndex].playedCards.splice(destinationIndex, 0, removed);
      }
      else {
        const [removed] = draftPlayers[playerIndex].playedCards.splice(sourceIndex, 1);

        if (destinationIndex > sourceIndex) {
          destinationIndex--;
        }

        draftPlayers[playerIndex].playedCards.splice(destinationIndex, 0, removed);

        // put destinationRackType's last extra to sourceRackType's last
        let destinationRackLastIndex = RackLastIndex(destinationRackType);
        const sourceRackTypeLastIndex = RackLastIndex(sourceRackType);

        if (destinationRackLastIndex < sourceRackTypeLastIndex) {
          destinationRackLastIndex++;
        }

        const [removed2] = draftPlayers[playerIndex].playedCards.splice(destinationRackLastIndex, 1);
        draftPlayers[playerIndex].playedCards.splice(sourceRackTypeLastIndex, 0, removed2);
      }
    });
  };

  const onDragEnd = (result: any) => {
    const { source, destination } = result;

    if (source == null || destination == null)
      return;

    let newPlayers = reorder(
      players,
      source,
      destination
    );

    newPlayers = solveHands(newPlayers);
    
    setPlayers([...newPlayers]);
  }

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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="row">
        <div className="col s2">
          <div className="row">
            <div>#{ props.roundIndex + 1 }</div>
            
            <div className="col s12"><div className='red-text'>{ duplicateCards.length ? '重覆:' + duplicateCards.join(',') : ''}</div></div>
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
                        <div key={rackIndex}>
                          <div className="row rack-title">
                            <div className="col s12">
                              Hand: { rack.hand()?.descr }
                            </div>
                          </div>
                          <div className="row draggable-rack">
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
                                      key={`${props.roundIndex}-${cardCode}-${cardIndex}`} 
                                      draggableId={`${playerIndex}-${props.roundIndex}-${cardCode}`} 
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
                                            cardIndex={RackBaseIndex(rack.type) + cardIndex}
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

const findDuplicates = (arr: any[]) => {
  let sorted_arr = arr.slice().sort(); // You can define the comparing function here. 
  // JS by default uses a crappy string compare.
  // (we use slice to clone the array so the
  // original array won't be modified)
  let results = [];
  for (let i = 0; i < sorted_arr.length - 1; i++) {
    if (sorted_arr[i + 1] == sorted_arr[i]) {
      results.push(sorted_arr[i]);
    }
  }
  return results;
}
