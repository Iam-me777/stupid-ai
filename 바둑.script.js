const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const size = 19; // 19x19 바둑판
const gridSize = canvas.width / (size + 1);
const stones = Array.from({ length: size }, () => Array(size).fill(null));
let playerTurn = true; // true = 너(흑), false = AI(백)

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

  setTimeout(aiMove, 500); // AI 살짝 딜레이
});

function aiMove() {
  let empty = [];

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (!stones[i][j]) {
        empty.push([i, j]);
      }
    }
  }

  if (empty.length === 0) return;

  // 무지성 랜덤에서 가끔 바보같은 선택
  const [i, j] = empty[Math.floor(Math.random() * empty.length)];
  stones[i][j] = 'white';
  drawStone(i + 1, j + 1, 'white');

  playerTurn = true;
}

drawBoard();
