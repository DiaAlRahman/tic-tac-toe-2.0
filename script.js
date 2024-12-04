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

const gameboard = (player1, player2) => {
  function checkWinner(player) {
    for (let win of WINNING_COMBINATIONS) {
      if ((player.bitmask & win) === win) { return true; }
    }
    return false;
  };
  const findWinner = () => {
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

    if (checkWinner(player1.bitmask)) {
      return player1;
    } else if (checkWinner(player2.bitmask)) {
      return player2;
    } else {
      return null;
    }
  };
  const checkDraw = () => {
    return 0b111111111 === player1.bitmask | player2.bitmask
  };

  let board = {}
  for (let i = 0; i < 9; i++) {
    board[i] = null;
  }

  const resetBoard = () => {
    player1.setBitmask = 0
    player2.setBitmask = 0
  };
  const updateBoard = (cell, player) => {
    player.bitmask | (1 << cell);
  }
};

const Player = (name, symbol) => {
  let bitmask = 0b000000000;
  let name = name;
  let symbol = symbol;
}

const TicTacToe = (() => {

})();