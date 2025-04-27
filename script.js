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

    // 잡힌 돌 처리
    removeCapturedStones(row, col, currentPlayer);

    // 턴 변경
    currentPlayer = currentPlayer === 'black' ? 'white' : 'black';
}

// 돌 잡기 로직
function removeCapturedStones(row, col, color) {
    const opponentColor = color === 'black' ? 'white' : 'black';
    
    const directions = [
        { dr: -1, dc: 0 }, // 위
        { dr: 1, dc: 0 },  // 아래
        { dr: 0, dc: -1 }, // 왼쪽
        { dr: 0, dc: 1 }   // 오른쪽
    ];

    // 각 방향에 대해 탐색
    for (let direction of directions) {
        const capturedStones = [];
        let r = row + direction.dr;
        let c = col + direction.dc;

        while (r >= 0 && r < size && c >= 0 && c < size) {
            const stone = stones.find(stone => stone.row === r && stone.col === c);
            if (stone) {
                if (stone.color === opponentColor) {
                    capturedStones.push(stone);
                } else if (stone.color === color) {
                    break; // 같은 색의 돌을 만나면 종료
                }
            }
            r += direction.dr;
            c += direction.dc;
        }

        // 잡힌 돌 처리
        if (capturedStones.length > 0) {
            for (let capturedStone of capturedStones) {
                const capturedCell = document.querySelector(`[data-row="${capturedStone.row}"][data-col="${capturedStone.col}"]`);
                capturedCell.innerHTML = ''; // 셀에서 돌 제거
                const index = stones.indexOf(capturedStone);
                if (index !== -1) stones.splice(index, 1); // 배열에서 돌 제거
            }
        }
    }
}

