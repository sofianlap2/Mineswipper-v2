window.onload = function () {
  startGame();
};

const rows = 9;
const cols = 9;
const board = [];
let gameOver = false;
let gameWon = false;
let gameClicked = 0;
let counterSeconds = 0;
let minesNumber = 10

const minesPosition = [];

function randomMines() {
    let minesCount = 0
    while(minesCount < minesNumber) {
        let r = Math.floor(Math.random() * rows)
        let c = Math.floor(Math.random() * cols)
        let randomId = r.toString() + '-' + c.toString()

        if(!minesPosition.includes(randomId)) {
            minesCount++
            minesPosition.push(randomId)
        }
    }
}

function startGame() {
  const minesContainer = document.getElementById("mines-container");
  const restartGame = document.getElementById("restart");
  const minesCount = document.getElementById("mines-count");

  randomMines()

  minesCount.innerText = minesPosition.length;

  restartGame.addEventListener("click", function () {
    window.location.reload();
  });

  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      const cell = document.createElement("div");
      cell.id = i.toString() + "-" + j.toString();
      cell.classList.add("cell_closed");
      cell.addEventListener("click", clickCell);
      minesContainer.append(cell);
      row.push(cell);
    }
    board.push(row);
  }
}

function clickCell(e) {
  let r = parseInt(e.target.id[0]);
  let c = parseInt(e.target.id[2]);
  const counterTime = document.getElementById("counter-time");

  if(gameWon) {
    return
  }

  function checkCell(r, c) {
    const cell = board[r][c];
    const restartGame = document.getElementById("restart");

    if (cell.classList.contains("cell_opened") || gameOver) {
      return;
    }
    cell.classList.remove("cell_closed");
    cell.classList.add("cell_opened");

    gameClicked++;

    function gameTimerAdd() {
        counterSeconds++;
        counterTime.innerText = counterSeconds;
    }

    function gameTimerStop() {
        counterTime.style.visibility = 'hidden'
        clearInterval(addCounterTime)
    }

    function revealMine(mine) {
        mine.innerText = "💣";
        mine.style.background = "red";
    }

    if (gameClicked === 1) {
      var addCounterTime = setInterval(gameTimerAdd , 1000);
    }

    if (minesPosition.includes(cell.id)) {
        revealMine(cell)
      gameOver = true;
      minesPosition.forEach(pos => {
        let r = pos[0]
        let c = pos[2]
        gameTimerStop()
        revealMine(board[r][c])
      })
      restartGame.innerHTML = '&#128544;'
      alert('gameOver')
      return;
    }

    let minesCounter = 0;

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        if (i === 0 && j === 0) continue;
        if (r + i < 0 || r + i >= rows || c + j < 0 || c + j >= cols) continue;
        let idCell = (r + i).toString() + "-" + (c + j).toString();
        if (minesPosition.includes(idCell)) {
          minesCounter++;
        }
      }
    }

    if (minesCounter > 0) {
      cell.innerText = minesCounter;
    } else {
      for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
          if (i === 0 && j === 0) continue;
          if (r + i < 0 || r + i >= rows || c + j < 0 || c + j >= cols)
            continue;
          checkCell(r + i, c + j);
        }
      }
    }

    if(gameClicked === (cols * rows) - minesPosition.length) {
        gameWon = true
        restartGame.innerHTML = '&#128512;'
        gameTimerStop()
        alert('Good job you have won')
    }
  }

  checkCell(r, c);
}
