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

function checkCapture(x, y, color) {
  const directions = [
    [-1, 0], [1, 0], [0, -1], [0, 1], // 가로, 세로
    [-1, -1], [1, 1], [-1, 1], [1, -1]  // 대각선
  ];
  
  let captured = false;

  for (const [dx, dy] of directions) {
    const nx = x + dx;
    const ny = y + dy;
    
    if (nx >= 0 && ny >= 0 && nx < size && ny < size && stones[nx][ny] !== color && stones[nx][ny] !== null) {
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
  let bestScore = -Infinity;

  // AI가 가장 좋은 자리를 선택하는 로직
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (!stones[i][j]) {
        // 돌을 놓을 수 있는 자리
        stones[i][j] = 'white'; // 일단 돌 놓고
        let score = evaluateMove(i, j); // 평가 함수 호출
        if (score > bestScore) {
          bestScore = score;
          bestMove = [i, j];
        }
        stones[i][j] = null; // 돌 취소
      }
    }
  }

  if (bestMove) {
    const [x, y] = bestMove;
    stones[x][y] = 'white';
    drawStone(x + 1, y + 1, 'white');
  }

  playerTurn = true;
}

function evaluateMove(x, y) {
  let score = 0;

  // AI가 돌을 놓았을 때 얻는 점수 계산
  if (checkCapture(x, y, 'black')) {
    score += 10;  // 상대 돌을 잡을 수 있는 곳
  }

  // AI가 좀 더 중앙으로 가는 경향을 갖게 유도
  if (x > size / 3 && x < (size * 2) / 3 && y > size / 3 && y < (size * 2) / 3) {
    score += 5;  // 중앙 근처일수록 점수 증가
  }
  
  return score;
}

drawBoard();
