const board = document.getElementById('board');
const size = 19; // 19x19 바둑판

// 바둑판 셀 생성
for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.row = row;
        cell.dataset.col = col;

        // 셀 클릭 이벤트
        cell.addEventListener('click', function() {
            placeStone(row, col);
        });

        board.appendChild(cell);
    }
}

// 격자선 추가
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

// 바둑돌 놓기
let currentPlayer = 'black'; // 처음에는 검은 돌
const stones = []; // 바둑돌 정보 저장

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
}
