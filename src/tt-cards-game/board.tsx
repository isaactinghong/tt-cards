/*
 * Copyright 2017 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React from 'react';
import PropTypes from 'prop-types';
import './board.css';

interface Props {
  G: any;
  ctx: any;
  moves: any;
  playerID: string;
  isActive: boolean;
  isMultiplayer: boolean;
}

class TTCardsBoard extends React.Component<Props> {

  static propTypes = {
    G: PropTypes.any.isRequired,
    ctx: PropTypes.any.isRequired,
    moves: PropTypes.any.isRequired,
    playerID: PropTypes.string,
    isActive: PropTypes.bool,
    isMultiplayer: PropTypes.bool,
  };

  render() {

    return (
      <div>
        thirteen card here~~
      </div>
    );
  }
}

export default TTCardsBoard;