document.addEventListener("DOMContentLoaded", function(event) {
  setupBoard();
  document.querySelector("#start-button").addEventListener("click", e => {
    setupBoard();
    var player2 = document.querySelector("#player2").selectedOptions[0]
      .textContent;
    let game = new Game(player2);
    $("#game").data("game", game);
    let boardEl = "null";
    game.availableMoves().forEach(i => {
      boardEl = document.querySelector("#board" + (i + 1));
      boardEl.className = "board active";
      let boxEl = null;
      for (var j = 1; j < 10; j++) {
        boxEl = document.querySelector("#box" + (i * 9 + j));
        boxEl.addEventListener("click", e => makeMove(e));
      }
    });
  });
});

function setupBoard() {
  const gameHook = document.querySelector("#game");
  let board = null;
  let box = null;
  let div = null;
  for (var i = 1; i < 10; i++) {
    board = document.createElement("div");
    board.id = "board" + i;
    board.className = "board";
    for (var j = 1; j < 10; j++) {
      box = document.createElement("div");
      div = document.createElement("img");
      box.id = "box" + ((i - 1) * 9 + j);
      box.className = "box";
      div.src = "https://tinyurl.com/y842zfgk";
      box.innerHTML += div.outerHTML;
      board.innerHTML += box.outerHTML;
    }
    if (i === 1) {
      gameHook.innerHTML = board.outerHTML;
    } else {
      gameHook.innerHTML += board.outerHTML;
    }
  }
}
function makeMove(e) {
  const gameJS = $("#game").data("game");
  let moveI = e.path[1].id.substring(3) / 9;
  let moveJ = e.path[1].id.substring(3) % 9;
  if (moveJ === 0) {
    moveJ = 9;
    moveI -= 1;
  }
  if (gameJS.validMove(Math.floor(moveI), moveJ)) {
    let test = gameJS.makeMove(Math.floor(moveI), moveJ);
    document.querySelectorAll(".box").forEach(box => {
      var new_element = box.cloneNode(true);
      box.parentNode.replaceChild(new_element, box);
    });
    const moveBox = document.querySelector("#box" + e.path[1].id.substring(3));
    moveBox.className = "box-filled";
    document.querySelectorAll(".active").forEach((active, i) => {
      active.className = "board";
    });
    if (test === "won") {
      let wonEl = document.createElement("img");
      if (gameJS.player === "X") {
        wonEl.src = "https://tinyurl.com/ybroc4qb";
      } else {
        wonEl.src = "https://tinyurl.com/y842zfgk";
      }
      document.querySelector("#board" + (Math.floor(moveI) + 1)).innerHTML =
        wonEl.outerHTML;
    }
    if (
      gameJS.opponent === "CPU" &&
      gameJS.player === "O" &&
      gameJS.won() === false
    ) {
      if (gameJS.lastCPU !== null) {
        document.querySelectorAll("#box" + gameJS.lastCPU).forEach(el => {
          el.style.backgroundColor = "inherit";
        });
      }

      $.ajax({
        url: "/ajax/choose_move/",
        data: {
          game: JSON.stringify(gameJS)
        },
        dataType: "json",
        success: function(data) {
          let test1 = gameJS.makeMove(data.move[0], data.move[1]);
          document.querySelector(
            "#box" + (data.move[0] * 9 + data.move[1])
          ).className =
            "box-filled";
          document.querySelector(
            "#box" + (data.move[0] * 9 + data.move[1])
          ).style.backgroundColor =
            "#709fb0";
          document.querySelector(
            "#box" + (data.move[0] * 9 + data.move[1]) + " > img"
          ).src =
            "https://tinyurl.com/ybroc4qb";
          gameJS.lastCPU = data.move[0] * 9 + data.move[1];
          if (test1 === "won") {
            let wonEl = document.createElement("img");
            wonEl.src = "https://tinyurl.com/ybroc4qb";
            wonEl.height = "100";
            wonEl.width = "100";
            document.querySelector("#board" + data.move[0]).innerHTML =
              wonEl.outerHTML;
          }
        }
      });
    } else {
      if (gameJS.player === "X") {
        if (
          document.querySelector(
            "#box" + e.path[1].id.substring(3) + "> img"
          ) !== null
        ) {
          document.querySelector(
            "#box" + e.path[1].id.substring(3) + "> img"
          ).src =
            "https://tinyurl.com/ybroc4qb";
        }
      } else {
        if (
          document.querySelector(
            "#box" + e.path[1].id.substring(3) + "> img"
          ) !== null
        ) {
          document.querySelector(
            "#box" + e.path[1].id.substring(3) + "> img"
          ).src =
            "https://tinyurl.com/y842zfgk";
        }
      }
    }
    if (gameJS.won()) {
      alert("Game Over");
    } else {
      gameJS.availableMoves().forEach(i => {
        boardEl = document.querySelector("#board" + (i + 1));
        boardEl.className = "board active";
        let boxEl = null;
        for (var j = 1; j < 10; j++) {
          boxEl = document.querySelector("#box" + (i * 9 + j));
          if (boxEl.className !== "box-filled") {
            if (gameJS.player === "O") {
              document.querySelector("#box" + (i * 9 + j) + " > img").src =
                "https://tinyurl.com/ybroc4qb";
            } else {
              document.querySelector("#box" + (i * 9 + j) + " > img").src =
                "https://tinyurl.com/y842zfgk";
            }
          }
          boxEl.addEventListener("click", e => makeMove(e));
        }
      });
    }
  }
}

class Board {
  constructor() {
    this.board = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  }

  board() {
    return this.board;
  }

  makeMove(player, position) {
    this.board[position - 1] = player;
  }

  won() {
    if (
      (this.board[0] === this.board[4] && this.board[4] === this.board[8]) ||
      (this.board[1] === this.board[4] && this.board[4] === this.board[7]) ||
      (this.board[2] === this.board[4] && this.board[4] === this.board[6]) ||
      (this.board[3] === this.board[4] && this.board[4] === this.board[5])
    ) {
      return this.board[4];
    } else if (
      (this.board[6] === this.board[7] && this.board[6] === this.board[8]) ||
      (this.board[0] === this.board[3] && this.board[0] === this.board[6])
    ) {
      return this.board[6];
    } else if (
      (this.board[2] === this.board[5] && this.board[2] === this.board[8]) ||
      (this.board[0] === this.board[1] && this.board[0] === this.board[2])
    ) {
      return this.board[2];
    } else if (
      this.board.join("").replace(/[0-9]/g, "").length ===
      this.board.join("").length
    ) {
      return "draw";
    } else {
      return false;
    }
  }
}

class Game {
  constructor(player2) {
    this.game = [];
    let board = null;
    for (var i = 0; i < 9; i++) {
      board = new Board();
      this.game.push(board);
    }
    this.lastMove = null;
    this.player = "X";
    this.opponent = player2;
    this.lastCPU = null;
  }

  availableMoves() {
    if (this.lastMove === null) {
      return [0, 1, 2, 3, 4, 5, 6, 7, 8];
    }
    if (this.game[this.lastMove].won() === false) {
      return [this.lastMove];
    } else {
      let arr = [];
      this.game.forEach((board, i) => {
        if (board.won() === false) {
          arr.push(i);
        }
      });
      return arr;
    }
  }

  validMove(i, j) {
    // console.(Number.isInteger("O"));
    if (Number.isInteger(this.game[i].board[j - 1]) === true) {
      return true;
    }
    return false;
  }

  makeMove(i, j) {
    this.game[i].makeMove(this.player, j);

    if (this.player === "X") {
      this.player = "O";
    } else {
      this.player = "X";
    }
    this.lastMove = j - 1;
    if (this.game[i].won() !== "draw" && this.game[i].won() !== false) {
      return "won";
    }
  }

  won() {
    if (
      (this.game[0].won() === this.game[1].won() &&
        this.game[0].won() === this.game[2].won() &&
        this.game[0].won() !== false) ||
      (this.game[0].won() === this.game[3].won() &&
        this.game[0].won() === this.game[6].won() &&
        this.game[0].won() !== false) ||
      (this.game[0].won() === this.game[4].won() &&
        this.game[0].won() === this.game[8].won() &&
        this.game[0].won() !== false) ||
      (this.game[1].won() === this.game[4].won() &&
        this.game[1].won() === this.game[7].won() &&
        this.game[1].won() !== false) ||
      (this.game[2].won() === this.game[5].won() &&
        this.game[8].won() === this.game[2].won() &&
        this.game[2].won() !== false) ||
      (this.game[3].won() === this.game[4].won() &&
        this.game[4].won() === this.game[5].won() &&
        this.game[3].won() !== false) ||
      (this.game[6].won() === this.game[7].won() &&
        this.game[6].won() === this.game[8].won() &&
        this.game[6].won() !== false)
    ) {
      return true;
    } else {
      return false;
    }
  }
}
