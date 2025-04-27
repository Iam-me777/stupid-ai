const board = document.getElementById('board');
const size = 19; // 19x19 바둑판
const stones = []; // 돌 정보 저장

let currentPlayer = 'black'; // 처음엔 검은 돌부터

// 바둑판 셀 생성
for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = row;
        cell.dataset.col = col;

        // 셀 클릭 이벤트
        cell.addEventListener('click', function () {
            placeStone(row, col);
            if (currentPlayer === 'black') aiMove(); // 검은 돌 차례 후 AI가 흰 돌을 둠
        });

        board.appendChild(cell);
    }
}

// 바둑판에 격자선 추가
function addGridLines() {
    for (let i = 0; i < size; i++) {
        const horizontalLine = document.createElement('div');
        horizontalLine.classList.add('grid-line', 'horizontal-line');
        horizontalLine.style.top = `${i * 30}px`;
        board.appendChild(horizontalLine);

        const verticalLine = document.createElement('div');
        verticalLine.classList.add('grid-line', 'vertical-line');
        verticalLine.style.left = `${i * 30}px`;
        board.appendChild(verticalLine);
    }
}

addGridLines(); // 격자선 그리기

// 바둑돌 놓기
function placeStone(row, col) {
    const existingStone = stones.find(stone => stone.row === row && stone.col === col);
    if (existingStone) return; // 이미 돌이 놓인 곳엔 놓을 수 없음

    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    const stone = document.createElement('div');
    stone.classList.add('stone', currentPlayer);
    cell.appendChild(stone);

    // 돌 정보 저장
    stones.push({ row, col, color: currentPlayer });

    // 턴 변경
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';

    // 돌 잡기 체크
    checkCapture(row, col);
}

// AI가 돌을 놓는 함수 (랜덤하게 돌을 놓음)
function aiMove() {
    let row, col;
    do {
        row = Math.floor(Math.random() * size);
        col = Math.floor(Math.random() * size);
    } while (stones.some(stone => stone.row === row && stone.col === col)); // 이미 돌이 있는 곳은 제외

    placeStone(row, col);
}

// 돌 잡기 기능 (간단한 규칙)
function checkCapture(row, col) {
    const playerColor = currentPlayer === 'black' ? 'white' : 'black';
    const directions = [
        { x: -1, y: 0 }, // 위
        { x: 1, y: 0 },  // 아래
        { x: 0, y: -1 }, // 왼쪽
        { x: 0, y: 1 }   // 오른쪽
    ];

    for (let dir of directions) {
        const capturedStones = [];
        let x = row + dir.x;
        let y = col + dir.y;
        while (x >= 0 && x < size && y >= 0 && y < size) {
            const stone = stones.find(stone => stone.row === x && stone.col === y);
            if (stone && stone.color === playerColor) {
                capturedStones.push(stone);
            } else if (stone && stone.color !== playerColor) {
                break;
            }
            x += dir.x;
            y += dir.y;
        }

        if (capturedStones.length > 0) {
            capturedStones.forEach(stone => {
                const cell = document.querySelector(`[data-row="${stone.row}"][data-col="${stone.col}"]`);
                cell.innerHTML = ''; // 돌 제거
                const index = stones.findIndex(st => st.row === stone.row && st.col === stone.col);
                if (index > -1) stones.splice(index, 1); // 배열에서 돌 제거
            });
        }
    }
}

