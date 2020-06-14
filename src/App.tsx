import React from 'react';
import './App.css';
import CompareHands from './tt-cards-compare/compare-hands'


function App() {
  

  // const deck = new decks.StandardDeck();
  

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
      <CompareHands />
    </div>
  );
}
export default App;
