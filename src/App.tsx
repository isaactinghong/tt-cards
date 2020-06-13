import React from 'react';
import logo from './logo.svg';
import './App.css';
import TicTacToe from './tic-tac-toe/game';
import ReactDOM, { render } from 'react-dom';
import Board from './tic-tac-toe/board';
import { Client } from "boardgame.io/react";
import { PlayingDeck } from './tt-cards-game/playing-cards';
const Hand = require('pokersolver').Hand;

function printHand(solvedHand: any, isWinner: boolean) {

  const handInCardCode = solvedHand.cards.join(', ');
  // console.log(solvedHand.playerId);
  // console.log(handInCardCode);
  // console.log(solvedHand.name); // Two Pair
  // console.log(solvedHand.descr); // Two Pair, A's & Q's

  const winner = isWinner ? <div> Is Winner! </div> : '';

  return (
    <div>
      <div>{ solvedHand.playerId }</div>
      <div>{ handInCardCode}</div>
      <div>{ solvedHand.descr }</div>
      { winner }
      ---------------
    </div>
  );

}

function App() {
  
  const TTTBoard = Client({
    game: TicTacToe,
    board: Board,
    // The number of players.
    numPlayers: 2
  });

  // const deck = new decks.StandardDeck();
  
  const deck = PlayingDeck();
  let solvedHands = [];
  const numOfCardsDrawn = 5;
  let playerIndex = 1;
  while (deck.remaining() >= numOfCardsDrawn) {
    const hand = deck.draw(numOfCardsDrawn);
    const solvedHand = Hand.solve(hand);
    solvedHand.playerId = playerIndex;
    solvedHands.push(solvedHand);
    playerIndex++;
  }

  const winnerHands = Hand.winners(solvedHands);

  for (const solvedHand of solvedHands) {
    printHand(solvedHand, winnerHands.some((hand:any) => hand.playerId == solvedHand.playerId));

    console.log('------------------------')
  }
  
  console.log('------- winner -----------')
  for (const winnerHand of winnerHands) {
    printHand(winnerHand, true);
    // console.log('winner:', winnerHand);
  }

  
  // console.log('winner:', winnerHand);

  


  return (
    <div className="App">
      <header className="App-header">
        Chinese Poker: Thirteen Cards
      </header>
      <div>
        {/* <TTTBoard /> */}

        {solvedHands.map((solvedHand, index) => {
          return printHand(solvedHand, winnerHands.some((hand:any) => hand.playerId == solvedHand.playerId))
        })}

        {/* { tttBoard } */}
      </div>
    </div>
  );
}

export default App;

/*
 * Copyright 2017 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

// import React from "react";
// import { render } from "react-dom";
// import { Client } from "boardgame.io/react";
// import TicTacToe from "./ttt/game";
// import Board from "./ttt/board";

// const App = Client({
//   game: TicTacToe,
//   board: Board,
//   // The number of players.
//   numPlayers: 2
// });


// render(<App />, document.getElementById("root"));

// export default App;