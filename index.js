document.getElementById('studentForm').addEventListener('submit', function(e) {
    e.preventDefault(); // 폼 제출 시 페이지가 새로고침되는 것을 방지

    // 입력값 가져오기
    const name = document.getElementById('studentName').value;
    const log = document.getElementById('studentLog').value;
    const photoFile = document.getElementById('studentPhoto').files[0];

    if (photoFile) {
        const reader = new FileReader();

        // 파일을 성공적으로 읽었을 때 실행될 함수
        reader.onload = function(event) {
            const imageUrl = event.target.result; // 이미지 데이터 URL

            // 새로운 학생 카드 컴포넌트 생성
            createStudentCard(name, log, imageUrl);

            // 폼 초기화 (다음 입력을 위해 비우기)
            document.getElementById('studentForm').reset();
        };

        // 파일을 데이터 URL로 읽어오기
        reader.readAsDataURL(photoFile);
    }
});

// 카드를 생성하여 HTML 그리드 영역에 추가하는 함수
function createStudentCard(name, log, imageUrl) {
    const grid = document.getElementById('studentGrid');

    // 1. 카드 전체를 감싸는 div 생성
    const card = document.createElement('div');
    card.className = 'student-card';

    // 2. 내부 HTML 구조 짜기
    card.innerHTML = `
        <div class="card-img-container">
            <img src="${imageUrl}" alt="${name} 학생 사진">
        </div>
        <div class="card-content">
            <div class="card-name">${name}</div>
            <p class="card-log">${log}</p>
        </div>
    `;

    // 3. 기존 그리드 맨 앞에 새 카드 삽입 (최신 글이 먼저 보이도록)
    grid.insertBefore(card, grid.firstChild);
}
