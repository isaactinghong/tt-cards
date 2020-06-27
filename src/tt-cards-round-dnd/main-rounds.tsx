
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

    // this.state = {
    //   ...this.state,
    //   // rounds: rounds,
    // };
    
  }
  
  updateFormNumber(event: any) {
    console.log(event.target.name, event.target.value);
    
    var num: number = + event.target.value;

    this.setState({
      ...this.state,
      [event.target.name]: num,
    });

    console.log(this.state);
  }

  render() {
    return (
      <div>
        <form action="#" className="form-parameters">

          <div className="row form-row">
            <div className="col s2">
              <div className="input-field inline">
                <input 
                  type="number" 
                  name="numOfRounds" 
                  min="1"
                  value={this.state.numOfRounds}
                  onChange={(e) => this.updateFormNumber(e)}
                />
                <label>Number of rounds:</label>
              </div>
            </div>
            <div className="col s2">
              <div className="input-field inline"
                  style={{width: "100%"}}>
                <input 
                  type="number" 
                  name="numOfPlayersInRound" 
                  min="2"
                  max="4"
                  value={this.state.numOfPlayersInRound}
                  onChange={(e) => this.updateFormNumber(e)}
                />
                <label>Number of players:</label>
              </div>
            </div>
          </div>
        </form>
        <div className="row">

          <div className="col s12">
            { 
              Array(this.state.numOfRounds).fill(null).map((round: any, roundIndex: number) => {
                
                return (
                  <GameRoundComponent key={roundIndex} roundIndex={roundIndex} numOfPlayersInRound={this.state.numOfPlayersInRound} />
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