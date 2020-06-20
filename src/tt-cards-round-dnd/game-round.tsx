import React, { useState } from "react";
import { CardComponent } from "./card";
import produce from "immer";
import { Player } from "./player";
import PlayingDeck from "../tt-cards-game/playing-cards";
import { plainToClass } from "class-transformer";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Duels, DuelKey, Duel, Top3HandScore } from "./duels";
import { RackLastIndex, RackBaseIndex } from "./card-rack";
import { findDuplicates } from "./helper-functions";
const Hand = require('pokersolver').Hand;

export const GameRoundComponent = (props: { 
  numOfPlayersInRound: number,
  roundIndex: number
}) => {
  
  console.log('to run GameRoundComponent');

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

      draftPlayers.map((draftPlayer: Player, playerIndex: number) => {
        draftPlayer.top3Hand = Hand.solve(draftPlayer.top3Cards);
        draftPlayer.top3Hand.playerIndex = playerIndex;
        draftPlayer.middle5Hand = Hand.solve(draftPlayer.middle5Cards);
        draftPlayer.middle5Hand.playerIndex = playerIndex;
        draftPlayer.bottom5Hand = Hand.solve(draftPlayer.bottom5Cards);
        draftPlayer.bottom5Hand.playerIndex = playerIndex;
        return true;
      });
    });
  }


  // const solveHands = (players: Player[]) => {
  //   const solvedHands: any[] = [];
  //   let playerIndex = 1;

  //   players.map((player: Player) => {
  //     const solvedHand = Hand.solve(player.top3?.cards);

  //     solvedHand.playerIndex = playerIndex;
  //     solvedHands.push(solvedHand);
  //     playerIndex++;
  //   });
  //   return solvedHands;s
  // }

  const determineWinner = (solvedHands: any[]) => {

    const winnerHands = Hand.winners(solvedHands);
    // const winnerPlayerIndexs = winnerHands.map((hand: any) => hand.playerIndex);
    // const filterSolvedHands = solvedHands.filter(o => winnerPlayerIndexs?.includes(o.playerIndex) ?? false);
    // for (const solvedHand of filterSolvedHands) {
    //   solvedHand.isWinner = true;
    // }
    return winnerHands;
  }
  
  const findDuplicateCards = (players: Player[]) => {
    
    const reducer = (acc: any, player: Player) => { acc.push(player.playedCards); return acc; };
    const allCards = [].concat(...players.reduce(reducer, []));
    // console.log('allCards:', allCards);
    return findDuplicates(allCards);
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

    newPlayers = solveHands(newPlayers);

    // set the card to hands
    setPlayers([...newPlayers]);
    
    // setDuels(calculateDuels(newPlayers));
    
    setDuplicateCards(findDuplicateCards(newPlayers));

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

    newPlayers = solveHands(newPlayers);
    
    setPlayers([...newPlayers]);
    
    // setDuels(calculateDuels(newPlayers));
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

  const calculateDuels = (iPlayers: Player[]) => {
    console.log('calculateDuels start');

    const duels = {} as Duels;

    for (let i = 0; i < iPlayers.length - 1; i++) {
      for (let j = i + 1; j < iPlayers.length; j++) {
        const duelKey = DuelKey(iPlayers[i], iPlayers[j]);
        console.log('duelKey',duelKey);

        // calcualte results here
        // TODO: compare top3
        const compareTop3: any[] = determineWinner([iPlayers[i].top3Hand, iPlayers[j].top3Hand]);
        if (compareTop3.length == 1) {
          const winningHand = compareTop3[0];
          console.log('compareTop3winner hand:', winningHand);
          console.log('compareTop3winner handplayer:', winningHand.playerIndex);
          const winningScore = Top3HandScore(winningHand);
          console.log('winningHand winningScore', winningHand, winningScore);
        }
        // console.log('compareTop3',compareTop3);
        
        // TODO: compare middle5
        const compareMiddle5: any[] = determineWinner([iPlayers[i].middle5Hand, iPlayers[j].middle5Hand]);
        
        // TODO: compare bottom5
        const compareBottom5: any[] = determineWinner([iPlayers[i].bottom5Hand, iPlayers[j].bottom5Hand]);

        // TODO: compare special hand


        duels[duelKey] = {
          // compareTop3: 
        } as Duel;
      }
    }

    return duels;
  }


  const [players, setPlayers] = useState(solveHands(initialPlayers));
  const [duels, setDuels] = useState(calculateDuels(initialPlayers))
  const [duplicateCards, setDuplicateCards] = useState(findDuplicateCards(initialPlayers));

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
                  </div>
                );
              }) }
          </div>
        </div>
      </div>
    </DragDropContext>
  );

}