
import React from 'react';
import PlayingDeck, { CardCodeToImage, CardCodeFromCard } from '../tt-cards-game/playing-cards';
import { produce } from 'immer';
import { GameRoundComponent, RoundState } from './game-round';
import { Player } from './player';
import { plainToClass } from 'class-transformer';

interface State {
  // rounds: RoundState[];
  numOfRounds: number;
  numOfPlayersInRound: number;
  // numOfCardsDrawn: number;
}

interface Props {
  numOfRounds: number;
  numOfPlayersInRound: number;
}

class MainRoundsComponent extends React.Component<Props, State> {
  
  constructor(props: Props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {
      numOfRounds: props.numOfRounds,
      numOfPlayersInRound: props.numOfPlayersInRound,
      // numOfCardsDrawn: 5,
      // rounds: [],
    };

    // const rounds = this.refreshRounds();

    this.state = {
      ...this.state,
      // rounds: rounds,
    };
    
  }

  // refreshRounds(numOfRounds: number = this.state.numOfRounds) {
    
  //   const roundsArray: any[] = [];

  //   console.log('numOfRounds', numOfRounds)

  //   for (let i = 0; i < numOfRounds; i++) {

  //     let deck = PlayingDeck();
  //     const players = [];

  //     for (let j = 0; j < this.state.numOfPlayersInRound; j++) {

  //       const top3Cards = deck.draw(3);
  //       const middle5Cards = deck.draw(5);
  //       const bottom5Cards = deck.draw(5);

  //       const dealtCards = top3Cards.concat(middle5Cards, bottom5Cards);

  //       const player = plainToClass(Player, {
  //         playerIndex: j,
  //         dealtCards: dealtCards,
  //         playedCards: Object.assign([], dealtCards),
  //       });

  //       players.push(player);
  //     }

  //     roundsArray.push({
  //       deck,
  //       players: players,
  //     });
  //   }
  //   console.log('roundsArray', roundsArray)

  //   return roundsArray;
  // }
  
  updateFormData(event: any) {
    console.log(event.target.name, event.target.value);
    
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value,
    });
  }

  updateNumOfRounds(event: any) {
    console.log(event.target.name, event.target.value);
    
    this.setState({
      ...this.state,
      // rounds: this.refreshRounds(event.target.value),
      [event.target.name]: event.target.value,
    });
  }


  render() {
      
    
    return (
      <div>
        <form action="#" className="form-parameters">

          <div className="row">
          <div className="col s12">
            <div className="input-field inline">
              <input 
                type="number" 
                name="numOfRounds" 
                min="1"
                value={this.state.numOfRounds}
                onChange={(e) => this.updateNumOfRounds(e)}
              />
              <label>Number of rounds:</label>
            </div>
          </div>
        </div>
        </form>
        <div>
          <h5 className="page-title teal-text text-darken-3">Round#</h5>

          <div>
            { 
              Array(this.state.numOfRounds).fill(null).map((round: any, roundIndex: number) => {
                
                return (
                  <GameRoundComponent roundIndex={roundIndex} numOfPlayersInRound={this.props.numOfPlayersInRound} />
                );
              })
            }
          </div>
        </div>
      </div>
    )
  }

}

export default MainRoundsComponent;