const numRows = 8;
const numCols = 8;
const numMines = 10;

const gameBoard = document.getElementById("gameBoard");
const scoreDisplay = document.getElementById("score");
let board = [];
let score = 0;

function initializeBoard() {
    board = [];
    for (let i = 0; i < numRows; i++) {
        board[i] = [];
        for (let j = 0; j < numCols; j++) {
            board[i][j] = {
                isMine: false,
                revealed: false,
                flagged: false,
                count: 0,
            };
        }
    }

    let minesPlaced = 0;
    while (minesPlaced < numMines) {
        const row = Math.floor(Math.random() * numRows);
        const col = Math.floor(Math.random() * numCols);
        if (!board[row][col].isMine) {
            board[row][col].isMine = true;
            minesPlaced++;
        }
    }

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            if (!board[i][j].isMine) {
                let count = 0;
                for (let dx = -1; dx <= 1; dx++) {
                    for (let dy = -1; dy <= 1; dy++) {
                        const ni = i + dx;
                        const nj = j + dy;
                        if (
                            ni >= 0 &&
                            ni < numRows &&
                            nj >= 0 &&
                            nj < numCols &&
                            board[ni][nj].isMine
                        ) {
                            count++;
                        }
                    }
                }
                board[i][j].count = count;
            }
        }
    }
}

function revealCell(row, col) {
    if (
        row < 0 ||
        row >= numRows ||
        col < 0 ||
        col >= numCols ||
        board[row][col].revealed ||
        board[row][col].flagged
    ) {
        return;
    }

    board[row][col].revealed = true;

    if (board[row][col].isMine) {
        alert("Game Over! You stepped on a mine.");
        return;
    } else {
        score += 10;
        if (board[row][col].count === 0) {
            for (let dx = -1; dx <= 1; dx++) {
                for (let dy = -1; dy <= 1; dy++) {
                    revealCell(row + dx, col + dy);
                }
            }
        }
    }

    checkWin();
    updateScoreDisplay();
    renderBoard();
}

function toggleFlag(row, col) {
    if (board[row][col].revealed) return;
    board[row][col].flagged = !board[row][col].flagged;

    if (board[row][col].flagged) {
        if (board[row][col].isMine) {
            score += 20;
        } else {
            score -= 10;
        }
    }

    updateScoreDisplay();
    renderBoard();
}

function checkWin() {
    let revealedCount = 0;
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            if (board[i][j].revealed) revealedCount++;
        }
    }
    if (revealedCount === numRows * numCols - numMines) {
        alert("Congratulations! You cleared the board!");
    }
}

function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${score}`;
}

function resetGame() {
    score = 0;
    initializeBoard();
    updateScoreDisplay();
    renderBoard();
}

function renderBoard() {
    gameBoard.innerHTML = "";

    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            const cell = document.createElement("div");
            cell.className = "cell";

            if (board[i][j].revealed) {
                cell.classList.add("revealed");
                if (board[i][j].isMine) {
                    cell.classList.add("mine");
                    cell.textContent = "💣";
                } else if (board[i][j].count > 0) {
                    cell.textContent = board[i][j].count;
                }
            } else if (board[i][j].flagged) {
                cell.textContent = "🚩";
            }

            cell.addEventListener("click", () => revealCell(i, j));
            cell.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                toggleFlag(i, j);
            });

            gameBoard.appendChild(cell);
        }
        gameBoard.appendChild(document.createElement("br"));
    }
}

initializeBoard();
renderBoard();
updateScoreDisplay();
