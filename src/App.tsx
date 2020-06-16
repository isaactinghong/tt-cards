import React from 'react';
import './App.css';
import MainRoundsDndComponent from './tt-cards-round-dnd/main-rounds';

function App() {
  
  return (
    <div className="App">
      <nav>
        <div className="nav-wrapper">
          <a href="#" className="brand-logo">十三張 Chinese Poker Thirteen Cards</a>
          {/* <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li><a href="sass.html">Sass</a></li>
            <li><a href="badges.html">Components</a></li>
            <li><a href="collapsible.html">JavaScript</a></li>
          </ul> */}
        </div>
      </nav>
      {/* <TTTBoard /> */}      
      <MainRoundsDndComponent
        numOfRounds={2}
        numOfPlayersInRound={2}
        // numOfCardsDrawn={4}
         />
      {/* <MainCompare5
        numOfCompares={1}
        numOfHandsToCompares={2}
        numOfCardsDrawn={4}
         /> */}
    </div>
  );
}
export default App;
