
import React from 'react';
import PlayingDeck, { CardCodeToImage, CardCodeFromCard } from '../../tt-cards-game/playing-cards';
import { produce } from 'immer';
import { CompareHand } from './compare5-round';

export interface CompareRound {
  deck: any;
  hands: any[];
  solvedHands: any[];
  hasDuplicateCard: boolean
}

interface MainComparesState {
  compares: CompareRound[];
  numOfCompares: number;
  numOfHandsToCompares: number;
  numOfCardsDrawn: number;
}

interface Props {
  numOfCompares: number;
  numOfHandsToCompares: number;
  numOfCardsDrawn: number;
}

class MainCompare5 extends React.Component<Props, MainComparesState> {
  
  static Props: {
    numOfCompares: number;
    numOfHandsToCompares: number;
    numOfCardsDrawn: number;
  }

  constructor(props: Props) {
    super(props);
    // Don't call this.setState() here!
    this.state = {
      numOfCompares: props.numOfCompares,
      numOfHandsToCompares: props.numOfHandsToCompares,
      numOfCardsDrawn: props.numOfCardsDrawn,
      compares: [],
    };

    const compares = this.refreshCompares();

    this.state = {
      ...this.state,
      compares: compares,
    };
    
    // this.updateFormData = this.updateFormData.bind(this);
  }

  refreshCompares(numOfCompares: number = this.state.numOfCompares) {
    
    const comparesArray: any[] = [];

    for (let i = 0; i < numOfCompares; i++) {

      let deck = PlayingDeck();

      const hands = [];
      for (let j = 0; j < this.state.numOfHandsToCompares; j++) {
        hands.push(deck.draw(this.state.numOfCardsDrawn));
      }
      comparesArray.push({
        deck,
        hands,
      });
    }
    return comparesArray;
  }
  
  updateFormData(event: any) {
    console.log(event.target.name, event.target.value);
    
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value,
    });
  }

  updateNumOfCompares(event: any) {
    console.log(event.target.name, event.target.value);
    
    this.setState({
      ...this.state,
      compares: this.refreshCompares(event.target.value),
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
                name="numOfCompares" 
                min="1"
                value={this.state.numOfCompares}
                onChange={(e) => this.updateNumOfCompares(e)}
              />
              <label>Number of compares:</label>
            </div>
          </div>
        </div>
        </form>
        <div>
          <h5 className="page-title teal-text text-darken-3">Compare Hands</h5>

          <div>
            { 
              this.state.compares.map((compareRound:CompareRound, compareIndex: number) => {
                
                return (
                  <div className="row" key={compareIndex}>
                    <div className="col s2">
                      #{ compareIndex + 1 }
                    </div>

                    <CompareHand compareRound={compareRound} />
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    )
  }

}

export default MainCompare5;