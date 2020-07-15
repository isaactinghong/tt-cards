import React, { useState, useEffect } from "react";
import { CardComponent } from "./card";
import produce from "immer";
import { Player } from "./player";
import PlayingDeck from "../tt-cards-game/playing-cards";
import { plainToClass } from "class-transformer";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Duels, duelKey, Duel, top3HandScore, bottom5HandScore, middle5HandScore, duelAgainst, calculateDuels } from "./duels";
import { RackLastIndex, RackBaseIndex } from "./card-rack";
import { findDuplicates, findDuplicateCards } from "./helpers";
import { getWinnerHands, solveHandsForPlayers } from "./hand";
const Hand = require('pokersolver').Hand;

export const GameRoundComponent = (props: { 
  numOfPlayersInRound: number,
  roundIndex: number
}) => {
  
  const initializePlayers = () => {
    
    console.log('initialize players', props.roundIndex);

    let deck = PlayingDeck();
    let initialPlayers = [];

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
    
    initialPlayers = solveHandsForPlayers(initialPlayers);

    console.log('GameRoundComponent initializePlayers.', initialPlayers);
    return initialPlayers;
  }

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

    refreshRoundResults(newPlayers);

  }

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

    refreshRoundResults(newPlayers);
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


  const refreshRoundResults = (iPlayers: Player[]) => {
    
    iPlayers = solveHandsForPlayers(iPlayers);

    const duelResult = calculateDuels(iPlayers);
    setDuels(duelResult);
    
    // TODO: set round score for each players
    iPlayers = setRoundScoreForPlayers(iPlayers, duelResult);
    
    console.log('after setRoundScoreForPlayers:', iPlayers);

    setPlayers([...iPlayers]);
    
    setDuplicateCards(findDuplicateCards(iPlayers));
  }

  const setRoundScoreForPlayers = (iPlayers: Player[], duelResult: Duels) => {

    
    return produce(iPlayers, (draftPlayers: Player[]) => {
      const duelKeys: string[] = Object.keys(duelResult);
      draftPlayers.forEach((draftPlayer: Player, playerIndex: number) => {
        
        // initialize round score to 0
        draftPlayer.roundScore = 0;

        for(const duelKey of duelKeys) {
          console.log('setRoundScoreForPlayers: duelKey', duelKey, duelResult[duelKey]);

          const matchLeft = duelKey[0] === playerIndex.toString();
          if (matchLeft) {
            draftPlayer.roundScore += duelResult[duelKey]?.compareTotal ?? 0;
          }
          else {
            const matchRight = duelKey[2] === playerIndex.toString();
            if (matchRight) {
              draftPlayer.roundScore -= duelResult[duelKey]?.compareTotal ?? 0;
            }
          } 
  
        }
      });
    });
  }

  const [players, setPlayers] = useState(initializePlayers);
  const [duels, setDuels] = useState(() => calculateDuels(players));
  const [duplicateCards, setDuplicateCards] = useState(() => findDuplicateCards(players));

  useEffect(() => { setPlayers(initializePlayers()) }, [props.numOfPlayersInRound])

  // run once
  useEffect(() => {
    refreshRoundResults(players)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <div className="row">
        <div className="col s6">
          <h5 className="page-title teal-text text-darken-3">Round #{ props.roundIndex + 1 }</h5>
          <div className='red-text'>{ duplicateCards.length ? '重覆:' + duplicateCards.join(',') : ''}</div>
        </div>
      </div>
      <div className="row round-details">
        <div className="col s12">
          <div className="row">
            { players.map((player: Player, playerIndex: number) => {
                return (
                  <div className="col s6" key={playerIndex}>
                    <div className="player-title">Player {player.playerIndex + 1}</div>
                    <div className="player-score">Round Score: <strong>{ player.roundScore }</strong></div>
                    <div className="player-hand row">
                      { players
                          .filter(againstPlayer => againstPlayer !== player)
                          .map((againstPlayer: Player, againstPlayerIndex: number) =>
                            (
                              <div className="col s4" key={againstPlayerIndex}>
                                <div>Against Player {againstPlayer.playerIndex + 1}:</div>
                                <div>
                                  { [duelAgainst(player, againstPlayer, duels)]
                                    .map((duel: Duel, duelIndex: number) => {
                                      return (
                                        <div key={duelIndex}>
                                          {duel.compareTop3} | {duel.compareMiddle5} | {duel.compareBottom5}, total: <strong>{duel.compareTotal}</strong>
                                        </div>
                                      );
                                    })
                                  }
                                </div>
                              </div>
                            )
                          )
                      }
                    </div>
                    <DragDropContext onDragEnd={onDragEnd}>
                      { player.racks.map((rack, rackIndex: number) => {
                        return (
                          <div key={rackIndex}>
                            <div className="row rack-title">
                              <div className="col s12">
                                { rack.hand()?.descr }
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
                    </DragDropContext>
                  </div>
                );
              }) }
          </div>
        </div>
      </div>
      <div className="divider"></div>
    </div>
  );

}