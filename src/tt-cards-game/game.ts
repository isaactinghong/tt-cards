const TTCards = {
  name: "tic-tac-toe",

  setup: () => ({
    // cells: Array(9).fill(null)
  }),

  moves: {
    // clickCell(G: any, ctx: any, id: any) {
    //   if (G.cells[id] === null) {
    //     G.cells[id] = ctx.currentPlayer;
    //   }
    // }
  },

  turn: { moveLimit: 1 },

  endIf: (G: any, ctx: any) => {
    // if (IsVictory(G.cells)) {
    //   return { winner: ctx.currentPlayer };
    // }
    // if (G.cells.filter((c: any) => c === null).length === 0) {
    //   return { draw: true };
    // }

  },

  ai: {
    // enumerate: (G: any) => {
    //   let moves = [];
    //   for (let i = 0; i < 9; i++) {
    //     if (G.cells[i] === null) {
    //       moves.push({ move: "clickCell", args: [i] });
    //     }
    //   }
    //   return moves;
    // }
  }

}
export default TTCards;
