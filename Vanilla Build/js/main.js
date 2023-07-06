import View from "./view.js";
import Store from "./store.js";

function init() {
  const view = new View();
  const store = new Store();

  view.bindNewGameEvent((event) => {
    store.newGame();
    view.handleRestartRoundEvent();
    view.updateScoreboard(...store.getScoreboard());
    view.updateStatus(store.getCurrentPlayer());
  });

  view.bindRestartRoundEvent((event) => {
    store.restartRound();
    view.handleRestartRoundEvent();
    view.updateStatus(store.getCurrentPlayer());
  });

  view.bindPlayerMoveEvent((square) => {
    //check for existing move in square:

    if (store.hasPlay(+square.id)) {
      return;
    }

    view.handlePlayerMoveEvent(square, store.getCurrentPlayer());

    store.nextMove(square.id);

    const winner = store.checkWinner();

    if (winner !== undefined) {
      // End the game and declare winner
      view.declareWinner(winner);
      store.declareWinner(winner);
      view.updateScoreboard(...store.getScoreboard());
    } else {
      console.log("no winner yet");
    }

    view.updateStatus(store.getCurrentPlayer());
  });
}

window.addEventListener("load", init);
