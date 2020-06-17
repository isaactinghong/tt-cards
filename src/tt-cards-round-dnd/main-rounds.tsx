
import React from 'react';
import { GameRoundComponent } from './game-round';

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

class MainRoundsDndComponent extends React.Component<Props, State> {
  
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
                  <GameRoundComponent key={roundIndex} roundIndex={roundIndex} numOfPlayersInRound={this.props.numOfPlayersInRound} />
                );
              })
            }
          </div>
        </div>
      </div>
    )
  }

}

export default MainRoundsDndComponent;