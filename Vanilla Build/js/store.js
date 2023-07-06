export default class Store {
  #state = { moves: [], winners: [] };

  constructor() {
    this.winningPatterns = [
      [1, 2, 3],
      [1, 5, 9],
      [1, 4, 7],
      [2, 5, 8],
      [3, 5, 7],
      [3, 6, 9],
      [4, 5, 6],
      [7, 8, 9],
    ];
  }

  #getState() {
    return this.#state;
  }

  #saveState(newState) {
    this.#state = newState;
  }

  getCurrentPlayer() {
    if (this.#state.moves.length === 0) {
      return 1;
    } else {
      return this.#state.moves.at(-1).playerId === 1 ? 2 : 1;
    }
  }

  nextMove(squareId) {
    const state = structuredClone(this.#getState());

    const currentPlayer = this.getCurrentPlayer();

    state.moves.push({
      squareId: +squareId,
      playerId: currentPlayer,
    });

    this.#saveState(state);

    console.log(this.#getState());
  }

  hasPlay(squareId) {
    const moves = this.#getState().moves; //.moves;

    return moves.filter((move) => move.squareId === +squareId).length === 0
      ? false
      : true;
  }

  checkWinner() {
    const moves = this.#getState().moves;
    const player = moves.at(-1).playerId;
    const playerMoves = moves.filter((move) => move.playerId === player);

    let playerWins = false;

    this.winningPatterns.forEach((pattern) => {
      const winningPatternFound = pattern.every((value) =>
        playerMoves.some((move) => move.squareId == value)
      );

      if (winningPatternFound) {
        playerWins = true;
      }
    });

    if (playerWins) {
      return player;
    } else if (moves.length >= 9) {
      return 0;
    } else {
      return undefined;
    }
  }

  newGame() {
    const newState = { moves: [], winners: [] };
    this.#saveState(newState);
  }

  restartRound() {
    const newMoves = [];
    this.#state.moves = newMoves;
  }

  declareWinner(winner) {
    this.#state.winners.push(winner);
    this.restartRound();
  }

  getScoreboard() {
    const pastWinners = structuredClone(this.#getState().winners);

    let p1Score = pastWinners.filter((el) => el === 1).length;
    let p2Score = pastWinners.filter((el) => el === 2).length;
    let numTies = pastWinners.filter((el) => el === 0).length;

    p1Score = p1Score == null ? 0 : p1Score;
    p2Score = p2Score == null ? 0 : p2Score;
    numTies = numTies == null ? 0 : numTies;

    return [p1Score, p2Score, numTies];
  }
}
