export default class View {
  $ = {};

  $$ = {};

  constructor() {
    this.$.menuBtn = this.#qs('[data-id="menu-btn"]');
    this.$.menuItems = this.#qs('[data-id="menu-items-div"]');
    this.$.restartRndBtn = this.#qs('[data-id="restart-rnd-btn"]');
    this.$.nextRndBtn = this.#qs('[data-id="modal-btn"]');
    this.$.newGameBtn = this.#qs('[data-id="new-game-btn"]');
    this.$.p1Score = this.#qs('[data-id="p1-score"]');
    this.$.p2Score = this.#qs('[data-id="p2-score"]');
    this.$.numTies = this.#qs('[data-id="num-ties"]');
    this.$.modalContainer = this.#qs('[data-id="modal-container"]');
    this.$.statusText = this.#qs('[data-id="status-text"]');
    this.$.statusIcon = this.#qs('[data-id="status-icon"]');

    this.$.chevronIcon = this.#qs("i", this.$.menuBtn);
    this.$.modalP = this.#qs("p", this.$.modalContainer);

    this.$$.squares = this.#qsAll('[data-id="square"]');

    // UI-only event listeners //

    this.$.menuBtn.addEventListener("click", (event) => {
      this.toggleMenuEvent(event);
    });

    document.addEventListener("click", (event) => {
      this.closeMenuEvent(event);
    });
  }

  bindRestartRoundEvent(handler) {
    this.$.restartRndBtn.addEventListener("click", handler);
    this.$.nextRndBtn.addEventListener("click", handler);
  }

  bindNewGameEvent(handler) {
    this.$.newGameBtn.addEventListener("click", handler);
  }

  bindPlayerMoveEvent(handler) {
    this.$$.squares.forEach((square) => {
      square.addEventListener("click", () => handler(square));
    });
  }

  /* DOM Helper methods */

  toggleMenuEvent(event) {
    this.$.menuItems.classList.toggle("hidden");
    this.$.chevronIcon.classList.toggle("fa-chevron-down", "fa-chevron-up");
    // Change the colour
    this.$.menuBtn.classList.toggle(
      "menu-btn-open-color",
      "menu-btn-closed-color"
    );
    // Stop the event from toggling immediately due to document click
    event.stopPropagation();
  }

  closeMenuEvent(event) {
    if (!this.$.menuItems.classList.contains("hidden")) {
      this.$.menuItems.classList.add("hidden");
      this.$.chevronIcon.classList.add("fa-chevron-down");
      this.$.chevronIcon.classList.remove("fa-chevron-up");
      // Change the colour
      this.$.menuBtn.classList.remove("menu-btn-open-color");
      this.$.menuBtn.classList.add("menu-btn-closed-color");
    }
  }

  handlePlayerMoveEvent(square, currentPlayer) {
    const icon = document.createElement("i");
    icon.style.scale = 4;

    if (currentPlayer == 1) {
      icon.classList.add("fa-solid", "fa-x", "marker", "purple");
      console.log("replaced with x");
    } else {
      icon.classList.add("fa-solid", "fa-o", "marker", "yellow");
      console.log("replaced with o");
    }

    square.replaceChildren(icon);
  }

  hideModalEvent() {
    this.$.modalContainer.classList.remove("hide-animation", "show-animation");
    this.$.modalContainer.classList.add("hide-animation");

    setTimeout(() => {
      this.$.modalContainer.classList.add("hidden");
    }, 199);

    if (this.$.modalP.classList.contains("yellow")) {
      this.$.modalP.classList.remove("yellow");
    }

    if (this.$.modalP.classList.contains("purple")) {
      this.$.modalP.classList.remove("purple");
    }
  }

  showModalEvent() {
    this.$.modalContainer.classList.remove("hide-animation", "show-animation");
    this.$.modalContainer.classList.add("show-animation");
    this.$.modalContainer.classList.remove("hidden");
  }

  handleRestartRoundEvent() {
    this.$$.squares.forEach((square) => {
      if (square.hasChildNodes()) {
        square.removeChild(square.firstChild);
      }
    });
    if (!this.$.modalContainer.classList.contains("hidden")) {
      this.hideModalEvent();
    }
  }

  declareWinner(winner) {
    const winningMessage =
      winner == 0 ? "It's a tie!" : `Player ${winner} wins!`;

    this.$.modalP.textContent = winningMessage;

    if (winner !== 0) {
      this.$.modalP.classList.add(winner === 1 ? "purple" : "yellow");
    }
    this.showModalEvent();
  }

  updateScoreboard(p1Score, p2Score, numTies) {
    this.$.numTies.textContent = numTies;
    this.$.p1Score.textContent = `${p1Score} wins`;
    this.$.p2Score.textContent = `${p2Score} wins`;
  }

  updateStatus(currentPlayer) {
    console.log(currentPlayer);
    this.$.statusText.textContent = `Player ${currentPlayer}, you're up!`;

    if (currentPlayer === 1) {
      this.$.statusIcon.classList.add("fa-x", "purple");
      this.$.statusIcon.classList.remove("fa-o", "yellow");
    } else {
      this.$.statusIcon.classList.remove("fa-x", "purple");
      this.$.statusIcon.classList.add("fa-o", "yellow");
    }

    this.$.statusIcon.classList.remove("icon-animation");
    this.$.statusText.classList.remove("text-animation");
    void this.$.statusIcon.offsetWidth;
    this.$.statusIcon.classList.add("icon-animation");
    this.$.statusText.classList.add("text-animation");
  }

  /* Class utility methods */

  #qs(selector, parent) {
    const element = parent
      ? parent.querySelector(selector)
      : document.querySelector(selector);

    if (!element) {
      throw new Error("No element with selector " + selector + " found");
    }
    return element;
  }

  #qsAll(selector, parent) {
    const elements = parent
      ? parent.querySelectorAll(selector)
      : document.querySelectorAll(selector);
    if (!elements) {
      throw new Error("No elements with selector " + selector + " found");
    }
    return elements;
  }
}
