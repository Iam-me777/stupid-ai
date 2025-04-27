const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const size = 19; // 19x19 바둑판
const gridSize = canvas.width / (size + 1);
const stones = Array.from({ length: size }, () => Array(size).fill(null));
let playerTurn = true; // true = 너(흑), false = AI(백)

const stoneSound = document.getElementById('stoneSound');  // 바둑돌 소리

function drawBoard() {
  for (let i = 1; i <= size; i++) {
    ctx.beginPath();
    ctx.moveTo(gridSize, i * gridSize);
    ctx.lineTo(size * gridSize, i * gridSize);
    ctx.moveTo(i * gridSize, gridSize);
    ctx.lineTo(i * gridSize, size * gridSize);
    ctx.stroke();
  }
}

function drawStone(x, y, color) {
  ctx.beginPath();
  ctx.arc(x * gridSize, y * gridSize, gridSize / 2.5, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.stroke();
  stoneSound.play();  // 바둑돌 소리 재생
}

function isCaptured(x, y, color) {
  // 흰돌을 잡는 함수, 간단하게 잡을 수 있는 경우만 체크
  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1], // 가로, 세로
    [-1, -1], [1, 1], [-1, 1], [1, -1]  // 대각선
  ];
  
  let captured = false;
  
  const enemyColor = color === 'black' ? 'white' : 'black';

  for (const [dx, dy] of directions) {
    const nx = x + dx;
    const ny = y + dy;

    if (nx >= 0 && ny >= 0 && nx < size && ny < size && stones[nx][ny] === enemyColor) {
      captured = true;
    }
  }

  return captured;
}

canvas.addEventListener('click', (e) => {
  if (!playerTurn) return;

  const rect = canvas.getBoundingClientRect();
  const x = Math.round((e.clientX - rect.left) / gridSize);
  const y = Math.round((e.clientY - rect.top) / gridSize);

  if (x < 1 || y < 1 || x > size || y > size || stones[x - 1][y - 1]) return;

  stones[x - 1][y - 1] = 'black';
  drawStone(x, y, 'black');
  playerTurn = false;

  setTimeout(aiMove, 500); // AI 딜레이
});

function aiMove() {
  let bestMove = null;

  // AI는 그냥 랜덤으로 돌을 놓을 거야
  let availableMoves = [];

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (!stones[i][j]) {
        availableMoves.push([i, j]);
      }
    }
  }

  if (availableMoves.length > 0) {
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    const [x, y] = randomMove;
    stones[x][y] = 'white';
    drawStone(x + 1, y + 1, 'white');
  }

  playerTurn = true;
}

drawBoard();
