/*
 * Copyright 2017 The boardgame.io Authors.
 *
 * Use of this source code is governed by a MIT-style
 * license that can be found in the LICENSE file or at
 * https://opensource.org/licenses/MIT.
 */

import React from "react";
import { render } from "react-dom";
import { Client } from "boardgame.io/react";
import TicTacToe from "./game";
import Board from "./board";

const App = Client({
  game: TicTacToe,
  board: Board,
  // The number of players.
  numPlayers: 2
});

render(<App />, document.getElementById("root"));
