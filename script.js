const animateSmoke = (() => {
  function animatePoof() {
    var bgTop = 0,
      frame = 0,
      frames = 6,
      frameSize = 32,
      frameRate = 160;
    let puff = document.getElementById('puff');

    var animate = function () {
      if (frame < frames) {
        puff.style.backgroundPosition = "0 " + bgTop + "px";
        bgTop = bgTop - frameSize;
        frame++;
        setTimeout(animate, frameRate);
      }
    };

    animate();
    setTimeout(() => {
      puff.style.display = 'none';
    }, frames * frameRate);
  }

  let tiles = document.querySelectorAll('.tile');
  tiles.forEach(tile => {
    tile.addEventListener('click', (e) => {
      var xOffset = 24;
      var yOffset = 24;
      let puff = document.getElementById('puff');
      puff.style.left = (e.pageX - xOffset) + 'px';
      puff.style.top = (e.pageY - yOffset) + 'px';
      puff.style.display = 'block';
      animatePoof();
    });
  });
})();

const Player = (name, symbol) => {
  let bitmask = 0b000000000;
  const setBitmask = (newBitmask) => {
    bitmask = newBitmask;
  };
  const makeMove = (cell) => {
    bitmask = bitmask | (1 << cell);
    // console.log(name, bitmask.toString(2))
  };

  const getBitmask = () => bitmask;

  return { name, symbol, setBitmask, getBitmask, makeMove };
}

const TicTacToe = ((px, po) => {
  const gameboard = ((player1, player2) => {
    function checkWinner(player) {
      const WINNING_COMBINATIONS = [
        0b111000000, // Row 1
        0b000111000, // Row 2
        0b000000111, // Row 3
        0b100100100, // Column 1
        0b010010010, // Column 2
        0b001001001, // Column 3
        0b100010001, // Diagonal 1
        0b001010100  // Diagonal 2
      ];
      for (let win of WINNING_COMBINATIONS) {
        if ((player.getBitmask() & win) === win) { return true; }
      }
      return false;
    };

    const findWinner = () => {
      if (checkWinner(player1)) {
        return player1;
      } else if (checkWinner(player2)) {
        return player2;
      } else {
        return null;
      }
    };

    const checkDraw = () => {
      // return 0b111111111 === 0b111111111;
      return 0b111111111 === (player1.getBitmask() | player2.getBitmask());
    };

    let board = {};
    function createBoard() {
      for (let i = 0; i < 9; i++) {
        board[i] = null;
      }
    };
    createBoard();

    const resetBoard = () => {
      player1.setBitmask(0);
      player2.setBitmask(0);
      createBoard();
    };

    const updateBoard = (cell, player) => {
      if (board[cell] === null) {
        board[cell] = player.symbol;
        player.makeMove(cell);
        return true;
      }
      return false;
    };

    const showBoard = () => {
      return [board[0], board[1], board[2]] + '\n' + [board[3], board[4], board[5]] + '\n' + [board[6], board[7], board[8]]
    };

    return { findWinner, checkDraw, resetBoard, updateBoard, showBoard }
  })(px, po);

  const displayController = (() => {
    const tiles = document.querySelectorAll('.tile');
    const messageBody = document.querySelector('.game-over');
    const resetButton = document.querySelector('#reset');
    const restartButton = document.querySelector('.restart');
    const board = document.querySelector('.board');
    const form = document.querySelector('#form');

    // activate board
    form.classList.add('hide');
    form.classList.remove('activate-general');
    board.classList.add('activate-board');
    restartButton.classList.add('activate-restart');

    // getPosition of tile
    for (let i = 0; i < tiles.length; i++) {
      tiles[i].addEventListener('click', startGame);
      tiles[i].position = i;
    };

    const updateBoard = (i, symbol) => {
      if (symbol == 'X') {
        tiles[i].style.backgroundImage = "url(./images/xtop128px.png)";
        // tiles[i].style.border = '1000px solid white'
      } else if (symbol === 'O') {
        tiles[i].style.backgroundImage = "url(./images/otop128px.png)";
      }
    };

    const resetBoard = () => {
      resetGame()
      for (let i = 0; i < tiles.length; i++) {
        tiles[i].style.backgroundImage = "url(./images/blackboard.png)";
      }
      messageText = document.querySelector('.game-over-message');
      if (messageText) {
        messageBody.removeChild(messageText);
      }
      messageBody.classList.remove('active');
      board.classList.remove('blur');
    }
    resetButton.addEventListener('click', resetBoard);

    const showMessage = (message) => {
      let p = document.createElement('p');
      p.textContent = message;
      p.classList.add('game-over-message');
      messageBody.prepend(p);
      messageBody.classList.add('active');
      board.classList.add('blur');
    };

    // Remove event listener, i.e. delete entry point to a game instance
    const restartGame = () => {
      // removePlayers()
      for (let i = 0; i < tiles.length; i++) {
        tiles[i].removeEventListener('click', startGame);
      };
      displayController.resetBoard();  // resets the game as well
      board.classList.remove('activate-board');
      restartButton.classList.remove('activate-restart');
      form.classList.remove('hide');
      form.classList.add('activate-general');
    };
    restartButton.addEventListener('click', restartGame);

    return { updateBoard, resetBoard, showMessage };
  })();

  let round = 0, gameOver = false, message;
  const runGame = (i) => {
    if (gameOver) {
      return;
    }

    let isUpdate = false, player;
    if (round % 2 == 0) { player = px; } else { player = po; };
    isUpdate = gameboard.updateBoard(i, player);

    if (isUpdate) {
      round++;
      displayController.updateBoard(i, player.symbol);
    }

    // console.log(gameboard.showBoard());

    winner = gameboard.findWinner()

    if (winner !== null) {
      message = winner.name + ' wins!';
      gameOver = true
      // console.log(winner)
    } else {
      if (gameboard.checkDraw()) {
        message = "Draw!";
        gameOver = true
      };
    };
    if (gameOver) {
      // console.log(message);
      displayController.showMessage(message);
    }

  };
  // console.log(gameboard.checkDraw())
  const resetGame = () => {
    gameboard.resetBoard()
    round = 0
    gameOver = false
  };

  function startGame(e) {
    runGame(e.currentTarget.position);
  };

  // const removePlayers = () => {
  //   px = null;
  //   po = null;
  // }
});

const Init = (() => {
  const startButton = document.querySelector('#form button');
  const xPlayer = document.querySelector('#x-player');
  const oPlayer = document.querySelector('#o-player');
  let game;
  // console.log(game)

  const getPlayerNames = () => {
    let namex = 'Joe', nameo = 'Mama';
    if (xPlayer.value) { namex = xPlayer.value };
    if (oPlayer.value) { nameo = oPlayer.value };

    return [namex, nameo];
  }

  const startGame = () => {
    if (game) {
      console.log(game)
      game = null;
    }
    names = getPlayerNames()
    let px = Player(names[0], 'X'), po = Player(names[1], 'O');
    game = TicTacToe(px, po);
  }

  startButton.addEventListener('click', startGame);

  return { startGame }
})();
